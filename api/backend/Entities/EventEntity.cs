using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TheFirmApi.Entities;

[Table("event")]
public class EventEntity
{
    [Key]
    [Column("id")]
    public int Id { get; set; }
    
    [Column("slug")]
    public string Slug { get; set; } = string.Empty;
    
    [Column("event_name")]
    public string EventName { get; set; } = string.Empty;
    
    [Column("event_description")]
    public string EventDescription { get; set; } = string.Empty;
    
    [Column("start_date")]
    public DateTime StartDate { get; set; }
    
    [Column("end_date")]
    public DateTime EndDate { get; set; }
    
    [Column("logo_irid")]
    public string? LogoIrid { get; set; }
    
    [Column("banner_irid")]
    public string? BannerIrid { get; set; }
    
    [Column("template_irid")]
    public string? TemplateIrid { get; set; }
    
    [Column("css_irid")]
    public string? CssIrid { get; set; }
    
    [Column("public")]
    public bool Public { get; set; }
    
    [Column("company")]
    public int CompanyId { get; set; }
    
    // Relaciones
    [ForeignKey("CompanyId")]
    public CompanyEntity? Company { get; set; }
    
    public CalendarEventEntity? CalendarEvent { get; set; }
    
    public List<TicketTierEntity> TicketTiers { get; set; } = new();
    
    public List<CouponEntity> Coupons { get; set; } = new();
} 