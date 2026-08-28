using FutNight.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace FutNight.Data.Fixtures;

public interface IFixtureRepository
{
    // Indsæt nye kampe / opdatér eksisterende (matchet på ExternalId).
    Task UpsertAsync(IEnumerable<Fixture> fixtures, CancellationToken ct = default);

    // Kommende kampe (fra nu), evt. filtreret på turnering, sorteret efter kickoff.
    Task<IReadOnlyList<Fixture>> GetUpcomingAsync(string? competitionCode, CancellationToken ct = default);
}

public sealed class FixtureRepository : IFixtureRepository
{
    private readonly AppDbContext _db;

    public FixtureRepository(AppDbContext db) => _db = db;

    public async Task UpsertAsync(IEnumerable<Fixture> fixtures, CancellationToken ct = default)
    {
        var incoming = fixtures.ToList();
        if (incoming.Count == 0)
            return;

        var ids = incoming.Select(f => f.ExternalId).ToList();
        var existing = await _db.Fixtures
            .Where(f => ids.Contains(f.ExternalId))
            .ToDictionaryAsync(f => f.ExternalId, ct);

        foreach (var f in incoming)
        {
            if (existing.TryGetValue(f.ExternalId, out var e))
            {
                e.CompetitionCode = f.CompetitionCode;
                e.CompetitionName = f.CompetitionName;
                e.HomeTeam = f.HomeTeam;
                e.AwayTeam = f.AwayTeam;
                e.UtcKickoff = f.UtcKickoff;
                e.Status = f.Status;
                e.Matchday = f.Matchday;
                e.LastSyncedUtc = f.LastSyncedUtc;
            }
            else
            {
                f.Id = Guid.NewGuid();
                _db.Fixtures.Add(f);
            }
        }

        await _db.SaveChangesAsync(ct);
    }

    public async Task<IReadOnlyList<Fixture>> GetUpcomingAsync(string? competitionCode, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        var query = _db.Fixtures.AsNoTracking().Where(f => f.UtcKickoff >= now);

        if (!string.IsNullOrWhiteSpace(competitionCode))
        {
            var code = competitionCode.Trim().ToUpperInvariant();
            query = query.Where(f => f.CompetitionCode == code);
        }

        return await query.OrderBy(f => f.UtcKickoff).ToListAsync(ct);
    }
}
