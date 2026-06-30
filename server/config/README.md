# Configuration

This project uses a TypeScript-based configuration system instead of `.env` files.

## Setup

1. Copy the example configuration to create your local config:
   ```bash
   cp server/config/conf.dev.ts.example server/config/conf.dev.ts
   ```

2. Edit `server/config/conf.dev.ts` with your local development settings:
   - Database credentials
   - JWT secrets
   - SMTP settings
   - etc.

## Configuration Files

- `server/config/conf.ts` - Base configuration with defaults
- `server/config/conf.dev.ts` - Development overrides (not in git)
- `server/config/conf.prod.ts` - Production overrides (not in git)

The system will try to load `conf.dev.ts` first, then `conf.prod.ts` if dev is not found.
Any settings in these files will override the base configuration.

## Example

```typescript
import { Config } from './conf';

export const config: Partial<Config> = {
  database: {
    host: 'localhost',
    user: 'root',
    password: 'your-password',
    name: 'verlang',
    port: 3306
  },

  jwt: {
    secret: 'your-jwt-secret',
    expiresIn: '7d'
  }
};
```

## Security

**Never commit `conf.dev.ts` or `conf.prod.ts` files!**

These files are in `.gitignore` and should contain sensitive credentials only.
