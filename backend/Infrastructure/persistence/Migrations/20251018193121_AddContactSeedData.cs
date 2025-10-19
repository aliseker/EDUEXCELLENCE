using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddContactSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 10, 18, 19, 31, 20, 888, DateTimeKind.Utc).AddTicks(4766), "$2a$11$vNkECSrB39Lzog9bFJLCA.vokpkAjrcB3P/OxtZBsNlmpCgTJEsOi" });

            migrationBuilder.InsertData(
                table: "Contacts",
                columns: new[] { "Id", "CreatedAt", "Details", "IsActive", "IsPrimary", "Order", "Title", "Type", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 10, 18, 19, 31, 20, 888, DateTimeKind.Utc).AddTicks(5458), "[\"Kısla Mah. 37 Sk. Cengizhan Apt. B Girişi No: 6\", \"İç Kapı No: 102 Muratpaşa, Antalya / Türkiye\"]", true, true, 1, "Adres", "address", new DateTime(2025, 10, 18, 19, 31, 20, 888, DateTimeKind.Utc).AddTicks(5458) },
                    { 2, new DateTime(2025, 10, 18, 19, 31, 20, 888, DateTimeKind.Utc).AddTicks(5463), "[\"+90 505 274 90 36\"]", true, true, 2, "Telefon", "phone", new DateTime(2025, 10, 18, 19, 31, 20, 888, DateTimeKind.Utc).AddTicks(5464) },
                    { 3, new DateTime(2025, 10, 18, 19, 31, 20, 888, DateTimeKind.Utc).AddTicks(5465), "[\"info@edu-excellence.net\"]", true, true, 3, "E-posta", "email", new DateTime(2025, 10, 18, 19, 31, 20, 888, DateTimeKind.Utc).AddTicks(5466) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 10, 13, 20, 22, 58, 832, DateTimeKind.Utc).AddTicks(307), "$2a$11$IJHz1RmzKC4iPVMcPukau.e0y9G7FzOzLVa00oKnskfzJrBkpWiX." });
        }
    }
}
