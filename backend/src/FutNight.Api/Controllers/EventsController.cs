using System.Security.Claims;
using FutNight.Logic.Events;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FutNight.Api.Controllers;

[ApiController]
[Route("api/events")]
[Authorize]
public sealed class EventsController : ControllerBase
{
    private readonly IEventService _events;

    public EventsController(IEventService events) => _events = events;

    private Guid CurrentUserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private string CurrentUserName => User.FindFirstValue("displayName") ?? string.Empty;

    // Opret event — host bliver den indloggede bruger.
    [HttpPost]
    public async Task<ActionResult<EventDto>> Create(CreateEventRequest request)
    {
        var result = await _events.CreateAsync(CurrentUserId, request);
        return result.Succeeded ? Ok(result.Event) : BadRequest(new { error = result.Error });
    }

    // Mine events (som host).
    [HttpGet("mine")]
    public async Task<ActionResult<IReadOnlyList<EventDto>>> Mine()
        => Ok(await _events.GetMineAsync(CurrentUserId));

    // Indlogget bruger svarer ja/nej (ja giver chat-adgang).
    [HttpPost("{eventId:guid}/rsvp")]
    public async Task<ActionResult> Attend(Guid eventId, AttendRequest request)
    {
        var ok = await _events.AttendAsync(eventId, CurrentUserId, CurrentUserName, request.Answer);
        return ok ? Ok() : NotFound(new { error = "Eventet findes ikke." });
    }

    // ---- Gæste-flow (#6): åbne endpoints, ingen login ----

    // Gæst åbner invite-linket → ser dette ene event.
    [AllowAnonymous]
    [HttpGet("by-token/{token}")]
    public async Task<ActionResult<GuestEventDto>> ByToken(string token)
    {
        var ev = await _events.GetGuestEventAsync(token);
        return ev is null ? NotFound(new { error = "Eventet findes ikke." }) : Ok(ev);
    }

    // Gæst svarer ja/nej uden konto.
    [AllowAnonymous]
    [HttpPost("by-token/{token}/rsvp")]
    public async Task<ActionResult<GuestEventDto>> Rsvp(string token, RsvpRequest request)
    {
        var result = await _events.SubmitRsvpAsync(token, request);
        return result.Succeeded ? Ok(result.Event) : BadRequest(new { error = result.Error });
    }
}
