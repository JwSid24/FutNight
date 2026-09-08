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
}
