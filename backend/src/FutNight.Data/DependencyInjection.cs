using FutNight.Data.Chat;
using FutNight.Data.Entities;
using FutNight.Data.Events;
using FutNight.Data.Fixtures;
using FutNight.Data.Football;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace FutNight.Data;

public static class DependencyInjection
{
    // Registrerer Data-lagets services (DbContext, Identity, repositories, den ene fodbold-data-grænse).
    // Connection string sendes ind fra Api-laget, så Data ikke afhænger af config.
    public static IServiceCollection AddDataLayer(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        // ASP.NET Identity (kun det vi bruger — lempelige krav til MVP/dev).
        services.AddIdentityCore<User>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireDigit = false;
            })
            .AddRoles<IdentityRole<Guid>>()
            .AddEntityFrameworkStores<AppDbContext>();

        services.AddScoped<IFixtureRepository, FixtureRepository>();
        services.AddScoped<IEventRepository, EventRepository>();
        services.AddScoped<IChatRepository, ChatRepository>();

        // Typed HttpClient til fodbold-data-kilden. Base-URL fra options (FootballDataOptions).
        services.AddHttpClient<IFootballDataClient, FootballDataClient>((sp, http) =>
        {
            var opts = sp.GetRequiredService<IOptions<FootballDataOptions>>().Value;
            http.BaseAddress = new Uri(opts.BaseUrl);
        });

        return services;
    }
}
