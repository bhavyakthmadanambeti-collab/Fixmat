import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  X,
  QrCode,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  Laptop
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { APP_CONFIG } from '../../config/appConfig';

interface AppInstallBannerProps {
  forceShow?: boolean;
  onClose?: () => void;
}

export const AppInstallBanner: React.FC<AppInstallBannerProps> = ({
  forceShow = false,
  onClose,
}) => {
  const {
    deviceType,
    isStandalone,
    isDismissed,
    dismissBanner,
    isInstallable,
    promptInstall,
  } = usePWAInstall();

  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // If already running as installed app and not forced, hide banner
  if (isStandalone && !forceShow) {
    return null;
  }

  // If user dismissed it and not forced, hide banner
  if (isDismissed && !forceShow) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deviceType === 'android') {
      // Open official Google Play Store listing
      window.open(APP_CONFIG.PLAY_STORE_URL, '_blank', 'noopener,noreferrer');
    } else if (deviceType === 'ios') {
      // Open Apple App Store listing
      window.open(APP_CONFIG.APP_STORE_URL, '_blank', 'noopener,noreferrer');
    } else {
      // On desktop, show QR code modal or open Play Store URL
      setShowQrModal(true);
    }
  };

  const handlePwaDesktopInstall = async () => {
    const success = await promptInstall();
    if (success) {
      dismissBanner();
    }
  };

  const handleDismiss = () => {
    dismissBanner();
    if (onClose) onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(APP_CONFIG.PLAY_STORE_URL);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <>
      {/* Slide-Down Top Smart Banner */}
      <aside
        aria-label="App Installation"
        className="w-full bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white border-b border-blue-800/80 shadow-md relative z-50 animate-in slide-in-from-top duration-300"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 text-xs">
          {/* Left: App Logo & Identity */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* FixMate AI Logo (Letter F Badge) */}
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-heading font-black text-white text-base shadow-sm shrink-0 ring-1 ring-white/20">
              F
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-white text-xs sm:text-sm tracking-tight truncate">
                  📱 Install FixMate AI
                </span>
                <span className="hidden sm:inline-block bg-blue-500/30 text-blue-200 text-[10px] font-semibold px-1.5 py-0.2 rounded border border-blue-400/30">
                  {deviceType === 'android' ? 'Google Play Store' : deviceType === 'ios' ? 'App Store' : 'Android App'}
                </span>
              </div>

              <p className="text-[11px] text-blue-200/90 truncate hidden xs:block">
                Get the full FixMate AI app for a faster and better experience.
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Separate PWA Web App Install Option (when supported by browser) */}
            {isInstallable && (
              <button
                type="button"
                onClick={handlePwaDesktopInstall}
                className="hidden sm:flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700 text-blue-200 px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold text-xs border border-slate-700 transition-colors"
                title="Install Progressive Web App (PWA)"
              >
                <Laptop className="w-3.5 h-3.5 text-blue-400" />
                <span>Install Web App</span>
              </button>
            )}

            {/* Desktop: Scan QR Code for mobile */}
            {deviceType === 'desktop' && (
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="hidden md:flex items-center gap-1 bg-blue-800/60 hover:bg-blue-800 text-blue-100 px-2.5 py-1.5 rounded-lg font-semibold text-xs border border-blue-700 transition-colors"
                title="Scan QR Code to install on phone"
              >
                <QrCode className="w-3.5 h-3.5 text-yellow-300" />
                <span>Scan QR</span>
              </button>
            )}

            {/* Primary Action Button: Install Android App (Google Play Store) */}
            <button
              type="button"
              onClick={handleInstallClick}
              className="bg-blue-500 hover:bg-blue-600 text-white font-heading font-bold px-3.5 sm:px-4 py-1.5 rounded-lg text-xs shadow-md shadow-blue-900/50 flex items-center gap-1.5 transition-transform active:scale-95 shrink-0"
              title="Open FixMate AI on Google Play Store"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>

            {/* Not Now button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="px-2 sm:px-2.5 py-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
              title="Dismiss popup"
            >
              <span className="hidden sm:inline">Not Now</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop QR Code Modal for Laptop/Desktop users */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative text-center">
            {/* Close */}
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-heading font-black text-xl mx-auto mb-3 shadow-lg shadow-blue-200">
              F
            </div>
            <h3 className="font-heading font-extrabold text-lg text-slate-900">
              Scan to Install on Android
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Scan this QR code with your phone camera to open FixMate AI on the Google Play Store.
            </p>

            {/* Dynamic QR Code */}
            <div className="bg-slate-50 border-2 border-dashed border-blue-200 rounded-2xl p-5 my-4 flex flex-col items-center justify-center">
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200">
                <QRCodeSVG
                  value={APP_CONFIG.PLAY_STORE_URL}
                  size={180}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%232563eb"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="60" fill="white">F</text></svg>',
                    x: undefined,
                    y: undefined,
                    height: 38,
                    width: 38,
                    excavate: true,
                  }}
                />
              </div>

              <span className="text-[10px] font-mono text-slate-400 mt-3 truncate max-w-[220px]">
                {APP_CONFIG.packageId}
              </span>
            </div>

            {/* Store Buttons */}
            <div className="space-y-2">
              <a
                href={APP_CONFIG.PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-heading font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Google Play Listing</span>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Link Copied to Clipboard!</span>
                  </>
                ) : (
                  <span>Copy Play Store URL</span>
                )}
              </button>
            </div>

            {/* Developer Credit */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400">
              {APP_CONFIG.developerCredit} • {APP_CONFIG.developerTitle}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
