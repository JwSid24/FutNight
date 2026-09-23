namespace FutNight.Logic.Chat;

public sealed record ChatMessageDto(Guid Id, Guid SenderUserId, string SenderName, string Text, DateTime SentUtc);

public sealed record ChatSendRequest(string Text);

// CanSend = false når der er gået 24t siden kampstart. Messages = beskeder nyere end 24t.
public sealed record ChatStateDto(bool CanSend, IReadOnlyList<ChatMessageDto> Messages);

public sealed record ChatSendResult(bool Succeeded, ChatMessageDto? Message, string? Error)
{
    public static ChatSendResult Ok(ChatMessageDto message) => new(true, message, null);
    public static ChatSendResult Fail(string error) => new(false, null, error);
}
