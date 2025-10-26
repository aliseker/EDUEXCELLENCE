using EduExcellence.Application.DTOs.Settings;
using EduExcellence.Infrastructure.Persistence.Context;
using EduExcellence.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduExcellence.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly EduExcellenceDbContext _context;
        private readonly ILogger<SettingsController> _logger;

        public SettingsController(EduExcellenceDbContext context, ILogger<SettingsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("whatsapp")]
        public async Task<ActionResult<WhatsAppSettingsDto>> GetWhatsAppSettings()
        {
            var settings = await _context.WhatsAppSettings.FirstOrDefaultAsync();
            
            if (settings == null)
            {
                // Create default settings if none exist
                settings = new WhatsAppSettings
                {
                    PhoneNumber = "+905555555555",
                    WelcomeMessage = "Hello! How can we help you?",
                    IsEnabled = true,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };
                
                _context.WhatsAppSettings.Add(settings);
                await _context.SaveChangesAsync();
            }

            var dto = new WhatsAppSettingsDto
            {
                PhoneNumber = settings.PhoneNumber,
                WelcomeMessage = settings.WelcomeMessage,
                IsEnabled = settings.IsEnabled
            };

            return Ok(dto);
        }

        [HttpPut("whatsapp")]
        public async Task<ActionResult<WhatsAppSettingsDto>> UpdateWhatsAppSettings([FromBody] WhatsAppSettingsDto dto)
        {
            try
            {
                var settings = await _context.WhatsAppSettings.FirstOrDefaultAsync();
                
                if (settings == null)
                {
                    // Create new settings
                    settings = new WhatsAppSettings
                    {
                        PhoneNumber = dto.PhoneNumber,
                        WelcomeMessage = dto.WelcomeMessage,
                        IsEnabled = dto.IsEnabled,
                        CreatedAt = DateTime.UtcNow,
                        IsActive = true
                    };
                    
                    _context.WhatsAppSettings.Add(settings);
                }
                else
                {
                    // Update existing settings
                    settings.PhoneNumber = dto.PhoneNumber;
                    settings.WelcomeMessage = dto.WelcomeMessage;
                    settings.IsEnabled = dto.IsEnabled;
                    settings.UpdatedAt = DateTime.UtcNow;
                    
                    _context.WhatsAppSettings.Update(settings);
                }
                
                await _context.SaveChangesAsync();
                
                return Ok(dto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while processing request");
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
        }
    }
}

