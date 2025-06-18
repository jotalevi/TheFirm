using Microsoft.EntityFrameworkCore;
using TheFirmApi.Entities;

namespace TheFirmApi.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<UserEntity> Users { get; set; }
    public DbSet<CompanyEntity> Companies { get; set; }
    public DbSet<EventEntity> Events { get; set; }
    public DbSet<CalendarEventEntity> CalendarEvents { get; set; }
    public DbSet<TicketTierEntity> TicketTiers { get; set; }
    public DbSet<TicketBoughtEntity> TicketsBought { get; set; }
    public DbSet<UserModCompanyEntity> UserModCompanies { get; set; }
    public DbSet<AnalyticsSessionEntity> AnalyticsSessions { get; set; }
    public DbSet<AnalyticsEventEntity> AnalyticsEvents { get; set; }
    public DbSet<CouponEntity> Coupons { get; set; }
    public DbSet<CouponUsageEntity> CouponUsages { get; set; }
    public DbSet<TicketOrderEntity> TicketOrders { get; set; }
    public DbSet<TicketOrderItemEntity> TicketOrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuraciones de entidades y relaciones
        modelBuilder.Entity<UserEntity>(entity =>
        {
            entity.ToTable("user");
            entity.HasKey(e => e.Run);
        });

        modelBuilder.Entity<CompanyEntity>(entity =>
        {
            entity.ToTable("company");
        });

        modelBuilder.Entity<EventEntity>(entity =>
        {
            entity.ToTable("event");
            entity.HasOne(e => e.Company)
                  .WithMany(c => c.Events)
                  .HasForeignKey(e => e.CompanyId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<CalendarEventEntity>(entity =>
        {
            entity.ToTable("calendar_event");
            entity.HasOne(ce => ce.Event)
                  .WithOne(e => e.CalendarEvent)
                  .HasForeignKey<CalendarEventEntity>(ce => ce.InternalEventId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TicketTierEntity>(entity =>
        {
            entity.ToTable("ticket_tier");
            entity.HasOne(tt => tt.Event)
                  .WithMany(e => e.TicketTiers)
                  .HasForeignKey(tt => tt.EventId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TicketBoughtEntity>(entity =>
        {
            entity.ToTable("ticket_bought");
            entity.HasKey(tb => new { tb.UserRun, tb.TierId });
            
            entity.HasOne(tb => tb.User)
                  .WithMany(u => u.Tickets)
                  .HasForeignKey(tb => tb.UserRun)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(tb => tb.Tier)
                  .WithMany(tt => tt.TicketsBought)
                  .HasForeignKey(tb => tb.TierId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<UserModCompanyEntity>(entity =>
        {
            entity.ToTable("user_mod_company");
            entity.HasKey(umc => new { umc.UserRun, umc.CompanyId });
            
            entity.HasOne(umc => umc.User)
                  .WithMany(u => u.ModeratedCompanies)
                  .HasForeignKey(umc => umc.UserRun)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(umc => umc.Company)
                  .WithMany(c => c.Moderators)
                  .HasForeignKey(umc => umc.CompanyId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<AnalyticsSessionEntity>(entity =>
        {
            entity.ToTable("analytics_session");
            entity.HasOne(aes => aes.User)
                  .WithMany(u => u.AnalyticsSessions)
                  .HasForeignKey(aes => aes.UserRun)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<AnalyticsEventEntity>(entity =>
        {
            entity.ToTable("analytics_event");
            entity.HasOne(ae => ae.Session)
                  .WithMany(aes => aes.Events)
                  .HasForeignKey(ae => ae.SessionId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<CouponEntity>(entity =>
        {
            entity.ToTable("coupon");
            entity.HasOne(c => c.Event)
                  .WithMany(e => e.Coupons)
                  .HasForeignKey(c => c.EventId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<CouponUsageEntity>(entity =>
        {
            entity.ToTable("coupon_usage");
            entity.HasOne(cu => cu.Coupon)
                  .WithMany(c => c.Usages)
                  .HasForeignKey(cu => cu.CouponId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(cu => cu.Order)
                  .WithMany(to => to.CouponUsages)
                  .HasForeignKey(cu => cu.TicketOrderId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TicketOrderEntity>(entity =>
        {
            entity.ToTable("ticket_order");
            entity.HasOne(to => to.User)
                  .WithMany(u => u.Orders)
                  .HasForeignKey(to => to.UserRun)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<TicketOrderItemEntity>(entity =>
        {
            entity.ToTable("ticket_order_item");
            entity.HasOne(toi => toi.Order)
                  .WithMany(to => to.Items)
                  .HasForeignKey(toi => toi.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(toi => toi.Tier)
                  .WithMany(tt => tt.OrderItems)
                  .HasForeignKey(toi => toi.TierId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        // Verifica si ya hay usuarios en la base de datos
        if (context.Users.Any())
        {
            return; // La base de datos ya tiene datos
        }
        
        // Crear usuarios iniciales
        var users = new UserEntity[]
        {
            new UserEntity
            {
                Run = "11111111-1",
                FirstNames = "Admin",
                LastNames = "Principal",
                Email = "admin@demo.com",
                Phone = "56911111111",
                DirStreet1 = "Calle Admin",
                DirStreet2 = string.Empty,
                DirStNumber = "1",
                DirInNumber = string.Empty,
                Notify = true,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password!"),
                IsAdmin = true
            },
            new UserEntity
            {
                Run = "22222222-2",
                FirstNames = "Mod",
                LastNames = "Moderador",
                Email = "mod@demo.com",
                Phone = "56922222222",
                DirStreet1 = "Calle Mod",
                DirStreet2 = string.Empty,
                DirStNumber = "2",
                DirInNumber = string.Empty,
                Notify = true,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password!"),
                IsAdmin = false
            },
            new UserEntity
            {
                Run = "33333333-3",
                FirstNames = "Cliente",
                LastNames = "Comun",
                Email = "cliente@demo.com",
                Phone = "56933333333",
                DirStreet1 = "Calle Cliente",
                DirStreet2 = string.Empty,
                DirStNumber = "3",
                DirInNumber = string.Empty,
                Notify = false,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password!"),
                IsAdmin = false
            }
        };

        context.Users.AddRange(users);
        context.SaveChanges();
    }
}
