using DocsApi.Core.DTOs.DocumentationDtos;

namespace DocsApi.Core.Interfaces.IServices;

public interface IDocumentationService
{
    // Original methods - using DocumentationDto (not DetailDto)
    Task<DocumentationDto> GetByIdAsync(int id);
    Task<DocumentationDto> GetActiveByProjectAsync(int projectId, bool isTest);
    Task<List<DocumentationDto>> GetAllByProjectAsync(int projectId);
    Task<List<DocumentationDto>> GetVersionHistoryAsync(int projectId, bool isTest);
    Task<DocumentationDto> CreateAsync(CreateDocumentationDto dto, int userId);
    Task<DocumentationDto> UpdateAsync(int id, UpdateDocumentationDto dto, int userId);
    Task<bool> DeleteAsync(int id);
    Task<bool> SetActiveVersionAsync(int projectId, int documentationId, bool isTest);
    Task<List<ChangeLogDto>> GetChangeLogsAsync(int documentationId);
    
    // NEW methods - Additional functionality
    Task<List<DocumentationListItemDto>> GetAllDocumentationsAsync();
    Task<List<DocumentationSummaryDto>> GetDocumentationSummariesAsync();
    Task<DocumentationDto> GetByVersionAsync(int projectId, string version, bool isTest);
}