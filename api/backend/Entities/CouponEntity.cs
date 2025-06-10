using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace TheFirmApi.Entities;

[Table("coupon")]
public class CouponEntity
{
    [Key]
    [Column("id")]
    public int Id { get; set; }
    
    [Column("code")]
    public string Code { get; set; } = string.Empty;
    
    [Column("description")]
    public string Description { get; set; } = string.Empty;
    
    [Column("discount_type")]
    public string DiscountType { get; set; } = string.Empty; // percentage, fixed
    
    [Column("discount_value")]
    [Precision(18, 2)]
    public decimal DiscountValue { get; set; }
    
    [Column("usage_limit")]
    public int UsageLimit { get; set; }
    
    [Column("usage_count")]
    public int UsageCount { get; set; }
    
    [Column("valid_from")]
    public DateTime ValidFrom { get; set; }
    
    [Column("valid_to")]
    public DateTime ValidTo { get; set; }
    
    [Column("event_id")]
    public int? EventId { get; set; }
    
    [Column("active")]
    public bool Active { get; set; }
    
    // Relaciones
    [ForeignKey("EventId")]
    public EventEntity? Event { get; set; }
    
    public List<CouponUsageEntity> Usages { get; set; } = new();
} 