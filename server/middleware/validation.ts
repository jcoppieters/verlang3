import { Request, Response, NextFunction } from 'express';
import { isValidEmail, isEmpty } from '../utils/helpers';

// Validate registration data
export function validateRegistration(req: Request, res: Response, next: NextFunction): void {
  const { username, password, name, email } = req.body;
  const errors: string[] = [];

  if (isEmpty(username)) {
    errors.push('Username is required');
  } else if (username.length < 3) {
    errors.push('Username must be at least 3 characters');
  } else if (username.length > 50) {
    errors.push('Username must be less than 50 characters');
  }

  if (isEmpty(password)) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (isEmpty(name)) {
    errors.push('Name is required');
  }

  if (isEmpty(email)) {
    errors.push('Email is required');
  } else if (!isValidEmail(email)) {
    errors.push('Invalid email format');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: errors.join('. ')
    });
    return;
  }

  next();
}

// Validate login data
export function validateLogin(req: Request, res: Response, next: NextFunction): void {
  const { username, password } = req.body;
  const errors: string[] = [];

  if (isEmpty(username)) {
    errors.push('Username is required');
  }

  if (isEmpty(password)) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: errors.join('. ')
    });
    return;
  }

  next();
}

// Validate list data
export function validateList(req: Request, res: Response, next: NextFunction): void {
  const { name, public: isPublic } = req.body;
  const errors: string[] = [];

  if (isEmpty(name)) {
    errors.push('List name is required');
  } else if (name.length > 64) {
    errors.push('List name must be less than 64 characters');
  }

  if (isPublic && !['Y', 'N'].includes(isPublic)) {
    errors.push('Invalid public value (must be Y or N)');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: errors.join('. ')
    });
    return;
  }

  next();
}

// Validate item data
export function validateItem(req: Request, res: Response, next: NextFunction): void {
  const { name, url, description, price, priority } = req.body;
  const errors: string[] = [];

  if (isEmpty(name)) {
    errors.push('Item name is required');
  } else if (name.length > 128) {
    errors.push('Item name must be less than 128 characters');
  }

  if (url && url.length > 255) {
    errors.push('URL must be less than 255 characters');
  }

  if (description && description.length > 255) {
    errors.push('Description must be less than 255 characters');
  }

  if (price && price.length > 64) {
    errors.push('Price must be less than 64 characters');
  }

  if (priority !== undefined) {
    const priorityNum = parseInt(priority);
    if (isNaN(priorityNum) || priorityNum < 0 || priorityNum > 100) {
      errors.push('Priority must be a number between 0 and 100');
    }
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: errors.join('. ')
    });
    return;
  }

  next();
}
