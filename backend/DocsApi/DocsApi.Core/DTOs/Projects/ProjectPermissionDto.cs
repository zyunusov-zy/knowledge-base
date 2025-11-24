namespace DocsApi.Core.DTOs.Projects;

public class ProjectPermissionDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
    public DateTime GrantedAt { get; set; }
}