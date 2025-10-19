using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveCourseCategoryAndIncreaseImageUrlLength : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Courses");

            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "Courses",
                type: "nvarchar(max)",
                maxLength: 500000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "Courses",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldMaxLength: 500000,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Courses",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

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
    }
}
