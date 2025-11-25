using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DocsApi.Core.Entities.Project;

namespace DocsApi.Core.Entities.Documentations;

public class Documentation
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int ProjectId { get; set; }
    
    [ForeignKey("ProjectId")]
    public virtual Projects Project { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Version { get; set; }
    
    [Required]
    public bool IsTest { get; set; }
    
    [Required]
    [Column(TypeName = "jsonb")]
    public string StructureJson { get; set; } 
    
    [MaxLength(2000)]
    public string Description { get; set; }
    
    [Required]
    [MaxLength(1000)]
    public string Title { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public int CreatedBy { get; set; }
    
    [ForeignKey("CreatedBy")]
    public virtual User Creator { get; set; }
    
    public int? UpdatedBy { get; set; }
    
    [ForeignKey("UpdatedBy")]
    public virtual User Updater { get; set; }
    
    public bool IsActive { get; set; } // Current active version
    
    public virtual ICollection<DocumentationChangeLog> ChangeLogs { get; set; }
}