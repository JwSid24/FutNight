namespace FutNight.Data.Football;

// Konfiguration for fodbold-data-kilden. ApiKey kommer fra user-secrets; resten fra appsettings.
public class FootballDataOptions
{
    public const string SectionName = "FootballData";

    public string ApiKey { get; set; } = "";
    public string BaseUrl { get; set; } = "https://api.football-data.org/v4/";

    // Bevidst tom default: options-binderen LÆGGER config-arrays oven i en ikke-tom default
    // (6 + 6 = 12). Tom default → config'en (appsettings) erstatter rent. Turneringerne
    // defineres i appsettings.json (FootballData:Competitions).
    public string[] Competitions { get; set; } = [];
    public int SyncIntervalHours { get; set; } = 12;
}
