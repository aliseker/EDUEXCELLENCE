using EduExcellence.Application.DTOs.Meeting;
using EduExcellence.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EduExcellence.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MeetingController : ControllerBase
    {
        private readonly IMeetingService _meetingService;

        public MeetingController(IMeetingService meetingService)
        {
            _meetingService = meetingService;
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
                return StatusCode(500, $"Internal server error: {ex.Message}");
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
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/Meeting
        [HttpPost]
        public async Task<ActionResult<MeetingDto>> CreateMeeting([FromBody] MeetingDto meetingDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var createdMeeting = await _meetingService.CreateMeetingAsync(meetingDto);
                return CreatedAtAction(nameof(GetMeeting), new { id = createdMeeting.Id }, createdMeeting);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/Meeting/5
        [HttpPut("{id}")]
        public async Task<ActionResult<MeetingDto>> UpdateMeeting(int id, [FromBody] MeetingDto meetingDto)
        {
            try
            {
                if (id != meetingDto.Id)
                    return BadRequest("ID mismatch");

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updatedMeeting = await _meetingService.UpdateMeetingAsync(meetingDto);
                return Ok(updatedMeeting);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/Meeting/5
        [HttpDelete("{id}")]
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
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}

