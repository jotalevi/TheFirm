using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TheFirmApi.Entities;

[Table("user_mod_company")]
public class UserModCompanyEntity
{
    [Column("user_run")]
    public string UserRun { get; set; } = string.Empty;
    
    [Column("company")]
    public int CompanyId { get; set; }
    
    // Relaciones
    [ForeignKey("UserRun")]
    public UserEntity? User { get; set; }
    
    [ForeignKey("CompanyId")]
    public CompanyEntity? Company { get; set; }
} 