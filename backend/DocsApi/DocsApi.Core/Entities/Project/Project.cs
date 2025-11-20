namespace DocsApi.Core.Entities.Project;

public class Project
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public bool IsTestEnvironment { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid CreatedBy { get; set; }
    
    // Navigation properties
    public virtual ICollection<ProjectVersion> Versions { get; set; }
}