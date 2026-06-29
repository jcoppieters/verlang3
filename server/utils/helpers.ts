// Share ID encoding (must match Java implementation)
export function encodeShareId(id: number): number {
  return ((id * 97) + 17) * 97 + 19;
}

export function decodeShareId(encodedId: number): number {
  return Math.floor((((encodedId - 19) / 97) - 17) / 97);
}

// Format date for MySQL
export function formatDateForMySQL(date: Date | string | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize input (basic XSS prevention)
export function sanitizeInput(input: any): any {
  if (typeof input !== 'string') return input;
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Check if string is empty
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

// Generate random token for password reset
export function generateToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
