using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TheFirmApi.Entities;

[Table("analytics_session")]
public class AnalyticsSessionEntity
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = string.Empty;
    
    [Column("user_run")]
    public string? UserRun { get; set; }
    
    [Column("started_at")]
    public DateTime StartedAt { get; set; }
    
    [Column("ended_at")]
    public DateTime? EndedAt { get; set; }
    
    [Column("ip_address")]
    public string IpAddress { get; set; } = string.Empty;
    
    [Column("user_agent")]
    public string UserAgent { get; set; } = string.Empty;
    
    // Relaciones
    [ForeignKey("UserRun")]
    public UserEntity? User { get; set; }
    
    public List<AnalyticsEventEntity> Events { get; set; } = new();
} 