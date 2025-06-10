using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TheFirmApi.Data;
using TheFirmApi.Dtos.Analytics;
using TheFirmApi.Entities;

namespace TheFirmApi.Controllers;

[ApiController]
[Route("analytics")]
public class AnalyticsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AnalyticsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAnalyticsSessions()
    {
        var sessions = await _context.AnalyticsSessions
            .Include(s => s.User)
            .Include(s => s.Events)
            .Select(s => new AnalyticsSessionDto
            {
                Id = s.Id,
                UserRun = s.UserRun,
                UserName = s.User != null ? $"{s.User.FirstNames} {s.User.LastNames}" : null,
                StartedAt = s.StartedAt,
                EndedAt = s.EndedAt,
                IpAddress = s.IpAddress,
                UserAgent = s.UserAgent,
                EventCount = s.Events.Count
            })
            .ToListAsync();

        return Ok(sessions);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetAnalyticsSessionDetails(string id)
    {
        var session = await _context.AnalyticsSessions
            .Include(s => s.User)
            .Include(s => s.Events)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (session == null)
            return NotFound();

        var sessionDto = new AnalyticsSessionDto
        {
            Id = session.Id,
            UserRun = session.UserRun,
            UserName = session.User != null ? $"{session.User.FirstNames} {session.User.LastNames}" : null,
            StartedAt = session.StartedAt,
            EndedAt = session.EndedAt,
            IpAddress = session.IpAddress,
            UserAgent = session.UserAgent,
            EventCount = session.Events.Count
        };

        var events = await _context.AnalyticsEvents
            .Where(e => e.SessionId == id)
            .Select(e => new AnalyticsEventDto
            {
                Id = e.Id,
                SessionId = e.SessionId,
                EventName = e.EventName,
                Metadata = e.Metadata,
                OccurredAt = e.OccurredAt
            })
            .ToListAsync();

        return Ok(new { Session = sessionDto, Events = events });
    }

    [HttpPost("session")]
    public async Task<IActionResult> StartSession(CreateSessionDto dto)
    {
        // Validate user if provided
        if (!string.IsNullOrEmpty(dto.UserRun))
        {
            var user = await _context.Users.FindAsync(dto.UserRun);
            if (user == null)
                return BadRequest("Invalid user");
        }

        var session = new AnalyticsSessionEntity
        {
            Id = Guid.NewGuid().ToString(),
            UserRun = dto.UserRun,
            StartedAt = DateTime.UtcNow,
            EndedAt = null,
            IpAddress = dto.IpAddress,
            UserAgent = dto.UserAgent
        };

        _context.AnalyticsSessions.Add(session);
        await _context.SaveChangesAsync();

        return Ok(new { SessionId = session.Id });
    }

    [HttpPost("event")]
    public async Task<IActionResult> SendEvent(CreateEventDto dto)
    {
        var session = await _context.AnalyticsSessions.FindAsync(dto.SessionId);
        if (session == null)
            return BadRequest("Invalid session ID");

        var analyticsEvent = new AnalyticsEventEntity
        {
            SessionId = dto.SessionId,
            EventName = dto.EventName,
            Metadata = dto.Metadata,
            OccurredAt = DateTime.UtcNow
        };

        _context.AnalyticsEvents.Add(analyticsEvent);

        // Update session end time
        session.EndedAt = DateTime.UtcNow;
        _context.AnalyticsSessions.Update(session);

        await _context.SaveChangesAsync();

        return Ok(new { EventId = analyticsEvent.Id });
    }
} 