using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DocsApi.Core.Entities.Documentations;
public class DocumentationChangeLog
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int DocumentationId { get; set; }
    
    [ForeignKey("DocumentationId")]
    public virtual Documentation Documentation { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Version { get; set; }
    
    [Required]
    public DateTime ChangeDate { get; set; } = DateTime.UtcNow;
    
    [Required]
    [MaxLength(20)]
    public string ChangeType { get; set; }
    
    [Required]
    [MaxLength(2000)]
    public string Description { get; set; }
    
    public int ChangedBy { get; set; }
    
    [ForeignKey("ChangedBy")]
    public virtual User ChangedByUser { get; set; }
}