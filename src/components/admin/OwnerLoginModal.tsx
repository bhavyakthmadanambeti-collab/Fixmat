import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  KeyRound,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AvatarB } from '../common/AvatarB';

export const OwnerLoginModal: React.FC = () => {
  const {
    isOwnerLoginModalOpen,
    setIsOwnerLoginModalOpen,
    isOwnerAuthenticated,
    ownerLogin,
    ownerLogout,
    setActiveTab,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOwnerLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = ownerLogin(email, password);
      setIsLoading(false);

      if (res.success) {
        setSuccessMsg('Authentication successful! Welcome to the Owner Control Center.');
        setTimeout(() => {
          setIsOwnerLoginModalOpen(false);
          setActiveTab('admin_dashboard');
          setSuccessMsg('');
          setPassword('');
          setEmail('');
        }, 800);
      } else {
        setErrorMsg('Invalid email or password. Access is restricted exclusively to the authorized app owner.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-purple-200 overflow-hidden relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="owner-portal-title"
      >
        {/* Top Gradient Header */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={() => {
              setIsOwnerLoginModalOpen(false);
              setErrorMsg('');
              setSuccessMsg('');
              setEmail('');
              setPassword('');
            }}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 flex items-center gap-3.5">
            <AvatarB size="md" showBadge />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="bg-purple-500/30 text-purple-200 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-purple-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-purple-300" />
                  Owner Portal
                </span>
                <span className="text-[10px] text-purple-300/80">Authorized Admin</span>
              </div>
              <h2 id="owner-portal-title" className="font-heading font-black text-xl text-white mt-1">
                Owner Login Portal
              </h2>
              <p className="text-xs text-purple-200/90">
                FixMate AI System Administration
              </p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          {/* If already authenticated, show status & quick actions */}
          {isOwnerAuthenticated ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-slate-900">
                  Owner Session Active
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  You are authenticated as the verified system owner.
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  You have full privileges to edit contact details, payments, categories, and settings.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOwnerLoginModalOpen(false);
                    setActiveTab('admin_dashboard');
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-heading font-bold py-3 rounded-2xl text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Open Owner Control Center</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    ownerLogout();
                    setIsOwnerLoginModalOpen(false);
                  }}
                  className="w-full bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-semibold py-2.5 rounded-2xl text-xs transition-colors"
                >
                  Log Out of Owner Session
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-purple-50/80 border border-purple-100 rounded-2xl p-3.5 text-xs text-purple-900">
                <p className="font-semibold flex items-center gap-1.5 text-purple-950">
                  <KeyRound className="w-3.5 h-3.5 text-purple-700" />
                  Authorized Owner Credentials Required
                </p>
                <p className="text-[11px] text-purple-700 mt-1 leading-relaxed">
                  Sign in with registered owner credentials to access contact details, payment accounts, and application management.
                </p>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Owner Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter registered owner email"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl text-slate-900 font-medium outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter owner password"
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl text-slate-900 font-medium outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Success Message */}
              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-70 text-white font-heading font-bold py-3 rounded-2xl text-xs shadow-md shadow-purple-900/20 flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                {isLoading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Sign In to Owner Portal</span>
                  </>
                )}
              </button>

              {/* Credential reminder pill */}
              <div className="text-center pt-1">
                <span className="text-[11px] text-slate-500">
                  Protected System • Multi-Device Authenticated
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
