using System;

namespace EduExcellence.Domain.Entities
{
    public class WhatsAppSettings : BaseEntity
    {
        public string PhoneNumber { get; set; } = string.Empty;
        public string WelcomeMessage { get; set; } = string.Empty;
        public bool IsEnabled { get; set; } = true;
    }
}






