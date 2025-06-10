using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TheFirmApi.Entities;

[Table("calendar_event")]
public class CalendarEventEntity
{
    [Key]
    [Column("id")]
    public int Id { get; set; }
    
    [Column("internal_event_id")]
    public int InternalEventId { get; set; }
    
    [Column("logo_irid")]
    public string? LogoIrid { get; set; }
    
    [Column("date_start")]
    public DateTime DateStart { get; set; }
    
    [Column("date_end")]
    public DateTime DateEnd { get; set; }
    
    // Relación
    [ForeignKey("InternalEventId")]
    public EventEntity? Event { get; set; }
} 