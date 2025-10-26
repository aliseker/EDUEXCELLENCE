using EduExcellence.Application.DTOs.Ka2;
using EduExcellence.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduExcellence.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Ka2Controller : ControllerBase
    {
        private readonly IKa2Service _ka2Service;
        private readonly ILogger<Ka2Controller> _logger;

        public Ka2Controller(IKa2Service ka2Service, ILogger<Ka2Controller> logger)
        {
            _ka2Service = ka2Service;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProjects()
        {
            try
            {
                var projects = await _ka2Service.GetAllProjectsAsync();
                return Ok(projects);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all KA2 projects");
                return StatusCode(500, new { message = "An error occurred while retrieving KA2 projects" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProjectById(int id)
        {
            try
            {
                var project = await _ka2Service.GetProjectByIdAsync(id);
                
                if (project == null)
                {
                    return NotFound(new { message = "KA2 project not found" });
                }

                return Ok(project);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting KA2 project with id {Id}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the KA2 project" });
            }
        }

        [HttpGet("type/{type}")]
        public async Task<IActionResult> GetProjectsByType(string type)
        {
            try
            {
                var projects = await _ka2Service.GetProjectsByTypeAsync(type);
                return Ok(projects);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting KA2 projects by type {Type}", type);
                return StatusCode(500, new { message = "An error occurred while retrieving KA2 projects by type" });
            }
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActiveProjects()
        {
            try
            {
                var projects = await _ka2Service.GetActiveProjectsAsync();
                return Ok(projects);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting active KA2 projects");
                return StatusCode(500, new { message = "An error occurred while retrieving active KA2 projects" });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateProject([FromBody] CreateKa2ProjectDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var project = await _ka2Service.CreateProjectAsync(dto);
                return CreatedAtAction(nameof(GetProjectById), new { id = project.Id }, project);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating KA2 project");
                return StatusCode(500, new { message = "An error occurred while creating the KA2 project" });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] UpdateKa2ProjectDto dto)
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

                var project = await _ka2Service.UpdateProjectAsync(dto);
                return Ok(project);
            }
            catch (ArgumentException)
            {
                return NotFound(new { message = "KA2 project not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating KA2 project with id {Id}", id);
                return StatusCode(500, new { message = "An error occurred while updating the KA2 project" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProject(int id)
        {
            try
            {
                // Use service layer instead of raw SQL for proper entity tracking and soft delete
                var result = await _ka2Service.DeleteProjectAsync(id);
                
                if (!result)
                {
                    return NotFound(new { message = "KA2 project not found" });
                }

                return Ok(new { message = "KA2 project deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting KA2 project with id {Id}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the KA2 project" });
            }
        }
    }
}

