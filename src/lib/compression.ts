import LZString from 'lz-string';

export interface PyarcelPayload {
  s: string; // sender
  a: boolean; // is anonymous
  r: string; // recipient
  rel: string; // relationship
  d: string; // destination
  i: Record<string, number>; // items { itemId: quantity }
  m: string; // message
  id: string; // unique order id
  ts: number; // timestamp
  u?: string; // UTR transaction ID
  th?: string; // theme
  v?: string; // voicenote URL
  sig?: string; // HMAC signature
}

export function encodePayload(payload: PyarcelPayload): string {
  const jsonStr = JSON.stringify(payload);
  const base64 = LZString.compressToBase64(jsonStr);
  // Convert standard Base64 to strictly URL-safe Base64Url
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodePayload(encoded: string): PyarcelPayload | null {
  try {
    // Convert Base64Url back to standard Base64
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonStr = LZString.decompressFromBase64(base64);
    if (!jsonStr) return null;
    return JSON.parse(jsonStr) as PyarcelPayload;
  } catch (e) {
    console.error("Failed to decode payload", e);
    return null;
  }
}
