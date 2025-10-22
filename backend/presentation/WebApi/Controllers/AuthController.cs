using EduExcellence.Application.DTOs.Auth;
using EduExcellence.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
// Rate limiting kaldırıldı
using Microsoft.AspNetCore.RateLimiting;

namespace EduExcellence.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            try
            {
                _logger.LogInformation("Login attempt from IP: {IP}", HttpContext.Connection.RemoteIpAddress);
                
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _authService.LoginAsync(request);
                
                if (result == null)
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                _logger.LogInformation("Admin {Email} logged in successfully", request.Email);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for email {Email}", request.Email);
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

        [HttpPost("validate")]
        public async Task<IActionResult> ValidateToken([FromBody] string token)
        {
            try
            {
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
        public async Task<IActionResult> Logout([FromBody] string token)
        {
            try
            {
                await _authService.LogoutAsync(token);
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

    }
}

