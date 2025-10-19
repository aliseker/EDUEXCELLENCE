using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateImageUrlLength : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 10, 18, 21, 48, 29, 12, DateTimeKind.Utc).AddTicks(4999), "$2a$11$TQmXpGMSlhra2LaatYI4jujOZQoJQvAai2w/RRdQgwHQXlX2E2mTO" });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 18, 21, 48, 29, 12, DateTimeKind.Utc).AddTicks(5658), new DateTime(2025, 10, 18, 21, 48, 29, 12, DateTimeKind.Utc).AddTicks(5659) });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 18, 21, 48, 29, 12, DateTimeKind.Utc).AddTicks(5664), new DateTime(2025, 10, 18, 21, 48, 29, 12, DateTimeKind.Utc).AddTicks(5664) });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 18, 21, 48, 29, 12, DateTimeKind.Utc).AddTicks(5666), new DateTime(2025, 10, 18, 21, 48, 29, 12, DateTimeKind.Utc).AddTicks(5666) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 10, 18, 19, 31, 20, 888, DateTimeKind.Utc).AddTicks(4766), "$2a$11$vNkECSrB39Lzog9bFJLCA.vokpkAjrcB3P/OxtZBsNlmpCgTJEsOi" });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 18, 19, 31, 20, 888, DateTimeKind.Utc).AddTicks(5458), new DateTime(2025, 10, 18, 19, 31, 20, 888, DateTimeKind.Utc).AddTicks(5458) });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 18, 19, 31, 20, 888, DateTimeKind.Utc).AddTicks(5463), new DateTime(2025, 10, 18, 19, 31, 20, 888, DateTimeKind.Utc).AddTicks(5464) });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 18, 19, 31, 20, 888, DateTimeKind.Utc).AddTicks(5465), new DateTime(2025, 10, 18, 19, 31, 20, 888, DateTimeKind.Utc).AddTicks(5466) });
        }
    }
}
