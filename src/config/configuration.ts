export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  database: {
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    name: process.env.POSTGRES_DB || 'regenera-db',
    url: process.env.DATABASE_URL || 'localhost',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
  },
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS_OF_HASHING, 10) || 10,
  },
  jwt: {
    accessSecretKey: process.env.JWT_ACCESS_SECRET_KEY || 'access',
    refreshSecretKey: process.env.JWT_REFRESH_SECRET_KEY || 'refresh',
  },
});
