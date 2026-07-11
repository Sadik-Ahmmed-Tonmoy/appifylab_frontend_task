/**
 * Decode a JWT and return its expiration timestamp in milliseconds.
 * Returns null if the token is invalid or has no 'exp' claim.
 */
export function getExpiryFromToken(token: string): number | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    if (payload.exp && typeof payload.exp === 'number') {
      return payload.exp * 1000; // exp is in seconds → milliseconds
    }
    return null;
  } catch {
    return null;
  }
}