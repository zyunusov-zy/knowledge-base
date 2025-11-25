namespace DocsApi.Core.DTOs.DocumentationDtos;

public class DocumentationVersionDto
{
    public int Id { get; set; }
    public string Version { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedByUsername { get; set; }
    public bool IsActive { get; set; }
    public bool IsTest { get; set; }
    public string Description { get; set; }
    public List<ChangeLogDto> RecentChanges { get; set; }
}