using DocsApi.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace DocsApi.Infrastructure.Data;

public class DocsDbContext : DbContext
{
    public DocsDbContext(DbContextOptions<DocsDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.ToTable("users");
            e.HasKey(x => x.Id);

            e.Property(x => x.Email).IsRequired();
            e.HasIndex(x => x.Email).IsUnique();
        });
    }
}