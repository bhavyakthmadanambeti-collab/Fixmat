import React, { useState, useRef } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Camera,
  CheckCircle2,
  Sparkles,
  Award,
  Bell,
  Lock,
  Wrench,
  CreditCard,
  LogOut,
  RefreshCw,
  KeyRound
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AvatarB } from '../common/AvatarB';
import { UserRole } from '../../types';

export const OwnerProfileView: React.FC = () => {
  const {
    ownerProfile,
    updateOwnerAvatar,
    currentUser,
    currentRole,
    setCurrentRole,
    userLocation,
    setUserLocation,
    bookings,
    isOwnerAuthenticated,
    ownerLogout,
    setIsOwnerLoginModalOpen,
    setActiveTab,
  } = useApp();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateOwnerAvatar(reader.result as string);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const isOwnerAdmin = currentRole === 'admin';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar with Photo Upload trigger */}
          <div className="relative group">
            {isOwnerAdmin ? (
              <AvatarB size="xl" customUrl={ownerProfile.customAvatarUrl} showBadge />
            ) : (
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=260'}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-100 shadow-md"
                referrerPolicy="no-referrer"
              />
            )}

            {isOwnerAdmin && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-sky-600 transition-colors shadow-md"
                title="Upload real profile photo for Bhavyakth"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-heading font-extrabold text-2xl text-slate-900">
                    {isOwnerAdmin ? ownerProfile.name : currentUser.name}
                  </h1>
                  <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {isOwnerAdmin ? 'Founder & App Developer' : 'Verified Member'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isOwnerAdmin ? ownerProfile.title : currentUser.email}
                </p>
              </div>

              {/* Role Switcher in Profile */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                {(['customer', 'provider', 'admin'] as UserRole[]).map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      if (role === 'admin' && !isOwnerAuthenticated) {
                        setIsOwnerLoginModalOpen(true);
                        return;
                      }
                      setCurrentRole(role);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                      currentRole === role
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {role === 'admin' ? 'Bhavyakth (Admin)' : role}
                  </button>
                ))}
              </div>
            </div>

            {/* Owner Portal Dedicated Access Card */}
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>FixMate AI Owner Control Portal</span>
                  {isOwnerAuthenticated && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full">
                      Logged In
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-purple-800 mt-0.5">
                  {isOwnerAuthenticated
                    ? 'Owner session verified • Contact & payment controls accessible'
                    : 'Authorized Owner & Administrator access only'}
                </p>
              </div>

              {isOwnerAuthenticated ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentRole('admin');
                      setActiveTab('admin_dashboard');
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs"
                  >
                    Open Control Center
                  </button>
                  <button
                    type="button"
                    onClick={ownerLogout}
                    className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-bold px-3 py-2 rounded-xl text-xs transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsOwnerLoginModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Owner Sign In</span>
                </button>
              )}
            </div>

            {isOwnerAdmin && (
              <p className="text-xs text-slate-600 mt-3 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {ownerProfile.bio}
              </p>
            )}

            {savedSuccess && (
              <div className="mt-3 p-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Profile image updated successfully.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Details & Security Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            Contact & Identity Details
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-500">Full Name</span>
              <strong className="text-slate-900">{isOwnerAdmin ? ownerProfile.name : currentUser.name}</strong>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-500">Email Address</span>
              <strong className="text-slate-900">{currentUser.email}</strong>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-500">
                {isOwnerAdmin ? 'Private Founder Phone' : 'Contact Phone'}
              </span>
              <strong className="text-slate-900 font-mono">
                {isOwnerAdmin ? ownerProfile.phone : currentUser.phone}
              </strong>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-500">Default Service Area</span>
              <strong className="text-slate-900">{userLocation}</strong>
            </div>
          </div>
        </div>

        {/* Platform Credentials */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            Developer Identity & Provenance
          </h3>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">App Developer Credit</span>
              <div className="text-sm font-heading font-extrabold text-slate-900 mt-0.5">
                {ownerProfile.appCredit}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Role Hierarchy</span>
              <div className="text-xs font-semibold text-slate-800 mt-0.5">
                Founder & Lead Systems Architect • Verified Super Admin
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Security Level</span>
              <div className="text-xs font-semibold text-emerald-700 mt-0.5 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                256-Bit Encrypted Marketplace Engine
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
