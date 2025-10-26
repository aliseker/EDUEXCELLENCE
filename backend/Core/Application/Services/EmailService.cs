using EduExcellence.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System.Text.RegularExpressions;

namespace EduExcellence.Application.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = true)
        {
            try
            {
                // Validate email address
                if (!IsValidEmail(to))
                {
                    throw new ArgumentException("Invalid email address format", nameof(to));
                }

                // Validate configuration
                ValidateSmtpConfiguration();

                var message = new MimeMessage();
                
                message.From.Add(new MailboxAddress(
                    _configuration["SmtpSettings:FromName"],
                    _configuration["SmtpSettings:FromEmail"]
                ));
                
                message.To.Add(MailboxAddress.Parse(to));
                message.Subject = SanitizeSubject(subject);
                
                var bodyBuilder = new BodyBuilder();
                if (isHtml)
                {
                    bodyBuilder.HtmlBody = body;
                }
                else
                {
                    bodyBuilder.TextBody = body;
                }
                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                
                // Connect with proper SSL/TLS settings
                var host = _configuration["SmtpSettings:Host"];
                var port = int.Parse(_configuration["SmtpSettings:Port"] ?? "587");
                var enableSsl = bool.Parse(_configuration["SmtpSettings:EnableSsl"] ?? "true");

                await client.ConnectAsync(host, port, enableSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None);

                var username = _configuration["SmtpSettings:Username"];
                var password = _configuration["SmtpSettings:Password"];
                
                if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
                {
                    await client.AuthenticateAsync(username, password);
                }

                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation($"Email sent successfully to {to}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {to}: {ex.Message}");
                throw new Exception($"Failed to send email: {ex.Message}", ex);
            }
        }

        private void ValidateSmtpConfiguration()
        {
            var requiredSettings = new[] { "Host", "Port", "Username", "Password", "FromEmail" };
            foreach (var setting in requiredSettings)
            {
                var value = _configuration[$"SmtpSettings:{setting}"];
                if (string.IsNullOrWhiteSpace(value) || value.Contains("***REMOVED_FOR_SECURITY***"))
                {
                    throw new InvalidOperationException($"SMTP configuration '{setting}' is missing or invalid. Please configure in appsettings.Development.json");
                }
            }
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

        private string SanitizeSubject(string subject)
        {
            if (string.IsNullOrWhiteSpace(subject))
                return "No Subject";

            // Remove potentially dangerous characters
            return subject.Replace("\r", "").Replace("\n", " ").Trim();
        }

        public async Task SendContactNotificationAsync(string customerName, string customerEmail, string customerPhone, string subject, string message)
        {
            var adminEmail = _configuration["SmtpSettings:AdminNotificationEmail"] ?? _configuration["SmtpSettings:Username"];
            
            if (string.IsNullOrEmpty(adminEmail))
            {
                throw new Exception("Admin notification email is not configured");
            }
            
            // Telefon numarası formatı
            var phoneDisplay = string.IsNullOrWhiteSpace(customerPhone) 
                ? "Belirtilmemiş" 
                : customerPhone;
            
            var emailBody = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; }}
                        .container {{ max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }}
                        .header {{ background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; }}
                        .header h2 {{ margin: 0; font-size: 24px; }}
                        .content {{ padding: 30px; }}
                        .field {{ margin-bottom: 20px; }}
                        .field-label {{ font-weight: bold; color: #374151; margin-bottom: 5px; }}
                        .field-value {{ color: #6b7280; padding: 10px; background-color: #f9fafb; border-radius: 5px; border-left: 3px solid #2563eb; }}
                        .message-box {{ background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 15px; white-space: pre-wrap; word-wrap: break-word; }}
                        .footer {{ background-color: #f9fafb; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h2>🔔 Yeni İletişim Formu Mesajı</h2>
                        </div>
                        <div class='content'>
                            <div class='field'>
                                <div class='field-label'>👤 Gönderen:</div>
                                <div class='field-value'>{customerName}</div>
                            </div>
                            <div class='field'>
                                <div class='field-label'>📧 E-posta:</div>
                                <div class='field-value'>{customerEmail}</div>
                            </div>
                            <div class='field'>
                                <div class='field-label'>📱 Telefon:</div>
                                <div class='field-value'>{phoneDisplay}</div>
                            </div>
                            <div class='field'>
                                <div class='field-label'>📋 Konu:</div>
                                <div class='field-value'>{subject}</div>
                            </div>
                            <div class='field'>
                                <div class='field-label'>💬 Mesaj:</div>
                                <div class='message-box'>{message}</div>
                            </div>
                        </div>
                        <div class='footer'>
                            Bu mail EDU Excellence platformundan otomatik gönderilmiştir.<br/>
                            © 2024 EDU Excellence - Tüm hakları saklıdır.
                        </div>
                    </div>
                </body>
                </html>
            ";

            await SendEmailAsync(adminEmail, $"İletişim Formu: {subject}", emailBody, true);
        }
    }
}




