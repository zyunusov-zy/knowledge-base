namespace DocsApi.Core.Entities.Project;

public class ProjectVersion
{
    public Guid Id { get; set; }
    public Guid ProjectId { get; set; }
    public string Version { get; set; } // "1.2.4"
    public string ChangeLog { get; set; } // JSON or text
    public DateTime CreatedAt { get; set; }
    public bool IsMajor { get; set; } // true for major versions
    
    // Navigation
    public virtual Project Project { get; set; }
}