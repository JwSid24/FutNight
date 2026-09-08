using Microsoft.AspNetCore.Identity;

namespace FutNight.Data.Entities;

// Arrangør-bruger. Arver Identity-felter (Email, UserName, PasswordHash m.m.). Guid som nøgle.
public class User : IdentityUser<Guid>
{
    public string DisplayName { get; set; } = "";
}
