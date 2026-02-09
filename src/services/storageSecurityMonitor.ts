class StorageSecurityMonitor {
  private accessAttempts: number = 0;
  private readonly MAX_ATTEMPTS = 5;

  getSecurityStatus(): { secure: boolean; accessAttempts: number } {
    return { secure: this.accessAttempts <= this.MAX_ATTEMPTS, accessAttempts: this.accessAttempts };
  }
}

export const storageSecurityMonitor = new StorageSecurityMonitor();
