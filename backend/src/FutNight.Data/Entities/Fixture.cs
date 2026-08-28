namespace FutNight.Data.Entities;

// En kamp, cachet i vores egen DB. Vores egen model — uafhængig af kilden (Football-Data.org).
public class Fixture
{
    public Guid Id { get; set; }

    // Kildens kamp-id (neutralt navn, så resten af koden ikke kender udbyderen). Bruges til upsert.
    public int ExternalId { get; set; }

    public string CompetitionCode { get; set; } = "";   // "PL", "PD", "BL1", "SA", "FL1", "CL"
    public string CompetitionName { get; set; } = "";

    public string HomeTeam { get; set; } = "";
    public string AwayTeam { get; set; } = "";

    public DateTime UtcKickoff { get; set; }
    public string Status { get; set; } = "";             // TIMED / SCHEDULED / FINISHED ...
    public int? Matchday { get; set; }

    public DateTime LastSyncedUtc { get; set; }
}
