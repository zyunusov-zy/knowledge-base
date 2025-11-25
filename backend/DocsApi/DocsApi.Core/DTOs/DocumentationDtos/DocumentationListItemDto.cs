namespace DocsApi.Core.DTOs.DocumentationDtos;

public class DocumentationListItemDto
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string ProjectName { get; set; }
    public string Version { get; set; }
    public string Title { get; set; }
    public string CreatedByUsername { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsActive { get; set; }
    public bool IsTest { get; set; }
    public int ChangeLogCount { get; set; }
}