import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (table: Knex.AlterTableBuilder) => {
    table.renameColumn("settlement_account", "settlement_account_number");
    table.string("settlement_account_name").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (table: Knex.AlterTableBuilder) => {
    table.renameColumn("settlement_account_number", "settlement_account");
    table.dropColumn("settlement_account_name");
  });
}
