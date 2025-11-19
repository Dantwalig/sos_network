// src/lib/utils/verification.ts

/**
 * Generate a 4-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Verify if a code matches
 */
export function verifyCode(provided: string, expected: string): boolean {
  return provided.trim() === expected.trim();
}

/**
 * Generate a human-readable verification phrase (alternative to numeric codes)
 */
export function generateVerificationPhrase(): string {
  const adjectives = ['Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Orange'];
  const nouns = ['Lion', 'Tiger', 'Eagle', 'Wolf', 'Bear', 'Hawk'];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adjective} ${noun}`;
}