using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixHeroIsActiveValues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Önce tüm hero'ları pasif yap
            migrationBuilder.Sql(@"
                UPDATE Heroes SET IsActive = 0
            ");

            // En küçük ID'ye sahip (ilk oluşturulan) hero'yu aktif yap
            migrationBuilder.Sql(@"
                UPDATE Heroes 
                SET IsActive = 1 
                WHERE Id = (SELECT MIN(Id) FROM Heroes)
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
