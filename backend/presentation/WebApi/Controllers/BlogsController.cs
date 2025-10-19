using EduExcellence.Application.DTOs.Blog;
using EduExcellence.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduExcellence.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogsController : ControllerBase
    {
        private readonly IBlogService _blogService;
        private readonly ILogger<BlogsController> _logger;

        public BlogsController(IBlogService blogService, ILogger<BlogsController> logger)
        {
            _blogService = blogService;
            _logger = logger;
        }

        [HttpGet]

        public async Task<IActionResult> GetAllBlogs()
        {
            try
            {
                var blogs = await _blogService.GetAllBlogsAsync();
                return Ok(blogs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all blogs");
                return StatusCode(500, new { message = "An error occurred while retrieving blogs" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBlogById(int id)
        {
            try
            {
                var blog = await _blogService.GetBlogByIdAsync(id);
                
                if (blog == null)
                {
                    return NotFound(new { message = "Blog not found" });
                }

                return Ok(blog);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting blog with id {Id}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the blog" });
            }
        }

        [HttpGet("type/{type}")]
        public async Task<IActionResult> GetBlogsByType(string type)
        {
            try
            {
                var blogs = await _blogService.GetBlogsByTypeAsync(type);
                return Ok(blogs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting blogs by type {Type}", type);
                return StatusCode(500, new { message = "An error occurred while retrieving blogs by type" });
            }
        }

        [HttpGet("featured")]
        public async Task<IActionResult> GetFeaturedBlogs()
        {
            try
            {
                var blogs = await _blogService.GetFeaturedBlogsAsync();
                return Ok(blogs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting featured blogs");
                return StatusCode(500, new { message = "An error occurred while retrieving featured blogs" });
            }
        }

        [HttpGet("category/{category}")]
        public async Task<IActionResult> GetBlogsByCategory(string category)
        {
            try
            {
                var blogs = await _blogService.GetBlogsByCategoryAsync(category);
                return Ok(blogs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting blogs by category {Category}", category);
                return StatusCode(500, new { message = "An error occurred while retrieving blogs by category" });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateBlog([FromBody] CreateBlogDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var blog = await _blogService.CreateBlogAsync(dto);
                return CreatedAtAction(nameof(GetBlogById), new { id = blog.Id }, blog);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating blog: {Message}", ex.Message);
                return StatusCode(500, new { message = $"An error occurred while creating the blog: {ex.Message}" });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateBlog(int id, [FromBody] UpdateBlogDto dto)
        {
            try
            {
                if (id != dto.Id)
                {
                    return BadRequest(new { message = "ID mismatch" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var blog = await _blogService.UpdateBlogAsync(dto);
                return Ok(blog);
            }
            catch (ArgumentException)
            {
                return NotFound(new { message = "Blog not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating blog with id {Id}", id);
                return StatusCode(500, new { message = "An error occurred while updating the blog" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            try
            {
                var result = await _blogService.DeleteBlogAsync(id);
                
                if (!result)
                {
                    return NotFound(new { message = "Blog not found" });
                }

                return Ok(new { message = "Blog deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting blog with id {Id}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the blog" });
            }
        }
    }
}

