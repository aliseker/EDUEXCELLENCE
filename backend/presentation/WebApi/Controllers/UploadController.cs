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

        [HttpPost("multiple")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> UploadMultipleFiles(List<IFormFile> files)
        {
            try
            {
                if (files == null || files.Count == 0)
                {
                    return BadRequest(new { message = "No files uploaded." });
                }

                var uploadedUrls = new List<string>();
                var allowedImageTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp" };
                var maxImageSize = 10 * 1024 * 1024; // 10MB

                foreach (var file in files)
                {
                    // Validate file type
                    if (!allowedImageTypes.Contains(file.ContentType))
                    {
                        continue; // Skip invalid files
                    }

                    // Validate file size
                    if (file.Length > maxImageSize)
                    {
                        continue; // Skip files that are too large
                    }

                    // Create upload directory
                    var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", "image");
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

                    // Add file URL to list
                    var fileUrl = $"/uploads/image/{fileName}";
                    uploadedUrls.Add(fileUrl);
                    
                    _logger.LogInformation("File uploaded successfully: {FileName}", fileName);
                }

                return Ok(uploadedUrls);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading files");
                return StatusCode(500, new { message = "An error occurred while uploading files." });
            }
        }

        [HttpDelete("{fileName}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public IActionResult DeleteFile(string fileName, string type)
        {
            try
            {
                // Sanitize fileName and type to prevent path traversal attacks
                var sanitizedFileName = Path.GetFileName(fileName); // Removes any path components
                var sanitizedType = Path.GetFileName(type);
                
                // Validate type against whitelist
                var allowedTypes = new[] { "image", "video" };
                if (!allowedTypes.Contains(sanitizedType))
                {
                    _logger.LogWarning("Invalid file type attempted: {Type}", type);
                    return BadRequest(new { message = "Invalid file type." });
                }
                
                // Construct file path
                var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", sanitizedType);
                var filePath = Path.Combine(uploadsPath, sanitizedFileName);
                
                // Ensure the resolved path is within the allowed directory (prevent path traversal)
                var fullPath = Path.GetFullPath(filePath);
                var allowedPath = Path.GetFullPath(uploadsPath);
                
                if (!fullPath.StartsWith(allowedPath + Path.DirectorySeparatorChar) && fullPath != allowedPath)
                {
                    _logger.LogWarning("Path traversal attempt detected: {FileName}", fileName);
                    return BadRequest(new { message = "Invalid file path." });
                }
                
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    _logger.LogInformation("File deleted successfully: {FileName}", sanitizedFileName);
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






