using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EduExcellence.Application.Interfaces;
using EduExcellence.Domain.Entities;
using EduExcellence.Domain.Interfaces;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;
using EduExcellence.Application.Services;

namespace EduExcellence.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailService _emailService;
        private readonly IRateLimitService _rateLimitService;
        private readonly ILogger<ContactController> _logger;

        public ContactController(
            IUnitOfWork unitOfWork, 
            IEmailService emailService,
            IRateLimitService rateLimitService,
            ILogger<ContactController> logger)
        {
            _unitOfWork = unitOfWork;
            _emailService = emailService;
            _rateLimitService = rateLimitService;
            _logger = logger;
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
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();
                    
                    return BadRequest(new { 
                        message = "Doğrulama hatası", 
                        errors = errors 
                    });
                }

                // Rate limiting by IP
                var clientIp = GetClientIpAddress();
                if (!_rateLimitService.IsAllowed($"contact_email_ip_{clientIp}", maxAttempts: 3, window: TimeSpan.FromMinutes(15)))
                {
                    _logger.LogWarning($"Rate limit exceeded for IP: {clientIp}");
                    return StatusCode(429, new { message = "Çok fazla istek gönderdiniz. Lütfen 15 dakika sonra tekrar deneyin." });
                }

                // Rate limiting by email
                if (!_rateLimitService.IsAllowed($"contact_email_addr_{request.Email?.Trim().ToLower()}", maxAttempts: 5, window: TimeSpan.FromHours(1)))
                {
                    _logger.LogWarning($"Rate limit exceeded for email: {request.Email}");
                    return StatusCode(429, new { message = "Bu e-posta adresinden çok fazla mesaj gönderildi. Lütfen daha sonra tekrar deneyin." });
                }

                // Additional server-side validation
                if (string.IsNullOrWhiteSpace(request.Name))
                {
                    return BadRequest(new { message = "Ad Soyad zorunludur" });
                }

                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    return BadRequest(new { message = "E-posta adresi zorunludur" });
                }

                if (string.IsNullOrWhiteSpace(request.Subject))
                {
                    return BadRequest(new { message = "Konu zorunludur" });
                }

                if (string.IsNullOrWhiteSpace(request.Message))
                {
                    return BadRequest(new { message = "Mesaj zorunludur" });
                }

                // Sanitize inputs to prevent XSS
                var sanitizedName = SanitizeInput(request.Name.Trim());
                var sanitizedEmail = SanitizeEmail(request.Email.Trim());
                var sanitizedPhone = !string.IsNullOrWhiteSpace(request.Phone) ? SanitizeInput(request.Phone.Trim()) : string.Empty;
                var sanitizedSubject = SanitizeInput(request.Subject.Trim());
                var sanitizedMessage = SanitizeInput(request.Message.Trim());

                // Validate name format (only letters and spaces, Turkish characters allowed)
                // Includes: a-z, A-Z, ğ, ü, ş, ö, ç, ı, İ, Ğ, Ü, Ş, Ö, Ç, I (English capital I)
                // Using Unicode escape sequences for Turkish characters: ğ(\u011F), ü(\u00FC), ş(\u015F), ö(\u00F6), ç(\u00E7), ı(\u0131), İ(\u0130), Ğ(\u011E), Ü(\u00DC), Ş(\u015E), Ö(\u00D6), Ç(\u00C7)
                if (!Regex.IsMatch(sanitizedName, @"^[a-zA-Z\u011F\u00FC\u015F\u00F6\u00E7\u0130\u011E\u00DC\u015E\u00D6\u00C7\u0131I\s]+$", RegexOptions.None))
                {
                    return BadRequest(new { message = "Ad Soyad sadece harf içermelidir" });
                }

                // Validate name length
                if (sanitizedName.Length < 3 || sanitizedName.Length > 100)
                {
                    return BadRequest(new { message = "Ad Soyad 3 ile 100 karakter arasında olmalıdır" });
                }

                // Validate email format and prevent email injection
                if (!IsValidEmail(sanitizedEmail))
                {
                    return BadRequest(new { message = "Geçerli bir e-posta adresi giriniz" });
                }

                // Prevent email injection attacks
                if (ContainsEmailInjectionChars(sanitizedEmail))
                {
                    _logger.LogWarning($"Email injection attempt detected from IP: {clientIp}, Email: {sanitizedEmail}");
                    return BadRequest(new { message = "Geçersiz e-posta formatı" });
                }

                // Validate phone format if provided
                if (!string.IsNullOrWhiteSpace(sanitizedPhone))
                {
                    var cleanPhone = Regex.Replace(sanitizedPhone, @"[\s\-\(\)]", "");
                    if (!Regex.IsMatch(cleanPhone, @"^(\+90|0)?5\d{9}$"))
                    {
                        return BadRequest(new { message = "Geçerli bir Türk telefon numarası giriniz (örn: +90 555 555 55 55)" });
                    }
                }

                // Validate subject length
                if (sanitizedSubject.Length < 5 || sanitizedSubject.Length > 200)
                {
                    return BadRequest(new { message = "Konu 5 ile 200 karakter arasında olmalıdır" });
                }

                // Validate message length
                if (sanitizedMessage.Length < 10 || sanitizedMessage.Length > 2000)
                {
                    return BadRequest(new { message = "Mesaj 10 ile 2000 karakter arasında olmalıdır" });
                }

                // Send email using the email service
                await _emailService.SendContactNotificationAsync(
                    sanitizedName,
                    sanitizedEmail,
                    sanitizedPhone,
                    sanitizedSubject,
                    sanitizedMessage
                );

                _logger.LogInformation($"Contact email sent successfully from {sanitizedEmail}");
                return Ok(new { message = "Email sent successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send contact email");
                return StatusCode(500, new { message = "Failed to send email", error = ex.Message });
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
                // RFC 5322 compliant regex pattern
                var pattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
                return Regex.IsMatch(email, pattern, RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }
        }

        private bool ContainsEmailInjectionChars(string email)
        {
            // Check for email injection attempts (newlines, carriage returns, etc.)
            var dangerousChars = new[] { '\r', '\n', '\0', '\b', '\t' };
            return dangerousChars.Any(c => email.Contains(c));
        }

        private string SanitizeInput(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return input;

            // Remove potentially dangerous HTML/script tags
            var sanitized = Regex.Replace(input, @"<[^>]*>", string.Empty);
            
            // Remove control characters and dangerous characters
            sanitized = Regex.Replace(sanitized, @"[\x00-\x1F\x7F]", string.Empty);
            
            // Trim and normalize whitespace
            return sanitized.Trim();
        }

        private string SanitizeEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return email;

            // Remove dangerous characters that could be used for email injection
            var sanitized = Regex.Replace(email, @"[\r\n\0\b\t]", string.Empty);
            
            // Remove any whitespace
            sanitized = sanitized.Trim();
            
            // Convert to lowercase for consistency
            return sanitized.ToLowerInvariant();
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
        [Required(ErrorMessage = "Ad Soyad zorunludur")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Ad Soyad 3 ile 100 karakter arasında olmalıdır")]
        [RegularExpression(@"^[a-zA-Z\u011F\u00FC\u015F\u00F6\u00E7\u0130\u011E\u00DC\u015E\u00D6\u00C7\u0131I\s]+$", ErrorMessage = "Ad Soyad sadece harf içermelidir")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "E-posta adresi zorunludur")]
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz")]
        [StringLength(100, ErrorMessage = "E-posta adresi en fazla 100 karakter olabilir")]
        public string Email { get; set; } = string.Empty;

        [RegularExpression(@"^(\+90|0)?\s*\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$", ErrorMessage = "Geçerli bir Türk telefon numarası giriniz (örn: +90 555 555 55 55 veya 0555 555 55 55)")]
        [StringLength(20, ErrorMessage = "Telefon numarası en fazla 20 karakter olabilir")]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "Konu zorunludur")]
        [StringLength(200, MinimumLength = 5, ErrorMessage = "Konu 5 ile 200 karakter arasında olmalıdır")]
        public string Subject { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mesaj zorunludur")]
        [StringLength(2000, MinimumLength = 10, ErrorMessage = "Mesaj 10 ile 2000 karakter arasında olmalıdır")]
        public string Message { get; set; } = string.Empty;
    }
}
