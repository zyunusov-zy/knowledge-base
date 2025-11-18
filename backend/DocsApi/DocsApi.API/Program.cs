using System.Security.Cryptography;
using System.Text;
using DocsApi.API.Middleware;
using DocsApi.Core.Entities;
using DocsApi.Core.Interfaces.IRepository;
using DocsApi.Core.Interfaces.IServices;
using DocsApi.Infrastructure.Data;
using DocsApi.Infrastructure.Repositories;
using DocsApi.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DocsDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DocsDbContext>();
    
    context.Database.Migrate();
    
    if (!context.Users.Any(u => u.Role == "Admin"))
    {
        using var hmac = new HMACSHA512();
        var password = "Admin@123";
        var passwordSalt = hmac.Key;
        var passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

        var adminUser = new User
        {
            Username = "admin",
            Email = "admin@docsapi.com",
            Role = "Admin",
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt,
            RefreshToken = string.Empty
        };

        context.Users.Add(adminUser);
        context.SaveChanges();
        Console.WriteLine("Admin user created: admin@docsapi.com / Admin@123");
    }
}

app.Run();