import { useState, useEffect } from 'react';

export type DeviceType = 'android' | 'ios' | 'desktop';

export interface PWAInstallState {
  isInstallable: boolean;
  isStandalone: boolean;
  deviceType: DeviceType;
  promptInstall: () => Promise<boolean>;
  isDismissed: boolean;
  dismissBanner: () => void;
  resetDismissal: () => void;
}

const DISMISSAL_KEY = 'fixmate_install_banner_dismissed';
const DISMISSAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function usePWAInstall(): PWAInstallState {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 1. Detect Standalone PWA mode
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
    };
    checkStandalone();

    // 2. Detect Device OS
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
    if (/android/i.test(ua)) {
      setDeviceType('android');
    } else if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) {
      setDeviceType('ios');
    } else {
      setDeviceType('desktop');
    }

    // 3. Check dismissal expiry
    const dismissedTime = localStorage.getItem(DISMISSAL_KEY);
    if (dismissedTime) {
      const elapsed = Date.now() - parseInt(dismissedTime, 10);
      if (elapsed < DISMISSAL_DURATION_MS) {
        setIsDismissed(true);
      } else {
        localStorage.removeItem(DISMISSAL_KEY);
        setIsDismissed(false);
      }
    }

    // 4. Capture native PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const promptInstall = async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return outcome === 'accepted';
    } catch (err) {
      console.warn('Install prompt error:', err);
      return false;
    }
  };

  const dismissBanner = () => {
    localStorage.setItem(DISMISSAL_KEY, Date.now().toString());
    setIsDismissed(true);
  };

  const resetDismissal = () => {
    localStorage.removeItem(DISMISSAL_KEY);
    setIsDismissed(false);
  };

  return {
    isInstallable: !!deferredPrompt,
    isStandalone,
    deviceType,
    promptInstall,
    isDismissed,
    dismissBanner,
    resetDismissal,
  };
}
