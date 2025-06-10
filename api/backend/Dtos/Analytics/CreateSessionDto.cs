namespace TheFirmApi.Dtos.Analytics;

public class CreateSessionDto
{
    public string? UserRun { get; set; }
    public string IpAddress { get; set; } = string.Empty;
    public string UserAgent { get; set; } = string.Empty;
} 