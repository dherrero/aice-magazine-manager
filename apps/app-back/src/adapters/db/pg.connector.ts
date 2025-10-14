import { Sequelize } from 'sequelize';

// Configuración de la base de datos con valores por defecto y mejor manejo de errores
const dbConfig = {
  dialect: 'postgres' as const,
  host: process.env.POSTGRESDB_HOST ?? 'postgresdb',
  port: process.env.POSTGRESDB_PORT
    ? Number(process.env.POSTGRESDB_PORT)
    : 5432,
  database: process.env.POSTGRESDB_DATABASE ?? 'aice_magazine',
  username: process.env.POSTGRESDB_USER ?? 'postgres',
  password: process.env.POSTGRESDB_PASSWORD ?? 'postgres',
  logging: process.env.NODE_PRODUCTION === 'true' ? false : console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  retry: {
    match: [
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /ECONNRESET/,
      /ECONNREFUSED/,
      /ETIMEDOUT/,
      /ESOCKETTIMEDOUT/,
      /EHOSTUNREACH/,
      /EPIPE/,
      /EAI_AGAIN/,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
    ],
    max: 3,
  },
  dialectOptions: {
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
  },
};

export const db = new Sequelize(dbConfig);

// Función para probar la conexión
export const testConnection = async (): Promise<boolean> => {
  try {
    await db.authenticate();
    console.log('✅ Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
};
