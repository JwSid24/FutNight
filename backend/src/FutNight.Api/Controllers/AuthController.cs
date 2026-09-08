using FutNight.Logic.Auth;
using Microsoft.AspNetCore.Mvc;

namespace FutNight.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth) => _auth = auth;

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var result = await _auth.RegisterAsync(request);
        return result.Succeeded ? Ok(result.Response) : BadRequest(new { error = result.Error });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var result = await _auth.LoginAsync(request);
        return result.Succeeded ? Ok(result.Response) : Unauthorized(new { error = result.Error });
    }
}
