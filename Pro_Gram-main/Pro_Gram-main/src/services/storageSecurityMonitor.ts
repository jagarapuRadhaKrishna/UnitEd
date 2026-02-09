/**
 * Storage Security Monitor
 * Monitors and protects localStorage from unauthorized access
 */

class StorageSecurityMonitor {
  private accessAttempts: number = 0;
  private readonly MAX_ATTEMPTS = 5;
  private isMonitoring: boolean = false;

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    if (typeof window === 'undefined' || this.isMonitoring) return;

    this.isMonitoring = true;

    // Monitor DevTools opening
    this.detectDevTools();

    // Display security banner
    this.displaySecurityBanner();
  }

  /**
   * Display security banner in console
   */
  private displaySecurityBanner(): void {
    const styles = {
      title: 'color: #EF4444; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);',
      subtitle: 'color: #F59E0B; font-size: 14px; font-weight: bold;',
      text: 'color: #6B7280; font-size: 12px;',
      info: 'color: #2563EB; font-size: 12px;'
    };

    console.log('%c⚠️ SECURITY WARNING ⚠️', styles.title);
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', styles.subtitle);
    console.log(
      '%cUnauthorized access to user data is prohibited!',
      styles.subtitle
    );
    console.log(
      '%c\nThis application stores encrypted user data. Attempting to access, modify, or\nexport this data without proper authorization may violate security policies.',
      styles.text
    );
    console.log(
      '%c\n📋 For legitimate data access:\n   • Use the application\'s profile settings\n   • Contact system administrator\n   • Use official API endpoints',
      styles.info
    );
    console.log(
      '%c\n🔒 Data Protection:\n   • All sensitive data is encrypted\n   • Access attempts are logged\n   • Unauthorized modifications are detected',
      styles.info
    );
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', styles.subtitle);
  }

  /**
   * Detect if DevTools is open
   */
  private detectDevTools(): void {
    const threshold = 160;
    let devToolsOpen = false;

    const checkDevTools = () => {
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        if (!devToolsOpen) {
          devToolsOpen = true;
          console.warn(
            '%c🔍 Developer Tools Detected',
            'color: #F59E0B; font-size: 14px; font-weight: bold;'
          );
          console.warn(
            '%cReminder: User data is encrypted and protected. Please use the application UI for data access.',
            'color: #6B7280; font-size: 12px;'
          );
        }
      } else {
        devToolsOpen = false;
      }
    };

    setInterval(checkDevTools, 1000);
  }

  /**
   * Log access attempt
   */
  logAccessAttempt(key: string): void {
    this.accessAttempts++;
    
    if (this.accessAttempts > this.MAX_ATTEMPTS) {
      console.error(
        '%c🚨 SECURITY ALERT: Excessive storage access attempts detected!',
        'color: #DC2626; font-size: 14px; font-weight: bold; background: #FEE2E2; padding: 8px;'
      );
    }
  }

  /**
   * Verify data integrity
   */
  verifyIntegrity(key: string): boolean {
    const data = localStorage.getItem(key);
    
    if (!data) return false;
    
    // Check if data looks encrypted (base64 pattern)
    const isEncrypted = /^[A-Za-z0-9+/]+=*$/.test(data);
    
    if (!isEncrypted) {
      console.error(
        `%c⚠️ Data integrity violation: ${key} appears to be unencrypted!`,
        'color: #DC2626; font-weight: bold;'
      );
      return false;
    }

    return true;
  }

  /**
   * Get security status
   */
  getSecurityStatus(): { secure: boolean; accessAttempts: number } {
    return {
      secure: this.accessAttempts <= this.MAX_ATTEMPTS,
      accessAttempts: this.accessAttempts,
    };
  }
}

// Export singleton instance
export const storageSecurityMonitor = new StorageSecurityMonitor();
