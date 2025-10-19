using EduExcellence.Application.DTOs.Auth;

namespace EduExcellence.Application.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
        Task<bool> ValidateTokenAsync(string token);
        Task<AdminDto?> GetAdminFromTokenAsync(string token);
        Task LogoutAsync(string token);
        Task<bool> ChangePasswordAsync(string token, ChangePasswordRequestDto request);
    }
}

