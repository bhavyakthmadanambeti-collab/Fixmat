import React, { useState } from 'react';
import {
  Wrench,
  MapPin,
  Bell,
  Sparkles,
  AlertTriangle,
  ChevronDown,
  UserCheck,
  Briefcase,
  ShieldCheck,
  Check,
  CheckCircle,
  X,
  Info,
  Smartphone,
  QrCode,
  KeyRound,
  Sun,
  Moon,
  Languages,
  Bot,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AvatarB } from './AvatarB';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenEmergency: () => void;
  onOpenAiScan: () => void;
  onOpenAbout: () => void;
  onOpenPhoneAccess?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenEmergency,
  onOpenAiScan,
  onOpenAbout,
  onOpenPhoneAccess,
}) => {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    ownerProfile,
    userLocation,
    setUserLocation,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    activeTab,
    setActiveTab,
    isOwnerAuthenticated,
    setIsOwnerLoginModalOpen,
    appBrandConfig,
    theme,
    toggleTheme,
    language,
    setLanguage,
  } = useApp();

  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const cities = [
    'Jubilee Hills, Hyderabad',
    'Hitech City, Hyderabad',
    'Gachibowli, Hyderabad',
    'Koramangala, Bangalore',
    'Indiranagar, Bangalore',
    'T. Nagar, Chennai',
    'Andheri West, Mumbai',
    'Gurugram DLF, Delhi NCR',
  ];

  const roleLabels: Record<UserRole, { label: string; icon: any; color: string; desc: string }> = {
    customer: {
      label: 'Customer Mode',
      icon: UserCheck,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      desc: 'Browse, AI Estimate & Book',
    },
    provider: {
      label: 'Provider Portal',
      icon: Briefcase,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      desc: 'Jobs, Quotes & Earnings',
    },
    admin: {
      label: 'Admin (Bhavyakth)',
      icon: ShieldCheck,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      desc: 'Platform & Verification',
    },
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      {/* Top Global Announcement Banner (controlled by Owner) */}
      {appBrandConfig.announcementEnabled && appBrandConfig.announcementText && (
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white text-[11px] py-1.5 px-4 flex items-center justify-center gap-2 border-b border-purple-800/60 shadow-2xs">
          <span className="bg-purple-500/40 text-purple-200 border border-purple-400/30 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded shrink-0">
            {appBrandConfig.announcementBadge || 'UPDATE'}
          </span>
          <span className="truncate">{appBrandConfig.announcementText}</span>
        </div>
      )}

      {/* High Density Main Bar */}
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand & Location */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setActiveTab('home');
              if (currentRole !== 'customer') setCurrentRole('customer');
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
              F
            </div>
            <h1 className="font-heading font-bold text-lg sm:text-xl text-slate-800 tracking-tight">
              {appBrandConfig.appName || 'FixMate AI'}
            </h1>
          </button>

          {/* High Density Location Pill */}
          <div className="relative">
            <button
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span className="max-w-[150px] sm:max-w-[200px] truncate">{userLocation}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLocationMenu && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Service City / Area
                </div>
                {cities.map(city => (
                  <button
                    key={city}
                    onClick={() => {
                      setUserLocation(city);
                      setShowLocationMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                      userLocation === city ? 'text-blue-600 font-semibold bg-blue-50/60' : 'text-slate-700'
                    }`}
                  >
                    <span>{city}</span>
                    {userLocation === city && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center / Navigation Links for quick tabs */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => {
              setCurrentRole('customer');
              setActiveTab('home');
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              currentRole === 'customer' && activeTab === 'home'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              setActiveTab('ai_assistant');
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'ai_assistant'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-blue-700 hover:bg-blue-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span>AI Assistant</span>
          </button>
          <button
            onClick={() => {
              setCurrentRole('customer');
              setActiveTab('providers');
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              currentRole === 'customer' && activeTab === 'providers'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Find Pros
          </button>
          <button
            onClick={() => {
              setCurrentRole('customer');
              setActiveTab('bookings');
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              currentRole === 'customer' && activeTab === 'bookings'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={() => {
              setActiveTab('help');
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              activeTab === 'help'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Help & FAQ
          </button>
          <button
            onClick={() => {
              setCurrentRole('provider');
              setActiveTab('provider_dashboard');
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              currentRole === 'provider'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pro Portal
          </button>
          <button
            onClick={() => {
              if (!isOwnerAuthenticated) {
                setIsOwnerLoginModalOpen(true);
                return;
              }
              setCurrentRole('admin');
              setActiveTab('admin_dashboard');
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              currentRole === 'admin'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin (Bhavyakth)
          </button>
        </div>

        {/* Right Action Icons & Emergency Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Owner Portal / Login Quick Button */}
          {isOwnerAuthenticated ? (
            <button
              onClick={() => {
                setCurrentRole('admin');
                setActiveTab('admin_dashboard');
              }}
              className="bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-300 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 shrink-0"
              title="Open Owner Control Center (Logged in as Bhavyakth)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
              <span className="hidden sm:inline">👑 Owner Portal</span>
              <span className="sm:hidden">Owner</span>
            </button>
          ) : (
            <button
              onClick={() => setIsOwnerLoginModalOpen(true)}
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 shrink-0"
              title="Owner Login Portal"
            >
              <KeyRound className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Owner Login</span>
              <span className="sm:hidden">Owner</span>
            </button>
          )}

          {/* Phone Access Button */}
          {onOpenPhoneAccess && (
            <button
              onClick={onOpenPhoneAccess}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs hover:shadow-xs active:scale-95 shrink-0"
              title="Open FixMate AI on your phone"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">📱 Phone</span>
              <span className="sm:hidden">Phone</span>
            </button>
          )}

          {/* High Density Emergency Button (Vibrant Orange Theme) */}
          <button
            onClick={onOpenEmergency}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-orange-200 transition-all shrink-0 active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
            <span className="hidden xs:inline">Emergency</span>
            <span className="xs:hidden">SOS</span>
          </button>

          {/* Role Switcher Pill */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                roleLabels[currentRole].color
              }`}
            >
              {React.createElement(roleLabels[currentRole].icon, { className: 'w-3.5 h-3.5' })}
              <span>{roleLabels[currentRole].label}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in zoom-in-95">
                {(['customer', 'provider', 'admin'] as UserRole[]).map(role => {
                  const info = roleLabels[role];
                  const Icon = info.icon;
                  const isActive = currentRole === role;
                  return (
                    <button
                      key={role}
                      onClick={() => {
                        if (role === 'admin' && !isOwnerAuthenticated) {
                          setShowRoleMenu(false);
                          setIsOwnerLoginModalOpen(true);
                          return;
                        }
                        setCurrentRole(role);
                        if (role === 'customer') setActiveTab('home');
                        if (role === 'provider') setActiveTab('provider_dashboard');
                        if (role === 'admin') setActiveTab('admin_dashboard');
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs font-medium mb-1 transition-colors ${
                        isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{info.label}</span>
                      </div>
                      {isActive && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notifications Icon with dot */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
              title="Notifications"
            >
              {unreadNotifs.length > 0 && (
                <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
              )}
              <Bell className="w-5 h-5" />
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-heading font-bold text-xs text-slate-900">Notifications</span>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Mark read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs">No new notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 text-left flex gap-2.5 cursor-pointer hover:bg-slate-50 ${!n.read ? 'bg-blue-50/40' : ''}`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-blue-600' : 'bg-slate-300'}`} />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-900">{n.title}</p>
                          <p className="text-[11px] text-slate-600 mt-0.5">{n.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Letter B Avatar */}
          <button
            onClick={() => setActiveTab('profile')}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-xs border border-blue-200 hover:border-blue-500 transition-colors shrink-0"
            title="Account & Owner Profile"
          >
            B
          </button>
        </div>
      </div>
    </header>
  );
};
