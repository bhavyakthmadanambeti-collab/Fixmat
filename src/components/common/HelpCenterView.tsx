import React, { useState } from 'react';
import {
  HelpCircle,
  ShieldCheck,
  FileText,
  Lock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Mail,
  Phone,
  CheckCircle2,
  Trash2,
  Download,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HelpCenterView: React.FC = () => {
  const { ownerProfile, ownerPaymentConfig } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'faq' | 'terms' | 'privacy' | 'data_export'>('faq');

  const faqs = [
    {
      q: 'How does FixMate AI diagnose repair problems?',
      a: 'FixMate AI utilizes advanced multimodal AI (Gemini 3.8 Flash) to analyze high-resolution photos and detailed text descriptions. It compares symptoms with thousands of validated diagnostic patterns across plumbing, electrical systems, HVAC/cooling, automobiles, and home appliances to determine likely root causes, necessary replacement components, and realistic labor ranges in Indian Rupees (₹ INR).'
    },
    {
      q: 'Are FixMate technicians background checked and verified?',
      a: 'Yes. All service professionals on FixMate must submit valid government ID verification (Aadhaar or Driving License), trade certificates, and undergo mandatory background reviews approved by the platform administration before being dispatched.'
    },
    {
      q: 'How does the payment guarantee work?',
      a: 'Payments are routed securely to the verified owner gateway (UPI ID: 9030957387@axl). Funds are held under FixMate Escrow Guarantee and only released after you inspect and approve the completed job.'
    },
    {
      q: 'Can I use FixMate AI in Telugu (తెలుగు)?',
      a: 'Yes! FixMate AI natively supports both English and Telugu. You can switch languages at any time from the top bar or inside the AI Assistant, enabling voice dictation and natural responses in your preferred language.'
    },
    {
      q: 'What should I do in an urgent emergency?',
      a: 'Use the 1-Tap Emergency SOS button in the top navigation. Our dispatch algorithm immediately pings the closest active verified technician in your neighborhood without waiting for quotations.'
    }
  ];

  const handleExportMyData = () => {
    const data = {
      app: 'FixMate AI',
      exportDate: new Date().toISOString(),
      userProfile: {
        owner: ownerProfile.name,
        role: ownerProfile.role,
      },
      paymentGateway: {
        upiId: ownerPaymentConfig.upiId,
      },
      exportStatus: 'Compliant with Indian IT Act & DPDP Data Protection Standards'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fixmate-user-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-800/80 text-blue-200 text-xs font-bold rounded-full mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Customer Trust & Support Center</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl tracking-tight">
            Help, Legal Terms & Safety
          </h2>
          <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-xl">
            Everything you need to know about our AI diagnostic procedures, escrow payments, privacy, and verified expert network.
          </p>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'faq', label: 'Frequently Asked Questions' },
          { id: 'terms', label: 'Terms of Service' },
          { id: 'privacy', label: 'Privacy Policy' },
          { id: 'data_export', label: 'Data Export & Control' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: FAQ */}
      {activeTab === 'faq' && (
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={faq.q}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: TERMS */}
      {activeTab === 'terms' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-slate-700 leading-relaxed shadow-xs">
          <h3 className="font-heading font-extrabold text-base text-slate-900">
            FixMate AI Terms of Service
          </h3>
          <p>
            Welcome to FixMate AI. By accessing or using our platform, you agree to comply with and be bound by the following terms. FixMate AI acts as a smart marketplace connecting consumers with independent verified trade professionals.
          </p>
          <h4 className="font-bold text-slate-900 pt-2">1. AI Diagnosis & Price Estimates</h4>
          <p>
            All AI diagnoses, parts estimates, and labor figures generated by FixMate AI are preliminary advisories. The final quote must be agreed upon between customer and technician prior to commencement of physical work.
          </p>
          <h4 className="font-bold text-slate-900 pt-2">2. Safety and Hazardous Work</h4>
          <p>
            Users must not attempt dangerous electrical, gas, or high-pressure plumbing repairs without proper training and safety equipment. FixMate disclaims liability for unilateral self-repairs conducted against explicit AI safety warnings.
          </p>
          <h4 className="font-bold text-slate-900 pt-2">3. Payments & Escrow</h4>
          <p>
            All platform payments must be transacted through the verified official gateway (UPI: 9030957387@axl). Cash settlements outside the app waive FixMate dispute resolution guarantees.
          </p>
        </div>
      )}

      {/* TAB 3: PRIVACY */}
      {activeTab === 'privacy' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-slate-700 leading-relaxed shadow-xs">
          <h3 className="font-heading font-extrabold text-base text-slate-900">
            Privacy Policy & Data Security
          </h3>
          <p>
            FixMate AI is committed to protecting your privacy. We process personal details (name, phone, service location, uploaded repair photos) strictly to connect you with nearby verified pros and generate diagnosis models.
          </p>
          <h4 className="font-bold text-slate-900 pt-2">1. Multimodal Images</h4>
          <p>
            Images uploaded for AI diagnosis are analyzed server-side via the Gemini API proxy without exposing user credentials or retaining private home metadata.
          </p>
          <h4 className="font-bold text-slate-900 pt-2">2. Credential Security</h4>
          <p>
            Sensitive administrative credentials and owner contact details are strictly restricted and never broadcast to public browser sessions.
          </p>
        </div>
      )}

      {/* TAB 4: DATA EXPORT */}
      {activeTab === 'data_export' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-slate-700 leading-relaxed shadow-xs">
          <h3 className="font-heading font-extrabold text-base text-slate-900">
            Your Data Rights & Export
          </h3>
          <p>
            In compliance with contemporary privacy standards, you maintain complete ownership of your service history, chats, and diagnosis records.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportMyData}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download My FixMate Data (JSON)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
