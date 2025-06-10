using TheFirmApi.Dtos.Ticket;

namespace TheFirmApi.Dtos.Order;

public class OrderDto
{
    public int Id { get; set; }
    public string UserRun { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string? PaymentReference { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
} 