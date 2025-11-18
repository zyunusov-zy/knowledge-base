using System.Net;
using System.Text.Json;

namespace DocsApi.API.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    
    private static readonly Dictionary<Type, HttpStatusCode> ExceptionStatusCodes = new()
    {
        { typeof(UnauthorizedAccessException), HttpStatusCode.Unauthorized },
        { typeof(ArgumentNullException), HttpStatusCode.BadRequest },
        { typeof(ArgumentException), HttpStatusCode.BadRequest },
    };

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex, _logger);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception, ILogger logger)
    {

        logger.LogError(exception, "Unhandled exception occurred.");

        // Default values
        var statusCode = HttpStatusCode.InternalServerError;
        var message = "An unexpected error occurred.";

        // Dynamically find matching exception type (handles derived exceptions)
        var exceptionType = exception.GetType();
        foreach (var kvp in ExceptionStatusCodes)
        {
            if (kvp.Key.IsAssignableFrom(exceptionType))
            {
                statusCode = kvp.Value;
                message = exception.Message;
                break;
            }
        }

        // Return structured JSON
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var response = new
        {
            error = message,
            statusCode = context.Response.StatusCode
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
