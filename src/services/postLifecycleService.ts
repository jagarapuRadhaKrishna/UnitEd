import { syncExpiredPosts } from './postAvailabilityService';

export const runPostLifecycleChecks = async (): Promise<void> => {
  await syncExpiredPosts();
};

export const initializePostLifecycle = (): (() => void) => {
  void runPostLifecycleChecks();

  const intervalId = window.setInterval(() => {
    void runPostLifecycleChecks();
  }, 60 * 60 * 1000);

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      void runPostLifecycleChecks();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    window.clearInterval(intervalId);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};
