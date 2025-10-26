namespace EduExcellence.Application.DTOs.Settings
{
    public class WhatsAppSettingsDto
    {
        public string PhoneNumber { get; set; } = string.Empty;
        public string WelcomeMessage { get; set; } = "Hello! How can we help you?";
        public bool IsEnabled { get; set; } = true;
    }
}








