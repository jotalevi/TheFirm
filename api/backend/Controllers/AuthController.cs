using Microsoft.AspNetCore.Mvc;
using TheFirmApi.Data;
using TheFirmApi.Dtos.Auth;
using TheFirmApi.Entities;
using TheFirmApi.Services;
using BCrypt.Net;

namespace TheFirmApi.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwt;

    public AuthController(AppDbContext context, JwtService jwt)
    {
        _context = context;
        _jwt = jwt;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterUserDto dto)
    {
        try 
        {
            //if (await _context.Users.FindAsync(dto.Run) is not null)
            //    return Conflict("User already exists");

            var user = new UserEntity
            {
                Run = dto.Run,
                FirstNames = dto.FirstNames,
                LastNames = dto.LastNames,
                Email = dto.Email,
                Phone = dto.Phone,
                DirStates = dto.DirStates,
                DirCounty = dto.DirCounty,
                DirStreet1 = dto.DirStreet1,
                DirStreet2 = dto.DirStreet2,
                DirStNumber = dto.DirStNumber,
                DirInNumber = dto.DirInNumber,
                Notify = dto.Notify,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.PasswordHash)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error interno: {ex.Message}");
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _context.Users.FindAsync(dto.Run);
        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.PasswordHash, user.PasswordHash))
            return Unauthorized("Invalid credentials");

        var token = _jwt.GenerateToken(user.Run);
        return Ok(new { token });
    }
}
