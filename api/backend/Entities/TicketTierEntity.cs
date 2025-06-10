using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace TheFirmApi.Entities;

[Table("ticket_tier")]
public class TicketTierEntity
{
    [Key]
    [Column("id")]
    public int Id { get; set; }
    
    [Column("tier_name")]
    public string TierName { get; set; } = string.Empty;
    
    [Column("base_price")]
    [Precision(18, 2)]
    public decimal BasePrice { get; set; }
    
    [Column("entry_allowed_from")]
    public DateTime? EntryAllowedFrom { get; set; }
    
    [Column("entry_allowed_to")]
    public DateTime? EntryAllowedTo { get; set; }
    
    [Column("single_use")]
    public bool SingleUse { get; set; }
    
    [Column("single_daily")]
    public bool SingleDaily { get; set; }
    
    [Column("tier_pdf_template_irid")]
    public string? TierPdfTemplateIrid { get; set; }
    
    [Column("tier_mail_template_irid")]
    public string? TierMailTemplateIrid { get; set; }
    
    [Column("stock_initial")]
    public int StockInitial { get; set; }
    
    [Column("stock_current")]
    public int StockCurrent { get; set; }
    
    [Column("stock_sold")]
    public int StockSold { get; set; }
    
    [Column("event")]
    public int EventId { get; set; }
    
    // Relaciones
    [ForeignKey("EventId")]
    public EventEntity? Event { get; set; }
    
    public List<TicketBoughtEntity> TicketsBought { get; set; } = new();
    
    public List<TicketOrderItemEntity> OrderItems { get; set; } = new();
} 