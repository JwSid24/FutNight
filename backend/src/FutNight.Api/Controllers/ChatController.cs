using System.Security.Claims;
using FutNight.Api.Chat;
using FutNight.Logic.Chat;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace FutNight.Api.Controllers;

[ApiController]
[Route("api/events/{eventId:guid}/chat")]
[Authorize]
public sealed class ChatController : ControllerBase
{
    private readonly IChatService _chat;
    private readonly IHubContext<ChatHub> _hub;

    public ChatController(IChatService chat, IHubContext<ChatHub> hub)
    {
        _chat = chat;
        _hub = hub;
    }

    private Guid CurrentUserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private string CurrentUserName => User.FindFirstValue("displayName") ?? string.Empty;

    // Historik + om der stadig kan sendes (24t efter kampstart).
    [HttpGet]
    public async Task<ActionResult<ChatStateDto>> Get(Guid eventId)
    {
        var state = await _chat.GetChatAsync(eventId, CurrentUserId);
        return state is null ? NotFound(new { error = "Ingen adgang eller eventet findes ikke." }) : Ok(state);
    }

    // Send besked → gemmes + broadcastes til gruppen i realtid.
    [HttpPost]
    public async Task<ActionResult<ChatMessageDto>> Send(Guid eventId, ChatSendRequest request)
    {
        var result = await _chat.SendAsync(eventId, CurrentUserId, CurrentUserName, request.Text);
        if (!result.Succeeded)
            return BadRequest(new { error = result.Error });

        await _hub.Clients.Group(ChatHub.GroupName(eventId)).SendAsync("ReceiveMessage", result.Message);
        return Ok(result.Message);
    }
}
