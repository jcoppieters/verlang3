import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/conf';

const JWT_SECRET = config.jwt.secret;

export interface UserPayload {
  id: number;
  username: string;
  name: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

// Verify JWT token middleware
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
      return;
    }

    req.user = user as UserPayload;
    next();
  });
}

// Optional authentication (doesn't fail if no token)
export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user as UserPayload;
      }
    });
  }

  next();
}

// Generate JWT token
export function generateToken(user: { id: number; username: string; name: string }): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: config.jwt.expiresIn as any }
  );
}
