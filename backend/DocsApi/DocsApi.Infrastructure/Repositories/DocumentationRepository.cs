using DocsApi.Core.Entities.Documentations;
using DocsApi.Core.Interfaces.IRepository;
using DocsApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DocsApi.Infrastructure.Repositories;

public class DocumentationRepository : IDocumentationRepository
    {
        private readonly DocsDbContext _context;

        public DocumentationRepository(DocsDbContext context)
        {
            _context = context;
        }

        public async Task<Documentation> GetByIdAsync(int id)
        {
            return await _context.Documentations
                .Include(d => d.ChangeLogs)
                .Include(d => d.Project)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<Documentation> GetByProjectAndVersionAsync(int projectId, string version, bool isTest)
        {
            return await _context.Documentations
                .Include(d => d.ChangeLogs)
                .FirstOrDefaultAsync(d => d.ProjectId == projectId 
                    && d.Version == version 
                    && d.IsTest == isTest);
        }

        public async Task<Documentation> GetActiveByProjectAsync(int projectId, bool isTest)
        {
            return await _context.Documentations
                .Include(d => d.ChangeLogs)
                .FirstOrDefaultAsync(d => d.ProjectId == projectId 
                    && d.IsActive 
                    && d.IsTest == isTest);
        }

        public async Task<List<Documentation>> GetAllByProjectAsync(int projectId)
        {
            return await _context.Documentations
                .Include(d => d.ChangeLogs)
                .Where(d => d.ProjectId == projectId)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Documentation>> GetAllVersionsByProjectAsync(int projectId, bool isTest)
        {
            return await _context.Documentations
                .Include(d => d.ChangeLogs)
                .Where(d => d.ProjectId == projectId && d.IsTest == isTest)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();
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
            // Deactivate all other versions for this project and type
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
                .Where(c => c.DocumentationId == documentationId)
                .OrderByDescending(c => c.ChangeDate)
                .ToListAsync();
        }
    }