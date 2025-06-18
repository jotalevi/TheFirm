using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TheFirmApi.Entities;

[Table("user")]
public class UserEntity
{
    [Key]
    [Column("run")]
    public string Run { get; set; } = string.Empty;
    
    [Column("first_names")]
    public string FirstNames { get; set; } = string.Empty;
    
    [Column("last_names")]
    public string LastNames { get; set; } = string.Empty;
    
    [Column("email")]
    public string Email { get; set; } = string.Empty;
    
    [Column("phone")]
    public string Phone { get; set; } = string.Empty;
    
    [Column("dir_states")]
    public int? DirStates { get; set; }
    
    [Column("dir_county")]
    public int? DirCounty { get; set; }
    
    [Column("dir_street_1")]
    public string DirStreet1 { get; set; } = string.Empty;
    
    [Column("dir_street_2")]
    public string? DirStreet2 { get; set; } = string.Empty;
    
    [Column("dir_st_number")]
    public string DirStNumber { get; set; } = string.Empty;
    
    [Column("dir_in_number")]
    public string? DirInNumber { get; set; } = string.Empty;
    
    [Column("notify")]
    public bool Notify { get; set; }
    
    [Column("password_hash")]
    public string PasswordHash { get; set; } = string.Empty;

    [Column("is_admin")]
    public bool IsAdmin { get; set; } = false;

    // Relaciones
    public List<TicketBoughtEntity> Tickets { get; set; } = new();
    public List<TicketOrderEntity> Orders { get; set; } = new();
    public List<AnalyticsSessionEntity> AnalyticsSessions { get; set; } = new();
    public List<UserModCompanyEntity> ModeratedCompanies { get; set; } = new();
}
