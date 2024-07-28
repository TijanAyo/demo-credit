import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (table: Knex.AlterTableBuilder) => {
    table.string("transaction_pin", 255).nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (table: Knex.AlterTableBuilder) => {
    table.string("transaction_pin", 4).notNullable().alter();
  });
}
