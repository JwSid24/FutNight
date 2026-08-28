using FutNight.Data.Fixtures;
using FutNight.Data.Football;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace FutNight.Data;

public static class DependencyInjection
{
    // Registrerer Data-lagets services (DbContext, repositories, den ene fodbold-data-grænse).
    // Connection string sendes ind fra Api-laget, så Data ikke afhænger af config.
    public static IServiceCollection AddDataLayer(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IFixtureRepository, FixtureRepository>();

        // Typed HttpClient til fodbold-data-kilden. Base-URL fra options (FootballDataOptions).
        services.AddHttpClient<IFootballDataClient, FootballDataClient>((sp, http) =>
        {
            var opts = sp.GetRequiredService<IOptions<FootballDataOptions>>().Value;
            http.BaseAddress = new Uri(opts.BaseUrl);
        });

        return services;
    }
}
