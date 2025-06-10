using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TheFirmApi.Data;
using TheFirmApi.Dtos.Order;
using TheFirmApi.Entities;
using TheFirmApi.Services;

namespace TheFirmApi.Controllers;

[ApiController]
[Route("orders")]
public class OrderController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly EmailService _emailService;

    public OrderController(AppDbContext context, EmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetOrder(int id)
    {
        var order = await _context.TicketOrders
            .Include(o => o.Items)
            .ThenInclude(i => i.Tier)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound();

        var orderDto = new OrderDto
        {
            Id = order.Id,
            UserRun = order.UserRun,
            OrderDate = order.OrderDate,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            PaymentMethod = order.PaymentMethod,
            PaymentReference = order.PaymentReference,
            Items = order.Items.Select(i => new OrderItemDto
            {
                Id = i.Id,
                TierId = i.TierId,
                TierName = i.Tier?.TierName ?? string.Empty,
                Quantity = i.Quantity,
                PricePerTicket = i.PricePerTicket,
                Subtotal = i.PricePerTicket * i.Quantity
            }).ToList()
        };

        return Ok(orderDto);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateOrder(CreateOrderDto dto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            // Verify user exists
            var user = await _context.Users.FindAsync(dto.UserRun);
            if (user == null)
                return BadRequest("Invalid user");

            // Calculate total and verify tier availability
            decimal total = 0;
            foreach (var item in dto.Items)
            {
                var tier = await _context.TicketTiers.FindAsync(item.TierId);
                if (tier == null)
                    return BadRequest($"Invalid tier ID: {item.TierId}");

                if (tier.StockCurrent < item.Quantity)
                    return BadRequest($"Not enough stock for tier: {tier.TierName}");

                total += tier.BasePrice * item.Quantity;
            }

            // Apply coupon if provided
            if (!string.IsNullOrEmpty(dto.CouponCode))
            {
                var coupon = await _context.Coupons
                    .FirstOrDefaultAsync(c => c.Code == dto.CouponCode && c.Active);

                if (coupon == null)
                    return BadRequest("Invalid coupon code");

                if (coupon.UsageCount >= coupon.UsageLimit)
                    return BadRequest("Coupon usage limit reached");

                if (coupon.ValidFrom > DateTime.UtcNow || coupon.ValidTo < DateTime.UtcNow)
                    return BadRequest("Coupon is not valid at this time");

                // Apply discount
                if (coupon.DiscountType == "percentage")
                {
                    total = total * (1 - (coupon.DiscountValue / 100));
                }
                else if (coupon.DiscountType == "fixed")
                {
                    total = Math.Max(0, total - coupon.DiscountValue);
                }

                // Increment coupon usage count
                coupon.UsageCount++;
                _context.Coupons.Update(coupon);
            }

            // Create order
            var order = new TicketOrderEntity
            {
                UserRun = dto.UserRun,
                OrderDate = DateTime.UtcNow,
                TotalAmount = total,
                Status = "pending", // Initial status
                PaymentMethod = dto.PaymentMethod,
                PaymentReference = null // Will be set after payment
            };

            _context.TicketOrders.Add(order);
            await _context.SaveChangesAsync();

            // Create order items and update ticket stock
            foreach (var item in dto.Items)
            {
                var tier = await _context.TicketTiers.FindAsync(item.TierId);

                var orderItem = new TicketOrderItemEntity
                {
                    OrderId = order.Id,
                    TierId = item.TierId,
                    Quantity = item.Quantity,
                    PricePerTicket = tier.BasePrice
                };

                _context.TicketOrderItems.Add(orderItem);

                // Update stock
                tier.StockCurrent -= item.Quantity;
                tier.StockSold += item.Quantity;
                _context.TicketTiers.Update(tier);

                // Create ticket bought entries (one per quantity)
                for (int i = 0; i < item.Quantity; i++)
                {
                    var ticket = new TicketBoughtEntity
                    {
                        UserRun = dto.UserRun,
                        TierId = item.TierId,
                        BoughtAt = DateTime.UtcNow,
                        TicketStatus = "valid" // Initial status
                    };

                    _context.TicketsBought.Add(ticket);
                }
            }

            // Record coupon usage if applicable
            if (!string.IsNullOrEmpty(dto.CouponCode))
            {
                var coupon = await _context.Coupons
                    .FirstOrDefaultAsync(c => c.Code == dto.CouponCode);
                
                if (coupon != null)
                {
                    var couponUsage = new CouponUsageEntity
                    {
                        CouponId = coupon.Id,
                        TicketOrderId = order.Id,
                        UsedAt = DateTime.UtcNow
                    };
                    
                    _context.CouponUsages.Add(couponUsage);
                }
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            // Process a simulated payment (in a real app, this would call a payment gateway)
            order.Status = "completed";
            order.PaymentReference = $"REF-{Guid.NewGuid().ToString().Substring(0, 8)}";
            await _context.SaveChangesAsync();

            // Send confirmation email (to do in a real app with actual SMTP settings)
            try
            {
                foreach (var item in dto.Items)
                {
                    var tier = await _context.TicketTiers
                        .Include(t => t.Event)
                        .FirstOrDefaultAsync(t => t.Id == item.TierId);

                    if (tier?.Event != null)
                    {
                        await _emailService.SendTicketConfirmationAsync(
                            user.Email,
                            $"{user.FirstNames} {user.LastNames}",
                            tier.Event.EventName,
                            tier.TierName,
                            tier.Event.StartDate
                        );
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the error but don't fail the order
                Console.WriteLine($"Failed to send confirmation email: {ex.Message}");
            }

            // Return the created order
            var orderDto = new OrderDto
            {
                Id = order.Id,
                UserRun = order.UserRun,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                PaymentMethod = order.PaymentMethod,
                PaymentReference = order.PaymentReference,
                Items = dto.Items.Select(i => new OrderItemDto
                {
                    Id = 0, // We don't have the IDs at this point, but it's not needed in the response
                    TierId = i.TierId,
                    TierName = _context.TicketTiers.Find(i.TierId)?.TierName ?? string.Empty,
                    Quantity = i.Quantity,
                    PricePerTicket = _context.TicketTiers.Find(i.TierId)?.BasePrice ?? 0,
                    Subtotal = (_context.TicketTiers.Find(i.TierId)?.BasePrice ?? 0) * i.Quantity
                }).ToList()
            };

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, orderDto);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }
} 