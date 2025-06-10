using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TheFirmApi.Entities;

[Table("analytics_event")]
public class AnalyticsEventEntity
{
    [Key]
    [Column("id")]
    public int Id { get; set; }
    
    [Column("session_id")]
    public string SessionId { get; set; } = string.Empty;
    
    [Column("event_name")]
    public string EventName { get; set; } = string.Empty;
    
    [Column("metadata")]
    public string Metadata { get; set; } = string.Empty;
    
    [Column("occurred_at")]
    public DateTime OccurredAt { get; set; }
    
    // Relaciones
    [ForeignKey("SessionId")]
    public AnalyticsSessionEntity? Session { get; set; }
} 