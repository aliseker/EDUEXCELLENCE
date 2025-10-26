using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EduExcellence.Application.Interfaces;
using EduExcellence.Domain.Entities;
using EduExcellence.Domain.Interfaces;

namespace EduExcellence.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailService _emailService;

        public ContactController(IUnitOfWork unitOfWork, IEmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _emailService = emailService;
        }

        // Public endpoints (no authorization required)
        [HttpGet("primary")]
        public async Task<ActionResult<IEnumerable<Contact>>> GetPrimaryContacts()
        {
            try
            {
                var contacts = await _unitOfWork.Contacts.GetAllAsync();
                var primaryContacts = contacts.Where(c => c.IsPrimary).OrderBy(c => c.Order).ToList();
                return Ok(primaryContacts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving primary contacts", error = ex.Message });
            }
        }

        [HttpGet("by-type/{type}")]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContactsByType(string type)
        {
            try
            {
                var contacts = await _unitOfWork.Contacts.GetAllAsync();
                var filteredContacts = contacts.Where(c => c.Type.ToLower() == type.ToLower()).OrderBy(c => c.Order).ToList();
                return Ok(filteredContacts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving contacts by type", error = ex.Message });
            }
        }

        [HttpPost("send-email")]
        public async Task<IActionResult> SendContactEmail([FromBody] ContactEmailRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState });
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(request.Name) || 
                    string.IsNullOrWhiteSpace(request.Email) || 
                    string.IsNullOrWhiteSpace(request.Subject) || 
                    string.IsNullOrWhiteSpace(request.Message))
                {
                    return BadRequest(new { message = "Name, email, subject, and message are required" });
                }

                // Send email using the email service
                await _emailService.SendContactNotificationAsync(
                    request.Name,
                    request.Email,
                    request.Phone ?? string.Empty,
                    request.Subject,
                    request.Message
                );

                return Ok(new { message = "Email sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to send email", error = ex.Message });
            }
        }

        // Admin endpoints (authorization required)
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
        {
            try
            {
                var contacts = await _unitOfWork.Contacts.GetAllAsync();
                return Ok(contacts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving contacts", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Contact>> GetContact(int id)
        {
            try
            {
                var contact = await _unitOfWork.Contacts.GetByIdAsync(id);
                if (contact == null)
                {
                    return NotFound(new { message = "Contact not found" });
                }
                return Ok(contact);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving contact", error = ex.Message });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Contact>> CreateContact([FromBody] Contact contact)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                await _unitOfWork.Contacts.AddAsync(contact);
                await _unitOfWork.SaveChangesAsync();

                return CreatedAtAction(nameof(GetContact), new { id = contact.Id }, contact);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating contact", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateContact(int id, [FromBody] Contact contact)
        {
            try
            {
                if (id != contact.Id)
                {
                    return BadRequest(new { message = "ID mismatch" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var existingContact = await _unitOfWork.Contacts.GetByIdAsync(id);
                if (existingContact == null)
                {
                    return NotFound(new { message = "Contact not found" });
                }

                _unitOfWork.Contacts.Update(contact);
                await _unitOfWork.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating contact", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteContact(int id)
        {
            try
            {
                var contact = await _unitOfWork.Contacts.GetByIdAsync(id);
                if (contact == null)
                {
                    return NotFound(new { message = "Contact not found" });
                }

                _unitOfWork.Contacts.Delete(contact);
                await _unitOfWork.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting contact", error = ex.Message });
            }
        }

        // Bulk update for contact info (for admin panel)
        [HttpPut("bulk-update")]
        [Authorize]
        public async Task<IActionResult> BulkUpdateContacts([FromBody] List<Contact> contacts)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                foreach (var contact in contacts)
                {
                    var existingContact = await _unitOfWork.Contacts.GetByIdAsync(contact.Id);
                    if (existingContact != null)
                    {
                        // Update existing contact
                        existingContact.Title = contact.Title;
                        existingContact.Details = contact.Details;
                        existingContact.Order = contact.Order;
                        existingContact.IsPrimary = contact.IsPrimary;
                        _unitOfWork.Contacts.Update(existingContact);
                    }
                    else if (contact.Id == 0)
                    {
                        // Add new contact (ID is 0 for new contacts)
                        contact.CreatedAt = DateTime.UtcNow;
                        contact.UpdatedAt = DateTime.UtcNow;
                        contact.IsActive = true;
                        await _unitOfWork.Contacts.AddAsync(contact);
                    }
                }

                await _unitOfWork.SaveChangesAsync();

                return Ok(new { message = "Contacts updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating contacts", error = ex.Message });
            }
        }
    }

    // DTO for contact email request
    public class ContactEmailRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
