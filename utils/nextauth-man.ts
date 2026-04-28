import { jwtDecrypt } from "jose";
// Manual Token Decoder for Edge Runtime

/**
 * Replicates NextAuth's key derivation logic to decrypt its session tokens
 * using the Web Crypto API (supported in Edge Runtime).
 */
async function getDerivedEncryptionKey(secret: string) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HKDF" },
    false,
    ["deriveBits"]
  );

  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: encoder.encode(""),
      info: encoder.encode("NextAuth.js Generated Encryption Key"),
    },
    keyMaterial,
    256 // 32 bytes * 8 bits
  );

  return new Uint8Array(derivedKey);
}

/**
 * Manual implementation of NextAuth's getToken to avoid dependency on next-auth/jwt
 */
export async function getManualToken(req: any) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return null;

  // NextAuth cookies are usually named 'next-auth.session-token' or '__Secure-next-auth.session-token'
  const cookieName = process.env.NODE_ENV === "production" 
    ? "__Secure-next-auth.session-token" 
    : "next-auth.session-token";
  
  const token = req.cookies.get(cookieName)?.value;
  if (!token) return null;

  try {
    const encryptionKey = await getDerivedEncryptionKey(secret);
    const { payload } = await jwtDecrypt(token, encryptionKey);
    return payload;
  } catch (error) {
    console.error("Manual token decryption failed:", error);
    return null;
  }
}
