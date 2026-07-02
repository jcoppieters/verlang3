// Share ID encoding (must match Java implementation)
export function encodeShareId(id: number): number {
  return ((id * 97) + 17) * 97 + 19;
}

export function decodeShareId(encodedId: number): number {
  return Math.floor((((encodedId - 19) / 97) - 17) / 97);
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check if string is empty
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}
