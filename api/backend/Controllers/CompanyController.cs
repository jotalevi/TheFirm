using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TheFirmApi.Data;
using TheFirmApi.Dtos.Company;
using TheFirmApi.Dtos.Event;
using TheFirmApi.Entities;
using System.Security.Claims;

namespace TheFirmApi.Controllers;

[ApiController]
[Route("companies")]
public class CompanyController : ControllerBase
{
    private readonly AppDbContext _context;

    public CompanyController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetCompanies()
    {
        // Get the current user's RUN from the JWT token
        var userRun = User.FindFirst(ClaimTypes.Name)?.Value;
        if (string.IsNullOrEmpty(userRun))
            return Unauthorized("User not authenticated");

        // Get the current user to check if they are admin
        var currentUser = await _context.Users.FindAsync(userRun);
        if (currentUser == null)
            return Unauthorized("User not found");

        IQueryable<CompanyEntity> companiesQuery;

        if (currentUser.IsAdmin)
        {
            // Admin can see all companies
            companiesQuery = _context.Companies;
        }
        else
        {
            // Moderators: only companies they moderate
            var moderatedCompanyIds = await _context.UserModCompanies
                .Where(umc => umc.UserRun == userRun)
                .Select(umc => umc.CompanyId)
                .ToListAsync();

            if (moderatedCompanyIds.Count == 0)
            {
                // Regular user, not moderator of any company
                return Ok(new List<CompanyDto>());
            }

            companiesQuery = _context.Companies
                .Where(c => moderatedCompanyIds.Contains(c.Id));
        }

        var companies = await companiesQuery
            .Select(c => new CompanyDto
            {
                Id = c.Id,
                CompanyName = c.CompanyName,
                CompanyRun = c.CompanyRun,
                LogoIrid = c.LogoIrid,
                BannerIrid = c.BannerIrid,
                HtmlIrid = c.HtmlIrid,
                ContactRut = c.ContactRut,
                ContactName = c.ContactName,
                ContactSurname = c.ContactSurname,
                ContactEmail = c.ContactEmail,
                ContactPhone = c.ContactPhone,
                ContactDirStates = c.ContactDirStates,
                ContactDirCounty = c.ContactDirCounty,
                ContactDirStreet1 = c.ContactDirStreet1,
                ContactDirStreet2 = c.ContactDirStreet2,
                ContactDirStNumber = c.ContactDirStNumber,
                ContactDirInNumber = c.ContactDirInNumber
            })
            .ToListAsync();

        return Ok(companies);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetCompany(int id)
    {
        var company = await _context.Companies.FindAsync(id);
        if (company == null)
            return NotFound();

        var companyDto = new CompanyDto
        {
            Id = company.Id,
            CompanyName = company.CompanyName,
            CompanyRun = company.CompanyRun,
            LogoIrid = company.LogoIrid,
            BannerIrid = company.BannerIrid,
            HtmlIrid = company.HtmlIrid,
            ContactRut = company.ContactRut,
            ContactName = company.ContactName,
            ContactSurname = company.ContactSurname,
            ContactEmail = company.ContactEmail,
            ContactPhone = company.ContactPhone,
            ContactDirStates = company.ContactDirStates,
            ContactDirCounty = company.ContactDirCounty,
            ContactDirStreet1 = company.ContactDirStreet1,
            ContactDirStreet2 = company.ContactDirStreet2,
            ContactDirStNumber = company.ContactDirStNumber,
            ContactDirInNumber = company.ContactDirInNumber
        };

        return Ok(companyDto);
    }

    [HttpGet("{id}/events")]
    [Authorize]
    public async Task<IActionResult> GetCompanyEvents(int id)
    {
        var company = await _context.Companies.FindAsync(id);
        if (company == null)
            return NotFound();

        var events = await _context.Events
            .Where(e => e.CompanyId == id)
            .Select(e => new EventDto
            {
                Id = e.Id,
                Slug = e.Slug,
                EventName = e.EventName,
                EventDescription = e.EventDescription,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                LogoIrid = e.LogoIrid,
                BannerIrid = e.BannerIrid,
                TemplateIrid = e.TemplateIrid,
                CssIrid = e.CssIrid,
                Public = e.Public,
                CompanyId = e.CompanyId,
                CompanyName = company.CompanyName
            })
            .ToListAsync();

        return Ok(events);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateCompany(CreateCompanyDto dto)
    {
        var company = new CompanyEntity
        {
            CompanyName = dto.CompanyName,
            CompanyRun = dto.CompanyRun,
            LogoIrid = dto.LogoIrid,
            BannerIrid = dto.BannerIrid,
            HtmlIrid = dto.HtmlIrid,
            ContactRut = dto.ContactRut,
            ContactName = dto.ContactName,
            ContactSurname = dto.ContactSurname,
            ContactEmail = dto.ContactEmail,
            ContactPhone = dto.ContactPhone,
            ContactDirStates = dto.ContactDirStates,
            ContactDirCounty = dto.ContactDirCounty,
            ContactDirStreet1 = dto.ContactDirStreet1,
            ContactDirStreet2 = dto.ContactDirStreet2,
            ContactDirStNumber = dto.ContactDirStNumber,
            ContactDirInNumber = dto.ContactDirInNumber
        };

        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        var responseDto = new CompanyDto
        {
            Id = company.Id,
            CompanyName = company.CompanyName,
            CompanyRun = company.CompanyRun,
            LogoIrid = company.LogoIrid,
            BannerIrid = company.BannerIrid,
            HtmlIrid = company.HtmlIrid,
            ContactRut = company.ContactRut,
            ContactName = company.ContactName,
            ContactSurname = company.ContactSurname,
            ContactEmail = company.ContactEmail,
            ContactPhone = company.ContactPhone,
            ContactDirStates = company.ContactDirStates,
            ContactDirCounty = company.ContactDirCounty,
            ContactDirStreet1 = company.ContactDirStreet1,
            ContactDirStreet2 = company.ContactDirStreet2,
            ContactDirStNumber = company.ContactDirStNumber,
            ContactDirInNumber = company.ContactDirInNumber
        };

        return CreatedAtAction(nameof(GetCompany), new { id = company.Id }, responseDto);
    }
} 