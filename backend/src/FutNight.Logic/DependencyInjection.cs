using FutNight.Logic.Auth;
using FutNight.Logic.Fixtures;
using Microsoft.Extensions.DependencyInjection;

namespace FutNight.Logic;

public static class DependencyInjection
{
    // Registrerer Logik-lagets services.
    public static IServiceCollection AddLogicLayer(this IServiceCollection services)
    {
        services.AddScoped<IFixtureService, FixtureService>();
        services.AddScoped<IFixtureSyncService, FixtureSyncService>();
        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}
