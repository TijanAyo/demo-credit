import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    "transactions",
    (table: Knex.CreateTableBuilder) => {
      table.increments("id").primary();
      table.string("amount").notNullable();
      table.string("status").notNullable();
      table.string("description").notNullable();
      table.string("reference").notNullable();
      table
        .integer("wallet_id")
        .unsigned()
        .references("id")
        .inTable("wallets")
        .onDelete("CASCADE");
      table.timestamps(true, true);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("transactions");
}
