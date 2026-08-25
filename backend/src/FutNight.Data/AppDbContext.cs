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
}
