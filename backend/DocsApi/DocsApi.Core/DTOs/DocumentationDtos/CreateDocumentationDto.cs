namespace DocsApi.Core.DTOs.DocumentationDtos;

public class CreateDocumentationDto
{
    public int ProjectId { get; set; }
    public string Version { get; set; }
    public bool IsTest { get; set; }
    public object Structure { get; set; }
    public string Description { get; set; }
    public List<ChangeLogEntryDto> ChangeLogEntries { get; set; }
}