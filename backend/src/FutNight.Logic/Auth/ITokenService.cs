using FutNight.Data.Entities;

namespace FutNight.Logic.Auth;

// Udsteder et JWT for en bruger. Implementeres i Api-laget (som kender JWT-detaljerne).
public interface ITokenService
{
    string CreateToken(User user);
}
