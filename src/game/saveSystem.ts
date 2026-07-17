import { SaveData } from '../types';

const SALT = "P0CK3T_QU3RY_S3CR3T_K3Y_2026";
const SAVE_KEY = "POCKET_QUERY_SAVE";

export function saveGame(data: SaveData): void {
  const jsonStr = JSON.stringify(data);
  const encoder = new TextEncoder();
  const bytes = encoder.encode(jsonStr);
  const encryptedBytes = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    encryptedBytes[i] = bytes[i] ^ SALT.charCodeAt(i % SALT.length);
  }
  const binString = Array.from(encryptedBytes, (byte) => String.fromCharCode(byte)).join("");
  localStorage.setItem(SAVE_KEY, btoa(binString));
}

export function loadGame(): SaveData | null {
  const b64Str = localStorage.getItem(SAVE_KEY);
  if (!b64Str) return null;
  try {
    // Try modern UTF-8 decoder first
    const binString = atob(b64Str);
    const encryptedBytes = new Uint8Array(binString.length);
    for (let i = 0; i < binString.length; i++) {
      encryptedBytes[i] = binString.charCodeAt(i);
    }
    const bytes = new Uint8Array(encryptedBytes.length);
    for (let i = 0; i < encryptedBytes.length; i++) {
      bytes[i] = encryptedBytes[i] ^ SALT.charCodeAt(i % SALT.length);
    }
    const decoder = new TextDecoder();
    const decrypted = decoder.decode(bytes);
    return JSON.parse(decrypted);
  } catch (e) {
    // Fallback to legacy charCode decoder for older saves
    try {
      const encrypted = atob(b64Str);
      let decrypted = "";
      for (let i = 0; i < encrypted.length; i++) {
        const charCode = encrypted.charCodeAt(i) ^ SALT.charCodeAt(i % SALT.length);
        decrypted += String.fromCharCode(charCode);
      }
      return JSON.parse(decrypted);
    } catch (err) {
      return null;
    }
  }
}
