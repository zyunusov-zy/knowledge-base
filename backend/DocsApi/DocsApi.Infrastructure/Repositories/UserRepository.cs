using DocsApi.Core.Entities;
using DocsApi.Core.Interfaces.IRepository;
using DocsApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DocsApi.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly DocsDbContext _context;
    public UserRepository(DocsDbContext context) => _context = context;

    public async Task<User?> GetByEmailAsync(string email) =>
        await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

    public async Task<User?> GetByRefreshTokenAsync(string refreshToken) =>
        await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

    public async Task<User> AddAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }
}