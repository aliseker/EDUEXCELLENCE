using Microsoft.AspNetCore.Mvc;

namespace EduExcellence.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new
            {
                Status = "OK",
                Message = "Edu Excellence API is running",
                Timestamp = DateTime.UtcNow
            });
        }
    }
}
