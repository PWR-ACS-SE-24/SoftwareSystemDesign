interface AppConfig {
  PROD: boolean;
  LEPRECHAUN_APP_PORT: number;
  LEPRECHAUN_DATABASE_HOST: string;
  LEPRECHAUN_DATABASE_DBNAME: string;
}

const config: AppConfig = {
  PROD: process.env.NODE_ENV === 'production',
  LEPRECHAUN_APP_PORT: parseInt(process.env.LEPRECHAUN_APP_PORT!) || 3000,
  LEPRECHAUN_DATABASE_HOST: process.env.LEPRECHAUN_DATABASE_HOST ?? 'postgresql://postgres:test@localhost:5432',
  LEPRECHAUN_DATABASE_DBNAME: process.env.LEPRECHAUN_DATABASE_DBNAME ?? 'leprechaun',
};

export default config;
