using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using TheFirmApi;
using TheFirmApi.Entities;
using TheFirmApi.Services;
using TheFirmApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Configure the server to listen on port 80 only
builder.WebHost.UseUrls("http://+:80");

// Add services
builder.Services.AddControllers();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException($"Database connection string 'DefaultConnection' is not configured properly");
}

builder.Services.AddDbContext<AppDbContext>(options => {
    options.UseOracle(connectionString, 
        oracleOptions => oracleOptions.UseOracleSQLCompatibility(OracleSQLCompatibility.DatabaseVersion19));
});

// Register services
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<EmailService>();

// Configure JWT authentication
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("JWT Key is not configured properly in appsettings.json");
}

var key = Encoding.ASCII.GetBytes(jwtKey);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero // Reduce the default 5 min clock skew for more precise token lifetime
        };
    });

// Add Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "TheFirm API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS
app.UseCors("AllowAll");

// Aplicar migraciones y sembrar datos iniciales
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        // Aplicar migraciones
        dbContext.Database.Migrate();
        DbInitializer.Initialize(dbContext);
        Console.WriteLine("Base de datos migrada y datos inicializados correctamente.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al migrar la base de datos: {ex.Message}");
        if (ex.InnerException != null)
        {
            Console.WriteLine($"Detalle: {ex.InnerException.Message}");
        }
    }
}

// Configure global exception handling middleware
app.UseExceptionHandler(appBuilder => {
    appBuilder.Run(async context => {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";
        
        var exceptionHandlerPathFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>();
        var exception = exceptionHandlerPathFeature?.Error;
        
        if (exception != null && app.Environment.IsDevelopment())
        {
            await context.Response.WriteAsJsonAsync(new {
                StatusCode = context.Response.StatusCode,
                Message = exception.Message,
                StackTrace = exception.StackTrace
            });
        }
        else
        {
            await context.Response.WriteAsJsonAsync(new {
                StatusCode = context.Response.StatusCode,
                Message = "An unexpected error occurred."
            });
        }
        
        // Log the exception (could use a proper logging framework here)
        Console.WriteLine($"Error: {exception?.Message}");
        if (exception?.InnerException != null)
        {
            Console.WriteLine($"Inner error: {exception.InnerException.Message}");
        }
    });
});

// app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
