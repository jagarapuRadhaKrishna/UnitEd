const ENCRYPTION_KEY = 'UnitEd_2025_Secure_Key_v1';

class SecureStorageService {
  private encrypt(data: string): string {
    let result = '';
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(result);
  }

  private decrypt(encryptedData: string): string {
    try {
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

  setItem(key: string, value: any): void {
    try {
      const jsonString = JSON.stringify(value);
      const encrypted = this.encrypt(jsonString);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store data securely:', error);
    }
  }

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

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}

export const secureStorage = new SecureStorageService();
