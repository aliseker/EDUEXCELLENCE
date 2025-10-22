using EduExcellence.Application.DTOs.Course;
using EduExcellence.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
// Rate limiting kaldırıldı
using Microsoft.AspNetCore.RateLimiting;

namespace EduExcellence.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly ILogger<CoursesController> _logger;

        public CoursesController(ICourseService courseService, ILogger<CoursesController> logger)
        {
            _courseService = courseService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCourses()
        {
            try
            {
                var courses = await _courseService.GetAllCoursesAsync();
                return Ok(courses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all courses");
                return StatusCode(500, new { message = "An error occurred while retrieving courses" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCourseById(int id)
        {
            try
            {
                var course = await _courseService.GetCourseByIdAsync(id);
                
                if (course == null)
                {
                    return NotFound(new { message = "Course not found" });
                }

                return Ok(course);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting course with id {Id}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the course" });
            }
        }

        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcomingCourses()
        {
            try
            {
                var courses = await _courseService.GetUpcomingCoursesAsync();
                return Ok(courses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting upcoming courses");
                return StatusCode(500, new { message = "An error occurred while retrieving upcoming courses" });
            }
        }


        [HttpGet("approved")]
        public async Task<IActionResult> GetApprovedCourses()
        {
            try
            {
                var courses = await _courseService.GetApprovedCoursesAsync();
                return Ok(courses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting approved courses");
                return StatusCode(500, new { message = "An error occurred while retrieving approved courses" });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var course = await _courseService.CreateCourseAsync(dto);
                return CreatedAtAction(nameof(GetCourseById), new { id = course.Id }, course);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating course");
                return StatusCode(500, new { message = "An error occurred while creating the course" });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateCourse(int id, [FromBody] UpdateCourseDto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(new { message = "Course data is required" });
                }

                if (id != dto.Id)
                {
                    return BadRequest(new { message = "ID mismatch" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var course = await _courseService.UpdateCourseAsync(dto);
                return Ok(course);
            }
            catch (ArgumentException)
            {
                return NotFound(new { message = "Course not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating course with id {Id}", id);
                return StatusCode(500, new { message = "An error occurred while updating the course" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            try
            {
                var result = await _courseService.DeleteCourseAsync(id);
                
                if (!result)
                {
                    return NotFound(new { message = "Course not found" });
                }

                return Ok(new { message = "Course deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting course with id {Id}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the course" });
            }
        }
    }
}

