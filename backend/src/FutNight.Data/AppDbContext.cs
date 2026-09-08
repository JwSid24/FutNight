using FutNight.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FutNight.Data;

// IdentityDbContext giver AspNetUsers/AspNetRoles m.fl. Vores egne tabeller ligger ved siden af.
public class AppDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

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
