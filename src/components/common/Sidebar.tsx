import React from 'react';
import {
  Home,
  Search,
  CalendarCheck,
  MessageSquare,
  Briefcase,
  ShieldCheck,
  Sparkles,
  User,
  AlertTriangle,
  Info,
  Smartphone,
  KeyRound
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AvatarB } from './AvatarB';
import { UserRole } from '../../types';
import { APP_CONFIG } from '../../config/appConfig';

interface SidebarProps {
  onOpenAiScan: () => void;
  onOpenEmergency: () => void;
  onOpenAbout: () => void;
  onOpenPhoneAccess?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenAiScan,
  onOpenEmergency,
  onOpenAbout,
  onOpenPhoneAccess,
}) => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    setCurrentRole,
    ownerProfile,
    bookings,
    chatMessages,
    isOwnerAuthenticated,
    setIsOwnerLoginModalOpen,
  } = useApp();

  const unreadChatCount = chatMessages.filter(m => m.senderId !== 'c1' && m.senderId !== 'p1').length;
  const activeBookingsCount = bookings.filter(
    b => b.status !== 'work_completed' && b.status !== 'payment_completed' && b.status !== 'cancelled'
  ).length;

  return (
    <aside className="hidden lg:flex w-20 bg-white border-r border-slate-200 flex-col items-center py-5 justify-between shrink-0 select-none z-30">
      {/* Brand Icon (Letter F / FixMate) */}
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={() => {
            setActiveTab('home');
            if (currentRole !== 'customer') setCurrentRole('customer');
          }}
          className="w-11 h-11 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center text-white font-heading font-black text-xl shadow-lg shadow-blue-200 transition-all hover:scale-105"
          title="FixMate AI Home"
        >
          F
        </button>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-3">
          {/* Customer: Home */}
          {currentRole === 'customer' && (
            <button
              onClick={() => setActiveTab('home')}
              className={`p-3 rounded-xl transition-all relative ${
                activeTab === 'home'
                  ? 'bg-blue-50 text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
              }`}
              title="Home Dashboard"
            >
              <Home className="w-5 h-5" />
            </button>
          )}

          {/* Customer: Find Providers */}
          {currentRole === 'customer' && (
            <button
              onClick={() => setActiveTab('providers')}
              className={`p-3 rounded-xl transition-all relative ${
                activeTab === 'providers'
                  ? 'bg-blue-50 text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
              }`}
              title="Find Pros / Radar"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {/* Customer: Bookings */}
          {currentRole === 'customer' && (
            <button
              onClick={() => setActiveTab('bookings')}
              className={`p-3 rounded-xl transition-all relative ${
                activeTab === 'bookings'
                  ? 'bg-blue-50 text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
              }`}
              title="My Bookings & Orders"
            >
              <CalendarCheck className="w-5 h-5" />
              {activeBookingsCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </button>
          )}

          {/* Provider Portal */}
          {currentRole === 'provider' && (
            <button
              onClick={() => setActiveTab('provider_dashboard')}
              className={`p-3 rounded-xl transition-all relative ${
                activeTab === 'provider_dashboard'
                  ? 'bg-emerald-50 text-emerald-600 shadow-xs'
                  : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-50'
              }`}
              title="Technician Portal"
            >
              <Briefcase className="w-5 h-5" />
            </button>
          )}

          {/* Owner Control Portal */}
          <button
            onClick={() => {
              if (!isOwnerAuthenticated) {
                setIsOwnerLoginModalOpen(true);
                return;
              }
              setCurrentRole('admin');
              setActiveTab('admin_dashboard');
            }}
            className={`p-3 rounded-xl transition-all relative ${
              activeTab === 'admin_dashboard'
                ? 'bg-purple-100 text-purple-700 shadow-xs ring-1 ring-purple-300'
                : isOwnerAuthenticated
                ? 'text-purple-600 hover:text-purple-800 hover:bg-purple-50'
                : 'text-slate-400 hover:text-purple-600 hover:bg-slate-50'
            }`}
            title={
              isOwnerAuthenticated
                ? '👑 Owner Control Center (Logged in as Bhavyakth)'
                : '🔒 Owner Login Portal (bhavyakthmadanambeti@gmail.com)'
            }
          >
            {isOwnerAuthenticated ? (
              <ShieldCheck className="w-5 h-5 text-purple-600" />
            ) : (
              <KeyRound className="w-5 h-5" />
            )}
          </button>

          {/* Chat */}
          <button
            onClick={() => setActiveTab('chat')}
            className={`p-3 rounded-xl transition-all relative ${
              activeTab === 'chat'
                ? 'bg-blue-50 text-blue-600 shadow-xs'
                : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
            }`}
            title="Messages & Quotes"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* AI Scan Fast Launcher */}
          <button
            onClick={onOpenAiScan}
            className="p-3 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-105"
            title="AI Photo Estimate"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </button>
        </nav>
      </div>

      {/* Bottom Profile & Info Icons */}
      <div className="flex flex-col gap-3 items-center">
        {onOpenPhoneAccess ? (
          <button
            onClick={onOpenPhoneAccess}
            className="p-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors"
            title="📱 Open FixMate AI on your phone (Scan QR / Get App)"
          >
            <Smartphone className="w-5 h-5" />
          </button>
        ) : (
          <a
            href={APP_CONFIG.PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors"
            title="Get FixMate AI Mobile App"
          >
            <Smartphone className="w-5 h-5" />
          </a>
        )}

        <button
          onClick={onOpenAbout}
          className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
          title="About FixMate AI & Founder"
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Developer Letter B Avatar in Sidebar */}
        <button
          onClick={() => setActiveTab('profile')}
          className="w-10 h-10 bg-slate-100 hover:bg-blue-50 rounded-full flex items-center justify-center text-blue-700 font-bold border-2 border-blue-200 hover:border-blue-500 transition-all shadow-xs"
          title={`Profile: ${ownerProfile.name} (Founder)`}
        >
          B
        </button>
      </div>
    </aside>
  );
};
