using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace TheFirmApi.Entities;

[Table("ticket_order")]
public class TicketOrderEntity
{
    [Key]
    [Column("id")]
    public int Id { get; set; }
    
    [Column("user_run")]
    public string UserRun { get; set; } = string.Empty;
    
    [Column("order_date")]
    public DateTime OrderDate { get; set; }
    
    [Column("total_amount")]
    [Precision(18, 2)]
    public decimal TotalAmount { get; set; }
    
    [Column("status")]
    public string Status { get; set; } = string.Empty;
    
    [Column("payment_method")]
    public string PaymentMethod { get; set; } = string.Empty;
    
    [Column("payment_reference")]
    public string? PaymentReference { get; set; }
    
    // Relaciones
    [ForeignKey("UserRun")]
    public UserEntity? User { get; set; }
    
    public List<TicketOrderItemEntity> Items { get; set; } = new();
    
    public List<CouponUsageEntity> CouponUsages { get; set; } = new();
} 