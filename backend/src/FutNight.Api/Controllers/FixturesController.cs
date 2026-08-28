using FutNight.Logic.Fixtures;
using Microsoft.AspNetCore.Mvc;

namespace FutNight.Api.Controllers;

[ApiController]
[Route("api/fixtures")]
public sealed class FixturesController : ControllerBase
{
    private readonly IFixtureService _fixtures;
    private readonly IFixtureSyncService _sync;

    public FixturesController(IFixtureService fixtures, IFixtureSyncService sync)
    {
        _fixtures = fixtures;
        _sync = sync;
    }

    // Kommende kampe fra cachen. Valgfrit filter: ?competition=PL
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<FixtureDto>>> GetUpcoming(
        [FromQuery] string? competition, CancellationToken ct)
    {
        var fixtures = await _fixtures.GetUpcomingAsync(competition, ct);
        return Ok(fixtures);
    }

    // Manuel trigger af sync (hent + cache). TODO: beskyt med auth når #1 er bygget.
    [HttpPost("sync")]
    public async Task<ActionResult> Sync(CancellationToken ct)
    {
        var count = await _sync.SyncAllAsync(ct);
        return Ok(new { synced = count });
    }
}
