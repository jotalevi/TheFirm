namespace TheFirmApi.Dtos.User;

public class UserResponseDto
{
    public string Run { get; set; } = string.Empty;
    public string FirstNames { get; set; } = string.Empty;
    public string LastNames { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public int? DirStates { get; set; }
    public int? DirCounty { get; set; }
    public string DirStreet1 { get; set; } = string.Empty;
    public string? DirStreet2 { get; set; }
    public string DirStNumber { get; set; } = string.Empty;
    public string? DirInNumber { get; set; }
    public bool Notify { get; set; }
} 