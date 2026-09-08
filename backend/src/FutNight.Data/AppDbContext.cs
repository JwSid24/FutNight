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

        modelBuilder.Entity<Event>(e =>
        {
            e.HasIndex(x => x.InviteToken).IsUnique();
            e.HasOne(x => x.Fixture).WithMany().HasForeignKey(x => x.FixtureId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Host).WithMany().HasForeignKey(x => x.HostUserId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}
