-- Fix password column length for bcrypt hashes
-- bcrypt produces 60-character hashes, but we use VARCHAR(255) for safety
-- Current: VARCHAR(32) - too short!
-- New: VARCHAR(255)

ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NOT NULL;

-- Verify the change
DESCRIBE users;
