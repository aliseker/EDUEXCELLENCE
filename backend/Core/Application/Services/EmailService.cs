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
                
                // Prevent email injection in From address
                var fromName = SanitizeInput(_configuration["SmtpSettings:FromName"] ?? "EduExcellence");
                var fromEmail = SanitizeEmail(_configuration["SmtpSettings:FromEmail"]);
                
                if (!IsValidEmail(fromEmail))
                {
                    throw new InvalidOperationException("Invalid From email address in configuration");
                }

                message.From.Add(new MailboxAddress(fromName, fromEmail));
                
                // Prevent email injection in To address
                var sanitizedTo = SanitizeEmail(to);
                if (!IsValidEmail(sanitizedTo))
                {
                    throw new ArgumentException("Invalid email address format", nameof(to));
                }
                
                message.To.Add(MailboxAddress.Parse(sanitizedTo));
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
            var sanitized = subject.Replace("\r", "").Replace("\n", " ").Trim();
            
            // Remove control characters
            sanitized = Regex.Replace(sanitized, @"[\x00-\x1F\x7F]", string.Empty);
            
            // Limit length to prevent header injection
            if (sanitized.Length > 200)
            {
                sanitized = sanitized.Substring(0, 200);
            }
            
            return sanitized;
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

        private string HtmlEncode(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return input;

            // HTML encode to prevent XSS
            return System.Net.WebUtility.HtmlEncode(input);
        }

        public async Task SendContactNotificationAsync(string customerName, string customerEmail, string customerPhone, string subject, string message)
        {
            var adminEmail = _configuration["SmtpSettings:AdminNotificationEmail"] ?? _configuration["SmtpSettings:Username"];
            
            if (string.IsNullOrEmpty(adminEmail))
            {
                throw new Exception("Admin notification email is not configured");
            }

            // Sanitize all inputs to prevent XSS
            var sanitizedName = HtmlEncode(customerName);
            var sanitizedEmail = HtmlEncode(customerEmail);
            var sanitizedPhone = string.IsNullOrWhiteSpace(customerPhone) 
                ? "Belirtilmemiş" 
                : HtmlEncode(customerPhone);
            var sanitizedSubject = HtmlEncode(subject);
            var sanitizedMessage = HtmlEncode(message);
            
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
                                <div class='field-value'>{sanitizedName}</div>
                            </div>
                            <div class='field'>
                                <div class='field-label'>📧 E-posta:</div>
                                <div class='field-value'>{sanitizedEmail}</div>
                            </div>
                            <div class='field'>
                                <div class='field-label'>📱 Telefon:</div>
                                <div class='field-value'>{sanitizedPhone}</div>
                            </div>
                            <div class='field'>
                                <div class='field-label'>📋 Konu:</div>
                                <div class='field-value'>{sanitizedSubject}</div>
                            </div>
                            <div class='field'>
                                <div class='field-label'>💬 Mesaj:</div>
                                <div class='message-box'>{sanitizedMessage}</div>
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

            await SendEmailAsync(adminEmail, $"İletişim Formu: {sanitizedSubject}", emailBody, true);
        }

        public async Task SendPasswordResetEmailAsync(string email, string resetUrl, string firstName)
        {
            var subject = "Şifre Sıfırlama Talebi - EDU Excellence";
            
            var emailBody = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; }}
                        .container {{ max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }}
                        .header {{ background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 40px; text-align: center; }}
                        .header h2 {{ margin: 0; font-size: 28px; }}
                        .content {{ padding: 40px; }}
                        .greeting {{ font-size: 18px; color: #374151; margin-bottom: 20px; }}
                        .message {{ color: #6b7280; line-height: 1.6; margin-bottom: 30px; }}
                        .button-container {{ text-align: center; margin: 30px 0; }}
                        .button {{ display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }}
                        .warning {{ background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; color: #92400e; }}
                        .footer {{ background-color: #f9fafb; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; }}
                        .security-note {{ font-size: 12px; color: #9ca3af; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h2>🔐 Şifre Sıfırlama</h2>
                        </div>
                        <div class='content'>
                            <div class='greeting'>Merhaba {firstName},</div>
                            <div class='message'>
                                Admin hesabınız için şifre sıfırlama talebinde bulundunuz. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz.
                            </div>
                            <div class='button-container'>
                                <a href='{resetUrl}' class='button'>Şifremi Sıfırla</a>
                            </div>
                            <div class='warning'>
                                ⚠️ <strong>Önemli:</strong> Bu link sadece <strong>15 dakika</strong> geçerlidir ve sadece <strong>bir kez</strong> kullanılabilir.
                            </div>
                            <div class='message'>
                                Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz. Hesabınız güvendedir.
                            </div>
                            <div class='security-note'>
                                <strong>Güvenlik İpucu:</strong> Asla şifrenizi kimseyle paylaşmayın. EDU Excellence ekibi asla e-posta ile şifrenizi sormaz.
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

            await SendEmailAsync(email, subject, emailBody, true);
        }

        public async Task SendPasswordChangedNotificationAsync(string email, string firstName)
        {
            var subject = "Şifreniz Değiştirildi - EDU Excellence";
            
            var emailBody = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; }}
                        .container {{ max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }}
                        .header {{ background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px; text-align: center; }}
                        .header h2 {{ margin: 0; font-size: 28px; }}
                        .content {{ padding: 40px; }}
                        .greeting {{ font-size: 18px; color: #374151; margin-bottom: 20px; }}
                        .message {{ color: #6b7280; line-height: 1.6; margin-bottom: 20px; }}
                        .success-box {{ background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 5px; color: #065f46; }}
                        .warning {{ background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 5px; color: #991b1b; }}
                        .footer {{ background-color: #f9fafb; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; }}
                        .timestamp {{ font-size: 12px; color: #9ca3af; margin-top: 20px; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h2>✅ Şifre Değişikliği Onayı</h2>
                        </div>
                        <div class='content'>
                            <div class='greeting'>Merhaba {firstName},</div>
                            <div class='success-box'>
                                ✓ Admin hesabınızın şifresi başarıyla değiştirildi.
                            </div>
                            <div class='message'>
                                Hesabınızın güvenliği için tüm aktif oturumlar sonlandırıldı. Yeni şifrenizle tekrar giriş yapabilirsiniz.
                            </div>
                            <div class='warning'>
                                ⚠️ <strong>Bu değişikliği siz yapmadıysanız:</strong><br/>
                                Lütfen derhal sistem yöneticisi ile iletişime geçin. Hesabınızın güvenliği tehlikede olabilir.
                            </div>
                            <div class='timestamp'>
                                Değişiklik Zamanı: {DateTime.UtcNow.ToString("dd.MM.yyyy HH:mm")} UTC
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

            await SendEmailAsync(email, subject, emailBody, true);
        }
    }
}




