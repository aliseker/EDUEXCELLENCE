using EduExcellence.Application.DTOs.Dissemination;
using EduExcellence.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduExcellence.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DisseminationController : ControllerBase
    {
        private readonly IDisseminationService _disseminationService;
        private readonly ILogger<DisseminationController> _logger;

        public DisseminationController(IDisseminationService disseminationService, ILogger<DisseminationController> logger)
        {
            _disseminationService = disseminationService;
            _logger = logger;
        }

        // GET: api/Dissemination/project/5
        [HttpGet("project/{ka2ProjectId}")]
        public async Task<ActionResult<IEnumerable<DisseminationDto>>> GetDisseminationsByProjectId(int ka2ProjectId)
        {
            try
            {
                var disseminations = await _disseminationService.GetDisseminationsByProjectIdAsync(ka2ProjectId);
                return Ok(disseminations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while processing request");
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
        }

        // GET: api/Dissemination/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DisseminationDto>> GetDissemination(int id)
        {
            try
            {
                var dissemination = await _disseminationService.GetDisseminationByIdAsync(id);
                if (dissemination == null)
                    return NotFound($"Dissemination with ID {id} not found");

                return Ok(dissemination);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while processing request");
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
        }

        // POST: api/Dissemination
        [HttpPost]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<DisseminationDto>> CreateDissemination([FromBody] CreateDisseminationDto createDisseminationDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var createdDissemination = await _disseminationService.CreateDisseminationAsync(createDisseminationDto);
                return CreatedAtAction(nameof(GetDissemination), new { id = createdDissemination.Id }, createdDissemination);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while processing request");
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
        }

        // PUT: api/Dissemination/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<DisseminationDto>> UpdateDissemination(int id, [FromBody] UpdateDisseminationDto updateDisseminationDto)
        {
            try
            {
                if (id != updateDisseminationDto.Id)
                    return BadRequest("ID mismatch");

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updatedDissemination = await _disseminationService.UpdateDisseminationAsync(updateDisseminationDto);
                return Ok(updatedDissemination);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while processing request");
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
        }

        // DELETE: api/Dissemination/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> DeleteDissemination(int id)
        {
            try
            {
                var result = await _disseminationService.DeleteDisseminationAsync(id);
                if (!result)
                    return NotFound($"Dissemination with ID {id} not found");

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while processing request");
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
        }
    }
}



