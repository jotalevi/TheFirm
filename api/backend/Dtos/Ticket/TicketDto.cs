namespace TheFirmApi.Dtos.Ticket;

public class TicketDto
{
    public string UserRun { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty; // FirstNames + LastNames
    public int TierId { get; set; }
    public string TierName { get; set; } = string.Empty;
    public DateTime BoughtAt { get; set; }
    public string TicketStatus { get; set; } = string.Empty;
    public int EventId { get; set; }
    public string EventName { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
} 