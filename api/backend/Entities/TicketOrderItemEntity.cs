using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace TheFirmApi.Entities;

[Table("ticket_order_item")]
public class TicketOrderItemEntity
{
    [Key]
    [Column("id")]
    public int Id { get; set; }
    
    [Column("order_id")]
    public int OrderId { get; set; }
    
    [Column("tier_id")]
    public int TierId { get; set; }
    
    [Column("quantity")]
    public int Quantity { get; set; }
    
    [Column("price_per_ticket")]
    [Precision(18, 2)]
    public decimal PricePerTicket { get; set; }
    
    // Relaciones
    [ForeignKey("OrderId")]
    public TicketOrderEntity? Order { get; set; }
    
    [ForeignKey("TierId")]
    public TicketTierEntity? Tier { get; set; }
} 