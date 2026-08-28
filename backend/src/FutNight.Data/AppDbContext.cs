using FutNight.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace FutNight.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Fixture> Fixtures => Set<Fixture>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Fixture>(e =>
        {
            e.HasIndex(f => f.ExternalId).IsUnique();
            e.HasIndex(f => f.CompetitionCode);
            e.HasIndex(f => f.UtcKickoff);
        });
    }
}
