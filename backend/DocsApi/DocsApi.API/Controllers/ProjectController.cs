using System.Security.Claims;
using DocsApi.Core.DTOs.Projects;
using DocsApi.Core.Entities.Project;
using DocsApi.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DocsApi.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly DocsDbContext _context;

    public ProjectsController(DocsDbContext context)
    {
        _context = context;
    }

    private int GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return claim is null
            ? throw new UnauthorizedAccessException("User ID not found")
            : int.Parse(claim);
    }

    private string GetUserRole() => User.FindFirst(ClaimTypes.Role)?.Value;

    private bool CanEdit(string role) => role == "Admin" || role == "Engineer";
    private bool CanManagePermissions(string role) => role == "Admin";

    [HttpGet]
    public async Task<ActionResult<List<ProjectDto>>> GetProjects()
    {
        var userId = GetUserId();
        var userRole = GetUserRole();

        IQueryable<Projects> query;

        if (userRole == "Admin" || userRole == "Engineer")
        {
            query = _context.Projects.Include(p => p.Creator);
        }
        else
        {
            var permittedProjectIds = await _context.ProjectPermissions
                .Where(p => p.UserId == userId)
                .Select(p => p.ProjectId)
                .ToListAsync();

            query = _context.Projects
                .Where(p => permittedProjectIds.Contains(p.Id))
                .Include(p => p.Creator);
        }

        var projects = await query
            .Select(p => new ProjectDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Slug = p.Slug,
                CreatorName = p.Creator.Username,
                CanEdit = CanEdit(userRole),
                CanManagePermissions = CanManagePermissions(userRole),
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            })
            .ToListAsync();

        return Ok(projects);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProjectDto>> GetProject(string slug)
    {
        var userId = GetUserId();
        var userRole = GetUserRole();

        var project = await _context.Projects
            .Include(p => p.Creator)
            .FirstOrDefaultAsync(p => p.Slug == slug);

        if (project == null) return NotFound();

        // Check permission for Users
        if (userRole == "User")
        {
            var hasPermission = await _context.ProjectPermissions
                .AnyAsync(p => p.ProjectId == project.Id && p.UserId == userId);

            if (!hasPermission) return Forbid();
        }

        return Ok(new ProjectDto
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            Slug = project.Slug,
            CreatorName = project.Creator.Username,
            CanEdit = CanEdit(userRole),
            CanManagePermissions = CanManagePermissions(userRole),
            CreatedAt = project.CreatedAt,
            UpdatedAt = project.UpdatedAt
        });
    }

    [HttpPost]
    public async Task<ActionResult<ProjectDto>> CreateProject(CreateProjectDto dto)
    {
        var userRole = GetUserRole();
        if (!CanEdit(userRole)) return Forbid();

        var userId = GetUserId();
        var slug = GenerateSlug(dto.Name);

        var project = new Projects
        {
            Name = dto.Name,
            Description = dto.Description,
            Slug = slug,
            CreatedBy = userId
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        var creator = await _context.Users.FindAsync(userId);

        return CreatedAtAction(nameof(GetProject), new { slug = project.Slug }, new ProjectDto
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            Slug = project.Slug,
            CreatorName = creator.Username,
            CanEdit = true,
            CanManagePermissions = CanManagePermissions(userRole),
            CreatedAt = project.CreatedAt,
            UpdatedAt = project.UpdatedAt
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProject(int id, CreateProjectDto dto)
    {
        var userRole = GetUserRole();
        if (!CanEdit(userRole)) return Forbid();

        var project = await _context.Projects.FindAsync(id);
        if (project == null) return NotFound();

        project.Name = dto.Name;
        project.Description = dto.Description;
        project.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var userRole = GetUserRole();
        if (!CanEdit(userRole)) return Forbid();

        var project = await _context.Projects.FindAsync(id);
        if (project == null) return NotFound();

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id}/permissions")]
    public async Task<ActionResult<List<ProjectPermissionDto>>> GetPermissions(int id)
    {
        var userRole = GetUserRole();
        if (!CanManagePermissions(userRole)) return Forbid();

        var permissions = await _context.ProjectPermissions
            .Where(p => p.ProjectId == id)
            .Include(p => p.User)
            .Select(p => new ProjectPermissionDto
            {
                Id = p.Id,
                UserId = p.UserId,
                Username = p.User.Username,
                Email = p.User.Email,
                Role = p.User.Role,
                GrantedAt = p.GrantedAt
            })
            .ToListAsync();

        return Ok(permissions);
    }

    [HttpPost("{id}/permissions")]
    public async Task<IActionResult> GrantPermission(int id, GrantProjectPermissionDto dto)
    {
        var userRole = GetUserRole();
        if (!CanManagePermissions(userRole)) return Forbid();

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.UserEmail);
        if (user == null) return NotFound("User not found");

        var existing = await _context.ProjectPermissions
            .FirstOrDefaultAsync(p => p.ProjectId == id && p.UserId == user.Id);

        if (existing != null)
        {
            return BadRequest("User already has access to this project");
        }

        _context.ProjectPermissions.Add(new ProjectPermissions
        {
            ProjectId = id,
            UserId = user.Id,
            GrantedBy = GetUserId()
        });

        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id}/permissions/{permissionId}")]
    public async Task<IActionResult> RevokePermission(int id, int permissionId)
    {
        var userRole = GetUserRole();
        if (!CanManagePermissions(userRole)) return Forbid();

        var permission = await _context.ProjectPermissions.FindAsync(permissionId);
        if (permission == null || permission.ProjectId != id) return NotFound();

        _context.ProjectPermissions.Remove(permission);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private string GenerateSlug(string title)
    {
        return title.ToLower()
            .Replace(" ", "-")
            .Replace(".", "")
            .Replace(",", "")
            .Trim('-');
    }
}