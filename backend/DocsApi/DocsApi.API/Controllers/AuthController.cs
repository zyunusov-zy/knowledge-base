using DocsApi.Core.DTOs.Auth;
using DocsApi.Core.Interfaces.IServices;
using Microsoft.AspNetCore.Mvc;

namespace DocsApi.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth)
    {
        _auth = auth;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDto dto)
        => Ok(await _auth.LoginAsync(dto));

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(RefreshTokenRequestDto dto)
        => Ok(await _auth.RefreshAsync(dto));
    
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(RefreshTokenRequestDto dto)
    {
        await _auth.LogoutAsync(dto.RefreshToken);
        return NoContent();
    }
}
