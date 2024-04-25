using Microsoft.AspNetCore.Mvc;

namespace APIManager.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class DataController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Received a GET request");
        }

        [HttpPost]
        public IActionResult Post([FromBody] dynamic data)
        {
            return Ok($"Received a POST request with data: {data}");
        }
    }
}