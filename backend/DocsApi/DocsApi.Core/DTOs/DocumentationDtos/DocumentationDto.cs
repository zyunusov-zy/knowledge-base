namespace DocsApi.Core.DTOs.DocumentationDtos;

public class DocumentationDto
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string Version { get; set; }
    public bool IsTest { get; set; }
    public object Structure { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int CreatedBy { get; set; }
    public int? UpdatedBy { get; set; }
    
    public bool IsActive { get; set; }
    public List<ChangeLogDto> ChangeLogs { get; set; }
}