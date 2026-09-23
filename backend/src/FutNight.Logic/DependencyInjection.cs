using FutNight.Logic.Auth;
using FutNight.Logic.Chat;
using FutNight.Logic.Events;
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
        services.AddScoped<IEventService, EventService>();
        services.AddScoped<IChatService, ChatService>();

        return services;
    }
}
