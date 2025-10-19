using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace persistence.Migrations
{
    /// <inheritdoc />
    public partial class NormalizeLocationData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Normalize location data in Courses table
            migrationBuilder.Sql(@"
                UPDATE Courses 
                SET Location = 'İstanbul' 
                WHERE LOWER(Location) IN ('istanbul', 'i̇stanbul');
                
                UPDATE Courses 
                SET Location = 'Antalya' 
                WHERE LOWER(Location) = 'antalya';
                
                UPDATE Courses 
                SET Location = 'Paris' 
                WHERE LOWER(Location) = 'paris';
                
                UPDATE Courses 
                SET Location = 'Dortmund' 
                WHERE LOWER(Location) = 'dortmund';
                
                UPDATE Courses 
                SET Location = 'Cologne' 
                WHERE LOWER(Location) = 'cologne';
                
                UPDATE Courses 
                SET Location = 'Düsseldorf' 
                WHERE LOWER(Location) IN ('düsseldorf', 'dusseldorf');
                
                UPDATE Courses 
                SET Location = 'Berlin' 
                WHERE LOWER(Location) = 'berlin';
                
                UPDATE Courses 
                SET Location = 'Madrid' 
                WHERE LOWER(Location) = 'madrid';
                
                UPDATE Courses 
                SET Location = 'Rome' 
                WHERE LOWER(Location) = 'rome';
                
                UPDATE Courses 
                SET Location = 'London' 
                WHERE LOWER(Location) = 'london';
                
                UPDATE Courses 
                SET Location = 'Amsterdam' 
                WHERE LOWER(Location) = 'amsterdam';
                
                UPDATE Courses 
                SET Location = 'Vienna' 
                WHERE LOWER(Location) = 'vienna';
                
                UPDATE Courses 
                SET Location = 'Prague' 
                WHERE LOWER(Location) = 'prague';
                
                UPDATE Courses 
                SET Location = 'Budapest' 
                WHERE LOWER(Location) = 'budapest';
                
                UPDATE Courses 
                SET Location = 'Warsaw' 
                WHERE LOWER(Location) = 'warsaw';
                
                UPDATE Courses 
                SET Location = 'Athens' 
                WHERE LOWER(Location) = 'athens';
                
                UPDATE Courses 
                SET Location = 'Lisbon' 
                WHERE LOWER(Location) = 'lisbon';
                
                UPDATE Courses 
                SET Location = 'Stockholm' 
                WHERE LOWER(Location) = 'stockholm';
                
                UPDATE Courses 
                SET Location = 'Oslo' 
                WHERE LOWER(Location) = 'oslo';
                
                UPDATE Courses 
                SET Location = 'Copenhagen' 
                WHERE LOWER(Location) = 'copenhagen';
                
                UPDATE Courses 
                SET Location = 'Helsinki' 
                WHERE LOWER(Location) = 'helsinki';
            ");

            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 10, 19, 8, 47, 18, 646, DateTimeKind.Utc).AddTicks(2928), "$2a$11$TUf9qPx2auNuM5YiRK6ES.LkKEJ1ous3i0eZGfK4nkb08pWUqieqS" });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 19, 8, 47, 18, 646, DateTimeKind.Utc).AddTicks(4029), new DateTime(2025, 10, 19, 8, 47, 18, 646, DateTimeKind.Utc).AddTicks(4030) });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 19, 8, 47, 18, 646, DateTimeKind.Utc).AddTicks(4038), new DateTime(2025, 10, 19, 8, 47, 18, 646, DateTimeKind.Utc).AddTicks(4038) });

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 19, 8, 47, 18, 646, DateTimeKind.Utc).AddTicks(4041), new DateTime(2025, 10, 19, 8, 47, 18, 646, DateTimeKind.Utc).AddTicks(4041) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
        }
    }
}
