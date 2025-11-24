using DocsApi.Core.Entities.Documentations;
using DocsApi.Core.Entities.Project;

namespace DocsApi.Core.Entities;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "User";

    public byte[] PasswordHash { get; set; } = Array.Empty<byte>();
    public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();

    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
    
    public ICollection<Projects> OwnedProjects { get; set; }
    public virtual ICollection<Documentation> CreatedDocumentations { get; set; }
    public virtual ICollection<Documentation> UpdatedDocumentations { get; set; }
    public virtual ICollection<DocumentationChangeLog> ChangeLogEntries { get; set; }
}