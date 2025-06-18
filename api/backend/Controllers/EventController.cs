using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TheFirmApi.Data;
using TheFirmApi.Dtos.Event;
using TheFirmApi.Dtos.Ticket;
using TheFirmApi.Entities;

namespace TheFirmApi.Controllers;

[ApiController]
[Route("events")]
public class EventController : ControllerBase
{
    private readonly AppDbContext _context;

    public EventController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetEvents()
    {
        var events = await _context.Events
            .Include(e => e.Company)
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
                CompanyName = e.Company.CompanyName
            })
            .ToListAsync();

        return Ok(events);
    }

    [HttpGet("public")]
    public async Task<IActionResult> GetPublicEvents()
    {
        var events = await _context.Events
            .Include(e => e.Company)
            .Where(e => e.Public)
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
                CompanyName = e.Company.CompanyName
            })
            .ToListAsync();

        return Ok(events);
    }

    [HttpGet("{slug}")]
    [Authorize]
    public async Task<IActionResult> GetEvent(string slug)
    {
        var eventEntity = await _context.Events
            .Include(e => e.Company)
            .FirstOrDefaultAsync(e => e.Slug == slug);

        if (eventEntity == null)
            return NotFound();

        var eventDto = new EventDto
        {
            Id = eventEntity.Id,
            Slug = eventEntity.Slug,
            EventName = eventEntity.EventName,
            EventDescription = eventEntity.EventDescription,
            StartDate = eventEntity.StartDate,
            EndDate = eventEntity.EndDate,
            LogoIrid = eventEntity.LogoIrid,
            BannerIrid = eventEntity.BannerIrid,
            TemplateIrid = eventEntity.TemplateIrid,
            CssIrid = eventEntity.CssIrid,
            Public = eventEntity.Public,
            CompanyId = eventEntity.CompanyId,
            CompanyName = eventEntity.Company?.CompanyName ?? string.Empty
        };

        return Ok(eventDto);
    }

    [HttpGet("{slug}/tiers")]
    [Authorize]
    public async Task<IActionResult> GetEventTiers(string slug)
    {
        var eventEntity = await _context.Events
            .FirstOrDefaultAsync(e => e.Slug == slug);

        if (eventEntity == null)
            return NotFound();

        var tiers = await _context.TicketTiers
            .Where(t => t.EventId == eventEntity.Id)
            .Select(t => new TicketTierDto
            {
                Id = t.Id,
                TierName = t.TierName,
                BasePrice = t.BasePrice,
                EntryAllowedFrom = t.EntryAllowedFrom,
                EntryAllowedTo = t.EntryAllowedTo,
                SingleUse = t.SingleUse,
                SingleDaily = t.SingleDaily,
                TierPdfTemplateIrid = t.TierPdfTemplateIrid,
                TierMailTemplateIrid = t.TierMailTemplateIrid,
                StockInitial = t.StockInitial,
                StockCurrent = t.StockCurrent,
                StockSold = t.StockSold,
                EventId = t.EventId,
                EventName = eventEntity.EventName
            })
            .ToListAsync();

        return Ok(tiers);
    }

    [HttpGet("{slug}/tiers/{id}")]
    [Authorize]
    public async Task<IActionResult> GetEventTierDetail(string slug, int id)
    {
        var eventEntity = await _context.Events
            .FirstOrDefaultAsync(e => e.Slug == slug);

        if (eventEntity == null)
            return NotFound("Event not found");

        var tier = await _context.TicketTiers
            .FirstOrDefaultAsync(t => t.Id == id && t.EventId == eventEntity.Id);

        if (tier == null)
            return NotFound("Ticket tier not found");

        var tierDto = new TicketTierDto
        {
            Id = tier.Id,
            TierName = tier.TierName,
            BasePrice = tier.BasePrice,
            EntryAllowedFrom = tier.EntryAllowedFrom,
            EntryAllowedTo = tier.EntryAllowedTo,
            SingleUse = tier.SingleUse,
            SingleDaily = tier.SingleDaily,
            TierPdfTemplateIrid = tier.TierPdfTemplateIrid,
            TierMailTemplateIrid = tier.TierMailTemplateIrid,
            StockInitial = tier.StockInitial,
            StockCurrent = tier.StockCurrent,
            StockSold = tier.StockSold,
            EventId = tier.EventId,
            EventName = eventEntity.EventName
        };

        return Ok(tierDto);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateEvent(CreateEventDto dto)
    {
        // Verify company exists
        var company = await _context.Companies.FindAsync(dto.CompanyId);
        if (company == null)
            return BadRequest("Invalid company ID");

        // Create event
        var eventEntity = new EventEntity
        {
            Slug = dto.Slug,
            EventName = dto.EventName,
            EventDescription = dto.EventDescription,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            LogoIrid = dto.LogoIrid,
            BannerIrid = dto.BannerIrid,
            TemplateIrid = dto.TemplateIrid,
            CssIrid = dto.CssIrid,
            Public = dto.Public,
            CompanyId = dto.CompanyId
        };

        _context.Events.Add(eventEntity);
        await _context.SaveChangesAsync();

        // Create corresponding calendar event
        var calendarEvent = new CalendarEventEntity
        {
            InternalEventId = eventEntity.Id,
            LogoIrid = eventEntity.LogoIrid,
            DateStart = eventEntity.StartDate,
            DateEnd = eventEntity.EndDate
        };

        _context.CalendarEvents.Add(calendarEvent);
        await _context.SaveChangesAsync();

        var responseDto = new EventDto
        {
            Id = eventEntity.Id,
            Slug = eventEntity.Slug,
            EventName = eventEntity.EventName,
            EventDescription = eventEntity.EventDescription,
            StartDate = eventEntity.StartDate,
            EndDate = eventEntity.EndDate,
            LogoIrid = eventEntity.LogoIrid,
            BannerIrid = eventEntity.BannerIrid,
            TemplateIrid = eventEntity.TemplateIrid,
            CssIrid = eventEntity.CssIrid,
            Public = eventEntity.Public,
            CompanyId = eventEntity.CompanyId,
            CompanyName = company.CompanyName
        };

        return CreatedAtAction(nameof(GetEvent), new { slug = eventEntity.Slug }, responseDto);
    }

    [HttpPost("{slug}/tiers")]
    [Authorize]
    public async Task<IActionResult> CreateEventTier(string slug, CreateTicketTierDto dto)
    {
        var eventEntity = await _context.Events
            .FirstOrDefaultAsync(e => e.Slug == slug);

        if (eventEntity == null)
            return NotFound("Event not found");

        var tier = new TicketTierEntity
        {
            TierName = dto.TierName,
            BasePrice = dto.BasePrice,
            EntryAllowedFrom = dto.EntryAllowedFrom,
            EntryAllowedTo = dto.EntryAllowedTo,
            SingleUse = dto.SingleUse,
            SingleDaily = dto.SingleDaily,
            TierPdfTemplateIrid = dto.TierPdfTemplateIrid,
            TierMailTemplateIrid = dto.TierMailTemplateIrid,
            StockInitial = dto.StockInitial,
            StockCurrent = dto.StockInitial, // Initially, current stock equals initial stock
            StockSold = 0,
            EventId = eventEntity.Id
        };

        _context.TicketTiers.Add(tier);
        await _context.SaveChangesAsync();

        var tierDto = new TicketTierDto
        {
            Id = tier.Id,
            TierName = tier.TierName,
            BasePrice = tier.BasePrice,
            EntryAllowedFrom = tier.EntryAllowedFrom,
            EntryAllowedTo = tier.EntryAllowedTo,
            SingleUse = tier.SingleUse,
            SingleDaily = tier.SingleDaily,
            TierPdfTemplateIrid = tier.TierPdfTemplateIrid,
            TierMailTemplateIrid = tier.TierMailTemplateIrid,
            StockInitial = tier.StockInitial,
            StockCurrent = tier.StockCurrent,
            StockSold = tier.StockSold,
            EventId = tier.EventId,
            EventName = eventEntity.EventName
        };

        return CreatedAtAction(nameof(GetEventTierDetail), new { slug = slug, id = tier.Id }, tierDto);
    }

    [HttpPut("{slug}")]
    [Authorize]
    public async Task<IActionResult> UpdateEvent(string slug, UpdateEventDto dto)
    {
        var eventEntity = await _context.Events
            .FirstOrDefaultAsync(e => e.Slug == slug);

        if (eventEntity == null)
            return NotFound();

        // Update event properties
        eventEntity.EventName = dto.EventName;
        eventEntity.EventDescription = dto.EventDescription;
        eventEntity.StartDate = dto.StartDate;
        eventEntity.EndDate = dto.EndDate;
        eventEntity.LogoIrid = dto.LogoIrid;
        eventEntity.BannerIrid = dto.BannerIrid;
        eventEntity.TemplateIrid = dto.TemplateIrid;
        eventEntity.CssIrid = dto.CssIrid;
        eventEntity.Public = dto.Public;

        // Also update the calendar event
        var calendarEvent = await _context.CalendarEvents
            .FirstOrDefaultAsync(ce => ce.InternalEventId == eventEntity.Id);

        if (calendarEvent != null)
        {
            calendarEvent.LogoIrid = dto.LogoIrid;
            calendarEvent.DateStart = dto.StartDate;
            calendarEvent.DateEnd = dto.EndDate;
        }

        await _context.SaveChangesAsync();

        return Ok(new EventDto
        {
            Id = eventEntity.Id,
            Slug = eventEntity.Slug,
            EventName = eventEntity.EventName,
            EventDescription = eventEntity.EventDescription,
            StartDate = eventEntity.StartDate,
            EndDate = eventEntity.EndDate,
            LogoIrid = eventEntity.LogoIrid,
            BannerIrid = eventEntity.BannerIrid,
            TemplateIrid = eventEntity.TemplateIrid,
            CssIrid = eventEntity.CssIrid,
            Public = eventEntity.Public,
            CompanyId = eventEntity.CompanyId,
            CompanyName = eventEntity.Company?.CompanyName ?? string.Empty
        });
    }

    [HttpGet("all")]
    [Authorize]
    public async Task<IActionResult> GetAllEvents()
    {
        var events = await _context.Events
            .Include(e => e.Company)
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
                CompanyName = e.Company.CompanyName
            })
            .ToListAsync();

        return Ok(events);
    }

    [HttpDelete("{slug}")]
    [Authorize]
    public async Task<IActionResult> DeleteEvent(string slug)
    {
        var eventEntity = await _context.Events
            .FirstOrDefaultAsync(e => e.Slug == slug);

        if (eventEntity == null)
            return NotFound();

        _context.Events.Remove(eventEntity);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{slug}/tiers/{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateEventTier(string slug, int id, CreateTicketTierDto dto)
    {
        var eventEntity = await _context.Events
            .FirstOrDefaultAsync(e => e.Slug == slug);

        if (eventEntity == null)
            return NotFound("Event not found");

        var tier = await _context.TicketTiers
            .FirstOrDefaultAsync(t => t.Id == id && t.EventId == eventEntity.Id);

        if (tier == null)
            return NotFound("Ticket tier not found");

        // Update tier properties
        tier.TierName = dto.TierName;
        tier.BasePrice = dto.BasePrice;
        tier.EntryAllowedFrom = dto.EntryAllowedFrom;
        tier.EntryAllowedTo = dto.EntryAllowedTo;
        tier.SingleUse = dto.SingleUse;
        tier.SingleDaily = dto.SingleDaily;
        tier.TierPdfTemplateIrid = dto.TierPdfTemplateIrid;
        tier.TierMailTemplateIrid = dto.TierMailTemplateIrid;
        tier.StockInitial = dto.StockInitial;

        await _context.SaveChangesAsync();

        var tierDto = new TicketTierDto
        {
            Id = tier.Id,
            TierName = tier.TierName,
            BasePrice = tier.BasePrice,
            EntryAllowedFrom = tier.EntryAllowedFrom,
            EntryAllowedTo = tier.EntryAllowedTo,
            SingleUse = tier.SingleUse,
            SingleDaily = tier.SingleDaily,
            TierPdfTemplateIrid = tier.TierPdfTemplateIrid,
            TierMailTemplateIrid = tier.TierMailTemplateIrid,
            StockInitial = tier.StockInitial,
            StockCurrent = tier.StockCurrent,
            StockSold = tier.StockSold,
            EventId = tier.EventId,
            EventName = eventEntity.EventName
        };

        return Ok(tierDto);
    }

    [HttpDelete("{slug}/tiers/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteEventTier(string slug, int id)
    {
        var eventEntity = await _context.Events
            .FirstOrDefaultAsync(e => e.Slug == slug);

        if (eventEntity == null)
            return NotFound("Event not found");

        var tier = await _context.TicketTiers
            .FirstOrDefaultAsync(t => t.Id == id && t.EventId == eventEntity.Id);

        if (tier == null)
            return NotFound("Ticket tier not found");

        _context.TicketTiers.Remove(tier);
        await _context.SaveChangesAsync();

        return NoContent();
    }
} 