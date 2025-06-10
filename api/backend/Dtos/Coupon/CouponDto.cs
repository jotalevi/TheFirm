namespace TheFirmApi.Dtos.Coupon;

public class CouponDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DiscountType { get; set; } = string.Empty;
    public decimal DiscountValue { get; set; }
    public int UsageLimit { get; set; }
    public int UsageCount { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
    public int? EventId { get; set; }
    public string? EventName { get; set; }
    public bool Active { get; set; }
} 