using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

class RegisterUser
{
    static async Task Main()
    {
        var jsonContent = @"{
            ""run"": ""123456789"",
            ""firstNames"": ""Usuario"",
            ""lastNames"": ""Prueba"",
            ""email"": ""usuario.prueba@example.com"",
            ""phone"": ""56912345678"",
            ""dirStreet1"": ""Calle Principal"",
            ""dirStreet2"": ""Sector Centro"",
            ""dirStNumber"": ""123"",
            ""dirInNumber"": ""A"",
            ""notify"": true,
            ""passwordHash"": ""Contrasena123""
        }";

        var handler = new HttpClientHandler();
        handler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => true;

        using var client = new HttpClient(handler);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");
        
        try
        {
            var response = await client.PostAsync("https://localhost:44335/auth/register", content);
            
            Console.WriteLine($"Status: {response.StatusCode}");
            var responseContent = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Response: {responseContent}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            if (ex.InnerException != null)
            {
                Console.WriteLine($"Inner Error: {ex.InnerException.Message}");
            }
        }
    }
} 