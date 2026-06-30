export interface Config {
  env: 'development' | 'production';
  
  server: {
    port: number;
    appUrl: string;
    clientUrl: string;
  };

  database: {
    host: string;
    user: string;
    password: string;
    name: string;
    port: number;
  };

  jwt: {
    secret: string;
    expiresIn: string | number;
  };

  bcrypt: {
    rounds: number;
  };

  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };

  session: {
    secret: string;
  };

  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    from: string;
    fromName: string;
  };
}

export const config: Config = {
  env: 'development',
  
  server: {
    port: 3000,
    appUrl: 'http://localhost:3000',
    clientUrl: 'http://localhost:3000'
  },

  database: {
    host: 'localhost',
    user: 'root',
    password: '',
    name: 'verlang',
    port: 3306
  },

  jwt: {
    secret: 'your-secret-key-change-this',
    expiresIn: '7d'
  },

  bcrypt: {
    rounds: 10
  },

  rateLimit: {
    windowMs: 900000, // 15 minutes
    maxRequests: 100
  },

  session: {
    secret: 'your-session-secret-change-this'
  },

  smtp: {
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    user: 'noreply@example.com',
    password: '',
    from: 'noreply@example.com',
    fromName: 'Verlanglijstje'
  }
};

// Try to load development config
try {
  const devConfig = require('./conf.dev');
  if (devConfig && devConfig.config) {
    merge(config, devConfig.config);
  }
} catch (e) {
  // No dev config, try production
  try {
    const prodConfig = require('./conf.prod');
    if (prodConfig && prodConfig.config) {
      merge(config, prodConfig.config);
    }
  } catch (e) {
    // No custom config found, use defaults
  }
}

function merge(dest: any, src: any) {
  Object.keys(src).forEach(name => {
    if (typeof src[name] !== 'object' || src[name] === null) {
      dest[name] = src[name];
    } else {
      if (!dest[name]) dest[name] = {};
      merge(dest[name], src[name]);
    }
  });
}
