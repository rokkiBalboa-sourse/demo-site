import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';

const ISSUER = 'SudoStudy Exam';

/**
 * Generate a new random Base32 TOTP secret
 */
export function generateTotpSecret(): string {
  const secret = new OTPAuth.Secret({ size: 20 });
  return secret.base32;
}

/**
 * Build TOTP instance for a user
 */
export function getTotpInstance(secretBase32: string, username: string): OTPAuth.TOTP {
  return new OTPAuth.TOTP({
    issuer: ISSUER,
    label: username,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secretBase32),
  });
}

/**
 * Generate QR code Data URL (PNG base64) for otpauth URI
 */
export async function generateTotpQRCode(secretBase32: string, username: string): Promise<string> {
  const totp = getTotpInstance(secretBase32, username);
  const uri = totp.toString();
  return QRCode.toDataURL(uri, {
    margin: 2,
    width: 250,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });
}

/**
 * Verify a 6-digit TOTP code against a secret
 * Window: 1 (allows +/- 30 seconds drift for desynchronized clocks)
 */
export function verifyTotpCode(secretBase32: string, code: string, username = 'user'): boolean {
  if (!secretBase32 || !code) return false;
  const cleanCode = code.replace(/\s+/g, '').trim();
  if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) return false;

  const totp = getTotpInstance(secretBase32, username);
  const delta = totp.validate({
    token: cleanCode,
    window: 1,
  });

  return delta !== null;
}
