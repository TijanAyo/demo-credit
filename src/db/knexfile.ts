import type { Knex } from "knex";
import * as dotenv from "dotenv";
import { environment } from "../config";

// dotenv.config({ path: "../../.env" });
dotenv.config();

interface IknexConfig {
  [key: string]: Knex.Config;
}

const config: IknexConfig = {
  development: {
    client: "mysql2",
    connection: {
      host: environment.DB_HOST,
      port: Number(environment.DB_PORT),
      database: environment.DB_NAME,
      user: environment.DB_USER,
      password: environment.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },
  test: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;
