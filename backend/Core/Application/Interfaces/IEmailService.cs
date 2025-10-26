namespace EduExcellence.Application.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body, bool isHtml = true);
        Task SendContactNotificationAsync(string customerName, string customerEmail, string customerPhone, string subject, string message);
    }
}





