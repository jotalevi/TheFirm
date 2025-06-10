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
    public DbSet<UserAdminCompanyEntity> UserAdminCompanies { get; set; }
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

        modelBuilder.Entity<UserAdminCompanyEntity>(entity =>
        {
            entity.ToTable("user_admin_company");
            entity.HasKey(uac => new { uac.UserRun, uac.CompanyId });
            
            entity.HasOne(uac => uac.User)
                  .WithMany(u => u.AdminCompanies)
                  .HasForeignKey(uac => uac.UserRun)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(uac => uac.Company)
                  .WithMany(c => c.Admins)
                  .HasForeignKey(uac => uac.CompanyId)
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
                Run = "12345678-9",
                FirstNames = "Admin",
                LastNames = "System",
                Email = "admin@thefirm.com",
                Phone = "56912345678",
                DirStreet1 = "Main Street",
                DirStreet2 = string.Empty,
                DirStNumber = "123",
                DirInNumber = string.Empty,
                Notify = true,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!")
            },
            new UserEntity
            {
                Run = "98765432-1",
                FirstNames = "Juan",
                LastNames = "Pérez",
                Email = "juan.perez@example.com",
                Phone = "56987654321",
                DirStreet1 = "Av. Providencia",
                DirStreet2 = "Depto 301",
                DirStNumber = "1500",
                DirInNumber = "301",
                Notify = true,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!")
            },
            new UserEntity
            {
                Run = "11111111-1",
                FirstNames = "María",
                LastNames = "González",
                Email = "maria.gonzalez@example.com",
                Phone = "56911111111",
                DirStreet1 = "Las Condes",
                DirStreet2 = string.Empty,
                DirStNumber = "500",
                DirInNumber = string.Empty,
                Notify = false,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!")
            }
        };

        context.Users.AddRange(users);
        context.SaveChanges();

        // Crear compañías
        var companies = new CompanyEntity[]
        {
            new CompanyEntity
            {
                CompanyName = "Eventos Santiago",
                CompanyRun = "76123456-7",
                LogoIrid = "logo-eventos-santiago",
                BannerIrid = "banner-eventos-santiago",
                HtmlIrid = "html-eventos-santiago",
                ContactRut = "12345678-9",
                ContactName = "Admin",
                ContactSurname = "System",
                ContactEmail = "admin@thefirm.com",
                ContactPhone = "56912345678",
                ContactDirStreet1 = "Main Street",
                ContactDirStreet2 = string.Empty,
                ContactDirStNumber = "123",
                ContactDirInNumber = string.Empty
            },
            new CompanyEntity
            {
                CompanyName = "Conciertos Chile",
                CompanyRun = "76987654-3",
                LogoIrid = "logo-conciertos-chile",
                BannerIrid = "banner-conciertos-chile",
                HtmlIrid = "html-conciertos-chile",
                ContactRut = "98765432-1",
                ContactName = "Juan",
                ContactSurname = "Pérez",
                ContactEmail = "juan.perez@example.com",
                ContactPhone = "56987654321",
                ContactDirStreet1 = "Av. Providencia",
                ContactDirStreet2 = "Depto 301",
                ContactDirStNumber = "1500",
                ContactDirInNumber = "301"
            }
        };

        context.Companies.AddRange(companies);
        context.SaveChanges();

        // Crear relaciones admin-compañía
        var adminCompanies = new UserAdminCompanyEntity[]
        {
            new UserAdminCompanyEntity
            {
                UserRun = "12345678-9",
                CompanyId = 1
            },
            new UserAdminCompanyEntity
            {
                UserRun = "98765432-1",
                CompanyId = 2
            }
        };

        context.UserAdminCompanies.AddRange(adminCompanies);
        
        // Crear eventos
        var now = DateTime.UtcNow;
        var events = new EventEntity[]
        {
            new EventEntity
            {
                Slug = "evento-2025",
                EventName = "Gran Evento 2025",
                EventDescription = "El mejor evento del año",
                StartDate = now.AddMonths(2),
                EndDate = now.AddMonths(2).AddHours(5),
                LogoIrid = "logo-evento-2025",
                BannerIrid = "banner-evento-2025",
                TemplateIrid = "template-evento-2025",
                CssIrid = "css-evento-2025",
                Public = true,
                CompanyId = 1
            },
            new EventEntity
            {
                Slug = "concierto-rock",
                EventName = "Concierto de Rock",
                EventDescription = "El mejor concierto de rock",
                StartDate = now.AddMonths(3),
                EndDate = now.AddMonths(3).AddHours(4),
                LogoIrid = "logo-concierto-rock",
                BannerIrid = "banner-concierto-rock",
                TemplateIrid = "template-concierto-rock",
                CssIrid = "css-concierto-rock",
                Public = true,
                CompanyId = 2
            }
        };

        context.Events.AddRange(events);
        context.SaveChanges();

        // Crear tiers de tickets
        var ticketTiers = new TicketTierEntity[]
        {
            new TicketTierEntity
            {
                TierName = "VIP",
                BasePrice = 100000,
                EntryAllowedFrom = now.AddMonths(2).AddHours(-1),
                EntryAllowedTo = now.AddMonths(2).AddHours(5),
                SingleUse = true,
                SingleDaily = false,
                TierPdfTemplateIrid = "pdf-vip",
                TierMailTemplateIrid = "mail-vip",
                StockInitial = 100,
                StockCurrent = 100,
                StockSold = 0,
                EventId = 1
            },
            new TicketTierEntity
            {
                TierName = "General",
                BasePrice = 50000,
                EntryAllowedFrom = now.AddMonths(2),
                EntryAllowedTo = now.AddMonths(2).AddHours(5),
                SingleUse = true,
                SingleDaily = false,
                TierPdfTemplateIrid = "pdf-general",
                TierMailTemplateIrid = "mail-general",
                StockInitial = 500,
                StockCurrent = 500,
                StockSold = 0,
                EventId = 1
            },
            new TicketTierEntity
            {
                TierName = "VIP Concierto",
                BasePrice = 120000,
                EntryAllowedFrom = now.AddMonths(3).AddHours(-1),
                EntryAllowedTo = now.AddMonths(3).AddHours(4),
                SingleUse = true,
                SingleDaily = false,
                TierPdfTemplateIrid = "pdf-vip-concierto",
                TierMailTemplateIrid = "mail-vip-concierto",
                StockInitial = 200,
                StockCurrent = 200,
                StockSold = 0,
                EventId = 2
            },
            new TicketTierEntity
            {
                TierName = "General Concierto",
                BasePrice = 60000,
                EntryAllowedFrom = now.AddMonths(3),
                EntryAllowedTo = now.AddMonths(3).AddHours(4),
                SingleUse = true,
                SingleDaily = false,
                TierPdfTemplateIrid = "pdf-general-concierto",
                TierMailTemplateIrid = "mail-general-concierto",
                StockInitial = 1000,
                StockCurrent = 1000,
                StockSold = 0,
                EventId = 2
            }
        };

        context.TicketTiers.AddRange(ticketTiers);
        
        // Crear cupones
        var coupons = new CouponEntity[]
        {
            new CouponEntity
            {
                Code = "DESCUENTO20",
                Description = "20% de descuento en todos los tickets",
                DiscountType = "percentage",
                DiscountValue = 20,
                UsageLimit = 100,
                UsageCount = 0,
                ValidFrom = now,
                ValidTo = now.AddMonths(6),
                EventId = 1,
                Active = true
            },
            new CouponEntity
            {
                Code = "DESCUENTO10000",
                Description = "10000 pesos de descuento",
                DiscountType = "fixed",
                DiscountValue = 10000,
                UsageLimit = 50,
                UsageCount = 0,
                ValidFrom = now,
                ValidTo = now.AddMonths(6),
                EventId = 2,
                Active = true
            }
        };

        context.Coupons.AddRange(coupons);
        context.SaveChanges();
    }
}
