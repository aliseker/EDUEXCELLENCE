using EduExcellence.Application.DTOs.Meeting;
using EduExcellence.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduExcellence.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MeetingController : ControllerBase
    {
        private readonly IMeetingService _meetingService;
        private readonly ILogger<MeetingController> _logger;

        public MeetingController(IMeetingService meetingService, ILogger<MeetingController> logger)
        {
            _meetingService = meetingService;
            _logger = logger;
        }

        // GET: api/Meeting/project/5
        [HttpGet("project/{ka2ProjectId}")]
        public async Task<ActionResult<IEnumerable<MeetingDto>>> GetMeetingsByProjectId(int ka2ProjectId)
        {
            try
            {
                var meetings = await _meetingService.GetMeetingsByProjectIdAsync(ka2ProjectId);
                return Ok(meetings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while processing request");
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
        }

        // GET: api/Meeting/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MeetingDto>> GetMeeting(int id)
        {
            try
            {
                var meeting = await _meetingService.GetMeetingByIdAsync(id);
                if (meeting == null)
                    return NotFound($"Meeting with ID {id} not found");

                return Ok(meeting);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while processing request");
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
        }

        // POST: api/Meeting
        [HttpPost]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<MeetingDto>> CreateMeeting([FromBody] CreateMeetingDto createMeetingDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var createdMeeting = await _meetingService.CreateMeetingAsync(createMeetingDto);
                return CreatedAtAction(nameof(GetMeeting), new { id = createdMeeting.Id }, createdMeeting);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while processing request");
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
        }

        // PUT: api/Meeting/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<MeetingDto>> UpdateMeeting(int id, [FromBody] UpdateMeetingDto updateMeetingDto)
        {
            try
            {
                if (id != updateMeetingDto.Id)
                    return BadRequest("ID mismatch");

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updatedMeeting = await _meetingService.UpdateMeetingAsync(updateMeetingDto);
                return Ok(updatedMeeting);
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

        // DELETE: api/Meeting/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> DeleteMeeting(int id)
        {
            try
            {
                var result = await _meetingService.DeleteMeetingAsync(id);
                if (!result)
                    return NotFound($"Meeting with ID {id} not found");

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

