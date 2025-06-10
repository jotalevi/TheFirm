using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TheFirmApi.Data;
using TheFirmApi.Dtos.Calendar;

namespace TheFirmApi.Controllers;

[ApiController]
[Route("calendar")]
public class CalendarController : ControllerBase
{
    private readonly AppDbContext _context;

    public CalendarController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCalendarEvents(
        [FromQuery] string? q = null,
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null,
        [FromQuery] bool? internal_ = null,
        [FromQuery] bool? external = null)
    {
        var query = _context.CalendarEvents
            .Include(ce => ce.Event)
            .ThenInclude(e => e.Company)
            .AsQueryable();

        // Apply search filter
        if (!string.IsNullOrEmpty(q))
        {
            query = query.Where(ce => 
                ce.Event.EventName.Contains(q) || 
                ce.Event.EventDescription.Contains(q) ||
                ce.Event.Company.CompanyName.Contains(q));
        }

        // Apply date filters
        if (from.HasValue)
        {
            query = query.Where(ce => ce.DateEnd >= from.Value);
        }
        
        if (to.HasValue)
        {
            query = query.Where(ce => ce.DateStart <= to.Value);
        }

        // Apply visibility filters
        if (internal_.HasValue && internal_.Value)
        {
            query = query.Where(ce => !ce.Event.Public);
        }
        
        if (external.HasValue && external.Value)
        {
            query = query.Where(ce => ce.Event.Public);
        }

        var events = await query.Select(ce => new CalendarEventDto
        {
            Id = ce.Id,
            InternalEventId = ce.InternalEventId,
            LogoIrid = ce.LogoIrid,
            DateStart = ce.DateStart,
            DateEnd = ce.DateEnd,
            EventName = ce.Event.EventName,
            EventDescription = ce.Event.EventDescription,
            CompanyName = ce.Event.Company.CompanyName
        }).ToListAsync();

        return Ok(events);
    }
} 