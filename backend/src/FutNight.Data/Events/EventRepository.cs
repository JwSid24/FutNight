using FutNight.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace FutNight.Data.Events;

public interface IEventRepository
{
    Task AddAsync(Event ev, CancellationToken ct = default);
    Task<Event?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Event?> GetByTokenAsync(string token, CancellationToken ct = default);
    Task<IReadOnlyList<Event>> ListForHostAsync(Guid hostUserId, CancellationToken ct = default);
    Task<bool> FixtureExistsAsync(Guid fixtureId, CancellationToken ct = default);
    Task AddRsvpAsync(Rsvp rsvp, CancellationToken ct = default);
}

public sealed class EventRepository : IEventRepository
{
    private readonly AppDbContext _db;

    public EventRepository(AppDbContext db) => _db = db;

    public async Task AddAsync(Event ev, CancellationToken ct = default)
    {
        _db.Events.Add(ev);
        await _db.SaveChangesAsync(ct);
    }

    public Task<Event?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        _db.Events
            .AsNoTracking()
            .Include(e => e.Fixture)
            .Include(e => e.Host)
            .FirstOrDefaultAsync(e => e.Id == id, ct);

    public async Task<IReadOnlyList<Event>> ListForHostAsync(Guid hostUserId, CancellationToken ct = default) =>
        await _db.Events
            .AsNoTracking()
            .Include(e => e.Fixture)
            .Include(e => e.Host)
            .Where(e => e.HostUserId == hostUserId)
            .OrderByDescending(e => e.CreatedUtc)
            .ToListAsync(ct);

    public Task<Event?> GetByTokenAsync(string token, CancellationToken ct = default) =>
        _db.Events
            .AsNoTracking()
            .Include(e => e.Fixture)
            .Include(e => e.Host)
            .Include(e => e.Rsvps)
            .FirstOrDefaultAsync(e => e.InviteToken == token, ct);

    public Task<bool> FixtureExistsAsync(Guid fixtureId, CancellationToken ct = default) =>
        _db.Fixtures.AnyAsync(f => f.Id == fixtureId, ct);

    public async Task AddRsvpAsync(Rsvp rsvp, CancellationToken ct = default)
    {
        _db.Rsvps.Add(rsvp);
        await _db.SaveChangesAsync(ct);
    }
}
