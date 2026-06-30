import { Config } from './conf';

// Development configuration override
// Copy this file to conf.dev.ts or conf.prod.ts and update with your settings
export const config: Partial<Config> = {
  env: 'development',

  server: {
    port: 3000,
    appUrl: 'http://localhost:3000',
    clientUrl: 'http://localhost:3000'
  },

  database: {
    host: 'localhost',
    user: 'root',
    password: 'Jd2qqNAt',
    name: 'verlang',
    port: 3306
  },

  jwt: {
    secret: 'ikke_en_den_dikke',
    expiresIn: '7d'
  },

  bcrypt: {
    rounds: 10
  },

  rateLimit: {
    windowMs: 900000,
    maxRequests: 100
  },

  session: {
    secret: 'Ikke_zonder_den_dikke'
  },

  smtp: {
    host: 'smtp.verlanglijstje.be',
    port: 587,
    secure: false,
    user: 'admin@verlanglijstje.be',
    password: 'Ikke_587',
    from: 'admin@verlanglijstje.be',
    fromName: 'Verlanglijstje.be'
  }
};
