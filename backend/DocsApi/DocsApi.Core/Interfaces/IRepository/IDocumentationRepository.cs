using DocsApi.Core.Entities.Documentations;

namespace DocsApi.Core.Interfaces.IRepository;

public interface IDocumentationRepository
{
    Task<Documentation> GetByIdAsync(int id);
    Task<Documentation> GetByProjectAndVersionAsync(int projectId, string version, bool isTest);
    Task<Documentation> GetActiveByProjectAsync(int projectId, bool isTest);
    Task<List<Documentation>> GetAllByProjectAsync(int projectId);
    Task<List<Documentation>> GetAllVersionsByProjectAsync(int projectId, bool isTest);
    Task<Documentation> CreateAsync(Documentation documentation);
    Task<Documentation> UpdateAsync(Documentation documentation);
    Task<bool> DeleteAsync(int id);
    Task<bool> SetActiveVersionAsync(int projectId, int documentationId, bool isTest);
    Task<List<DocumentationChangeLog>> GetChangeLogsByDocumentationAsync(int documentationId);
}