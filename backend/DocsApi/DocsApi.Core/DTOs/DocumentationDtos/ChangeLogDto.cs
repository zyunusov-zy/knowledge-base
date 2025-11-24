namespace DocsApi.Core.DTOs.DocumentationDtos;

public class ChangeLogDto
{
    public int Id { get; set; }
    public string Version { get; set; }
    public DateTime ChangeDate { get; set; }
    public string ChangeType { get; set; }
    public string Description { get; set; }
    public int ChangedBy { get; set; }
}