using DocsApi.Core.DTOs.DocumentationDtos;

namespace DocsApi.Core.Interfaces.IServices;

public interface IDocumentationService
{
    Task<DocumentationDto> GetByIdAsync(int id);
    Task<DocumentationDto> GetActiveByProjectAsync(int projectId, bool isTest);
    Task<List<DocumentationDto>> GetAllByProjectAsync(int projectId);
    Task<List<DocumentationDto>> GetVersionHistoryAsync(int projectId, bool isTest);
    
    // ⭐ CHANGED: string userName → int userId ⭐
    Task<DocumentationDto> CreateAsync(CreateDocumentationDto dto, int userId);
    Task<DocumentationDto> UpdateAsync(int id, UpdateDocumentationDto dto, int userId);
    
    Task<bool> DeleteAsync(int id);
    Task<bool> SetActiveVersionAsync(int projectId, int documentationId, bool isTest);
    Task<List<ChangeLogDto>> GetChangeLogsAsync(int documentationId);
}
