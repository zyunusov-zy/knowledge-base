namespace DocsApi.Core.DTOs.Projects;

public class ProjectDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Slug { get; set; }
    public string CreatorName { get; set; }
    public bool CanEdit { get; set; }
    public bool CanManagePermissions { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}