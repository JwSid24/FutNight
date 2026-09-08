namespace FutNight.Data.Entities;

// Et watch-party knyttet til ét fixture, ejet af en arrangør (host).
public class Event
{
    public Guid Id { get; set; }

    public Guid FixtureId { get; set; }
    public Fixture? Fixture { get; set; }

    public Guid HostUserId { get; set; }
    public User? Host { get; set; }

    public VenueMode VenueMode { get; set; }
    public string? VenueText { get; set; }   // fx adresse når host lægger hus til

    public string InviteToken { get; set; } = "";  // til det delbare link
    public DateTime CreatedUtc { get; set; }
}
