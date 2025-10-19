using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixCourseImageUrlColumnLength : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Change ImageUrl column to NVARCHAR(MAX) for Courses table
            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "Courses",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500000)",
                oldMaxLength: 500000,
                oldNullable: true);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revert ImageUrl column back to NVARCHAR(500000) for Courses table
            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "Courses",
                type: "nvarchar(500000)",
                maxLength: 500000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 10, 19, 1, 55, 14, 443, DateTimeKind.Utc).AddTicks(7838), "$2a$11$o6jSSdalb5mhmYtqkV/u4OLwDUx6ue20c4vM7sjb8sdNbNpzNLTv2" });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 19, 1, 55, 14, 443, DateTimeKind.Utc).AddTicks(8711), new DateTime(2025, 10, 19, 1, 55, 14, 443, DateTimeKind.Utc).AddTicks(8712) });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 19, 1, 55, 14, 443, DateTimeKind.Utc).AddTicks(8717), new DateTime(2025, 10, 19, 1, 55, 14, 443, DateTimeKind.Utc).AddTicks(8718) });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 19, 1, 55, 14, 443, DateTimeKind.Utc).AddTicks(8720), new DateTime(2025, 10, 19, 1, 55, 14, 443, DateTimeKind.Utc).AddTicks(8720) });
        }
    }
}
