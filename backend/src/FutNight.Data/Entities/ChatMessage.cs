namespace FutNight.Data.Entities;

// En chatbesked i et events chat. Efemer: slettes 24t efter afsendelse.
public class ChatMessage
{
    public Guid Id { get; set; }

    public Guid EventId { get; set; }
    public Event? Event { get; set; }

    public Guid SenderUserId { get; set; }
    public string SenderName { get; set; } = "";  // denormaliseret displaynavn

    public string Text { get; set; } = "";
    public DateTime SentUtc { get; set; }
}
