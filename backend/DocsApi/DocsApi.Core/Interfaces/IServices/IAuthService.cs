using DocsApi.Core.DTOs.Auth;

namespace DocsApi.Core.Interfaces.IServices;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto dto);
    Task<LoginResponseDto> RefreshAsync(RefreshTokenRequestDto dto);
    Task LogoutAsync(string refreshToken);

}