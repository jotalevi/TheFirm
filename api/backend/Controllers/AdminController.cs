using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TheFirmApi.Data;
using TheFirmApi.Dtos.User;
using TheFirmApi.Entities;

namespace TheFirmApi.Controllers;

[ApiController]
[Route("admin")]
[Authorize]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("company/{id}/user/{run}")]
    public async Task<IActionResult> AddModeratorToCompany(int id, string run)
    {
        // Verify company exists
        var company = await _context.Companies.FindAsync(id);
        if (company == null)
            return NotFound("Company not found");

        // Verify user exists
        var user = await _context.Users.FindAsync(run);
        if (user == null)
            return NotFound("User not found");

        // Check if user is already a moderator
        var existingMod = await _context.UserModCompanies
            .FirstOrDefaultAsync(umc => umc.CompanyId == id && umc.UserRun == run);

        if (existingMod != null)
            return BadRequest("User is already a moderator for this company");

        // Add user as moderator
        var userModCompany = new UserModCompanyEntity
        {
            UserRun = run,
            CompanyId = id
        };

        _context.UserModCompanies.Add(userModCompany);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "User added as moderator" });
    }

    [HttpPost("user/{run}")]
    public async Task<IActionResult> AddAdminRole(string run)
    {
        // Verificar que el usuario existe
        var user = await _context.Users.FindAsync(run);
        if (user == null)
            return NotFound("User not found");

        user.IsAdmin = true;
        await _context.SaveChangesAsync();

        return Ok(new { Message = "User is now admin" });
    }

    [HttpGet("company/{id}/users")]
    public async Task<IActionResult> ListCompanyModerators(int id)
    {
        // Verify company exists
        var company = await _context.Companies.FindAsync(id);
        if (company == null)
            return NotFound("Company not found");

        var moderators = await _context.UserModCompanies
            .Where(umc => umc.CompanyId == id)
            .Include(umc => umc.User)
            .Select(umc => new UserResponseDto
            {
                Run = umc.User.Run,
                FirstNames = umc.User.FirstNames,
                LastNames = umc.User.LastNames,
                Email = umc.User.Email,
                Phone = umc.User.Phone,
                DirStates = umc.User.DirStates,
                DirCounty = umc.User.DirCounty,
                DirStreet1 = umc.User.DirStreet1,
                DirStreet2 = umc.User.DirStreet2,
                DirStNumber = umc.User.DirStNumber,
                DirInNumber = umc.User.DirInNumber,
                Notify = umc.User.Notify,
                IsAdmin = umc.User.IsAdmin
            })
            .ToListAsync();

        return Ok(moderators);
    }

    [HttpGet("users")]
    public async Task<IActionResult> ListAdmins()
    {
        var admins = await _context.Users
            .Where(u => u.IsAdmin)
            .Select(user => new UserResponseDto
            {
                Run = user.Run,
                FirstNames = user.FirstNames,
                LastNames = user.LastNames,
                Email = user.Email,
                Phone = user.Phone,
                DirStates = user.DirStates,
                DirCounty = user.DirCounty,
                DirStreet1 = user.DirStreet1,
                DirStreet2 = user.DirStreet2,
                DirStNumber = user.DirStNumber,
                DirInNumber = user.DirInNumber,
                Notify = user.Notify,
                IsAdmin = user.IsAdmin
            })
            .ToListAsync();

        return Ok(admins);
    }
}