-- Fix password column length for bcrypt hashes
-- bcrypt produces 60-character hashes, but we use VARCHAR(255) for safety
-- Current: VARCHAR(32) - too short!
-- New: VARCHAR(255)

ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NOT NULL;

-- Just in case something goes wrong in the password migration, 
-- I copy the current password into another column.
ALTER TABLE users ADD COLUMN old_password VARCHAR(32) NOT NULL;
UPDATE users SET old_password = password;

-- Verify the change
DESCRIBE users;
