using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TheFirmApi.Entities;

[Table("company")]
public class CompanyEntity
{
    [Key]
    [Column("id")]
    public int Id { get; set; }
    
    [Column("company_name")]
    public string CompanyName { get; set; } = string.Empty;
    
    [Column("company_run")]
    public string CompanyRun { get; set; } = string.Empty;
    
    [Column("logo_irid")]
    public string? LogoIrid { get; set; }
    
    [Column("banner_irid")]
    public string? BannerIrid { get; set; }
    
    [Column("html_irid")]
    public string? HtmlIrid { get; set; }
    
    [Column("contact_rut")]
    public string ContactRut { get; set; } = string.Empty;
    
    [Column("contact_name")]
    public string ContactName { get; set; } = string.Empty;
    
    [Column("contact_surname")]
    public string ContactSurname { get; set; } = string.Empty;
    
    [Column("contact_email")]
    public string ContactEmail { get; set; } = string.Empty;
    
    [Column("contact_phone")]
    public string ContactPhone { get; set; } = string.Empty;
    
    [Column("contact_dir_states")]
    public int? ContactDirStates { get; set; }
    
    [Column("contact_dir_county")]
    public int? ContactDirCounty { get; set; }
    
    [Column("contact_dir_street_1")]
    public string ContactDirStreet1 { get; set; } = string.Empty;
    
    [Column("contact_dir_street_2")]
    public string? ContactDirStreet2 { get; set; }
    
    [Column("contact_dir_st_number")]
    public string ContactDirStNumber { get; set; } = string.Empty;
    
    [Column("contact_dir_in_number")]
    public string? ContactDirInNumber { get; set; }
    
    // Relaciones
    public List<EventEntity> Events { get; set; } = new();
    public List<UserModCompanyEntity> Moderators { get; set; } = new();
} 