using FutNight.Data.Fixtures;
using FutNight.Data.Football;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace FutNight.Logic.Fixtures;

// Orkestrerer sync: for hver turnering → hent (via grænsen) → upsert i cachen.
public interface IFixtureSyncService
{
    Task<int> SyncAllAsync(CancellationToken ct = default);
}

public sealed class FixtureSyncService : IFixtureSyncService
{
    private readonly IFootballDataClient _client;
    private readonly IFixtureRepository _repository;
    private readonly FootballDataOptions _options;
    private readonly ILogger<FixtureSyncService> _logger;

    public FixtureSyncService(
        IFootballDataClient client,
        IFixtureRepository repository,
        IOptions<FootballDataOptions> options,
        ILogger<FixtureSyncService> logger)
    {
        _client = client;
        _repository = repository;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<int> SyncAllAsync(CancellationToken ct = default)
    {
        var total = 0;

        foreach (var code in _options.Competitions)
        {
            ct.ThrowIfCancellationRequested();

            var fixtures = await _client.GetSeasonFixturesAsync(code, ct);
            await _repository.UpsertAsync(fixtures, ct);

            total += fixtures.Count;
            _logger.LogInformation("Synkede {Count} kampe for {Code}.", fixtures.Count, code);
        }

        return total;
    }
}
