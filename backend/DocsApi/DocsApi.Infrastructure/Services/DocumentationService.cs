using System.Text.Json;
using DocsApi.Core.DTOs.DocumentationDtos;
using DocsApi.Core.Entities.Documentations;
using DocsApi.Core.Interfaces.IRepository;
using DocsApi.Core.Interfaces.IServices;

namespace DocsApi.Infrastructure.Services;

public class DocumentationService : IDocumentationService
{
    private readonly IDocumentationRepository _repository;

    public DocumentationService(IDocumentationRepository repository)
    {
        _repository = repository;
    }

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

    // ⭐ CHANGED: userName (string) → userId (int) ⭐
    public async Task<DocumentationDto> CreateAsync(CreateDocumentationDto dto, int userId)
    {
        var documentation = new Documentation
        {
            ProjectId = dto.ProjectId,
            Version = dto.Version,
            IsTest = dto.IsTest,
            StructureJson = JsonSerializer.Serialize(dto.Structure),
            Description = dto.Description,
            CreatedBy = userId,      // ⭐ Now using int
            UpdatedBy = userId,      // ⭐ Now using int
            IsActive = true,
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
                    ChangedBy = userId  // ⭐ Now using int
                });
            }
        }

        // Deactivate other versions
        await _repository.SetActiveVersionAsync(dto.ProjectId, 0, dto.IsTest);

        var created = await _repository.CreateAsync(documentation);
        
        // Set this as active
        await _repository.SetActiveVersionAsync(dto.ProjectId, created.Id, dto.IsTest);

        return MapToDto(created);
    }

    // ⭐ CHANGED: userName (string) → userId (int) ⭐
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
        documentation.UpdatedBy = userId;  // ⭐ Now using int

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
                ChangedBy = userId  // ⭐ Now using int
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
}
