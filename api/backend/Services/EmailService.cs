using System.Net;
using System.Net.Mail;

namespace TheFirmApi.Services;

public class EmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = true)
    {
        try
        {
            var emailSettings = _config.GetSection("EmailSettings");
            var host = emailSettings["Host"] ?? "smtp.gmail.com";
            var port = int.Parse(emailSettings["Port"] ?? "587");
            var username = emailSettings["Username"];
            var password = emailSettings["Password"];
            var enableSsl = bool.Parse(emailSettings["EnableSsl"] ?? "true");
            var from = emailSettings["From"] ?? "noreply@thefirm.com";
            var fromName = emailSettings["FromName"] ?? "TheFirm";

            // Check if email credentials are properly configured
            if (string.IsNullOrEmpty(username) || username == "REPLACE_WITH_ACTUAL_EMAIL" ||
                string.IsNullOrEmpty(password) || password == "REPLACE_WITH_ACTUAL_APP_PASSWORD")
            {
                _logger.LogWarning("Email service is not properly configured. Email will not be sent.");
                return; // Silently return without sending in development/testing
            }

            using var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = enableSsl
            };

            var message = new MailMessage
            {
                From = new MailAddress(from, fromName),
                Subject = subject,
                Body = body,
                IsBodyHtml = isHtml
            };

            message.To.Add(to);

            await client.SendMailAsync(message);
            _logger.LogInformation($"Email sent successfully to {to}");
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error sending email: {ex.Message}");
            // Don't throw in production, but log the error
            if (_config.GetValue<string>("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                throw;
            }
        }
    }

    public async Task SendTicketConfirmationAsync(string to, string userName, string eventName, string ticketTierName, DateTime eventDate)
    {
        var subject = $"Your Ticket for {eventName}";
        var body = $@"
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #4CAF50; color: white; padding: 10px; text-align: center; }}
                    .content {{ padding: 20px; }}
                    .footer {{ background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h2>Ticket Confirmation</h2>
                    </div>
                    <div class='content'>
                        <p>Hello {userName},</p>
                        <p>Thank you for your purchase! Your ticket for <strong>{eventName}</strong> has been confirmed.</p>
                        <p>Ticket details:</p>
                        <ul>
                            <li>Event: {eventName}</li>
                            <li>Ticket Type: {ticketTierName}</li>
                            <li>Date: {eventDate.ToString("dddd, dd MMMM yyyy")}</li>
                            <li>Time: {eventDate.ToString("hh:mm tt")}</li>
                        </ul>
                        <p>Please keep this email as your receipt. You will receive your ticket closer to the event date.</p>
                        <p>We look forward to seeing you at the event!</p>
                        <p>Best regards,<br>The Firm Team</p>
                    </div>
                    <div class='footer'>
                        <p>© {DateTime.Now.Year} TheFirm. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        ";

        await SendEmailAsync(to, subject, body);
    }
} 