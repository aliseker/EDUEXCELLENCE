using EduExcellence.Application.DTOs.Auth;
using EduExcellence.Application.Interfaces;
using EduExcellence.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace EduExcellence.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IRateLimitService _rateLimitService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IAuthService authService, 
            IRateLimitService rateLimitService,
            ILogger<AuthController> logger)
        {
            _authService = authService;
            _rateLimitService = rateLimitService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            try
            {
                var clientIp = GetClientIpAddress();
                _logger.LogInformation("Login attempt from IP: {IP}", clientIp);
                
                // Rate limiting by IP: 5 attempts per 15 minutes
                if (!_rateLimitService.IsAllowed($"login_ip_{clientIp}", maxAttempts: 5, window: TimeSpan.FromMinutes(15)))
                {
                    _logger.LogWarning("Login rate limit exceeded for IP: {IP}", clientIp);
                    return StatusCode(429, new { message = "Too many login attempts. Please try again in 15 minutes." });
                }
                
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _authService.LoginAsync(request);
                
                if (result == null)
                {
                    // Rate limiting by email on failed attempts
                    _rateLimitService.IsAllowed($"login_email_{request.Email}", maxAttempts: 3, window: TimeSpan.FromMinutes(30));
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                // Clear rate limit on successful login
                _rateLimitService.Clear($"login_ip_{clientIp}");
                _rateLimitService.Clear($"login_email_{request.Email}");
                
                _logger.LogInformation("Admin {Email} logged in successfully", request.Email);
                
                // Return tokens in response body for localStorage
                return Ok(new 
                { 
                    accessToken = result.Token,
                    refreshToken = result.RefreshToken,
                    expiresAt = result.ExpiresAt,
                    refreshTokenExpiresAt = result.RefreshTokenExpiresAt,
                    expiresIn = 600, // 10 minutes in seconds
                    admin = result.Admin
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for email {Email}", request.Email);
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }
        
        private string GetClientIpAddress()
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            
            // Check for forwarded IP (if behind proxy/load balancer)
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
            {
                ipAddress = Request.Headers["X-Forwarded-For"].ToString().Split(',').FirstOrDefault()?.Trim();
            }
            else if (Request.Headers.ContainsKey("X-Real-IP"))
            {
                ipAddress = Request.Headers["X-Real-IP"].ToString();
            }

            return ipAddress ?? "unknown";
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.RefreshToken))
                {
                    return BadRequest(new { message = "Refresh token is required" });
                }

                var result = await _authService.RefreshAccessTokenAsync(request.RefreshToken);
                
                if (result == null)
                {
                    return Unauthorized(new { message = "Invalid or expired refresh token" });
                }

                _logger.LogInformation("Access token refreshed successfully");
                
                return Ok(new 
                { 
                    accessToken = result.Token,
                    refreshToken = result.RefreshToken,
                    expiresAt = result.ExpiresAt,
                    refreshTokenExpiresAt = result.RefreshTokenExpiresAt,
                    expiresIn = 600, // 10 minutes in seconds
                    admin = result.Admin
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error refreshing token");
                return StatusCode(500, new { message = "An error occurred while refreshing token" });
            }
        }

        [HttpPost("validate")]
        public async Task<IActionResult> ValidateToken([FromBody] string token)
        {
            try
            {
                if (string.IsNullOrEmpty(token))
                {
                    return BadRequest(new { message = "Token is required" });
                }

                var isValid = await _authService.ValidateTokenAsync(token);
                
                if (!isValid)
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                var admin = await _authService.GetAdminFromTokenAsync(token);
                return Ok(new { valid = true, admin });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating token");
                return StatusCode(500, new { message = "An error occurred during token validation" });
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] string? token)
        {
            try
            {
                if (!string.IsNullOrEmpty(token))
                {
                    await _authService.LogoutAsync(token);
                }
                
                _logger.LogInformation("User logged out successfully");
                return Ok(new { message = "Logged out successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                return StatusCode(500, new { message = "An error occurred during logout" });
            }
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Get token from Authorization header
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                if (authHeader == null || !authHeader.StartsWith("Bearer "))
                {
                    return Unauthorized(new { message = "Authorization token required" });
                }

                var token = authHeader.Substring("Bearer ".Length).Trim();

                var result = await _authService.ChangePasswordAsync(token, request);
                
                if (!result)
                {
                    return BadRequest(new { message = "Current password is incorrect or an error occurred" });
                }

                _logger.LogInformation("Password changed successfully");
                return Ok(new { message = "Password changed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password");
                return StatusCode(500, new { message = "An error occurred while changing password" });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
        {
            try
            {
                var clientIp = GetClientIpAddress();
                _logger.LogInformation("Forgot password request from IP: {IP}", clientIp);

                // Rate limiting by IP: 3 attempts per hour
                if (!_rateLimitService.IsAllowed($"forgot_password_ip_{clientIp}", maxAttempts: 3, window: TimeSpan.FromHours(1)))
                {
                    _logger.LogWarning("Forgot password rate limit exceeded for IP: {IP}", clientIp);
                    return Ok(new { message = "Eğer bu email kayıtlıysa, şifre sıfırlama talimatları email adresinize gönderildi." });
                }

                // Rate limiting by email: 3 attempts per day
                if (!_rateLimitService.IsAllowed($"forgot_password_email_{request.Email}", maxAttempts: 3, window: TimeSpan.FromDays(1)))
                {
                    _logger.LogWarning("Forgot password rate limit exceeded for email: {Email}", request.Email);
                    return Ok(new { message = "Eğer bu email kayıtlıysa, şifre sıfırlama talimatları email adresinize gönderildi." });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                await _authService.RequestPasswordResetAsync(request.Email, clientIp);

                return Ok(new { message = "Eğer bu email kayıtlıysa, şifre sıfırlama talimatları email adresinize gönderildi." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in forgot password for email {Email}", request.Email);
                return Ok(new { message = "Eğer bu email kayıtlıysa, şifre sıfırlama talimatları email adresinize gönderildi." });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto request)
        {
            try
            {
                var clientIp = GetClientIpAddress();
                _logger.LogInformation("Password reset attempt from IP: {IP} for email: {Email}", clientIp, request.Email);

                // Rate limiting by IP: 5 attempts per hour
                if (!_rateLimitService.IsAllowed($"reset_password_ip_{clientIp}", maxAttempts: 5, window: TimeSpan.FromHours(1)))
                {
                    _logger.LogWarning("Reset password rate limit exceeded for IP: {IP}", clientIp);
                    return StatusCode(429, new { message = "Çok fazla deneme yaptınız. Lütfen 1 saat sonra tekrar deneyin." });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _authService.ResetPasswordAsync(request);

                if (!result)
                {
                    return BadRequest(new { message = "Şifre sıfırlama başarısız. Link geçersiz, süresi dolmuş veya zaten kullanılmış olabilir." });
                }

                _logger.LogInformation("Password reset successful for email: {Email}", request.Email);
                return Ok(new { message = "Şifreniz başarıyla değiştirildi. Yeni şifrenizle giriş yapabilirsiniz." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resetting password for email {Email}", request.Email);
                return StatusCode(500, new { message = "Şifre sıfırlama sırasında bir hata oluştu." });
            }
        }

    }
}

