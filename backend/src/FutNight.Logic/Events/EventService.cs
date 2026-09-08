using FutNight.Data.Entities;
using FutNight.Data.Events;

namespace FutNight.Logic.Events;

public interface IEventService
{
    Task<EventResult> CreateAsync(Guid hostUserId, CreateEventRequest request);
    Task<IReadOnlyList<EventDto>> GetMineAsync(Guid hostUserId);
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
