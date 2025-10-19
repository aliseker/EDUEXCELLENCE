using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixImageUrlColumnLength : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Update Blogs table ImageUrl column to NVARCHAR(MAX)
            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "Blogs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);

            // Update BlogImages table ImageUrl column to NVARCHAR(MAX)
            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "BlogImages",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 10, 18, 22, 5, 38, 805, DateTimeKind.Utc).AddTicks(4861), "$2a$11$VwlSUZeisE//nay7azqkC.HSY5CgzAu2NtodgZUt.gcu1lP1Uqy9e" });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 18, 22, 5, 38, 805, DateTimeKind.Utc).AddTicks(5540), new DateTime(2025, 10, 18, 22, 5, 38, 805, DateTimeKind.Utc).AddTicks(5540) });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 18, 22, 5, 38, 805, DateTimeKind.Utc).AddTicks(5546), new DateTime(2025, 10, 18, 22, 5, 38, 805, DateTimeKind.Utc).AddTicks(5546) });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 18, 22, 5, 38, 805, DateTimeKind.Utc).AddTicks(5548), new DateTime(2025, 10, 18, 22, 5, 38, 805, DateTimeKind.Utc).AddTicks(5548) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revert BlogImages table ImageUrl column back to NVARCHAR(500)
            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "BlogImages",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            // Revert Blogs table ImageUrl column back to NVARCHAR(500)
            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "Blogs",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

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
    }
}
