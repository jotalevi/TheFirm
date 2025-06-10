namespace TheFirmApi.Dtos.Ticket;

public class TicketTierDto
{
    public int Id { get; set; }
    public string TierName { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public DateTime? EntryAllowedFrom { get; set; }
    public DateTime? EntryAllowedTo { get; set; }
    public bool SingleUse { get; set; }
    public bool SingleDaily { get; set; }
    public string? TierPdfTemplateIrid { get; set; }
    public string? TierMailTemplateIrid { get; set; }
    public int StockInitial { get; set; }
    public int StockCurrent { get; set; }
    public int StockSold { get; set; }
    public int EventId { get; set; }
    public string EventName { get; set; } = string.Empty;
} 