using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TheFirmApi.Data;
using TheFirmApi.Dtos.Ticket;
using System.Security.Cryptography;
using System.Text;

namespace TheFirmApi.Controllers;

[ApiController]
[Route("validate")]
[Authorize]
public class ValidateController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public ValidateController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("qr")]
    public async Task<IActionResult> ValidateQrCode(
        [FromQuery] string key, 
        [FromQuery] string secret)
    {
        // In a real app, the secret would be a hash that we'd verify against our data
        // Here we'll simulate validating a ticket using the key as a user run and the secret as verification
        if (string.IsNullOrEmpty(key) || string.IsNullOrEmpty(secret))
            return BadRequest("Key and secret are required");

        // Parse key as user run and tier id
        var parts = key.Split('-');
        if (parts.Length != 2 || !int.TryParse(parts[1], out int tierId))
            return BadRequest("Invalid key format");

        string userRun = parts[0];

        // Get the ticket
        var ticket = await _context.TicketsBought
            .Include(t => t.User)
            .Include(t => t.Tier)
            .ThenInclude(tier => tier.Event)
            .FirstOrDefaultAsync(t => t.UserRun == userRun && t.TierId == tierId);

        if (ticket == null)
            return NotFound("Ticket not found");

        // Verify secret by generating a hash of ticket info
        string ticketData = $"{ticket.UserRun}-{ticket.TierId}-{ticket.BoughtAt.Ticks}";
        string expectedSecret = GenerateHash(ticketData, _config["Jwt:Key"]);
        
        if (secret != expectedSecret)
            return Unauthorized("Invalid ticket verification");

        // Check ticket status
        if (ticket.TicketStatus != "valid")
            return BadRequest($"Ticket is not valid. Status: {ticket.TicketStatus}");

        // If ticket is single use, mark as used
        if (ticket.Tier.SingleUse)
        {
            ticket.TicketStatus = "used";
            await _context.SaveChangesAsync();
        }
        else if (ticket.Tier.SingleDaily)
        {
            // For single daily, we could mark it with a timestamp of when it was used today
            // For simplicity, we'll leave it as valid
        }

        // Return ticket info
        var ticketDto = new TicketDto
        {
            UserRun = ticket.UserRun,
            UserName = $"{ticket.User.FirstNames} {ticket.User.LastNames}",
            TierId = ticket.TierId,
            TierName = ticket.Tier.TierName,
            BoughtAt = ticket.BoughtAt,
            TicketStatus = ticket.TicketStatus,
            EventId = ticket.Tier.EventId,
            EventName = ticket.Tier.Event.EventName,
            EventDate = ticket.Tier.Event.StartDate
        };

        return Ok(new 
        { 
            Ticket = ticketDto,
            IsValid = true,
            Message = ticket.Tier.SingleUse ? "Ticket validated and marked as used" : "Ticket validated"
        });
    }

    private string GenerateHash(string data, string salt)
    {
        // In a real app, use a proper cryptographic hash function
        using (var sha256 = SHA256.Create())
        {
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(data + salt));
            return Convert.ToBase64String(bytes).Replace("/", "_").Replace("+", "-").Substring(0, 20);
        }
    }
} 