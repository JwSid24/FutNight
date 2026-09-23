using System.Text;
using FutNight.Api.Auth;
using FutNight.Api.BackgroundServices;
using FutNight.Api.Chat;
using FutNight.Data;
using FutNight.Data.Football;
using FutNight.Logic;
using FutNight.Logic.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter()));
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Data-laget (EF Core + PostgreSQL). Connection string læses fra config.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "Connection string 'DefaultConnection' mangler. Sæt den via user-secrets eller miljøvariabel.");
builder.Services.AddDataLayer(connectionString);

// Logik-laget (services).
builder.Services.AddLogicLayer();

// Fodbold-data-konfiguration (ApiKey fra user-secrets, resten fra appsettings).
builder.Services.Configure<FootballDataOptions>(
    builder.Configuration.GetSection(FootballDataOptions.SectionName));

// Baggrundsjob der synker kampe ved opstart + med interval.
builder.Services.AddHostedService<FixtureSyncBackgroundService>();

// Rydder udløbne chatbeskeder (efemer 24t-opbevaring).
builder.Services.AddHostedService<ChatCleanupBackgroundService>();

// CORS så mobil-appen (Expo) må kalde API'et under udvikling.
const string FrontendCors = "frontend";
builder.Services.AddCors(options =>
    options.AddPolicy(FrontendCors, policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

// JWT-authentication. Nøglen (Jwt:Key) kommer fra user-secrets.
var jwt = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>() ?? new JwtOptions();
if (string.IsNullOrWhiteSpace(jwt.Key))
    throw new InvalidOperationException("Jwt:Key mangler. Sæt den via user-secrets (dotnet user-secrets set \"Jwt:Key\" ...).");

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));
builder.Services.AddSingleton<ITokenService, JwtTokenService>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = jwt.Issuer,
            ValidAudience = jwt.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)),
        };

        // SignalR-websocket kan ikke sætte Authorization-header → læs token fra query.
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                if (!string.IsNullOrEmpty(accessToken) && context.HttpContext.Request.Path.StartsWithSegments("/hubs/chat"))
                    context.Token = accessToken;
                return Task.CompletedTask;
            },
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors(FrontendCors);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");

app.Run();
