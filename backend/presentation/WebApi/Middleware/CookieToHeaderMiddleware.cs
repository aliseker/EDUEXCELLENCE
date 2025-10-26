using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace EduExcellence.WebApi.Middleware
{
    /// <summary>
    /// Middleware to extract JWT token from HttpOnly cookie and add it to Authorization header
    /// This allows us to use [Authorize] attributes while token is stored in HttpOnly cookie (XSS protection)
    /// </summary>
    public class CookieToHeaderMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<CookieToHeaderMiddleware> _logger;

        public CookieToHeaderMiddleware(RequestDelegate next, ILogger<CookieToHeaderMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Check if Authorization header is already present
            if (!context.Request.Headers.ContainsKey("Authorization"))
            {
                // Try to get token from HttpOnly cookie
                var token = context.Request.Cookies["authToken"];

                if (!string.IsNullOrEmpty(token))
                {
                    // Add token to Authorization header
                    context.Request.Headers.Add("Authorization", $"Bearer {token}");
                    _logger.LogDebug("Token extracted from cookie and added to Authorization header");
                }
            }

            await _next(context);
        }
    }
}



