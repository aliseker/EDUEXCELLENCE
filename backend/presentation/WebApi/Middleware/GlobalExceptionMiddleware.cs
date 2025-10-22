using System.Net;
using System.Text.Json;

namespace EduExcellence.WebApi.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;
        private readonly IWebHostEnvironment _environment;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger, IWebHostEnvironment environment)
        {
            _next = next;
            _logger = logger;
            _environment = environment;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            object response;

            // Development ortamında daha detaylı hata bilgisi
            if (_environment.IsDevelopment())
            {
                response = new
                {
                    message = exception.Message,
                    stackTrace = exception.StackTrace,
                    statusCode = (int)HttpStatusCode.InternalServerError
                };
            }
            else
            {
                response = new
                {
                    message = "An error occurred while processing your request.",
                    statusCode = (int)HttpStatusCode.InternalServerError
                };
            }

            // Farklı exception türleri için özel handling
            if (exception is UnauthorizedAccessException)
            {
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                response = new
                {
                    message = "Unauthorized access.",
                    statusCode = (int)HttpStatusCode.Unauthorized
                };
            }
            else if (exception is ArgumentException || exception is ArgumentNullException)
            {
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response = new
                {
                    message = "Invalid request parameters.",
                    statusCode = (int)HttpStatusCode.BadRequest
                };
            }
            else if (exception is KeyNotFoundException)
            {
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                response = new
                {
                    message = "The requested resource was not found.",
                    statusCode = (int)HttpStatusCode.NotFound
                };
            }
            else if (exception is TimeoutException)
            {
                context.Response.StatusCode = (int)HttpStatusCode.RequestTimeout;
                response = new
                {
                    message = "Request timeout.",
                    statusCode = (int)HttpStatusCode.RequestTimeout
                };
            }
            else
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            }

            var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(jsonResponse);
        }
    }
}
