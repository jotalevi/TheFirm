using System.ComponentModel.DataAnnotations;

namespace TheFirmApi.Dtos.Order;

public class CreateOrderDto
{
    [Required]
    public string UserRun { get; set; } = string.Empty;
    
    [Required]
    public string PaymentMethod { get; set; } = string.Empty;
    
    public string? CouponCode { get; set; }
    
    [Required]
    public List<CreateOrderItemDto> Items { get; set; } = new();
}

public class CreateOrderItemDto
{
    [Required]
    public int TierId { get; set; }
    
    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
} 