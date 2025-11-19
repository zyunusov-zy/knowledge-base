using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using DocsApi.Core.DTOs.Auth;
using DocsApi.Core.Interfaces.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DocsApi.API.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }
    
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetMe()
    {
        var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub) 
                     ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (!int.TryParse(userId, out var id))
        {
            return Unauthorized();
        }

        var user = await _userService.GetUserByIdAsync(id);
        if (user == null) return NotFound();

        return Ok(new { user.Id, user.Username, user.Role });
    }

    
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateUser(CreateUserDto dto)
    {
        var user = await _userService.CreateUserAsync(dto);
        return Ok(user);
    }
}