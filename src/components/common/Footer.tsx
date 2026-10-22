import React from 'react';
import { Wrench, Shield, Sparkles, PhoneCall, Award, Heart, Info, Download, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/appConfig';

interface FooterProps {
  onOpenAbout: () => void;
  onOpenEmergency: () => void;
  onOpenAiScan: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAbout,
  onOpenEmergency,
  onOpenAiScan,
}) => {
  const {
    ownerProfile,
    setActiveTab,
    setSelectedCategory,
    setCurrentRole,
    isOwnerAuthenticated,
    setIsOwnerLoginModalOpen,
  } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-8 pb-20 md:pb-8 mt-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pb-8 border-b border-slate-800">
          {/* Col 1: Brand & Founder Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                F
              </div>
              <span className="font-heading font-bold text-base text-white">
                FixMate<span className="text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              See the problem. Get an estimate. Find the right expert.
            </p>
            <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-[11px]">
              <span className="text-slate-400 font-semibold block">{ownerProfile.title}</span>
              <span className="text-blue-300 font-bold">{ownerProfile.name}</span>
              <div className="text-slate-400 text-[10px] mt-0.5">{ownerProfile.appCredit}</div>
            </div>
            
            {/* Store Download Buttons */}
            <div className="mt-3 flex items-center gap-2">
              <a
                href={APP_CONFIG.PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-blue-600/80 hover:bg-blue-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-md transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Google Play</span>
              </a>
              <a
                href={APP_CONFIG.APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold px-2.5 py-1 rounded-md border border-slate-700 transition-colors"
              >
                <span>App Store</span>
              </a>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-200 text-[11px] mb-2.5">
              Service Categories
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              {['Plumbing', 'Electrical', 'AC & Cooling', 'Appliance Repair', 'Car & Bike', 'Carpentry'].map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat as any);
                      setActiveTab('providers');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Smart Tools */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-200 text-[11px] mb-2.5">
              Smart Actions
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>
                <button
                  onClick={onOpenAiScan}
                  className="hover:text-blue-400 flex items-center gap-1 transition-colors text-blue-300"
                >
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  <span>AI Photo Diagnosis</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenEmergency}
                  className="hover:text-orange-400 flex items-center gap-1 transition-colors text-orange-400"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Emergency 1-Tap Dispatch</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentRole('provider');
                    setActiveTab('provider_dashboard');
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Provider Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (!isOwnerAuthenticated) {
                      setIsOwnerLoginModalOpen(true);
                      return;
                    }
                    setCurrentRole('admin');
                    setActiveTab('admin_dashboard');
                  }}
                  className="hover:text-purple-400 transition-colors flex items-center gap-1.5 text-purple-300 font-semibold"
                >
                  <KeyRound className="w-3 h-3 text-purple-400" />
                  <span>Owner Login Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Info */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-200 text-[11px] mb-2.5">
              About & Trust
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>
                <button onClick={onOpenAbout} className="hover:text-blue-400 transition-colors">
                  About FixMate AI
                </button>
              </li>
              <li>
                <span className="hover:text-slate-200 cursor-pointer">Verified Provider Standards</span>
              </li>
              <li>
                <span className="hover:text-slate-200 cursor-pointer">Preliminary AI Estimate Disclaimer</span>
              </li>
              <li>
                <span className="hover:text-slate-200 cursor-pointer">Privacy & Terms</span>
              </li>
            </ul>
          </div>
        </div>

        {/* High Density Bottom Micro-strip */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500">
          <div>FixMate AI © {new Date().getFullYear()} • See the problem. Get an estimate.</div>
          <div className="flex items-center gap-3">
            <button onClick={onOpenAbout} className="hover:text-slate-300">About</button>
            <span>•</span>
            <span className="hover:text-slate-300">Privacy Policy</span>
            <span>•</span>
            <span className="text-slate-300 font-medium">Developed by <strong className="text-blue-400">{ownerProfile.name}</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
