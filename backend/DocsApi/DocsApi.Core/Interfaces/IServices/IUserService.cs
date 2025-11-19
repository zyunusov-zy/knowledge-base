using DocsApi.Core.DTOs.Auth;

namespace DocsApi.Core.Interfaces.IServices;

public interface IUserService
{
    Task<UserDto?> GetUserByIdAsync(int id);
    Task<UserDto> CreateUserAsync(CreateUserDto dto);
}