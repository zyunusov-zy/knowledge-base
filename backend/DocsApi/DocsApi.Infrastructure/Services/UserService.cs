using System.Security.Cryptography;
using System.Text;
using DocsApi.Core.DTOs.Auth;
using DocsApi.Core.Entities;
using DocsApi.Core.Interfaces.IRepository;
using DocsApi.Core.Interfaces.IServices;

namespace DocsApi.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _users;

    public UserService(IUserRepository users)
    {
        _users = users;
    }

    public async Task<UserDto?> GetUserByIdAsync(int id)
    {
        var user = await _users.GetByIdAsync(id);
        if (user == null) return null;

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
    {
        using var hmac = new HMACSHA512();
        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            Role = dto.Role,
            PasswordSalt = hmac.Key,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password)),
        };

        await _users.AddAsync(user);

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role
        };
    }
}