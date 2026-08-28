using FutNight.Data.Fixtures;

namespace FutNight.Logic.Fixtures;

// Læser KUN fra vores egen cache (repository). Kalder aldrig nettet.
public interface IFixtureService
{
    Task<IReadOnlyList<FixtureDto>> GetUpcomingAsync(string? competitionCode, CancellationToken ct = default);
}

public sealed class FixtureService : IFixtureService
{
    private readonly IFixtureRepository _repository;

    public FixtureService(IFixtureRepository repository) => _repository = repository;

    public async Task<IReadOnlyList<FixtureDto>> GetUpcomingAsync(string? competitionCode, CancellationToken ct = default)
    {
        var fixtures = await _repository.GetUpcomingAsync(competitionCode, ct);

        return fixtures
            .Select(f => new FixtureDto(
                f.Id, f.CompetitionCode, f.CompetitionName,
                f.HomeTeam, f.AwayTeam, f.UtcKickoff, f.Status, f.Matchday))
            .ToList();
    }
}
