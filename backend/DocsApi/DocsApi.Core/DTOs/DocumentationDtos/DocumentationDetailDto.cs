namespace DocsApi.Core.DTOs.DocumentationDtos;

public class DocumentationDetailDto
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string ProjectName { get; set; }
    public string Version { get; set; }
    public bool IsTest { get; set; }
    public object Structure { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string CreatedByUsername { get; set; }
    public string UpdatedByUsername { get; set; }
    public bool IsActive { get; set; }
    public List<ChangeLogDto> ChangeLogs { get; set; }
    public List<DocumentationVersionDto> AvailableVersions { get; set; }
}