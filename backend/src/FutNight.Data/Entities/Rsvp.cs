namespace FutNight.Data.Entities;

public enum RsvpAnswer
{
    Yes,
    No,
}

// En gæsts svar på et event (uden konto). Ét event har mange svar.
public class Rsvp
{
    public Guid Id { get; set; }

    public Guid EventId { get; set; }
    public Event? Event { get; set; }

    // null = gæst (via link, uden konto). Sat = indlogget bruger.
    public Guid? UserId { get; set; }

    public string GuestName { get; set; } = "";
    public RsvpAnswer Answer { get; set; }
    public DateTime RespondedUtc { get; set; }
}
