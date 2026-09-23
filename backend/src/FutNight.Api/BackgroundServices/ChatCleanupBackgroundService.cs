using FutNight.Data.Chat;

namespace FutNight.Api.BackgroundServices;

// Efemer chat: sletter beskeder ældre end 24 timer. Kører hver time.
public sealed class ChatCleanupBackgroundService : BackgroundService
{
    private static readonly TimeSpan Interval = TimeSpan.FromHours(1);
    private static readonly TimeSpan Ttl = TimeSpan.FromHours(24);

    private readonly IServiceProvider _services;
    private readonly ILogger<ChatCleanupBackgroundService> _logger;

    public ChatCleanupBackgroundService(IServiceProvider services, ILogger<ChatCleanupBackgroundService> logger)
    {
        _services = services;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _services.CreateScope();
                var chat = scope.ServiceProvider.GetRequiredService<IChatRepository>();
                var deleted = await chat.DeleteOlderThanAsync(DateTime.UtcNow - Ttl, stoppingToken);
                if (deleted > 0)
                    _logger.LogInformation("Ryddede {Count} udløbne chatbeskeder.", deleted);
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Chat-oprydning fejlede.");
            }

            try
            {
                await Task.Delay(Interval, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
        }
    }
}
