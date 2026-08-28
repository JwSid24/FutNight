using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FutNight.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddFixtures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Fixtures",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ExternalId = table.Column<int>(type: "integer", nullable: false),
                    CompetitionCode = table.Column<string>(type: "text", nullable: false),
                    CompetitionName = table.Column<string>(type: "text", nullable: false),
                    HomeTeam = table.Column<string>(type: "text", nullable: false),
                    AwayTeam = table.Column<string>(type: "text", nullable: false),
                    UtcKickoff = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Matchday = table.Column<int>(type: "integer", nullable: true),
                    LastSyncedUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fixtures", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Fixtures_CompetitionCode",
                table: "Fixtures",
                column: "CompetitionCode");

            migrationBuilder.CreateIndex(
                name: "IX_Fixtures_ExternalId",
                table: "Fixtures",
                column: "ExternalId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Fixtures_UtcKickoff",
                table: "Fixtures",
                column: "UtcKickoff");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Fixtures");
        }
    }
}
