namespace FutNight.Api.Auth;

// Nøglen (Key) kommer fra user-secrets; resten fra appsettings.
public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = "FutNight";
    public string Audience { get; set; } = "FutNightApp";
    public string Key { get; set; } = "";
    public int ExpiryMinutes { get; set; } = 1440;
}
