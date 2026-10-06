using FutNight.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace FutNight.Data.Events;

public interface IEventRepository
{
    Task AddAsync(Event ev, CancellationToken ct = default);
    Task<Event?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Event?> GetByIdWithRsvpsAsync(Guid id, CancellationToken ct = default);
    Task<Event?> GetByTokenAsync(string token, CancellationToken ct = default);
    Task<IReadOnlyList<Event>> ListForHostAsync(Guid hostUserId, CancellationToken ct = default);
    Task<bool> FixtureExistsAsync(Guid fixtureId, CancellationToken ct = default);
    Task AddRsvpAsync(Rsvp rsvp, CancellationToken ct = default);

    // Logget-ind bruger svarer ja/nej (bundet til konto) — opdaterer hvis de svarer igen.
    Task UpsertUserRsvpAsync(Guid eventId, Guid userId, string name, RsvpAnswer answer, CancellationToken ct = default);

    // Chat-adgang: host, eller en indlogget bruger der har svaret ja.
    Task<bool> CanUserAccessChatAsync(Guid eventId, Guid userId, CancellationToken ct = default);
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

    public Task<Event?> GetByIdWithRsvpsAsync(Guid id, CancellationToken ct = default) =>
        _db.Events
            .AsNoTracking()
            .Include(e => e.Fixture)
            .Include(e => e.Host)
            .Include(e => e.Rsvps)
            .FirstOrDefaultAsync(e => e.Id == id, ct);

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

    public async Task UpsertUserRsvpAsync(Guid eventId, Guid userId, string name, RsvpAnswer answer, CancellationToken ct = default)
    {
        var existing = await _db.Rsvps.FirstOrDefaultAsync(r => r.EventId == eventId && r.UserId == userId, ct);
        if (existing is null)
        {
            _db.Rsvps.Add(new Rsvp
            {
                Id = Guid.NewGuid(),
                EventId = eventId,
                UserId = userId,
                GuestName = name,
                Answer = answer,
                RespondedUtc = DateTime.UtcNow,
            });
        }
        else
        {
            existing.Answer = answer;
            existing.GuestName = name;
            existing.RespondedUtc = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync(ct);
    }

    public async Task<bool> CanUserAccessChatAsync(Guid eventId, Guid userId, CancellationToken ct = default)
    {
        var isHost = await _db.Events.AnyAsync(e => e.Id == eventId && e.HostUserId == userId, ct);
        if (isHost)
            return true;

        return await _db.Rsvps.AnyAsync(
            r => r.EventId == eventId && r.UserId == userId && r.Answer == RsvpAnswer.Yes, ct);
    }
}
