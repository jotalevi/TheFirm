using System.ComponentModel.DataAnnotations;

namespace TheFirmApi.Dtos.Event;

public class CreateEventDto
{
    [Required]
    [StringLength(12)]
    public string Slug { get; set; } = string.Empty;
    
    [Required]
    [StringLength(128)]
    public string EventName { get; set; } = string.Empty;
    
    [Required]
    [StringLength(512)]
    public string EventDescription { get; set; } = string.Empty;
    
    [Required]
    public DateTime StartDate { get; set; }
    
    [Required]
    public DateTime EndDate { get; set; }
    
    public string? LogoIrid { get; set; }
    
    public string? BannerIrid { get; set; }
    
    public string? TemplateIrid { get; set; }
    
    public string? CssIrid { get; set; }
    
    [Required]
    public bool Public { get; set; }
    
    [Required]
    public int CompanyId { get; set; }
} 