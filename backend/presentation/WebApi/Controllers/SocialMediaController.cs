using EduExcellence.Application.DTOs.SocialMedia;
using EduExcellence.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EduExcellence.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SocialMediaController : ControllerBase
    {
        private readonly ISocialMediaService _socialMediaService;
        private readonly ILogger<SocialMediaController> _logger;

        public SocialMediaController(ISocialMediaService socialMediaService, ILogger<SocialMediaController> logger)
        {
            _socialMediaService = socialMediaService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SocialMediaDto>>> GetAll()
        {
            try
            {
                var socialMedias = await _socialMediaService.GetAllAsync();
                return Ok(socialMedias);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all social media links");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<SocialMediaDto>>> GetActive()
        {
            try
            {
                var socialMedias = await _socialMediaService.GetActiveAsync();
                return Ok(socialMedias);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting active social media links");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SocialMediaDto>> GetById(int id)
        {
            try
            {
                var socialMedia = await _socialMediaService.GetByIdAsync(id);
                if (socialMedia == null)
                    return NotFound();

                return Ok(socialMedia);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting social media by id {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<SocialMediaDto>> Create([FromBody] CreateSocialMediaDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var socialMedia = await _socialMediaService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = socialMedia.Id }, socialMedia);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating social media link");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SocialMediaDto>> Update(int id, [FromBody] UpdateSocialMediaDto dto)
        {
            try
            {
                if (id != dto.Id)
                    return BadRequest("ID mismatch");

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var socialMedia = await _socialMediaService.UpdateAsync(dto);
                return Ok(socialMedia);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Social media link not found for update {Id}", id);
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating social media link {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var result = await _socialMediaService.DeleteAsync(id);
                if (!result)
                    return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting social media link {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPatch("{id}/toggle-active")]
        public async Task<ActionResult> ToggleActive(int id)
        {
            try
            {
                var result = await _socialMediaService.ToggleActiveAsync(id);
                if (!result)
                    return NotFound();

                return Ok(new { message = "Status updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling active status for social media link {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}







