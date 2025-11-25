using System.Text.Json;
using DocsApi.Core.DTOs.DocumentationDtos;
using DocsApi.Core.Entities.Documentations;
using DocsApi.Core.Interfaces.IRepository;
using DocsApi.Core.Interfaces.IServices;

public class DocumentationService : IDocumentationService
{
    private readonly IDocumentationRepository _repository;

    public DocumentationService(IDocumentationRepository repository)
    {
        _repository = repository;
    }

    // ============================================================
    // ORIGINAL METHODS (keeping your existing implementation)
    // ============================================================
    
    public async Task<DocumentationDto> GetByIdAsync(int id)
    {
        var doc = await _repository.GetByIdAsync(id);
        return doc == null ? null : MapToDto(doc);
    }

    public async Task<DocumentationDto> GetActiveByProjectAsync(int projectId, bool isTest)
    {
        var doc = await _repository.GetActiveByProjectAsync(projectId, isTest);
        return doc == null ? null : MapToDto(doc);
    }

    public async Task<List<DocumentationDto>> GetAllByProjectAsync(int projectId)
    {
        var docs = await _repository.GetAllByProjectAsync(projectId);
        return docs.Select(MapToDto).ToList();
    }

    public async Task<List<DocumentationDto>> GetVersionHistoryAsync(int projectId, bool isTest)
    {
        var docs = await _repository.GetAllVersionsByProjectAsync(projectId, isTest);
        return docs.Select(MapToDto).ToList();
    }

    public async Task<DocumentationDto> CreateAsync(CreateDocumentationDto dto, int userId)
    {
        // Check if version already exists
        var exists = await _repository.VersionExistsAsync(dto.ProjectId, dto.Version, dto.IsTest);
        if (exists)
        {
            throw new InvalidOperationException($"Version {dto.Version} already exists for this project in {(dto.IsTest ? "test" : "production")} environment.");
        }

        var documentation = new Documentation
        {
            ProjectId = dto.ProjectId,
            Version = dto.Version,
            IsTest = dto.IsTest,
            StructureJson = JsonSerializer.Serialize(dto.Structure),
            Description = dto.Description,
            CreatedBy = userId,
            UpdatedBy = userId,
            IsActive = true,
            Title =  dto.Title,
            ChangeLogs = new List<DocumentationChangeLog>()
        };

        // Add changelog entries
        if (dto.ChangeLogEntries != null && dto.ChangeLogEntries.Any())
        {
            foreach (var entry in dto.ChangeLogEntries)
            {
                documentation.ChangeLogs.Add(new DocumentationChangeLog
                {
                    Version = entry.Version ?? dto.Version,
                    ChangeDate = entry.ChangeDate ?? DateTime.UtcNow,
                    ChangeType = entry.ChangeType,
                    Description = entry.Description,
                    ChangedBy = userId
                });
            }
        }
        else
        {
            // Add initial creation changelog
            documentation.ChangeLogs.Add(new DocumentationChangeLog
            {
                Version = dto.Version,
                ChangeDate = DateTime.UtcNow,
                ChangeType = "created",
                Description = "Initial documentation version created",
                ChangedBy = userId
            });
        }

        // Deactivate other versions
        await _repository.SetActiveVersionAsync(dto.ProjectId, 0, dto.IsTest);

        var created = await _repository.CreateAsync(documentation);
        
        // Set this as active
        await _repository.SetActiveVersionAsync(dto.ProjectId, created.Id, dto.IsTest);

        return MapToDto(created);
    }

    public async Task<DocumentationDto> UpdateAsync(int id, UpdateDocumentationDto dto, int userId)
    {
        var documentation = await _repository.GetByIdAsync(id);
        if (documentation == null)
            return null;

        // Detect changes
        var oldStructure = documentation.StructureJson;
        var newStructure = JsonSerializer.Serialize(dto.Structure);
        
        documentation.Version = dto.Version;
        documentation.IsTest = dto.IsTest;
        documentation.StructureJson = newStructure;
        documentation.Description = dto.Description;
        documentation.UpdatedBy = userId;
        documentation.Title = dto.Title;

        // Add new changelog entries
        if (dto.ChangeLogEntries != null && dto.ChangeLogEntries.Any())
        {
            foreach (var entry in dto.ChangeLogEntries)
            {
                var changeLog = new DocumentationChangeLog
                {
                    DocumentationId = id,
                    Version = entry.Version ?? dto.Version,
                    ChangeDate = entry.ChangeDate ?? DateTime.UtcNow,
                    ChangeType = entry.ChangeType,
                    Description = entry.Description,
                    ChangedBy = userId,
                };
                documentation.ChangeLogs.Add(changeLog);
            }
        }
        else if (oldStructure != newStructure)
        {
            // Auto-generate changelog if structure changed but no manual entries
            var changeLog = new DocumentationChangeLog
            {
                DocumentationId = id,
                Version = dto.Version,
                ChangeDate = DateTime.UtcNow,
                ChangeType = "modified",
                Description = "Documentation structure updated",
                ChangedBy = userId
            };
            documentation.ChangeLogs.Add(changeLog);
        }

        var updated = await _repository.UpdateAsync(documentation);
        return MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repository.DeleteAsync(id);
    }

    public async Task<bool> SetActiveVersionAsync(int projectId, int documentationId, bool isTest)
    {
        return await _repository.SetActiveVersionAsync(projectId, documentationId, isTest);
    }

    public async Task<List<ChangeLogDto>> GetChangeLogsAsync(int documentationId)
    {
        var logs = await _repository.GetChangeLogsByDocumentationAsync(documentationId);
        return logs.Select(l => new ChangeLogDto
        {
            Id = l.Id,
            Version = l.Version,
            ChangeDate = l.ChangeDate,
            ChangeType = l.ChangeType,
            Description = l.Description,
            ChangedBy = l.ChangedBy
        }).ToList();
    }

    // ============================================================
    // NEW METHODS - Additional functionality
    // ============================================================

    // Get lightweight list for listing page
    public async Task<List<DocumentationListItemDto>> GetAllDocumentationsAsync()
    {
        var docs = await _repository.GetAllDocumentationsLightweightAsync();
        return docs.Select(MapToListItemDto).ToList();
    }

    // Get unique documentation summary (one per project)
    public async Task<List<DocumentationSummaryDto>> GetDocumentationSummariesAsync()
    {
        var projectIds = await _repository.GetProjectsWithDocumentationAsync();
        var summaries = new List<DocumentationSummaryDto>();

        foreach (var projectId in projectIds)
        {
            var allVersions = await _repository.GetAllByProjectAsync(projectId);
            if (!allVersions.Any()) continue;

            var latest = allVersions.OrderByDescending(d => d.CreatedAt).First();
            
            summaries.Add(new DocumentationSummaryDto
            {
                ProjectId = projectId,
                ProjectName = latest.Project?.Name,
                LatestVersion = latest.Version,
                Title = ExtractTitle(latest.StructureJson),
                LastUpdated = latest.UpdatedAt,
                LastUpdatedByUsername = latest.Updater?.Username ?? latest.Creator?.Username,
                TotalVersions = allVersions.Count,
                HasTestVersion = allVersions.Any(d => d.IsTest),
                HasProductionVersion = allVersions.Any(d => !d.IsTest)
            });
        }

        return summaries.OrderByDescending(s => s.LastUpdated).ToList();
    }

    // Get specific version by version string
    public async Task<DocumentationDto> GetByVersionAsync(int projectId, string version, bool isTest)
    {
        var doc = await _repository.GetByProjectAndVersionAsync(projectId, version, isTest);
        return doc == null ? null : MapToDto(doc);
    }

    // ============================================================
    // HELPER METHODS
    // ============================================================

    // Extract title from structure JSON
    private string ExtractTitle(string structureJson)
    {
        try
        {
            var structure = JsonSerializer.Deserialize<List<Dictionary<string, object>>>(structureJson);
            if (structure != null && structure.Count > 0 && structure[0].ContainsKey("content"))
            {
                var content = JsonSerializer.Deserialize<Dictionary<string, object>>(structure[0]["content"].ToString());
                if (content != null && content.ContainsKey("title"))
                {
                    return content["title"].ToString();
                }
            }
        }
        catch
        {
            // If parsing fails, return default
        }
        return "Untitled Documentation";
    }

    // Original mapping to DocumentationDto (keeping your implementation)
    private DocumentationDto MapToDto(Documentation doc)
    {
        return new DocumentationDto
        {
            Id = doc.Id,
            ProjectId = doc.ProjectId,
            Version = doc.Version,
            IsTest = doc.IsTest,
            Structure = JsonSerializer.Deserialize<object>(doc.StructureJson),
            Description = doc.Description,
            CreatedAt = doc.CreatedAt,
            UpdatedAt = doc.UpdatedAt,
            CreatedBy = doc.CreatedBy,
            UpdatedBy = doc.UpdatedBy,
            IsActive = doc.IsActive,
            Title = doc.Title,
            ChangeLogs = doc.ChangeLogs?.Select(c => new ChangeLogDto
            {
                Id = c.Id,
                Version = c.Version,
                ChangeDate = c.ChangeDate,
                ChangeType = c.ChangeType,
                Description = c.Description,
                ChangedBy = c.ChangedBy
            }).ToList()
        };
    }

    // NEW mapping to lightweight DTO
    private DocumentationListItemDto MapToListItemDto(Documentation doc)
    {
        return new DocumentationListItemDto
        {
            Id = doc.Id,
            ProjectId = doc.ProjectId,
            ProjectName = doc.Project?.Name,
            Version = doc.Version,
            Title = doc.Title,
            CreatedByUsername = doc.Creator?.Username ?? "Unknown",
            CreatedAt = doc.CreatedAt,
            UpdatedAt = doc.UpdatedAt,
            IsActive = doc.IsActive,
            IsTest = doc.IsTest,
            ChangeLogCount = doc.ChangeLogs?.Count ?? 0
        };
    }
}