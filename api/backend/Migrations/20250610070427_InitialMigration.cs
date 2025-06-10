using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "company",
                columns: table => new
                {
                    id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    company_name = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    company_run = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    logo_irid = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    banner_irid = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    html_irid = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    contact_rut = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    contact_name = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    contact_surname = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    contact_email = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    contact_phone = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    contact_dir_states = table.Column<int>(type: "NUMBER(10)", nullable: true),
                    contact_dir_county = table.Column<int>(type: "NUMBER(10)", nullable: true),
                    contact_dir_street_1 = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    contact_dir_street_2 = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    contact_dir_st_number = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    contact_dir_in_number = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_company", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "user",
                columns: table => new
                {
                    run = table.Column<string>(type: "NVARCHAR2(450)", nullable: false),
                    first_names = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    last_names = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    email = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    phone = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    dir_states = table.Column<int>(type: "NUMBER(10)", nullable: true),
                    dir_county = table.Column<int>(type: "NUMBER(10)", nullable: true),
                    dir_street_1 = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    dir_street_2 = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    dir_st_number = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    dir_in_number = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    notify = table.Column<bool>(type: "NUMBER(1)", nullable: false),
                    password_hash = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user", x => x.run);
                });

            migrationBuilder.CreateTable(
                name: "event",
                columns: table => new
                {
                    id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    slug = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    event_name = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    event_description = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    start_date = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    end_date = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    logo_irid = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    banner_irid = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    template_irid = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    css_irid = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    @public = table.Column<bool>(name: "public", type: "NUMBER(1)", nullable: false),
                    company = table.Column<int>(type: "NUMBER(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_event", x => x.id);
                    table.ForeignKey(
                        name: "FK_event_company_company",
                        column: x => x.company,
                        principalTable: "company",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "analytics_session",
                columns: table => new
                {
                    id = table.Column<string>(type: "NVARCHAR2(450)", nullable: false),
                    user_run = table.Column<string>(type: "NVARCHAR2(450)", nullable: true),
                    started_at = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    ended_at = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: true),
                    ip_address = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    user_agent = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_analytics_session", x => x.id);
                    table.ForeignKey(
                        name: "FK_analytics_session_user_user_run",
                        column: x => x.user_run,
                        principalTable: "user",
                        principalColumn: "run",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "ticket_order",
                columns: table => new
                {
                    id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    user_run = table.Column<string>(type: "NVARCHAR2(450)", nullable: false),
                    order_date = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    total_amount = table.Column<decimal>(type: "DECIMAL(18, 2)", nullable: false),
                    status = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    payment_method = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    payment_reference = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ticket_order", x => x.id);
                    table.ForeignKey(
                        name: "FK_ticket_order_user_user_run",
                        column: x => x.user_run,
                        principalTable: "user",
                        principalColumn: "run",
                        onDelete: ReferentialAction.Restrict);
                });

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

            migrationBuilder.CreateTable(
                name: "user_mod_company",
                columns: table => new
                {
                    user_run = table.Column<string>(type: "NVARCHAR2(450)", nullable: false),
                    company = table.Column<int>(type: "NUMBER(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_mod_company", x => new { x.user_run, x.company });
                    table.ForeignKey(
                        name: "FK_user_mod_company_company_company",
                        column: x => x.company,
                        principalTable: "company",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_mod_company_user_user_run",
                        column: x => x.user_run,
                        principalTable: "user",
                        principalColumn: "run",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "calendar_event",
                columns: table => new
                {
                    id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    internal_event_id = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    logo_irid = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    date_start = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    date_end = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_calendar_event", x => x.id);
                    table.ForeignKey(
                        name: "FK_calendar_event_event_internal_event_id",
                        column: x => x.internal_event_id,
                        principalTable: "event",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "coupon",
                columns: table => new
                {
                    id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    code = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    description = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    discount_type = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    discount_value = table.Column<decimal>(type: "DECIMAL(18, 2)", nullable: false),
                    usage_limit = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    usage_count = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    valid_from = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    valid_to = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    event_id = table.Column<int>(type: "NUMBER(10)", nullable: true),
                    active = table.Column<bool>(type: "NUMBER(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_coupon", x => x.id);
                    table.ForeignKey(
                        name: "FK_coupon_event_event_id",
                        column: x => x.event_id,
                        principalTable: "event",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "ticket_tier",
                columns: table => new
                {
                    id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    tier_name = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    base_price = table.Column<decimal>(type: "DECIMAL(18, 2)", nullable: false),
                    entry_allowed_from = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: true),
                    entry_allowed_to = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: true),
                    single_use = table.Column<bool>(type: "NUMBER(1)", nullable: false),
                    single_daily = table.Column<bool>(type: "NUMBER(1)", nullable: false),
                    tier_pdf_template_irid = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    tier_mail_template_irid = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    stock_initial = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    stock_current = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    stock_sold = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    @event = table.Column<int>(name: "event", type: "NUMBER(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ticket_tier", x => x.id);
                    table.ForeignKey(
                        name: "FK_ticket_tier_event_event",
                        column: x => x.@event,
                        principalTable: "event",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "analytics_event",
                columns: table => new
                {
                    id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    session_id = table.Column<string>(type: "NVARCHAR2(450)", nullable: false),
                    event_name = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    metadata = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    occurred_at = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_analytics_event", x => x.id);
                    table.ForeignKey(
                        name: "FK_analytics_event_analytics_session_session_id",
                        column: x => x.session_id,
                        principalTable: "analytics_session",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "coupon_usage",
                columns: table => new
                {
                    id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    coupon_id = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    ticket_order_id = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    ticket_id = table.Column<int>(type: "NUMBER(10)", nullable: true),
                    used_at = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_coupon_usage", x => x.id);
                    table.ForeignKey(
                        name: "FK_coupon_usage_coupon_coupon_id",
                        column: x => x.coupon_id,
                        principalTable: "coupon",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_coupon_usage_ticket_order_ticket_order_id",
                        column: x => x.ticket_order_id,
                        principalTable: "ticket_order",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ticket_bought",
                columns: table => new
                {
                    user_run = table.Column<string>(type: "NVARCHAR2(450)", nullable: false),
                    tier_id = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    bought_at = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    ticket_status = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ticket_bought", x => new { x.user_run, x.tier_id });
                    table.ForeignKey(
                        name: "FK_ticket_bought_ticket_tier_tier_id",
                        column: x => x.tier_id,
                        principalTable: "ticket_tier",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ticket_bought_user_user_run",
                        column: x => x.user_run,
                        principalTable: "user",
                        principalColumn: "run",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ticket_order_item",
                columns: table => new
                {
                    id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    order_id = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    tier_id = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    quantity = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    price_per_ticket = table.Column<decimal>(type: "DECIMAL(18, 2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ticket_order_item", x => x.id);
                    table.ForeignKey(
                        name: "FK_ticket_order_item_ticket_order_order_id",
                        column: x => x.order_id,
                        principalTable: "ticket_order",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ticket_order_item_ticket_tier_tier_id",
                        column: x => x.tier_id,
                        principalTable: "ticket_tier",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_analytics_event_session_id",
                table: "analytics_event",
                column: "session_id");

            migrationBuilder.CreateIndex(
                name: "IX_analytics_session_user_run",
                table: "analytics_session",
                column: "user_run");

            migrationBuilder.CreateIndex(
                name: "IX_calendar_event_internal_event_id",
                table: "calendar_event",
                column: "internal_event_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_coupon_event_id",
                table: "coupon",
                column: "event_id");

            migrationBuilder.CreateIndex(
                name: "IX_coupon_usage_coupon_id",
                table: "coupon_usage",
                column: "coupon_id");

            migrationBuilder.CreateIndex(
                name: "IX_coupon_usage_ticket_order_id",
                table: "coupon_usage",
                column: "ticket_order_id");

            migrationBuilder.CreateIndex(
                name: "IX_event_company",
                table: "event",
                column: "company");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_bought_tier_id",
                table: "ticket_bought",
                column: "tier_id");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_order_user_run",
                table: "ticket_order",
                column: "user_run");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_order_item_order_id",
                table: "ticket_order_item",
                column: "order_id");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_order_item_tier_id",
                table: "ticket_order_item",
                column: "tier_id");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_tier_event",
                table: "ticket_tier",
                column: "event");

            migrationBuilder.CreateIndex(
                name: "IX_user_admin_company_company",
                table: "user_admin_company",
                column: "company");

            migrationBuilder.CreateIndex(
                name: "IX_user_mod_company_company",
                table: "user_mod_company",
                column: "company");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "analytics_event");

            migrationBuilder.DropTable(
                name: "calendar_event");

            migrationBuilder.DropTable(
                name: "coupon_usage");

            migrationBuilder.DropTable(
                name: "ticket_bought");

            migrationBuilder.DropTable(
                name: "ticket_order_item");

            migrationBuilder.DropTable(
                name: "user_admin_company");

            migrationBuilder.DropTable(
                name: "user_mod_company");

            migrationBuilder.DropTable(
                name: "analytics_session");

            migrationBuilder.DropTable(
                name: "coupon");

            migrationBuilder.DropTable(
                name: "ticket_order");

            migrationBuilder.DropTable(
                name: "ticket_tier");

            migrationBuilder.DropTable(
                name: "user");

            migrationBuilder.DropTable(
                name: "event");

            migrationBuilder.DropTable(
                name: "company");
        }
    }
}
