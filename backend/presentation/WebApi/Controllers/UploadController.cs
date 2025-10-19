using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduExcellence.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<UploadController> _logger;

        public UploadController(IWebHostEnvironment environment, ILogger<UploadController> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> UploadFile(IFormFile file, string type)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "No file uploaded." });
                }

                // Validate file type
                var allowedImageTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp" };
                var allowedVideoTypes = new[] { "video/mp4", "video/avi", "video/mov", "video/wmv", "video/webm" };

                if (type == "image" && !allowedImageTypes.Contains(file.ContentType))
                {
                    return BadRequest(new { message = "Invalid image file type." });
                }

                if (type == "video" && !allowedVideoTypes.Contains(file.ContentType))
                {
                    return BadRequest(new { message = "Invalid video file type." });
                }

                // Validate file size (10MB for images, 100MB for videos)
                var maxImageSize = 10 * 1024 * 1024; // 10MB
                var maxVideoSize = 100 * 1024 * 1024; // 100MB

                if (type == "image" && file.Length > maxImageSize)
                {
                    return BadRequest(new { message = "Image file too large. Maximum size is 10MB." });
                }

                if (type == "video" && file.Length > maxVideoSize)
                {
                    return BadRequest(new { message = "Video file too large. Maximum size is 100MB." });
                }

                // Create upload directory
                var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", type);
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }

                // Generate unique filename
                var fileExtension = Path.GetExtension(file.FileName);
                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadsPath, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Return file URL
                var fileUrl = $"/uploads/{type}/{fileName}";
                
                _logger.LogInformation("File uploaded successfully: {FileName}", fileName);
                
                return Ok(new { url = fileUrl, fileName = fileName });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file");
                return StatusCode(500, new { message = "An error occurred while uploading the file." });
            }
        }

        [HttpDelete("{fileName}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public IActionResult DeleteFile(string fileName, string type)
        {
            try
            {
                var filePath = Path.Combine(_environment.WebRootPath, "uploads", type, fileName);
                
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    _logger.LogInformation("File deleted successfully: {FileName}", fileName);
                    return Ok(new { message = "File deleted successfully." });
                }
                
                return NotFound(new { message = "File not found." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file");
                return StatusCode(500, new { message = "An error occurred while deleting the file." });
            }
        }
    }
}


