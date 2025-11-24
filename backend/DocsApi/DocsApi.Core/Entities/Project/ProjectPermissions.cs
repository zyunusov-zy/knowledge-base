using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DocsApi.Core.Entities.Project;

public class ProjectPermissions
{
    [Key]
    public int Id { get; set; }
        
    public int ProjectId { get; set; }
        
    [ForeignKey("ProjectId")]
    public Projects Projects { get; set; }
        
    public int UserId { get; set; }
        
    [ForeignKey("UserId")]
    public User User { get; set; }
        
    public DateTime GrantedAt { get; set; } = DateTime.UtcNow;

    public int GrantedBy { get; set; }
}