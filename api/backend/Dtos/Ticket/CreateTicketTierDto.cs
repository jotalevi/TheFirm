using System.ComponentModel.DataAnnotations;

namespace TheFirmApi.Dtos.Ticket;

public class CreateTicketTierDto
{
    [Required]
    [StringLength(128)]
    public string TierName { get; set; } = string.Empty;
    
    [Required]
    [Range(0, double.MaxValue)]
    public decimal BasePrice { get; set; }
    
    public DateTime? EntryAllowedFrom { get; set; }
    
    public DateTime? EntryAllowedTo { get; set; }
    
    [Required]
    public bool SingleUse { get; set; }
    
    [Required]
    public bool SingleDaily { get; set; }
    
    public string? TierPdfTemplateIrid { get; set; }
    
    public string? TierMailTemplateIrid { get; set; }
    
    [Required]
    [Range(0, int.MaxValue)]
    public int StockInitial { get; set; }
} 