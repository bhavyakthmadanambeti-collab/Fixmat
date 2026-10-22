import React from 'react';
import { X, Wrench, Sparkles, ShieldCheck, Cpu, Code2, Heart, Award, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AvatarB } from '../common/AvatarB';
import { APP_CONFIG } from '../../config/appConfig';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const { ownerProfile } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 pb-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl">FixMate AI</span>
                <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                  v2.4 Production
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                See the problem. Get an estimate. Find the right expert.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Founder Section */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-850 text-white p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
            <AvatarB size="lg" showBadge />
            <div className="text-center sm:text-left flex-1">
              <div className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">
                Application Founder & Lead Engineer
              </div>
              <h3 className="font-heading font-extrabold text-lg text-white mt-0.5">
                {ownerProfile.name}
              </h3>
              <p className="text-xs text-slate-300 font-medium">{ownerProfile.title}</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {ownerProfile.bio}
              </p>
              <div className="inline-block mt-2 text-[11px] bg-white/10 px-2.5 py-1 rounded-lg text-sky-300 font-semibold border border-white/10">
                {ownerProfile.appCredit}
              </div>
            </div>
          </div>

          {/* Mission */}
          <div>
            <h4 className="font-heading font-bold text-sm text-slate-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" />
              Our Mission
            </h4>
            <p className="leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-600">
              FixMate AI is built to bridge trust and transparency between homeowners, vehicle owners, and local skilled trade professionals. By pairing multimodal computer vision diagnostics with verified local technicians, customers get instant upfront price ranges and transparent quotations with zero hidden fees.
            </p>
          </div>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-sky-50/70 border border-sky-200/80 rounded-2xl space-y-1">
              <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div className="font-bold text-sky-950">AI Multimodal Vision</div>
              <p className="text-[11px] text-sky-800 leading-relaxed">
                Server-side Gemini 3.7 Vision API calculates regional labor & replacement part benchmarks in ₹ INR.
              </p>
            </div>

            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-1">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div className="font-bold text-emerald-950">Verified Trade Pros</div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Government Aadhaar checks, trade certifications, and transparent customer review logs.
              </p>
            </div>

            <div className="p-3.5 bg-purple-50/70 border border-purple-200/80 rounded-2xl space-y-1">
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div className="font-bold text-purple-950">Safe Escrow Pay</div>
              <p className="text-[11px] text-purple-800 leading-relaxed">
                Instant UPI & card settlement only after job completion with digital tax invoices.
              </p>
            </div>
          </div>

          {/* Official App Installation Banner Section */}
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 p-5 rounded-2xl border border-blue-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-heading font-black text-lg text-white ring-2 ring-white/20">
                F
              </div>
              <div>
                <div className="font-heading font-bold text-sm text-white">
                  📱 Get the FixMate AI Mobile App
                </div>
                <div className="text-[11px] text-blue-200 mt-0.5">
                  Available for Android on Google Play & iPhone on App Store
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={APP_CONFIG.PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl font-heading font-bold text-xs shadow-md transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Google Play</span>
              </a>
              <a
                href={APP_CONFIG.APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-700 text-blue-100 px-3.5 py-2 rounded-xl font-heading font-bold text-xs border border-slate-700 transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>App Store</span>
              </a>
            </div>
          </div>

          {/* Verification Standards */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span>© {new Date().getFullYear()} FixMate AI</span>
              <span className="font-semibold text-slate-700">{ownerProfile.appCredit}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
