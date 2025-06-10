namespace TheFirmApi.Dtos.Analytics;

public class AnalyticsSessionDto
{
    public string Id { get; set; } = string.Empty;
    public string? UserRun { get; set; }
    public string? UserName { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public string IpAddress { get; set; } = string.Empty;
    public string UserAgent { get; set; } = string.Empty;
    public int EventCount { get; set; }
} 