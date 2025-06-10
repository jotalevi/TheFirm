using System.ComponentModel.DataAnnotations;

namespace TheFirmApi.Dtos.Company;

public class CreateCompanyDto
{
    [Required]
    public string CompanyName { get; set; } = string.Empty;
    
    [Required]
    public string CompanyRun { get; set; } = string.Empty;
    
    public string? LogoIrid { get; set; }
    
    public string? BannerIrid { get; set; }
    
    public string? HtmlIrid { get; set; }
    
    [Required]
    public string ContactRut { get; set; } = string.Empty;
    
    [Required]
    public string ContactName { get; set; } = string.Empty;
    
    [Required]
    public string ContactSurname { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    public string ContactEmail { get; set; } = string.Empty;
    
    [Required]
    [Phone]
    public string ContactPhone { get; set; } = string.Empty;
    
    public int? ContactDirStates { get; set; }
    
    public int? ContactDirCounty { get; set; }
    
    [Required]
    public string ContactDirStreet1 { get; set; } = string.Empty;
    
    public string? ContactDirStreet2 { get; set; }
    
    [Required]
    public string ContactDirStNumber { get; set; } = string.Empty;
    
    public string? ContactDirInNumber { get; set; }
} 