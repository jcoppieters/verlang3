-- Add password reset token columns to users table
-- These columns support the "forgot password" functionality

ALTER TABLE users 
ADD COLUMN reset_token VARCHAR(64) NULL DEFAULT NULL,
ADD COLUMN reset_token_expiry DATETIME NULL DEFAULT NULL;

-- Add index for faster lookups
CREATE INDEX idx_reset_token ON users(reset_token);

-- Verify the changes
DESCRIBE users;
