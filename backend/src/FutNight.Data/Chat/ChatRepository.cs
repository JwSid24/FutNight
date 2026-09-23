using FutNight.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace FutNight.Data.Chat;

public interface IChatRepository
{
    Task AddAsync(ChatMessage message, CancellationToken ct = default);
    // Beskeder nyere end 'since' (efemer 24t-regel), ældste først.
    Task<IReadOnlyList<ChatMessage>> GetRecentAsync(Guid eventId, DateTime since, CancellationToken ct = default);
    Task<int> DeleteOlderThanAsync(DateTime cutoff, CancellationToken ct = default);
}

public sealed class ChatRepository : IChatRepository
{
    private readonly AppDbContext _db;

    public ChatRepository(AppDbContext db) => _db = db;

    public async Task AddAsync(ChatMessage message, CancellationToken ct = default)
    {
        _db.ChatMessages.Add(message);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<IReadOnlyList<ChatMessage>> GetRecentAsync(Guid eventId, DateTime since, CancellationToken ct = default) =>
        await _db.ChatMessages
            .AsNoTracking()
            .Where(m => m.EventId == eventId && m.SentUtc > since)
            .OrderBy(m => m.SentUtc)
            .ToListAsync(ct);

    public Task<int> DeleteOlderThanAsync(DateTime cutoff, CancellationToken ct = default) =>
        _db.ChatMessages.Where(m => m.SentUtc <= cutoff).ExecuteDeleteAsync(ct);
}
