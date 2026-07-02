-- Drop the legacy plain/MD5-era password column.
-- ONLY run this once you have confirmed all users are migrated to bcrypt
-- (i.e. server/scripts/migrate-passwords.ts has been run and login works for everyone).

ALTER TABLE users DROP COLUMN old_password;
