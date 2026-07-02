# Password Migration

## Overview

This directory contains the password migration script to convert plain text passwords from the old Java application to bcrypt hashes.

## Migration Script

### `migrate-passwords.ts`

Converts all plain text passwords in the database to bcrypt hashes.

**Features:**
- Detects already-hashed passwords (skips them)
- Provides detailed progress reporting
- Safe to run multiple times
- Uses the same bcrypt rounds as the application

### How to Run

**Option 1: Using ts-node directly**
```bash
npx ts-node server/scripts/migrate-passwords.ts
```

**Option 2: Using npm script**
```bash
npm run migrate-passwords
```

### What It Does

1. Fetches all users from the database
2. For each user:
   - Checks if password is already bcrypt hashed (starts with `$2a$`, `$2b$`, or `$2y$`)
   - If plain text: hashes it with bcrypt and updates the database
   - If already hashed: skips it
3. Provides a summary of:
   - Successfully migrated passwords
   - Already-hashed passwords (skipped)
   - Errors (if any)

### Example Output

```
🔒 Starting password migration...

Found 42 users to migrate

✅ Migrated user: johndoe
✅ Migrated user: janedoe
⏭️  Skipping user: admin (already hashed)
...

📊 Migration Summary:
   ✅ Successfully migrated: 40
   ⏭️  Already hashed (skipped): 2
   ❌ Errors: 0

✨ Password migration complete!
```

### When to Run

**Before first production use:**
- Run this script ONCE before deploying the new application
- All new user registrations will use bcrypt automatically
- Existing users with plain text passwords will be migrated

### Safety

- The script is **idempotent** - safe to run multiple times
- Already-hashed passwords are automatically detected and skipped
- No passwords are lost or damaged in the process

### After Migration

Once the migration is complete:
- ✅ Login will use bcrypt password verification
- ✅ Password changes will use bcrypt
- ✅ New user registrations will use bcrypt
- ✅ Password reset will use bcrypt

## Database Migrations

See `db-migrations/` directory for SQL schema changes:
- `001-fix-password-column-length.sql` - Increase password column to VARCHAR(255)
- `002-add-password-reset-columns.sql` - Add reset token columns for forgot password
