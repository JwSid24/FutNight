using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FutNight.Data.Entities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace FutNight.Data.Football;

// DEN ENE GRÆNSE mod fodbold-data-API'en. Kun denne klasse ved at kilden er Football-Data.org.
// Skift af udbyder = ændring i denne ene fil. Klassen henter og MAPPER til vores egen Fixture,
// så provider-formatet aldrig slipper ud i resten af koden.
public interface IFootballDataClient
{
    Task<IReadOnlyList<Fixture>> GetSeasonFixturesAsync(string competitionCode, CancellationToken ct = default);
}

public sealed class FootballDataClient : IFootballDataClient
{
    private static readonly JsonSerializerOptions JsonOpts = new() { PropertyNameCaseInsensitive = true };

    private readonly HttpClient _http;
    private readonly FootballDataOptions _options;
    private readonly ILogger<FootballDataClient> _logger;

    public FootballDataClient(HttpClient http, IOptions<FootballDataOptions> options, ILogger<FootballDataClient> logger)
    {
        _http = http;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<IReadOnlyList<Fixture>> GetSeasonFixturesAsync(string competitionCode, CancellationToken ct = default)
    {
        var url = $"competitions/{competitionCode}/matches";
        var response = await SendAsync(url, ct);

        // Rate limit ramt? Vent anbefalet tid og prøv én gang til.
        if (response.StatusCode == HttpStatusCode.TooManyRequests)
        {
            var wait = response.Headers.RetryAfter?.Delta ?? TimeSpan.FromSeconds(60);
            _logger.LogWarning("Football-Data rate limit (429). Venter {Seconds}s og prøver igen.", wait.TotalSeconds);
            response.Dispose();
            await Task.Delay(wait, ct);
            response = await SendAsync(url, ct);
        }

        response.EnsureSuccessStatusCode();

        var payload = await response.Content.ReadFromJsonAsync<MatchesResponse>(JsonOpts, ct) ?? new MatchesResponse();

        // Selv-throttling: er vi ved at løbe tør for kald i minuttet, så vent til tælleren nulstilles.
        if (TryGetHeaderInt(response, "X-Requests-Available-Minute", out var available) && available <= 1)
        {
            var reset = TryGetHeaderInt(response, "X-RequestCounter-Reset", out var r) ? r : 60;
            _logger.LogInformation("Kun {Available} kald tilbage — venter {Reset}s for at undgå rate limit.", available, reset);
            await Task.Delay(TimeSpan.FromSeconds(reset), ct);
        }

        response.Dispose();

        var now = DateTime.UtcNow;
        var fixtures = new List<Fixture>(payload.Matches.Count);
        foreach (var m in payload.Matches)
        {
            if (m.HomeTeam?.Name is null || m.AwayTeam?.Name is null)
                continue; // spring ukomplette kampe over (fx endnu ikke lodtrukne KO-runder)

            fixtures.Add(new Fixture
            {
                ExternalId = m.Id,
                CompetitionCode = m.Competition?.Code ?? competitionCode,
                CompetitionName = m.Competition?.Name ?? competitionCode,
                HomeTeam = m.HomeTeam.Name,
                AwayTeam = m.AwayTeam.Name,
                UtcKickoff = ParseUtc(m.UtcDate),
                Status = m.Status ?? "UNKNOWN",
                Matchday = m.Matchday,
                LastSyncedUtc = now
            });
        }

        return fixtures;
    }

    private Task<HttpResponseMessage> SendAsync(string url, CancellationToken ct)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-Auth-Token", _options.ApiKey);
        return _http.SendAsync(request, ct);
    }

    private static DateTime ParseUtc(string? iso) =>
        DateTimeOffset.TryParse(iso, out var dto) ? dto.UtcDateTime : DateTime.UnixEpoch;

    private static bool TryGetHeaderInt(HttpResponseMessage response, string header, out int value)
    {
        value = 0;
        return response.Headers.TryGetValues(header, out var values)
               && int.TryParse(values.FirstOrDefault(), out value);
    }

    // ---- Provider-DTO'er: kun kendt her, bag grænsen ----
    private sealed class MatchesResponse
    {
        public List<MatchDto> Matches { get; set; } = new();
    }

    private sealed class MatchDto
    {
        public int Id { get; set; }
        public string? UtcDate { get; set; }
        public string? Status { get; set; }
        public int? Matchday { get; set; }
        public CompetitionDto? Competition { get; set; }
        public TeamDto? HomeTeam { get; set; }
        public TeamDto? AwayTeam { get; set; }
    }

    private sealed class CompetitionDto
    {
        public string? Code { get; set; }
        public string? Name { get; set; }
    }

    private sealed class TeamDto
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public string? ShortName { get; set; }
    }
}
