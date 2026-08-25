using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace FutNight.Data;

public static class DependencyInjection
{
    // Registrerer Data-lagets services (DbContext m.m.).
    // Connection string sendes ind fra Api-laget, så Data ikke afhænger af config.
    public static IServiceCollection AddDataLayer(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        return services;
    }
}
