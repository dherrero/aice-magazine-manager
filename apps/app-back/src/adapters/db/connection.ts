import { Sequelize } from 'sequelize';

export const db = new Sequelize({
  dialect: 'postgres',
  host: process.env.NODE_POSTGRESDB_HOST ?? 'localhost',
  port: process.env.NODE_POSTGRESDB_LOCAL_PORT
    ? Number(process.env.NODE_POSTGRESDB_LOCAL_PORT)
    : 5432,
  database: process.env.NODE_POSTGRESDB_DATABASE ?? 'postgres',
  username: process.env.NODE_POSTGRESDB_USER ?? 'postgres',
  password: process.env.NODE_POSTGRESDB_PASSWORD ?? 'postgres',
  logging: Boolean(process.env.NODE_PRODUCTION),
});
