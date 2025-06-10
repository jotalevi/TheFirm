using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using TheFirmApi.Data;

namespace TheFirmApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HealthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("/health")]
        public async Task<IActionResult> Check()
        {
            try
            {
                // Verificar conexión a la base de datos
                bool canConnect = await _context.Database.CanConnectAsync();
                
                if (canConnect)
                {
                    return Ok(new { status = "healthy", message = "API y base de datos funcionando correctamente." });
                }
                else
                {
                    return StatusCode(500, new { status = "unhealthy", message = "No se puede conectar a la base de datos." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = ex.Message });
            }
        }
    }
} 