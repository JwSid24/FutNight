using FutNight.Data.Chat;
using FutNight.Data.Entities;
using FutNight.Data.Events;

namespace FutNight.Logic.Chat;

public interface IChatService
{
    Task<ChatStateDto?> GetChatAsync(Guid eventId, Guid userId);
    Task<ChatSendResult> SendAsync(Guid eventId, Guid senderId, string senderName, string text);
}

public sealed class ChatService : IChatService
{
    private static readonly TimeSpan MessageTtl = TimeSpan.FromHours(24);            // besked lever 24t efter afsendelse
    private static readonly TimeSpan SendWindowAfterKickoff = TimeSpan.FromHours(24); // kan ikke sende 24t efter kampstart

    private readonly IChatRepository _chat;
    private readonly IEventRepository _events;

    public ChatService(IChatRepository chat, IEventRepository events)
    {
        _chat = chat;
        _events = events;
    }

    public async Task<ChatStateDto?> GetChatAsync(Guid eventId, Guid userId)
    {
        var ev = await _events.GetByIdAsync(eventId);
        if (ev is null)
            return null;
        // Kun host + indloggede deltagere der har svaret ja.
        if (!await _events.CanUserAccessChatAsync(eventId, userId))
            return null;

        var since = DateTime.UtcNow - MessageTtl;
        var messages = await _chat.GetRecentAsync(eventId, since);
        return new ChatStateDto(CanSend(ev), messages.Select(Map).ToList());
    }

    public async Task<ChatSendResult> SendAsync(Guid eventId, Guid senderId, string senderName, string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return ChatSendResult.Fail("Skriv en besked.");

        var ev = await _events.GetByIdAsync(eventId);
        if (ev is null)
            return ChatSendResult.Fail("Eventet findes ikke.");
        if (!await _events.CanUserAccessChatAsync(eventId, senderId))
            return ChatSendResult.Fail("Du har ikke adgang til denne chat.");
        if (!CanSend(ev))
            return ChatSendResult.Fail("Chatten er lukket (24 timer efter kampen).");

        var message = new ChatMessage
        {
            Id = Guid.NewGuid(),
            EventId = eventId,
            SenderUserId = senderId,
            SenderName = senderName,
            Text = text.Trim(),
            SentUtc = DateTime.UtcNow,
        };

        await _chat.AddAsync(message);
        return ChatSendResult.Ok(Map(message));
    }

    private static bool CanSend(Event ev)
    {
        var kickoff = ev.Fixture?.UtcKickoff;
        return kickoff is null || DateTime.UtcNow <= kickoff.Value + SendWindowAfterKickoff;
    }

    private static ChatMessageDto Map(ChatMessage m) =>
        new(m.Id, m.SenderUserId, m.SenderName, m.Text, m.SentUtc);
}
