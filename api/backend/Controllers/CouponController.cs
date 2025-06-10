using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TheFirmApi.Data;
using TheFirmApi.Dtos.Coupon;
using TheFirmApi.Entities;

namespace TheFirmApi.Controllers;

[ApiController]
[Route("coupons")]
public class CouponController : ControllerBase
{
    private readonly AppDbContext _context;

    public CouponController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{code}")]
    [Authorize]
    public async Task<IActionResult> GetCouponDetails(string code)
    {
        var coupon = await _context.Coupons
            .Include(c => c.Event)
            .FirstOrDefaultAsync(c => c.Code == code && c.Active);

        if (coupon == null)
            return NotFound();

        var couponDto = new CouponDto
        {
            Id = coupon.Id,
            Code = coupon.Code,
            Description = coupon.Description,
            DiscountType = coupon.DiscountType,
            DiscountValue = coupon.DiscountValue,
            UsageLimit = coupon.UsageLimit,
            UsageCount = coupon.UsageCount,
            ValidFrom = coupon.ValidFrom,
            ValidTo = coupon.ValidTo,
            EventId = coupon.EventId,
            EventName = coupon.Event?.EventName,
            Active = coupon.Active
        };

        return Ok(couponDto);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateCoupon(CreateCouponDto dto)
    {
        // Check if event exists if EventId is provided
        if (dto.EventId.HasValue)
        {
            var eventEntity = await _context.Events.FindAsync(dto.EventId.Value);
            if (eventEntity == null)
                return BadRequest("Invalid event ID");
        }

        // Check if coupon code already exists
        var existingCoupon = await _context.Coupons.FirstOrDefaultAsync(c => c.Code == dto.Code);
        if (existingCoupon != null)
            return BadRequest("Coupon code already exists");

        var coupon = new CouponEntity
        {
            Code = dto.Code,
            Description = dto.Description,
            DiscountType = dto.DiscountType,
            DiscountValue = dto.DiscountValue,
            UsageLimit = dto.UsageLimit,
            UsageCount = 0,
            ValidFrom = dto.ValidFrom,
            ValidTo = dto.ValidTo,
            EventId = dto.EventId,
            Active = dto.Active
        };

        _context.Coupons.Add(coupon);
        await _context.SaveChangesAsync();

        var couponDto = new CouponDto
        {
            Id = coupon.Id,
            Code = coupon.Code,
            Description = coupon.Description,
            DiscountType = coupon.DiscountType,
            DiscountValue = coupon.DiscountValue,
            UsageLimit = coupon.UsageLimit,
            UsageCount = coupon.UsageCount,
            ValidFrom = coupon.ValidFrom,
            ValidTo = coupon.ValidTo,
            EventId = coupon.EventId,
            EventName = dto.EventId.HasValue ? _context.Events.Find(dto.EventId.Value)?.EventName : null,
            Active = coupon.Active
        };

        return CreatedAtAction(nameof(GetCouponDetails), new { code = coupon.Code }, couponDto);
    }

    [HttpPost("{code}")]
    [Authorize]
    public async Task<IActionResult> ApplyToCart(string code)
    {
        var coupon = await _context.Coupons
            .Include(c => c.Event)
            .FirstOrDefaultAsync(c => c.Code == code && c.Active);

        if (coupon == null)
            return NotFound("Coupon not found or inactive");

        if (coupon.UsageCount >= coupon.UsageLimit)
            return BadRequest("Coupon usage limit reached");

        if (coupon.ValidFrom > DateTime.UtcNow || coupon.ValidTo < DateTime.UtcNow)
            return BadRequest("Coupon is not valid at this time");

        var couponDto = new CouponDto
        {
            Id = coupon.Id,
            Code = coupon.Code,
            Description = coupon.Description,
            DiscountType = coupon.DiscountType,
            DiscountValue = coupon.DiscountValue,
            UsageLimit = coupon.UsageLimit,
            UsageCount = coupon.UsageCount,
            ValidFrom = coupon.ValidFrom,
            ValidTo = coupon.ValidTo,
            EventId = coupon.EventId,
            EventName = coupon.Event?.EventName,
            Active = coupon.Active
        };

        return Ok(couponDto);
    }
} 