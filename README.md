# FutNight

En mobilapp der samler ens eksisterende venner om at se fodbold sammen.

**Kerne-loopet:** Opret et event til en kamp → del et link → en ven svarer ja uden at
oprette konto → I aftaler i en chat hvor I ser den (host lægger hus til, eller I finder en bar).

---

## Teknologi

| Del | Valg |
|---|---|
| Backend | ASP.NET Core Web API (C#, .NET 9)¹ |
| Realtidschat | SignalR |
| Dataadgang | Entity Framework Core + Npgsql |
| Database | PostgreSQL 16 (via Docker) |
| Mobil-app | React Native via Expo |
| Auth | ASP.NET Core Identity + JWT |
| Fodbolddata | Football-Data.org (hentes + caches i backend) |

¹ Briefen låser .NET 10 LTS; vi kører .NET 9 indtil videre og opgraderer senere.

---

## Arkitektur — 3-lags, ét deployerbart API

```
backend/
  FutNight.sln
  src/
    FutNight.Api/     # PRÆSENTATION — Controllers, Program.cs, DI, middleware, SignalR-hubs
    FutNight.Logic/   # LOGIK        — Services, DTOs, forretningsregler, adgangsmodel
    FutNight.Data/    # DATA         — EF Core (AppDbContext), entiteter, repositories, FixtureSyncService
```

Afhængigheder peger indad: **Api → Logic → Data**. Kun `FutNight.Api` startes;
de to andre er klassebiblioteker den trækker ind.

---

## Forudsætninger

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) + npm
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (til PostgreSQL)

---

## Kom i gang

### 1. Database (PostgreSQL via Docker)

Opret en `.env` i **projektroden** (kopiér fra `.env.example`), og start databasen:

```bash
cp .env.example .env      # udfyld værdierne
docker compose up -d
```

### 2. Backend

Backend læser sin connection string fra konfiguration (`ConnectionStrings:DefaultConnection`).
Lokalt sættes den via user-secrets, så den aldrig havner i git:

```bash
cd backend
dotnet user-secrets set "ConnectionStrings:DefaultConnection" \
  "Host=localhost;Port=5432;Database=futnight;Username=futnight;Password=DIT_PASSWORD" \
  --project src/FutNight.Api
```

Kør API'et:

```bash
dotnet run --project src/FutNight.Api
```

### 3. Databasemigrationer (EF Core)

```bash
cd backend
dotnet ef migrations add <Navn> --project src/FutNight.Data --startup-project src/FutNight.Api
dotnet ef database update --project src/FutNight.Data --startup-project src/FutNight.Api
```

> Kræver EF Core-værktøjet: `dotnet tool install --global dotnet-ef`

### 4. Mobil-app (Expo)

```bash
cd mobile
npm install
npm start
```

---

## Sikkerhed

- API-nøgler og db-credentials bor kun i backend (user-secrets / miljøvariabler) — aldrig i git.
- `.env` og build-output (`bin/`, `obj/`, `node_modules/`) er git-ignoreret.
