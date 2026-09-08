using FutNight.Data.Entities;
using Microsoft.AspNetCore.Identity;

namespace FutNight.Logic.Auth;

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(RegisterRequest request);
    Task<AuthResult> LoginAsync(LoginRequest request);
}

public sealed class AuthService : IAuthService
{
    private readonly UserManager<User> _users;
    private readonly ITokenService _tokens;

    public AuthService(UserManager<User> users, ITokenService tokens)
    {
        _users = users;
        _tokens = tokens;
    }

    public async Task<AuthResult> RegisterAsync(RegisterRequest request)
    {
        if (await _users.FindByEmailAsync(request.Email) is not null)
            return AuthResult.Fail("Der findes allerede en bruger med den e-mail.");

        var user = new User
        {
            Email = request.Email,
            UserName = request.Email,
            DisplayName = string.IsNullOrWhiteSpace(request.DisplayName) ? request.Email : request.DisplayName.Trim(),
        };

        var result = await _users.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return AuthResult.Fail(string.Join(" ", result.Errors.Select(e => e.Description)));

        return AuthResult.Ok(new AuthResponse(_tokens.CreateToken(user), user.Email!, user.DisplayName));
    }

    public async Task<AuthResult> LoginAsync(LoginRequest request)
    {
        var user = await _users.FindByEmailAsync(request.Email);
        if (user is null || !await _users.CheckPasswordAsync(user, request.Password))
            return AuthResult.Fail("Forkert e-mail eller adgangskode.");

        return AuthResult.Ok(new AuthResponse(_tokens.CreateToken(user), user.Email!, user.DisplayName));
    }
}
