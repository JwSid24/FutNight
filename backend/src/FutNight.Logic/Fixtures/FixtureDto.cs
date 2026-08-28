namespace FutNight.Logic.Fixtures;

// Det Api-laget ser. Ingen spor af kilden (Football-Data.org) her.
public sealed record FixtureDto(
    Guid Id,
    string CompetitionCode,
    string CompetitionName,
    string HomeTeam,
    string AwayTeam,
    DateTime UtcKickoff,
    string Status,
    int? Matchday);
