using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DocsApi.Core.Entities.Documentations;

namespace DocsApi.Core.Entities.Project;

public class Projects
{
    [Key]
    public int Id { get; set; }
        
    [Required]
    [MaxLength(200)]
    public string Name { get; set; }
        
    [MaxLength(5000)]
    public string Description { get; set; }
        
    [Required]
    [MaxLength(100)]
    public string Slug { get; set; }
        
    public int CreatedBy { get; set; }
        
    [ForeignKey("CreatedBy")]
    public User Creator { get; set; }
        
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ProjectPermissions> Permissions { get; set; }
    
    public ICollection<Documentation> Documentations { get; set; }
}