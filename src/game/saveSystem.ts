import { SaveData } from '../types';

const SALT = "P0CK3T_QU3RY_S3CR3T_K3Y_2026";
const SAVE_KEY = "POCKET_QUERY_SAVE";

export function saveGame(data: SaveData): void {
  const jsonStr = JSON.stringify(data);
  let encrypted = "";
  for (let i = 0; i < jsonStr.length; i++) {
    const charCode = jsonStr.charCodeAt(i) ^ SALT.charCodeAt(i % SALT.length);
    encrypted += String.fromCharCode(charCode);
  }
  localStorage.setItem(SAVE_KEY, btoa(encrypted));
}

export function loadGame(): SaveData | null {
  const b64Str = localStorage.getItem(SAVE_KEY);
  if (!b64Str) return null;
  try {
    const encrypted = atob(b64Str);
    let decrypted = "";
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i) ^ SALT.charCodeAt(i % SALT.length);
      decrypted += String.fromCharCode(charCode);
    }
    return JSON.parse(decrypted);
  } catch (e) {
    return null;
  }
}
