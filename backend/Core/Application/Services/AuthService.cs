using EduExcellence.Application.DTOs.Auth;
using EduExcellence.Application.Interfaces;
using EduExcellence.Domain.Entities;
using EduExcellence.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EduExcellence.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(IUnitOfWork unitOfWork, IConfiguration configuration, ILogger<AuthService> logger)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
        {
            var admin = await _unitOfWork.Admins.FirstOrDefaultAsync(a => a.Email == request.Email && a.IsActive);
            
            if (admin == null || !BCrypt.Net.BCrypt.Verify(request.Password, admin.PasswordHash))
            {
                return null;
            }

            // Update last login
            admin.LastLoginAt = DateTime.UtcNow;
            await _unitOfWork.Admins.UpdateAsync(admin);
            await _unitOfWork.SaveChangesAsync();

            // Generate Access Token (10 minutes)
            var accessToken = GenerateAccessToken(admin);
            var accessTokenExpiresAt = DateTime.UtcNow.AddMinutes(10);

            // Generate Refresh Token (30 days)
            var refreshToken = GenerateRefreshToken(admin);
            var refreshTokenExpiresAt = DateTime.UtcNow.AddDays(30);

            return new LoginResponseDto
            {
                Token = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = accessTokenExpiresAt,
                RefreshTokenExpiresAt = refreshTokenExpiresAt,
                Admin = new AdminDto
                {
                    Id = admin.Id,
                    Email = admin.Email,
                    FirstName = admin.FirstName,
                    LastName = admin.LastName,
                    PhoneNumber = admin.PhoneNumber,
                    IsSuperAdmin = admin.IsSuperAdmin,
                    LastLoginAt = admin.LastLoginAt
                }
            };
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(GetJwtSecretKey());
                
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = GetJwtIssuer(),
                    ValidateAudience = true,
                    ValidAudience = GetJwtAudience(),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<AdminDto?> GetAdminFromTokenAsync(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token);
                
                var adminIdClaim = jwtToken.Claims.FirstOrDefault(x => x.Type == "adminId");
                if (adminIdClaim == null || !int.TryParse(adminIdClaim.Value, out int adminId))
                {
                    return null;
                }

                var admin = await _unitOfWork.Admins.GetByIdAsync(adminId);
                if (admin == null || !admin.IsActive)
                {
                    return null;
                }

                return new AdminDto
                {
                    Id = admin.Id,
                    Email = admin.Email,
                    FirstName = admin.FirstName,
                    LastName = admin.LastName,
                    PhoneNumber = admin.PhoneNumber,
                    IsSuperAdmin = admin.IsSuperAdmin,
                    LastLoginAt = admin.LastLoginAt
                };
            }
            catch
            {
                return null;
            }
        }

        public async Task LogoutAsync(string token)
        {
            // In a more sophisticated implementation, you might want to blacklist the token
            // For now, we'll just validate that the token is valid
            await ValidateTokenAsync(token);
        }

        private string GenerateJwtToken(Admin admin)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(GetJwtSecretKey());
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("adminId", admin.Id.ToString()),
                    new Claim("email", admin.Email),
                    new Claim("firstName", admin.FirstName),
                    new Claim("lastName", admin.LastName),
                    new Claim("isSuperAdmin", admin.IsSuperAdmin.ToString()),
                    new Claim(ClaimTypes.Role, admin.IsSuperAdmin ? "SuperAdmin" : "Admin")
                }),
                Expires = DateTime.UtcNow.AddMinutes(GetJwtExpiryMinutes()),
                Issuer = GetJwtIssuer(),
                Audience = GetJwtAudience(),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string GenerateAccessToken(Admin admin)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(GetJwtSecretKey());
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("adminId", admin.Id.ToString()),
                    new Claim("email", admin.Email),
                    new Claim("firstName", admin.FirstName),
                    new Claim("lastName", admin.LastName),
                    new Claim("isSuperAdmin", admin.IsSuperAdmin.ToString()),
                    new Claim(ClaimTypes.Role, admin.IsSuperAdmin ? "SuperAdmin" : "Admin"),
                    new Claim("tokenType", "access")
                }),
                Expires = DateTime.UtcNow.AddMinutes(10), // 10 minutes
                Issuer = GetJwtIssuer(),
                Audience = GetJwtAudience(),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string GenerateRefreshToken(Admin admin)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(GetJwtSecretKey());
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("adminId", admin.Id.ToString()),
                    new Claim("email", admin.Email),
                    new Claim("tokenType", "refresh")
                }),
                Expires = DateTime.UtcNow.AddDays(30), // 30 days
                Issuer = GetJwtIssuer(),
                Audience = GetJwtAudience(),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<LoginResponseDto?> RefreshAccessTokenAsync(string refreshToken)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(GetJwtSecretKey());
                
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = GetJwtIssuer(),
                    ValidateAudience = true,
                    ValidAudience = GetJwtAudience(),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                var principal = tokenHandler.ValidateToken(refreshToken, validationParameters, out SecurityToken validatedToken);
                
                // Check if it's a refresh token
                var tokenTypeClaim = principal.Claims.FirstOrDefault(x => x.Type == "tokenType");
                if (tokenTypeClaim?.Value != "refresh")
                {
                    return null;
                }

                // Get admin from token
                var adminIdClaim = principal.Claims.FirstOrDefault(x => x.Type == "adminId");
                if (adminIdClaim == null || !int.TryParse(adminIdClaim.Value, out int adminId))
                {
                    return null;
                }

                var admin = await _unitOfWork.Admins.GetByIdAsync(adminId);
                if (admin == null || !admin.IsActive)
                {
                    return null;
                }

                // Generate new tokens
                var newAccessToken = GenerateAccessToken(admin);
                var newRefreshToken = GenerateRefreshToken(admin);
                var accessTokenExpiresAt = DateTime.UtcNow.AddMinutes(10);
                var refreshTokenExpiresAt = DateTime.UtcNow.AddDays(30);

                return new LoginResponseDto
                {
                    Token = newAccessToken,
                    RefreshToken = newRefreshToken,
                    ExpiresAt = accessTokenExpiresAt,
                    RefreshTokenExpiresAt = refreshTokenExpiresAt,
                    Admin = new AdminDto
                    {
                        Id = admin.Id,
                        Email = admin.Email,
                        FirstName = admin.FirstName,
                        LastName = admin.LastName,
                        PhoneNumber = admin.PhoneNumber,
                        IsSuperAdmin = admin.IsSuperAdmin,
                        LastLoginAt = admin.LastLoginAt
                    }
                };
            }
            catch
            {
                return null;
            }
        }

        private string GetJwtSecretKey()
        {
            return _configuration["JwtSettings:SecretKey"] ?? "your-super-secret-key-that-is-at-least-32-characters-long";
        }

        private string GetJwtIssuer()
        {
            return _configuration["JwtSettings:Issuer"] ?? "EduExcellence";
        }

        private string GetJwtAudience()
        {
            return _configuration["JwtSettings:Audience"] ?? "EduExcellenceUsers";
        }

        private int GetJwtExpiryMinutes()
        {
            return int.Parse(_configuration["JwtSettings:ExpiryInMinutes"] ?? "1440");
        }

        public async Task<bool> ChangePasswordAsync(string token, ChangePasswordRequestDto request)
        {
            try
            {
                // Validate token and get admin
                var admin = await GetAdminFromTokenAsync(token);
                if (admin == null)
                {
                    return false;
                }

                // Get admin from database
                var adminEntity = await _unitOfWork.Admins.GetByIdAsync(admin.Id);
                if (adminEntity == null)
                {
                    return false;
                }

                // Verify current password
                if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, adminEntity.PasswordHash))
                {
                    return false;
                }

                // Additional server-side password validation
                if (!IsValidPassword(request.NewPassword))
                {
                    return false;
                }

                // Hash new password
                var newPasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

                // Update password
                adminEntity.PasswordHash = newPasswordHash;
                adminEntity.UpdatedAt = DateTime.UtcNow;

                await _unitOfWork.Admins.UpdateAsync(adminEntity);
                await _unitOfWork.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password for admin");
                return false;
            }
        }

        private bool IsValidPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                return false;

            // At least 8 characters
            if (password.Length < 8)
                return false;

            // At least one uppercase letter
            if (!password.Any(char.IsUpper))
                return false;

            // At least one lowercase letter
            if (!password.Any(char.IsLower))
                return false;

            // At least one digit
            if (!password.Any(char.IsDigit))
                return false;

            return true;
        }
    }
}

