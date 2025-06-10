namespace TheFirmApi.Dtos.Calendar;

public class CalendarEventDto
{
    public int Id { get; set; }
    public int InternalEventId { get; set; }
    public string? LogoIrid { get; set; }
    public DateTime DateStart { get; set; }
    public DateTime DateEnd { get; set; }
    public string EventName { get; set; } = string.Empty;
    public string EventDescription { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
} 