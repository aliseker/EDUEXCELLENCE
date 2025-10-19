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
                // Direkt SQL connection string ile hard delete - kesin çözüm
                var connectionString = HttpContext.RequestServices
                    .GetRequiredService<IConfiguration>()
                    .GetConnectionString("DefaultConnection");
                
                using var connection = new Microsoft.Data.SqlClient.SqlConnection(connectionString);
                await connection.OpenAsync();
                
                // Hard delete - veritabanından tamamen kaldır
                using var command = new Microsoft.Data.SqlClient.SqlCommand(
                    "DELETE FROM Ka2Projects WHERE Id = @id", connection);
                command.Parameters.AddWithValue("@id", id);
                
                var result = await command.ExecuteNonQueryAsync();
                
                _logger.LogInformation($"Hard delete executed for KA2 project {id}, affected rows: {result}");
                
                if (result == 0)
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

