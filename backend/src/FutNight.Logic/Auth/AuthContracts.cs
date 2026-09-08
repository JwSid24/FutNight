namespace FutNight.Logic.Auth;

public sealed record RegisterRequest(string Email, string Password, string DisplayName);

public sealed record LoginRequest(string Email, string Password);

// Det klienten får tilbage ved succes.
public sealed record AuthResponse(string Token, string Email, string DisplayName);

public sealed record AuthResult(bool Succeeded, AuthResponse? Response, string? Error)
{
    public static AuthResult Ok(AuthResponse response) => new(true, response, null);
    public static AuthResult Fail(string error) => new(false, null, error);
}
