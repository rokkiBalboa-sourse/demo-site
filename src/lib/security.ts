import crypto from 'crypto';

/**
 * Secret key for HMAC token signatures.
 * Uses AUTH_SECRET or SESSION_SECRET from environment if provided,
 * otherwise falls back to a deterministic development key.
 */
const TOKEN_SECRET =
  process.env.AUTH_SECRET ||
  process.env.SESSION_SECRET ||
  'sudostudy-secure-token-signing-secret-key-alt-linux-exam-2026';

/**
 * Constant-time comparison between two strings.
 * Hashes inputs with SHA-256 before comparing to prevent timing leaks on length.
 */
export function timingSafeCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

// ============================================================================
// Password Hashing (Salted scrypt)
// ============================================================================

/**
 * Hashes a plaintext password using crypto.scrypt with a random 16-byte salt.
 * Returns format: scrypt$<saltHex>$<derivedKeyHex>
 */
export function hashPassword(password: string): string {
  const cleanPassword = password.trim();
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(cleanPassword, salt, 64).toString('hex');
  return `scrypt$${salt}$${derivedKey}`;
}

/**
 * Verifies a plaintext password against a stored password string.
 * Supports both modern scrypt hashes and legacy plaintext values (transparent upgrade).
 */
export function verifyPassword(
  password: string,
  storedHash: string
): { isValid: boolean; needsRehash: boolean } {
  if (!password || !storedHash) {
    return { isValid: false, needsRehash: false };
  }

  const cleanPassword = password.trim();

  // If already hashed with scrypt
  if (storedHash.startsWith('scrypt$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 3) {
      return { isValid: false, needsRehash: false };
    }
    const salt = parts[1];
    const expectedKeyHex = parts[2];
    const derivedKey = crypto.scryptSync(cleanPassword, salt, 64);
    const expectedKeyBuffer = Buffer.from(expectedKeyHex, 'hex');

    if (derivedKey.length !== expectedKeyBuffer.length) {
      return { isValid: false, needsRehash: false };
    }

    const isValid = crypto.timingSafeEqual(derivedKey, expectedKeyBuffer);
    return { isValid, needsRehash: false };
  }

  // Legacy plaintext fallback (seed accounts like admin123, student123)
  const isValid = timingSafeCompare(cleanPassword, storedHash.trim());
  return { isValid, needsRehash: isValid };
}

// ============================================================================
// Cryptographically Signed Tokens (HMAC-SHA256)
// ============================================================================

/**
 * Signs an arbitrary JSON payload using HMAC-SHA256.
 * Format: <base64urlPayload>.<base64urlSignature>
 */
export function signToken(payload: Record<string, unknown>): string {
  const serialized = JSON.stringify(payload);
  const encodedPayload = Buffer.from(serialized, 'utf-8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(encodedPayload)
    .digest('base64url');
  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies and decodes a signed token. Returns null if invalid or tampered with.
 */
export function verifyToken<T = Record<string, unknown>>(token: string): T | null {
  if (!token || typeof token !== 'string') return null;

  const dotIndex = token.lastIndexOf('.');
  if (dotIndex <= 0 || dotIndex === token.length - 1) return null;

  const encodedPayload = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);

  const expectedSignature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  if (!timingSafeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const parsed = JSON.parse(jsonStr);
    return parsed as T;
  } catch {
    return null;
  }
}

// ============================================================================
// 2FA Rate Limiting & 10-Minute Lockout
// ============================================================================

export const MAX_2FA_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10 minutes (600 seconds)

interface AttemptEntry {
  failedCount: number;
  lockedUntil: number | null;
  lastAttemptAt: number;
}

// Store rate limit state in global object to persist across HMR reloads in Next.js dev server
declare global {
  // eslint-disable-next-line no-var
  var __sudoStudy2FALockouts: Map<string, AttemptEntry> | undefined;
}

const lockoutStore = global.__sudoStudy2FALockouts ?? new Map<string, AttemptEntry>();
if (!global.__sudoStudy2FALockouts) {
  global.__sudoStudy2FALockouts = lockoutStore;
}

function normalizeKey(identifier: string): string {
  return identifier.trim().toLowerCase();
}

/**
 * Formats seconds into Russian readable string (e.g. "9 мин. 45 сек." or "10 минут")
 */
export function formatRemainingTime(seconds: number): string {
  if (seconds <= 0) return '0 сек.';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs} сек.`;
  if (secs === 0) return `${mins} мин.`;
  return `${mins} мин. ${secs} сек.`;
}

/**
 * Checks if a user is currently locked out from 2FA attempts.
 */
export function check2FALockout(identifier: string): {
  isLocked: boolean;
  remainingSeconds: number;
  attemptsLeft: number;
  failedCount: number;
} {
  const key = normalizeKey(identifier);
  const record = lockoutStore.get(key);
  const now = Date.now();

  if (!record) {
    return {
      isLocked: false,
      remainingSeconds: 0,
      attemptsLeft: MAX_2FA_ATTEMPTS,
      failedCount: 0,
    };
  }

  // If locked out
  if (record.lockedUntil) {
    if (now < record.lockedUntil) {
      const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return {
        isLocked: true,
        remainingSeconds,
        attemptsLeft: 0,
        failedCount: record.failedCount,
      };
    }
    // Lockout expired: reset record
    lockoutStore.delete(key);
    return {
      isLocked: false,
      remainingSeconds: 0,
      attemptsLeft: MAX_2FA_ATTEMPTS,
      failedCount: 0,
    };
  }

  // If inactive for more than 10 minutes without lock, clean up
  if (now - record.lastAttemptAt > LOCKOUT_DURATION_MS) {
    lockoutStore.delete(key);
    return {
      isLocked: false,
      remainingSeconds: 0,
      attemptsLeft: MAX_2FA_ATTEMPTS,
      failedCount: 0,
    };
  }

  const attemptsLeft = Math.max(0, MAX_2FA_ATTEMPTS - record.failedCount);
  return {
    isLocked: false,
    remainingSeconds: 0,
    attemptsLeft,
    failedCount: record.failedCount,
  };
}

/**
 * Records a failed 2FA code attempt.
 * If 5 failed attempts are reached, locks the user out for 10 minutes.
 */
export function record2FAFailure(identifier: string): {
  isLocked: boolean;
  remainingSeconds: number;
  attemptsLeft: number;
  failedCount: number;
} {
  const key = normalizeKey(identifier);
  const now = Date.now();
  let record = lockoutStore.get(key);

  if (!record || (record.lockedUntil && now >= record.lockedUntil)) {
    record = {
      failedCount: 1,
      lockedUntil: null,
      lastAttemptAt: now,
    };
  } else {
    record.failedCount += 1;
    record.lastAttemptAt = now;
  }

  if (record.failedCount >= MAX_2FA_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    lockoutStore.set(key, record);
    return {
      isLocked: true,
      remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
      attemptsLeft: 0,
      failedCount: record.failedCount,
    };
  }

  lockoutStore.set(key, record);
  return {
    isLocked: false,
    remainingSeconds: 0,
    attemptsLeft: MAX_2FA_ATTEMPTS - record.failedCount,
    failedCount: record.failedCount,
  };
}

/**
 * Resets lockout and failed attempts counter upon successful 2FA code entry.
 */
export function reset2FALockout(identifier: string): void {
  const key = normalizeKey(identifier);
  lockoutStore.delete(key);
}
