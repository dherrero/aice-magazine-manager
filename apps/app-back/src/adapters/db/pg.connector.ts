import { Sequelize } from 'sequelize';

export const db = new Sequelize({
  dialect: 'postgres',
  host: process.env.POSTGRESDB_HOST ?? 'localhost',
  port: process.env.POSTGRESDB_PORT
    ? Number(process.env.POSTGRESDB_PORT)
    : 5432,
  database: process.env.POSTGRESDB_DATABASE ?? 'postgres',
  username: process.env.POSTGRESDB_USER ?? 'postgres',
  password: process.env.POSTGRESDB_PASSWORD ?? 'postgres',
  logging: process.env.NODE_PRODUCTION === 'true' ? false : console.log,
});
