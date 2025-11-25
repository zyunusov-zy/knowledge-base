using DocsApi.Core.Entities.Documentations;
using DocsApi.Core.Interfaces.IRepository;
using DocsApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

public class DocumentationRepository : IDocumentationRepository
{
    private readonly DocsDbContext _context;

    public DocumentationRepository(DocsDbContext context)
    {
        _context = context;
    }

    // Get full documentation with all relationships
    public async Task<Documentation> GetByIdAsync(int id)
    {
        return await _context.Documentations
            .Include(d => d.ChangeLogs)
                .ThenInclude(c => c.ChangedByUser)
            .Include(d => d.Project)
            .Include(d => d.Creator)
            .Include(d => d.Updater)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    // Get specific version
    public async Task<Documentation> GetByProjectAndVersionAsync(int projectId, string version, bool isTest)
    {
        return await _context.Documentations
            .Include(d => d.ChangeLogs)
                .ThenInclude(c => c.ChangedByUser)
            .Include(d => d.Project)
            .Include(d => d.Creator)
            .Include(d => d.Updater)
            .FirstOrDefaultAsync(d => d.ProjectId == projectId 
                && d.Version == version 
                && d.IsTest == isTest);
    }

    // Get currently active version
    public async Task<Documentation> GetActiveByProjectAsync(int projectId, bool isTest)
    {
        return await _context.Documentations
            .Include(d => d.ChangeLogs)
                .ThenInclude(c => c.ChangedByUser)
            .Include(d => d.Project)
            .Include(d => d.Creator)
            .Include(d => d.Updater)
            .FirstOrDefaultAsync(d => d.ProjectId == projectId 
                && d.IsActive 
                && d.IsTest == isTest);
    }

    // Get all versions for a project (both test and production)
    public async Task<List<Documentation>> GetAllByProjectAsync(int projectId)
    {
        return await _context.Documentations
            .Include(d => d.ChangeLogs)
            .Include(d => d.Creator)
            .Include(d => d.Updater)
            .Include(d => d.Project)
            .Where(d => d.ProjectId == projectId)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync();
    }

    // Get versions by environment type (test or production)
    public async Task<List<Documentation>> GetAllVersionsByProjectAsync(int projectId, bool isTest)
    {
        return await _context.Documentations
            .Include(d => d.ChangeLogs)
                .ThenInclude(c => c.ChangedByUser)
            .Include(d => d.Creator)
            .Include(d => d.Updater)
            .Include(d => d.Project)
            .Where(d => d.ProjectId == projectId && d.IsTest == isTest)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync();
    }

    // Get lightweight list for all documentation (for listing page)
    public async Task<List<Documentation>> GetAllDocumentationsLightweightAsync()
    {
        return await _context.Documentations
            .Include(d => d.Project)
            .Include(d => d.Creator)
            .Include(d => d.ChangeLogs)
            .OrderByDescending(d => d.UpdatedAt)
            .ToListAsync();
    }

    // Get unique projects that have documentation
    public async Task<List<int>> GetProjectsWithDocumentationAsync()
    {
        return await _context.Documentations
            .Select(d => d.ProjectId)
            .Distinct()
            .ToListAsync();
    }

    // Get latest version per project (for summary view)
    public async Task<List<Documentation>> GetLatestVersionPerProjectAsync()
    {
        var latestDocs = await _context.Documentations
            .Include(d => d.Project)
            .Include(d => d.Creator)
            .Include(d => d.Updater)
            .Include(d => d.ChangeLogs)
            .GroupBy(d => d.ProjectId)
            .Select(g => g.OrderByDescending(d => d.CreatedAt).FirstOrDefault())
            .ToListAsync();

        return latestDocs;
    }

    public async Task<Documentation> CreateAsync(Documentation documentation)
    {
        documentation.CreatedAt = DateTime.UtcNow;
        documentation.UpdatedAt = DateTime.UtcNow;
        
        _context.Documentations.Add(documentation);
        await _context.SaveChangesAsync();
        return documentation;
    }

    public async Task<Documentation> UpdateAsync(Documentation documentation)
    {
        documentation.UpdatedAt = DateTime.UtcNow;
        
        _context.Documentations.Update(documentation);
        await _context.SaveChangesAsync();
        return documentation;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var documentation = await _context.Documentations.FindAsync(id);
        if (documentation == null)
            return false;

        _context.Documentations.Remove(documentation);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> SetActiveVersionAsync(int projectId, int documentationId, bool isTest)
    {
        var allVersions = await _context.Documentations
            .Where(d => d.ProjectId == projectId && d.IsTest == isTest)
            .ToListAsync();

        foreach (var doc in allVersions)
        {
            doc.IsActive = doc.Id == documentationId;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<DocumentationChangeLog>> GetChangeLogsByDocumentationAsync(int documentationId)
    {
        return await _context.DocumentationChangeLogs
            .Include(c => c.ChangedByUser)
            .Where(c => c.DocumentationId == documentationId)
            .OrderByDescending(c => c.ChangeDate)
            .ToListAsync();
    }

    // Check if version exists
    public async Task<bool> VersionExistsAsync(int projectId, string version, bool isTest)
    {
        return await _context.Documentations
            .AnyAsync(d => d.ProjectId == projectId 
                && d.Version == version 
                && d.IsTest == isTest);
    }
}