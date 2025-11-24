using DocsApi.Core.Entities;
using DocsApi.Core.Entities.Documentations;
using DocsApi.Core.Entities.Project;
using Microsoft.EntityFrameworkCore;

namespace DocsApi.Infrastructure.Data;

public class DocsDbContext : DbContext
{
    public DocsDbContext(DbContextOptions<DocsDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Projects> Projects => Set<Projects>();
    public DbSet<ProjectPermissions> ProjectPermissions => Set<ProjectPermissions>();
    public DbSet<Documentation> Documentations { get; set; }
    public DbSet<DocumentationChangeLog> DocumentationChangeLogs { get; set; }

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
        
        modelBuilder.Entity<Projects>(e =>
        {
            e.ToTable("projects");
            e.HasKey(p => p.Id);

            e.Property(p => p.Name).IsRequired().HasMaxLength(200);
            e.Property(p => p.Slug).IsRequired().HasMaxLength(100);
            
            e.HasIndex(p => p.Slug).IsUnique();
            
            e.HasOne(p => p.Creator)
                .WithMany(u => u.OwnedProjects)
                .HasForeignKey(p => p.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);
        });
        
        modelBuilder.Entity<ProjectPermissions>(e =>
        {
            e.ToTable("project_permissions");
            e.HasKey(pp => pp.Id);
            
            e.HasOne(pp => pp.Projects)
                .WithMany(p => p.Permissions)
                .HasForeignKey(pp => pp.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
            
            e.HasOne(pp => pp.User)
                .WithMany()
                .HasForeignKey(pp => pp.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            e.Property(pp => pp.GrantedAt).IsRequired();
        });
        
        modelBuilder.Entity<Documentation>(entity =>
        {
            entity.ToTable("Documentations"); // Explicit table name
            
            entity.HasIndex(e => new { e.ProjectId, e.Version, e.IsTest })
                .IsUnique()
                .HasDatabaseName("IX_Documentation_Project_Version_Type");

            entity.HasIndex(e => e.IsActive);
            entity.HasIndex(e => e.ProjectId);

            entity.HasOne(d => d.Project)
                .WithMany(p => p.Documentations)
                .HasForeignKey(d => d.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.Creator)
                .WithMany(u => u.CreatedDocumentations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(d => d.Updater)
                .WithMany(u => u.UpdatedDocumentations)
                .HasForeignKey(d => d.UpdatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(d => d.ChangeLogs)
                .WithOne(c => c.Documentation)
                .HasForeignKey(c => c.DocumentationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<DocumentationChangeLog>(entity =>
        {
            entity.ToTable("DocumentationChangeLogs");
            
            entity.HasIndex(e => e.DocumentationId);
            entity.HasIndex(e => e.ChangeDate);

            entity.HasOne(c => c.ChangedByUser)
                .WithMany(u => u.ChangeLogEntries)
                .HasForeignKey(c => c.ChangedBy)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
