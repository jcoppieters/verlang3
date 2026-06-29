import { Response } from 'express';
import bcrypt from 'bcrypt';
import { AuthRequest } from '../middleware/auth';
import { query, queryOne, insert } from '../config/database';
import { generateToken } from '../middleware/auth';

interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  since: Date;
  lastlogin: Date | null;
}

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10');

// Register new user
export async function register(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { username, password, name, email } = req.body;

    // Check if username already exists
    const existingUser = await queryOne<User>(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'Username already exists'
      });
      return;
    }

    // Check if email already exists
    const existingEmail = await queryOne<User>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingEmail) {
      res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Insert user
    const userId = await insert(
      'INSERT INTO users (username, password, name, email, since) VALUES (?, ?, ?, ?, NOW())',
      [username, hashedPassword, name, email]
    );

    // Get the created user
    const user = await queryOne<User>(
      'SELECT id, username, name, email, since FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      res.status(500).json({
        success: false,
        error: 'Failed to create user'
      });
      return;
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      username: user.username,
      name: user.name
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        since: user.since
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
}

// Login user
export async function login(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    // Get user by username or email (case-insensitive)
    const user = await queryOne<User>(
      'SELECT * FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)',
      [username, username]
    );

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
      return;
    }

    // Verify password
    // TODO: Re-enable bcrypt password hashing before production
    // const isValidPassword = await bcrypt.compare(password, user.password);
    const isValidPassword = password === user.password; // Plain text comparison for legacy DB

    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
      return;
    }

    // Update last login
    await query(
      'UPDATE users SET lastlogin = NOW() WHERE id = ?',
      [user.id]
    );

    // Generate token
    const token = generateToken({
      id: user.id,
      username: user.username,
      name: user.name
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        since: user.since,
        lastlogin: new Date()
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
}

// Get current user profile
export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    const user = await queryOne<User>(
      'SELECT id, username, name, email, since, lastlogin FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
}

// Update user profile
export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    const { name, email } = req.body;

    // Update user (email doesn't need to be unique)
    await query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name || req.user.name, email, req.user.id]
    );

    // Get updated user
    const user = await queryOne<User>(
      'SELECT id, username, name, email FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
}

// Update password
export async function updatePassword(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    // Get current user with password
    const user = await queryOne<User>(
      'SELECT * FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    // Update password
    await query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update password'
    });
  }
}
