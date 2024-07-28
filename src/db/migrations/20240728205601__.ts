import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    "wallets",
    (table: Knex.CreateTableBuilder) => {
      table.increments("id").primary();
      table.string("account_number").notNullable().unique();
      table.string("account_bank").notNullable();
      table.decimal("balance", 14, 2).nullable().defaultTo(0.0);
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.timestamps(true, true);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("wallets");
}
