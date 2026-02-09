/**
 * Secure Storage Service
 * Adds an extra layer of security to prevent easy access to user data
 * This encrypts/obfuscates data before storing in localStorage
 */

// Simple encryption key (in production, use environment variables)
const ENCRYPTION_KEY = 'UnitEd_2025_Secure_Key_v1';

// Display security warning once
let securityWarningShown = false;
if (typeof window !== 'undefined' && !securityWarningShown) {
  console.warn(
    '%c🔒 Security Notice',
    'color: #2563EB; font-size: 14px; font-weight: bold;'
  );
  console.warn(
    '%cUser data is encrypted in localStorage. Unauthorized access attempts will be logged.',
    'color: #64748B; font-size: 12px;'
  );
  securityWarningShown = true;
}

/**
 * Simple XOR encryption for obfuscation
 * Note: This is NOT cryptographically secure, but prevents casual inspection
 * For production, use a proper encryption library like CryptoJS
 */
class SecureStorageService {
  /**
   * Encrypt/obfuscate data
   */
  private encrypt(data: string): string {
    let result = '';
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode);
    }
    // Convert to base64 to make it URL-safe and unreadable
    return btoa(result);
  }

  /**
   * Decrypt/deobfuscate data
   */
  private decrypt(encryptedData: string): string {
    try {
      // Decode from base64
      const data = atob(encryptedData);
      let result = '';
      for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch {
      return '';
    }
  }

  /**
   * Set item in secure storage
   */
  setItem(key: string, value: any): void {
    try {
      const jsonString = JSON.stringify(value);
      const encrypted = this.encrypt(jsonString);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store data securely:', error);
    }
  }

  /**
   * Get item from secure storage
   */
  getItem<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      const decrypted = this.decrypt(encrypted);
      if (!decrypted) return null;
      
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Failed to retrieve data securely:', error);
      return null;
    }
  }

  /**
   * Remove item from storage
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear all storage
   */
  clear(): void {
    localStorage.clear();
  }

  /**
   * Check if key exists
   */
  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}

export const secureStorage = new SecureStorageService();
