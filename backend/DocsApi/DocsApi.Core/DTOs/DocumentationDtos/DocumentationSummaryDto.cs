namespace DocsApi.Core.DTOs.DocumentationDtos;

public class DocumentationSummaryDto
{
    public int ProjectId { get; set; }
    public string ProjectName { get; set; }
    public string LatestVersion { get; set; }
    public string Title { get; set; }
    public DateTime LastUpdated { get; set; }
    public string LastUpdatedByUsername { get; set; }
    public int TotalVersions { get; set; }
    public bool HasTestVersion { get; set; }
    public bool HasProductionVersion { get; set; }
}