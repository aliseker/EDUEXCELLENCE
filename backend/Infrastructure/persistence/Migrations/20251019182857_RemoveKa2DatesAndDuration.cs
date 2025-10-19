using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveKa2DatesAndDuration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Ka2Projects");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Ka2Projects");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "Ka2Projects");

            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 10, 19, 18, 28, 56, 994, DateTimeKind.Utc).AddTicks(9028), "$2a$11$JW.knwPYx1VQw46w3Uvh..laNFa.bbKtYaC0FAwEsWTxI7YFfWSnq" });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 19, 18, 28, 56, 994, DateTimeKind.Utc).AddTicks(9909), new DateTime(2025, 10, 19, 18, 28, 56, 994, DateTimeKind.Utc).AddTicks(9910) });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 19, 18, 28, 56, 994, DateTimeKind.Utc).AddTicks(9918), new DateTime(2025, 10, 19, 18, 28, 56, 994, DateTimeKind.Utc).AddTicks(9919) });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 19, 18, 28, 56, 994, DateTimeKind.Utc).AddTicks(9921), new DateTime(2025, 10, 19, 18, 28, 56, 994, DateTimeKind.Utc).AddTicks(9921) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Duration",
                table: "Ka2Projects",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "Ka2Projects",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "Ka2Projects",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 10, 19, 10, 14, 22, 903, DateTimeKind.Utc).AddTicks(8759), "$2a$11$tg.kUPoFkvahcK44QaRLmeNKkz7U0jva9mnnXkWk2mrzBRi/HusD6" });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 19, 10, 14, 22, 903, DateTimeKind.Utc).AddTicks(9454), new DateTime(2025, 10, 19, 10, 14, 22, 903, DateTimeKind.Utc).AddTicks(9455) });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 19, 10, 14, 22, 903, DateTimeKind.Utc).AddTicks(9461), new DateTime(2025, 10, 19, 10, 14, 22, 903, DateTimeKind.Utc).AddTicks(9461) });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 19, 10, 14, 22, 903, DateTimeKind.Utc).AddTicks(9463), new DateTime(2025, 10, 19, 10, 14, 22, 903, DateTimeKind.Utc).AddTicks(9464) });
        }
    }
}
