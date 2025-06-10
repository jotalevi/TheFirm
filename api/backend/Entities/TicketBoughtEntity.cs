using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TheFirmApi.Entities;

[Table("ticket_bought")]
public class TicketBoughtEntity
{
    [Column("user_run")]
    public string UserRun { get; set; } = string.Empty;
    
    [Column("tier_id")]
    public int TierId { get; set; }
    
    [Column("bought_at")]
    public DateTime BoughtAt { get; set; }
    
    [Column("ticket_status")]
    public string TicketStatus { get; set; } = string.Empty;
    
    // Relaciones
    [ForeignKey("UserRun")]
    public UserEntity? User { get; set; }
    
    [ForeignKey("TierId")]
    public TicketTierEntity? Tier { get; set; }
} 