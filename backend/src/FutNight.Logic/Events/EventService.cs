using FutNight.Data.Entities;
using FutNight.Data.Events;

namespace FutNight.Logic.Events;

public interface IEventService
{
    Task<EventResult> CreateAsync(Guid hostUserId, CreateEventRequest request);
    Task<IReadOnlyList<EventDto>> GetMineAsync(Guid hostUserId);

    // Gæste-flow (#6) — via invite-token, uden login.
    Task<GuestEventDto?> GetGuestEventAsync(string token);
    Task<GuestEventResult> SubmitRsvpAsync(string token, RsvpRequest request);

    // Indlogget bruger svarer ja/nej (giver chat-adgang ved ja).
    Task<bool> AttendAsync(Guid eventId, Guid userId, string displayName, RsvpAnswer answer);
}

public sealed class EventService : IEventService
{
    private readonly IEventRepository _events;

    public EventService(IEventRepository events) => _events = events;

    public async Task<EventResult> CreateAsync(Guid hostUserId, CreateEventRequest request)
    {
        if (!await _events.FixtureExistsAsync(request.FixtureId))
            return EventResult.Fail("Kampen findes ikke.");

        var ev = new Event
        {
            Id = Guid.NewGuid(),
            FixtureId = request.FixtureId,
            HostUserId = hostUserId,
            VenueMode = request.VenueMode,
            VenueText = string.IsNullOrWhiteSpace(request.VenueText) ? null : request.VenueText.Trim(),
            InviteToken = Guid.NewGuid().ToString("N")[..12],
            CreatedUtc = DateTime.UtcNow,
        };

        await _events.AddAsync(ev);

        var saved = await _events.GetByIdAsync(ev.Id);
        return saved is null ? EventResult.Fail("Kunne ikke oprette eventet.") : EventResult.Ok(Map(saved));
    }

    public async Task<IReadOnlyList<EventDto>> GetMineAsync(Guid hostUserId)
    {
        var events = await _events.ListForHostAsync(hostUserId);
        return events.Select(Map).ToList();
    }

    public async Task<GuestEventDto?> GetGuestEventAsync(string token)
    {
        var ev = await _events.GetByTokenAsync(token);
        return ev is null ? null : MapGuest(ev);
    }

    public async Task<GuestEventResult> SubmitRsvpAsync(string token, RsvpRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.GuestName))
            return GuestEventResult.Fail("Skriv dit navn.");

        var ev = await _events.GetByTokenAsync(token);
        if (ev is null)
            return GuestEventResult.Fail("Eventet findes ikke.");

        await _events.AddRsvpAsync(new Rsvp
        {
            Id = Guid.NewGuid(),
            EventId = ev.Id,
            GuestName = request.GuestName.Trim(),
            Answer = request.Answer,
            RespondedUtc = DateTime.UtcNow,
        });

        var updated = await _events.GetByTokenAsync(token);
        return GuestEventResult.Ok(MapGuest(updated!));
    }

    public async Task<bool> AttendAsync(Guid eventId, Guid userId, string displayName, RsvpAnswer answer)
    {
        var ev = await _events.GetByIdAsync(eventId);
        if (ev is null)
            return false;

        await _events.UpsertUserRsvpAsync(eventId, userId, displayName, answer);
        return true;
    }

    private static GuestEventDto MapGuest(Event e) => new(
        e.Fixture?.CompetitionCode ?? string.Empty,
        e.Fixture?.CompetitionName ?? string.Empty,
        e.Fixture?.HomeTeam ?? string.Empty,
        e.Fixture?.AwayTeam ?? string.Empty,
        e.Fixture?.UtcKickoff ?? default,
        e.VenueMode.ToString(),
        e.VenueText,
        e.Host?.DisplayName ?? string.Empty,
        e.Rsvps.Count(r => r.Answer == RsvpAnswer.Yes));

    private static EventDto Map(Event e) => new(
        e.Id,
        e.FixtureId,
        e.Fixture?.CompetitionCode ?? string.Empty,
        e.Fixture?.CompetitionName ?? string.Empty,
        e.Fixture?.HomeTeam ?? string.Empty,
        e.Fixture?.AwayTeam ?? string.Empty,
        e.Fixture?.UtcKickoff ?? default,
        e.VenueMode.ToString(),
        e.VenueText,
        e.InviteToken,
        e.Host?.DisplayName ?? string.Empty,
        e.CreatedUtc);
}
