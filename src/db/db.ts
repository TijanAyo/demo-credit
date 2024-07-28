import knex from "knex";
import config from "./knexfile";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const env = process.env.NODE_ENV || "development";
const configOptions = config[env];

if (!configOptions) {
  console.log(`No Knex configuration found for environment: ${env}`);
}

export const KNEX = knex(configOptions);
