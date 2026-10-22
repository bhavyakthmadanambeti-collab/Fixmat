import React, { useState } from 'react';
import {
  Smartphone,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Share2,
  X,
  Sparkles,
  ShieldCheck,
  Send,
  Download,
  Laptop,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { APP_CONFIG } from '../../config/appConfig';

interface PhoneAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneAccessModal: React.FC<PhoneAccessModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'web' | 'store'>('web');

  if (!isOpen) return null;

  // Use the live URL of the application
  const liveAppUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-ftbthnv57dyunyhsj5zm4t-58997940129.asia-east1.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(liveAppUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Open FixMate AI on your phone: ${liveAppUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-base sm:text-lg">
                  📱 Open FixMate AI on Your Phone
                </span>
              </div>
              <p className="text-xs text-blue-200/90 mt-0.5">
                Instant access on Android & iPhone with Live Cloud Sync
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle: Live Web App vs Google Play Store */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveView('web')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeView === 'web'
                ? 'bg-white text-blue-700 shadow-xs font-bold border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4 text-blue-600" />
            <span>Scan QR for Live App</span>
          </button>

          <button
            onClick={() => setActiveView('store')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeView === 'store'
                ? 'bg-white text-blue-700 shadow-xs font-bold border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Google Play Store</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-700 text-xs">
          {activeView === 'web' ? (
            <>
              {/* QR Code Display */}
              <div className="bg-slate-50 border-2 border-dashed border-blue-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                  <QRCodeSVG
                    value={liveAppUrl}
                    size={200}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%232563eb"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="60" fill="white">F</text></svg>',
                      x: undefined,
                      y: undefined,
                      height: 42,
                      width: 42,
                      excavate: true,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-slate-800">
                  <span>📸 Point your phone camera at this QR code</span>
                </div>
                <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
                  Your phone camera will automatically detect the link and open the full FixMate AI experience.
                </p>
              </div>

              {/* Direct Link Actions */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Direct Live Application Link
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-mono text-slate-700 truncate select-all">
                    {liveAppUrl}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-xs transition-all active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Share Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleShareWhatsApp}
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors text-xs"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Send to WhatsApp</span>
                </button>

                <a
                  href={liveAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors text-xs text-center"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                  <span>Open in New Tab</span>
                </a>
              </div>

              {/* Installation Step Guide on Phone */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-2.5">
                <div className="font-heading font-bold text-xs text-blue-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>How to install as a Home Screen App on Phone:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] text-blue-900">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                    <span className="font-bold block text-blue-950">🤖 On Android (Chrome)</span>
                    <span>Tap 3 dots menu <strong className="font-mono text-slate-800">⋮</strong> ➔ Select <strong>"Add to Home screen"</strong> or "Install App".</span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                    <span className="font-bold block text-blue-950">🍎 On iPhone (Safari)</span>
                    <span>Tap the Share button <strong>⎋</strong> ➔ Scroll down and tap <strong>"Add to Home Screen"</strong>.</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Google Play Store Tab */}
              <div className="bg-slate-50 border-2 border-dashed border-emerald-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                  <QRCodeSVG
                    value={APP_CONFIG.PLAY_STORE_URL}
                    size={200}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%2310b981"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="60" fill="white">F</text></svg>',
                      x: undefined,
                      y: undefined,
                      height: 42,
                      width: 42,
                      excavate: true,
                    }}
                  />
                </div>

                <div className="mt-3 text-xs font-bold text-slate-800">
                  Scan to install directly from Google Play Store
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  {APP_CONFIG.packageId}
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href={APP_CONFIG.PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-heading font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 text-center"
                >
                  <Download className="w-4 h-4" />
                  <span>Open Google Play Store Listing</span>
                </a>

                <a
                  href={APP_CONFIG.APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 text-center"
                >
                  <span>Apple App Store (iOS)</span>
                </a>
              </div>
            </>
          )}

          {/* Cloud Sync Assurance Note */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>
              <strong>Cross-Device Live Sync:</strong> All actions on your phone sync automatically with your laptop.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
