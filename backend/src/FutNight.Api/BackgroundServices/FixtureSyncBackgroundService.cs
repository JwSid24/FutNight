using FutNight.Data.Football;
using FutNight.Logic.Fixtures;
using Microsoft.Extensions.Options;

namespace FutNight.Api.BackgroundServices;

// Synkroniserer kampe ved opstart og derefter med fast interval (FootballData:SyncIntervalHours).
public sealed class FixtureSyncBackgroundService : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly FootballDataOptions _options;
    private readonly ILogger<FixtureSyncBackgroundService> _logger;

    public FixtureSyncBackgroundService(
        IServiceProvider services,
        IOptions<FootballDataOptions> options,
        ILogger<FixtureSyncBackgroundService> logger)
    {
        _services = services;
        _options = options.Value;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var interval = TimeSpan.FromHours(Math.Max(1, _options.SyncIntervalHours));

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // Baggrundsservicen er singleton; scoped services (DbContext m.m.) kræver et scope.
                using var scope = _services.CreateScope();
                var sync = scope.ServiceProvider.GetRequiredService<IFixtureSyncService>();

                var count = await sync.SyncAllAsync(stoppingToken);
                _logger.LogInformation("Baggrunds-sync færdig: {Count} kampe.", count);
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Baggrunds-sync fejlede — prøver igen næste interval.");
            }

            try
            {
                await Task.Delay(interval, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
        }
    }
}
