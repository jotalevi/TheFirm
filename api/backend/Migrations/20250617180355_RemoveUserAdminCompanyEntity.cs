using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUserAdminCompanyEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "user_admin_company");

            migrationBuilder.AddColumn<bool>(
                name: "is_admin",
                table: "user",
                type: "NUMBER(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_admin",
                table: "user");

            migrationBuilder.CreateTable(
                name: "user_admin_company",
                columns: table => new
                {
                    user_run = table.Column<string>(type: "NVARCHAR2(450)", nullable: false),
                    company = table.Column<int>(type: "NUMBER(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_admin_company", x => new { x.user_run, x.company });
                    table.ForeignKey(
                        name: "FK_user_admin_company_company_company",
                        column: x => x.company,
                        principalTable: "company",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_admin_company_user_user_run",
                        column: x => x.user_run,
                        principalTable: "user",
                        principalColumn: "run",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_user_admin_company_company",
                table: "user_admin_company",
                column: "company");
        }
    }
}
