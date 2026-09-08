using FutNight.Data.Entities;

namespace FutNight.Logic.Events;

public sealed record CreateEventRequest(Guid FixtureId, VenueMode VenueMode, string? VenueText);

// Det klienten får. Kampinfo fladet ud, så resten af koden ikke kender Fixture-entiteten direkte.
public sealed record EventDto(
    Guid Id,
    Guid FixtureId,
    string CompetitionCode,
    string CompetitionName,
    string HomeTeam,
    string AwayTeam,
    DateTime UtcKickoff,
    string VenueMode,
    string? VenueText,
    string InviteToken,
    string HostName,
    DateTime CreatedUtc);

public sealed record EventResult(bool Succeeded, EventDto? Event, string? Error)
{
    public static EventResult Ok(EventDto ev) => new(true, ev, null);
    public static EventResult Fail(string error) => new(false, null, error);
}
