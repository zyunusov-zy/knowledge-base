using DocsApi.Core.Entities;

namespace DocsApi.Core.Interfaces.IRepository;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByRefreshTokenAsync(string refreshToken);
    Task<User> AddAsync(User user);
    Task UpdateAsync(User user);
}