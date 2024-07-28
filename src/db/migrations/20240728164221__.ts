import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (table: Knex.AlterTableBuilder) => {
    table.string("bvn", 255).notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (table: Knex.AlterTableBuilder) => {
    table.string("bvn", 20).notNullable().alter();
  });
}
