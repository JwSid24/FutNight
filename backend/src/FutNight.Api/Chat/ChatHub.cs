using System.Security.Claims;
using FutNight.Data.Events;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace FutNight.Api.Chat;

// Realtime-levering. Beskeder sendes via REST (ChatController) og broadcastes til gruppen herfra.
[Authorize]
public sealed class ChatHub : Hub
{
    private readonly IEventRepository _events;

    public ChatHub(IEventRepository events) => _events = events;

    public static string GroupName(Guid eventId) => $"event-{eventId}";

    public async Task JoinEvent(Guid eventId)
    {
        var userId = Guid.Parse(Context.User!.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (!await _events.CanUserAccessChatAsync(eventId, userId))
            throw new HubException("Du har ikke adgang til denne chat.");

        await Groups.AddToGroupAsync(Context.ConnectionId, GroupName(eventId));
    }
}
