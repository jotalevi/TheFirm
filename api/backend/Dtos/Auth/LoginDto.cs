namespace TheFirmApi.Dtos.Auth;
    public class LoginDto
    {
    required public string Run { get; set; } = string.Empty;
    required public string PasswordHash { get; set; } = string.Empty;
    }
