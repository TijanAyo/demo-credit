import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table: Knex.CreateTableBuilder) => {
    table.increments("id").primary();
    table.string("first_name", 50).notNullable();
    table.string("last_name", 50).notNullable();
    table.string("email_address", 100).notNullable().unique();
    table.string("bvn", 20).notNullable();
    table.string("password", 255).notNullable();
    table.string("phone_number", 20).notNullable();
    table.string("settlement_account", 20).nullable();
    table.string("transaction_pin", 4).nullable();
    table.boolean("is_settlement_account_set").defaultTo(false);
    table.boolean("is_transaction_pin_set").defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("users");
}
