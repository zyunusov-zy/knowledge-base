namespace DocsApi.Core.DTOs.DocumentationDtos;

public class ChangeLogEntryDto
{
    public string Version { get; set; }
    public string ChangeType { get; set; }
    public string Description { get; set; }
    public DateTime? ChangeDate { get; set; }
}