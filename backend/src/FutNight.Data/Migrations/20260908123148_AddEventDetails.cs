using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FutNight.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddEventDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedUtc",
                table: "Events",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "FixtureId",
                table: "Events",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "HostUserId",
                table: "Events",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "InviteToken",
                table: "Events",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "VenueMode",
                table: "Events",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "VenueText",
                table: "Events",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Events_FixtureId",
                table: "Events",
                column: "FixtureId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_HostUserId",
                table: "Events",
                column: "HostUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_InviteToken",
                table: "Events",
                column: "InviteToken",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Events_AspNetUsers_HostUserId",
                table: "Events",
                column: "HostUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Fixtures_FixtureId",
                table: "Events",
                column: "FixtureId",
                principalTable: "Fixtures",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_AspNetUsers_HostUserId",
                table: "Events");

            migrationBuilder.DropForeignKey(
                name: "FK_Events_Fixtures_FixtureId",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Events_FixtureId",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Events_HostUserId",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Events_InviteToken",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "CreatedUtc",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "FixtureId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "HostUserId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "InviteToken",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "VenueMode",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "VenueText",
                table: "Events");
        }
    }
}
