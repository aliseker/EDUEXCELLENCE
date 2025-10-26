using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EduExcellence.Application.Interfaces;
using EduExcellence.Application.Services;
using EduExcellence.Domain.Entities;
using EduExcellence.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace EduExcellence.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactMessageController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailService _emailService;
        private readonly IRateLimitService _rateLimitService;
        private readonly ILogger<ContactMessageController> _logger;

        public ContactMessageController(
            IUnitOfWork unitOfWork, 
            IEmailService emailService, 
            IRateLimitService rateLimitService,
            ILogger<ContactMessageController> logger)
        {
            _unitOfWork = unitOfWork;
            _emailService = emailService;
            _rateLimitService = rateLimitService;
            _logger = logger;
        }

        // Public endpoint for submitting contact messages
        [HttpPost]
        public async Task<ActionResult<ContactMessage>> CreateContactMessage([FromBody] ContactMessage contactMessage)
        {
            try
            {
                // Input validation
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid input data", errors = ModelState });
                }

                // Additional validation
                if (string.IsNullOrWhiteSpace(contactMessage.Name) || contactMessage.Name.Length < 2)
                {
                    return BadRequest(new { message = "Name must be at least 2 characters long" });
                }

                if (string.IsNullOrWhiteSpace(contactMessage.Email) || !IsValidEmail(contactMessage.Email))
                {
                    return BadRequest(new { message = "Valid email address is required" });
                }

                if (string.IsNullOrWhiteSpace(contactMessage.Message) || contactMessage.Message.Length < 10)
                {
                    return BadRequest(new { message = "Message must be at least 10 characters long" });
                }

                // Rate limiting by IP
                var clientIp = GetClientIpAddress();
                if (!_rateLimitService.IsAllowed($"contact_ip_{clientIp}", maxAttempts: 3, window: TimeSpan.FromMinutes(15)))
                {
                    _logger.LogWarning($"Rate limit exceeded for IP: {clientIp}");
                    return StatusCode(429, new { message = "Too many requests. Please try again in 15 minutes." });
                }

                // Rate limiting by email
                if (!_rateLimitService.IsAllowed($"contact_email_{contactMessage.Email}", maxAttempts: 5, window: TimeSpan.FromHours(1)))
                {
                    _logger.LogWarning($"Rate limit exceeded for email: {contactMessage.Email}");
                    return StatusCode(429, new { message = "Too many messages from this email. Please try again later." });
                }

                // Sanitize input to prevent XSS
                contactMessage.Name = SanitizeInput(contactMessage.Name);
                contactMessage.Subject = SanitizeInput(contactMessage.Subject);
                contactMessage.Message = SanitizeInput(contactMessage.Message);

                // Set default values
                contactMessage.IsRead = false;
                contactMessage.ReadAt = null;
                contactMessage.AdminResponse = null;
                contactMessage.RespondedAt = null;

                await _unitOfWork.ContactMessages.AddAsync(contactMessage);
                await _unitOfWork.SaveChangesAsync();

                // Send email notification to admin (async, don't block response)
                _ = Task.Run(async () =>
                {
                    try
                    {
                        await _emailService.SendContactNotificationAsync(
                            contactMessage.Name,
                            contactMessage.Email,
                            contactMessage.Phone ?? "",
                            contactMessage.Subject,
                            contactMessage.Message
                        );
                    }
                    catch (Exception emailEx)
                    {
                        _logger.LogError(emailEx, $"Failed to send email notification for contact message {contactMessage.Id}");
                    }
                });

                _logger.LogInformation($"Contact message created successfully from {contactMessage.Email}");
                return CreatedAtAction(nameof(GetContactMessage), new { id = contactMessage.Id }, 
                    new { message = "Your message has been sent successfully. We will contact you soon.", id = contactMessage.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating contact message");
                return StatusCode(500, new { message = "An error occurred while sending your message. Please try again later." });
            }
        }

        private string GetClientIpAddress()
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            
            // Check for forwarded IP (if behind proxy/load balancer)
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
            {
                ipAddress = Request.Headers["X-Forwarded-For"].ToString().Split(',').FirstOrDefault()?.Trim();
            }
            else if (Request.Headers.ContainsKey("X-Real-IP"))
            {
                ipAddress = Request.Headers["X-Real-IP"].ToString();
            }

            return ipAddress ?? "unknown";
        }

        private bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            try
            {
                var emailAttribute = new EmailAddressAttribute();
                return emailAttribute.IsValid(email);
            }
            catch
            {
                return false;
            }
        }

        private string SanitizeInput(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return input;

            // Remove potentially dangerous HTML/script tags
            var sanitized = Regex.Replace(input, @"<[^>]*>", string.Empty);
            
            // Trim and normalize whitespace
            return sanitized.Trim();
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
