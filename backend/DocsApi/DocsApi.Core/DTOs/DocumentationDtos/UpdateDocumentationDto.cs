namespace DocsApi.Core.DTOs.DocumentationDtos;

public class UpdateDocumentationDto
{
    public string Version { get; set; }
    public bool IsTest { get; set; }
    public object Structure { get; set; }
    public string Description { get; set; }
    public List<ChangeLogEntryDto> ChangeLogEntries { get; set; }
}