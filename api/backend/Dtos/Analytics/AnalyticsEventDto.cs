namespace TheFirmApi.Dtos.Analytics;

public class AnalyticsEventDto
{
    public int Id { get; set; }
    public string SessionId { get; set; } = string.Empty;
    public string EventName { get; set; } = string.Empty;
    public string Metadata { get; set; } = string.Empty;
    public DateTime OccurredAt { get; set; }
} 