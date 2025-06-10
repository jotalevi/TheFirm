using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TheFirmApi.Data;
using TheFirmApi.Dtos.Order;
using TheFirmApi.Dtos.Ticket;
using TheFirmApi.Dtos.User;

namespace TheFirmApi.Controllers;

    [ApiController]
    [Route("users")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUsers([FromQuery] string? q = null)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(q))
            {
                query = query.Where(u => 
                    u.Run.Contains(q) || 
                    u.FirstNames.Contains(q) || 
                    u.LastNames.Contains(q) || 
                    u.Email.Contains(q) ||
                    u.Phone.Contains(q));
            }

            var users = await query
                .Select(u => new UserResponseDto
                {
                    Run = u.Run,
                    FirstNames = u.FirstNames,
                    LastNames = u.LastNames,
                    Email = u.Email,
                    Phone = u.Phone,
                    DirStates = u.DirStates,
                    DirCounty = u.DirCounty,
                    DirStreet1 = u.DirStreet1,
                    DirStreet2 = u.DirStreet2,
                    DirStNumber = u.DirStNumber,
                    DirInNumber = u.DirInNumber,
                    Notify = u.Notify
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("{run}")]
        [Authorize]
        public async Task<IActionResult> GetUser(string run)
        {
            var user = await _context.Users.FindAsync(run);
            if (user is null) 
                return NotFound();

            var userDto = new UserResponseDto
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
                Notify = user.Notify
            };

            return Ok(userDto);
        }

        [HttpPut("{run}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(string run, UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(run);
            if (user is null) 
                return NotFound();

            user.FirstNames = dto.FirstNames;
            user.LastNames = dto.LastNames;
            user.Email = dto.Email;
            user.Phone = dto.Phone;
            user.DirStates = dto.DirStates;
            user.DirCounty = dto.DirCounty;
            user.DirStreet1 = dto.DirStreet1;
            user.DirStreet2 = dto.DirStreet2;
            user.DirStNumber = dto.DirStNumber;
            user.DirInNumber = dto.DirInNumber;
            user.Notify = dto.Notify;

            await _context.SaveChangesAsync();
            
            var userDto = new UserResponseDto
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
                Notify = user.Notify
            };

            return Ok(userDto);
        }

        [HttpGet("{run}/orders")]
        [Authorize]
        public async Task<IActionResult> GetUserOrders(string run)
        {
            var user = await _context.Users.FindAsync(run);
            if (user is null) 
                return NotFound("User not found");

            var orders = await _context.TicketOrders
                .Where(o => o.UserRun == run)
                .Include(o => o.Items)
                .ThenInclude(i => i.Tier)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    UserRun = o.UserRun,
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    PaymentMethod = o.PaymentMethod,
                    PaymentReference = o.PaymentReference,
                    Items = o.Items.Select(i => new OrderItemDto
                    {
                        Id = i.Id,
                        TierId = i.TierId,
                        TierName = i.Tier.TierName,
                        Quantity = i.Quantity,
                        PricePerTicket = i.PricePerTicket,
                        Subtotal = i.PricePerTicket * i.Quantity
                    }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("{run}/tickets")]
        [Authorize]
        public async Task<IActionResult> GetUserTickets(string run)
        {
            var user = await _context.Users.FindAsync(run);
            if (user is null) 
                return NotFound("User not found");

            var tickets = await _context.TicketsBought
                .Where(t => t.UserRun == run)
                .Include(t => t.Tier)
                .ThenInclude(tier => tier.Event)
                .Select(t => new TicketDto
                {
                    UserRun = t.UserRun,
                    UserName = $"{user.FirstNames} {user.LastNames}",
                    TierId = t.TierId,
                    TierName = t.Tier.TierName,
                    BoughtAt = t.BoughtAt,
                    TicketStatus = t.TicketStatus,
                    EventId = t.Tier.EventId,
                    EventName = t.Tier.Event.EventName,
                    EventDate = t.Tier.Event.StartDate
                })
                .ToListAsync();

            return Ok(tickets);
        }
    }
