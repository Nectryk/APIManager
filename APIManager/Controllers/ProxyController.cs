using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using System.Xml.Linq;
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

        private static void ParseElement(XElement element, Dictionary<string, object> json)
        {
            if (!element.HasElements)
            {
                json[element.Name.LocalName] = element.Value.Trim();
            }
            else
            {
                var subJson = new Dictionary<string, object>();
                foreach (var subElement in element.Elements())
                {
                    ParseElement(subElement, subJson);
                }
                json[element.Name.LocalName] = subJson;
            }
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
                    Data = null,
                    Headers = new Dictionary<string, string>(),
                };

                var contentType = response.Content.Headers.ContentType?.MediaType;
                Console.WriteLine(contentType);

                if (contentType == "application/json" || contentType == "text/json")
                {
                    apiResponse.Data = JsonSerializer.Deserialize<object>(responseContent);
                }
                else if (contentType == "application/xml")
                {
                    var document = XDocument.Parse(responseContent);
                    var json = new Dictionary<string, object>();
                    ParseElement(document.Root, json);
                    string jsonString = JsonSerializer.Serialize(json, new JsonSerializerOptions { WriteIndented = true });
                    apiResponse.Data = JsonSerializer.Deserialize<object>(jsonString);
                }
                else
                {
                    apiResponse.Data = responseContent;
                }
                
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