import { describe, it, expect, beforeAll } from 'vitest';
import { makeJWT, validateJWT, hashPassword, checkPasswordHash, getBearerToken } from './auth.js';

describe('Password Hashing', () => {
  const password1 = 'correctPassword123!';
  const password2 = 'anotherPassword456!';
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it('should return true for the correct password', async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe('JWT Authentication', () => {
  const secret = 'test-secret';
  const userId = 'user-123';
  const expiresIn = 3600; // 1 hour in seconds
  
  
  it('should create a valid JWT', () => {
    const token = makeJWT(userId, expiresIn, secret);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });
  
  it('should validate a valid JWT', () => {
    const token = makeJWT(userId, expiresIn, secret);
    const extractedUserId = validateJWT(token, secret);
    expect(extractedUserId).toBe(userId);
  });
  
  it('should reject an expired JWT', () => {
    // Create a token that expires immediately
    const token = makeJWT(userId, -10, secret);
    expect(() => validateJWT(token, secret)).toThrow();
  });
  
  it('should reject a JWT with wrong secret', () => {
    const token = makeJWT(userId, expiresIn, secret);
    expect(() => validateJWT(token, 'wrong-secret')).toThrow();
  });

  const req = {
    "headers": {
      'Authorization': ""
    }
  }

  // it('should reject a JWT with wrong secret', () => {
  //   const JWT_token = makeJWT(userId, expiresIn, secret);
  //   expect(() => getBearerToken(req)).toBe(JWT_token);
  // });
});