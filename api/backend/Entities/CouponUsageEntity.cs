using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TheFirmApi.Entities;

[Table("coupon_usage")]
public class CouponUsageEntity
{
    [Key]
    [Column("id")]
    public int Id { get; set; }
    
    [Column("coupon_id")]
    public int CouponId { get; set; }
    
    [Column("ticket_order_id")]
    public int TicketOrderId { get; set; }
    
    [Column("ticket_id")]
    public int? TicketId { get; set; }
    
    [Column("used_at")]
    public DateTime UsedAt { get; set; }
    
    // Relaciones
    [ForeignKey("CouponId")]
    public CouponEntity? Coupon { get; set; }
    
    [ForeignKey("TicketOrderId")]
    public TicketOrderEntity? Order { get; set; }
} 