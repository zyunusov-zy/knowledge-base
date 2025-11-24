using System.Security.Claims;
using DocsApi.Core.DTOs.DocumentationDtos;
using DocsApi.Core.Interfaces.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DocsApi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DocumentationController : ControllerBase
{
    private readonly IDocumentationService _service;

    public DocumentationController(IDocumentationService service)
    {
        _service = service;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var doc = await _service.GetByIdAsync(id);
        if (doc == null)
            return NotFound();

        return Ok(doc);
    }

    [HttpGet("project/{projectId}/active")]
    public async Task<IActionResult> GetActiveByProject(int projectId, [FromQuery] bool isTest = false)
    {
        var doc = await _service.GetActiveByProjectAsync(projectId, isTest);
        if (doc == null)
            return NotFound();

        return Ok(doc);
    }

    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetAllByProject(int projectId)
    {
        var docs = await _service.GetAllByProjectAsync(projectId);
        return Ok(docs);
    }

    [HttpGet("project/{projectId}/versions")]
    public async Task<IActionResult> GetVersionHistory(int projectId, [FromQuery] bool isTest = false)
    {
        var docs = await _service.GetVersionHistoryAsync(projectId, isTest);
        return Ok(docs);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDocumentationDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token");
        }

        var created = await _service.CreateAsync(dto, userId);
        
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateDocumentationDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token");
        }

        var updated = await _service.UpdateAsync(id, dto, userId);
        
        if (updated == null)
            return NotFound();

        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpPost("project/{projectId}/set-active/{documentationId}")]
    public async Task<IActionResult> SetActiveVersion(int projectId, int documentationId, [FromQuery] bool isTest = false)
    {
        var result = await _service.SetActiveVersionAsync(projectId, documentationId, isTest);
        if (!result)
            return NotFound();

        return Ok();
    }

    [HttpGet("{documentationId}/changelogs")]
    public async Task<IActionResult> GetChangeLogs(int documentationId)
    {
        var logs = await _service.GetChangeLogsAsync(documentationId);
        return Ok(logs);
    }
}