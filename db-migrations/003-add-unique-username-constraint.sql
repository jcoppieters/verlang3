-- Add UNIQUE constraint to users.username to prevent duplicate usernames
-- This prevents TOCTOU race conditions during registration

ALTER TABLE users ADD UNIQUE KEY unique_username (username);

-- Note: For email, the application allows duplicates in updateProfile
-- but enforces uniqueness during registration. If you want to enforce
-- uniqueness at the database level for email as well, uncomment:
-- ALTER TABLE users ADD UNIQUE KEY unique_email (email);
