using System.ComponentModel.DataAnnotations;

namespace TheFirmApi.Dtos.Analytics;

public class CreateEventDto
{
    [Required]
    public string SessionId { get; set; } = string.Empty;
    
    [Required]
    [StringLength(128)]
    public string EventName { get; set; } = string.Empty;
    
    [StringLength(2048)]
    public string Metadata { get; set; } = string.Empty;
} 