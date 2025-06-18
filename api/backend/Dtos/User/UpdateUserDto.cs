namespace TheFirmApi.Dtos.User;

public class UpdateUserDto
{
    required public string FirstNames { get; set; }
    required public string LastNames { get; set; }
    required public string Email { get; set; }
    required public string Phone { get; set; }
    public int? DirStates { get; set; }
    public int? DirCounty { get; set; }
    required public string DirStreet1 { get; set; }
    required public string DirStreet2 { get; set; }
    required public string DirStNumber { get; set; }
    required public string DirInNumber { get; set; }
    required public bool Notify { get; set; }
    required public bool IsAdmin { get; set; }
}
