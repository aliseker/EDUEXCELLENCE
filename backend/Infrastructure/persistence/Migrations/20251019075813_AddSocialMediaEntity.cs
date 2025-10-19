using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddSocialMediaEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SocialMedias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Platform = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Url = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Order = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SocialMedias", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 10, 19, 7, 58, 13, 85, DateTimeKind.Utc).AddTicks(2876), "$2a$11$k97c8gNVQhmAyKW9W4YhduodwBaWJNbHuRR9mh/ct.ib/8YKaDWpq" });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 19, 7, 58, 13, 85, DateTimeKind.Utc).AddTicks(3553), new DateTime(2025, 10, 19, 7, 58, 13, 85, DateTimeKind.Utc).AddTicks(3554) });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 19, 7, 58, 13, 85, DateTimeKind.Utc).AddTicks(3559), new DateTime(2025, 10, 19, 7, 58, 13, 85, DateTimeKind.Utc).AddTicks(3559) });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 19, 7, 58, 13, 85, DateTimeKind.Utc).AddTicks(3561), new DateTime(2025, 10, 19, 7, 58, 13, 85, DateTimeKind.Utc).AddTicks(3561) });

            migrationBuilder.CreateIndex(
                name: "IX_SocialMedias_Platform",
                table: "SocialMedias",
                column: "Platform");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SocialMedias");

            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 10, 19, 2, 11, 7, 601, DateTimeKind.Utc).AddTicks(6335), "$2a$11$7GMHwitPhnc8W5PRY3eh5ekTs8O7XNRyxBCJB5ca1Im7i4.QXumf2" });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 19, 2, 11, 7, 601, DateTimeKind.Utc).AddTicks(7243), new DateTime(2025, 10, 19, 2, 11, 7, 601, DateTimeKind.Utc).AddTicks(7244) });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 19, 2, 11, 7, 601, DateTimeKind.Utc).AddTicks(7251), new DateTime(2025, 10, 19, 2, 11, 7, 601, DateTimeKind.Utc).AddTicks(7251) });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 19, 2, 11, 7, 601, DateTimeKind.Utc).AddTicks(7253), new DateTime(2025, 10, 19, 2, 11, 7, 601, DateTimeKind.Utc).AddTicks(7253) });
        }
    }
}
