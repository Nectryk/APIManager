using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace APIManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class ProxyController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public ProxyController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost("makeRequest")]
        public async Task<IActionResult> MakeRequest([FromBody] RequestData requestData)
        {
            var client = _httpClientFactory.CreateClient();
            var requestMessage = new HttpRequestMessage
            {
                Method = new HttpMethod(requestData.Method),
                RequestUri = new Uri(requestData.Url),
            };

            if (!string.IsNullOrEmpty(requestData.Body)) 
            {
                requestMessage.Content = new StringContent(requestData.Body);
            }

            if(requestData.Headers.Count > 0)
            {
                foreach (var header in requestData.Headers)
                {
                    requestMessage.Headers.Add(header.Key, header.Value);
                }
            }

            var response = await client.SendAsync(requestMessage);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var apiResponse = new ApiResponse{
                    Data = JsonSerializer.Deserialize<object>(responseContent),
                    // Data = JsonConvert.DeserializeObject(responseContent),
                    Headers = new Dictionary<string, string>(),
                };
                Console.WriteLine(apiResponse.Data);
                
                foreach (var header in response.Headers.Concat(response.Content.Headers))
                {
                    apiResponse.Headers[header.Key] = string.Join(", ", header.Value);
                }

                return Ok(apiResponse);
            }
            else
            {
                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
            }
        }
    }

    public class RequestData {
        public string? Url { get; set; }
        public string? Method { get; set; }
        public Dictionary<string, string>? Headers { get; set; }
        public string? Body { get; set; }
    }

    public class ApiResponse
    {
        public Dictionary<string, string> Headers { get; set; }
        public object Data { get; set; }
    }
}