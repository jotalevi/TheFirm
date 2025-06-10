using System.ComponentModel.DataAnnotations;

namespace TheFirmApi.Dtos.Coupon;

public class CreateCouponDto
{
    [Required]
    [StringLength(64)]
    public string Code { get; set; } = string.Empty;
    
    [Required]
    [StringLength(256)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    [StringLength(32)]
    public string DiscountType { get; set; } = string.Empty; // percentage, fixed
    
    [Required]
    [Range(0, double.MaxValue)]
    public decimal DiscountValue { get; set; }
    
    [Required]
    [Range(1, int.MaxValue)]
    public int UsageLimit { get; set; }
    
    [Required]
    public DateTime ValidFrom { get; set; }
    
    [Required]
    public DateTime ValidTo { get; set; }
    
    public int? EventId { get; set; }
    
    [Required]
    public bool Active { get; set; } = true;
} 