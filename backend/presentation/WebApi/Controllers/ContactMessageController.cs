using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EduExcellence.Application.Interfaces;
using EduExcellence.Domain.Entities;
using EduExcellence.Domain.Interfaces;

namespace EduExcellence.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactMessageController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public ContactMessageController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // Public endpoint for submitting contact messages
        [HttpPost]
        public async Task<ActionResult<ContactMessage>> CreateContactMessage([FromBody] ContactMessage contactMessage)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Set default values
                contactMessage.IsRead = false;
                contactMessage.ReadAt = null;
                contactMessage.AdminResponse = null;
                contactMessage.RespondedAt = null;

                await _unitOfWork.ContactMessages.AddAsync(contactMessage);
                await _unitOfWork.SaveChangesAsync();

                return CreatedAtAction(nameof(GetContactMessage), new { id = contactMessage.Id }, contactMessage);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating contact message", error = ex.Message });
            }
        }

        // Admin endpoints (authorization required)
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ContactMessage>>> GetContactMessages()
        {
            try
            {
                var messages = await _unitOfWork.ContactMessages.GetAllAsync();
                return Ok(messages.OrderByDescending(m => m.CreatedAt));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving contact messages", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ContactMessage>> GetContactMessage(int id)
        {
            try
            {
                var message = await _unitOfWork.ContactMessages.GetByIdAsync(id);
                if (message == null)
                {
                    return NotFound(new { message = "Contact message not found" });
                }
                return Ok(message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving contact message", error = ex.Message });
            }
        }

        [HttpPut("{id}/read")]
        [Authorize]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            try
            {
                var message = await _unitOfWork.ContactMessages.GetByIdAsync(id);
                if (message == null)
                {
                    return NotFound(new { message = "Contact message not found" });
                }

                message.IsRead = true;
                message.ReadAt = DateTime.UtcNow;

                _unitOfWork.ContactMessages.Update(message);
                await _unitOfWork.SaveChangesAsync();

                return Ok(new { message = "Contact message marked as read" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while marking message as read", error = ex.Message });
            }
        }

        [HttpPut("{id}/respond")]
        [Authorize]
        public async Task<IActionResult> RespondToMessage(int id, [FromBody] string response)
        {
            try
            {
                var message = await _unitOfWork.ContactMessages.GetByIdAsync(id);
                if (message == null)
                {
                    return NotFound(new { message = "Contact message not found" });
                }

                message.AdminResponse = response;
                message.RespondedAt = DateTime.UtcNow;
                message.IsRead = true;
                message.ReadAt = DateTime.UtcNow;

                _unitOfWork.ContactMessages.Update(message);
                await _unitOfWork.SaveChangesAsync();

                return Ok(new { message = "Response added successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while responding to message", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteContactMessage(int id)
        {
            try
            {
                var message = await _unitOfWork.ContactMessages.GetByIdAsync(id);
                if (message == null)
                {
                    return NotFound(new { message = "Contact message not found" });
                }

                _unitOfWork.ContactMessages.Delete(message);
                await _unitOfWork.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting contact message", error = ex.Message });
            }
        }

        [HttpGet("unread/count")]
        [Authorize]
        public async Task<ActionResult<int>> GetUnreadCount()
        {
            try
            {
                var messages = await _unitOfWork.ContactMessages.GetAllAsync();
                var unreadCount = messages.Count(m => !m.IsRead);
                return Ok(new { count = unreadCount });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting unread count", error = ex.Message });
            }
        }
    }
}
