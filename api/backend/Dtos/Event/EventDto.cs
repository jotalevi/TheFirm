namespace TheFirmApi.Dtos.Event;

public class EventDto
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string EventName { get; set; } = string.Empty;
    public string EventDescription { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string? LogoIrid { get; set; }
    public string? BannerIrid { get; set; }
    public string? TemplateIrid { get; set; }
    public string? CssIrid { get; set; }
    public bool Public { get; set; }
    public int CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
} 