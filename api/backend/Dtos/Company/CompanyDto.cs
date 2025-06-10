namespace TheFirmApi.Dtos.Company;

public class CompanyDto
{
    public int Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string CompanyRun { get; set; } = string.Empty;
    public string? LogoIrid { get; set; }
    public string? BannerIrid { get; set; }
    public string? HtmlIrid { get; set; }
    public string ContactRut { get; set; } = string.Empty;
    public string ContactName { get; set; } = string.Empty;
    public string ContactSurname { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public int? ContactDirStates { get; set; }
    public int? ContactDirCounty { get; set; }
    public string ContactDirStreet1 { get; set; } = string.Empty;
    public string? ContactDirStreet2 { get; set; }
    public string ContactDirStNumber { get; set; } = string.Empty;
    public string? ContactDirInNumber { get; set; }
} 