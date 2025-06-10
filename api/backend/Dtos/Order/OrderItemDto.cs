namespace TheFirmApi.Dtos.Order;

public class OrderItemDto
{
    public int Id { get; set; }
    public int TierId { get; set; }
    public string TierName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal PricePerTicket { get; set; }
    public decimal Subtotal { get; set; }
} 