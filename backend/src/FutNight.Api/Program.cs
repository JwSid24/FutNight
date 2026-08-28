using FutNight.Api.BackgroundServices;
using FutNight.Data;
using FutNight.Data.Football;
using FutNight.Logic;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
