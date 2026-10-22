import React from 'react';
import { Home, Search, Calendar, MessageSquare, User, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileBottomNavProps {
  onOpenAiScan: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenAiScan }) => {
  const { activeTab, setActiveTab, bookings, chatMessages, currentRole } = useApp();

  const activeBookingsCount = bookings.filter(
    b => b.status !== 'payment_completed' && b.status !== 'review_submitted' && b.status !== 'cancelled'
  ).length;

  const unreadMessagesCount = chatMessages.filter(m => !m.read && m.senderRole !== currentRole).length;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 shadow-lg safe-bottom">
      <div className="flex items-center justify-around">
        {/* 1. Home */}
        <button
          onClick={() => setActiveTab(currentRole === 'provider' ? 'provider_dashboard' : currentRole === 'admin' ? 'admin_dashboard' : 'home')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            (activeTab === 'home' || activeTab === 'provider_dashboard' || activeTab === 'admin_dashboard')
              ? 'text-sky-600 font-bold scale-105'
              : 'text-slate-500 font-medium'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* 2. Search / Providers */}
        <button
          onClick={() => setActiveTab('providers')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'providers' ? 'text-sky-600 font-bold scale-105' : 'text-slate-500 font-medium'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Find Pros</span>
        </button>

        {/* 3. Center AI Button (Elevated) */}
        <button
          onClick={onOpenAiScan}
          className="-mt-5 flex flex-col items-center group"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 group-active:scale-95 transition-transform">
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
          </div>
          <span className="text-[10px] font-bold text-sky-700 mt-0.5">AI Scan</span>
        </button>

        {/* 4. Bookings */}
        <button
          onClick={() => setActiveTab('bookings')}
          className={`relative flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'bookings' ? 'text-sky-600 font-bold scale-105' : 'text-slate-500 font-medium'
          }`}
        >
          <Calendar className="w-5 h-5" />
          {activeBookingsCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-sky-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {activeBookingsCount}
            </span>
          )}
          <span className="text-[10px] mt-0.5">Bookings</span>
        </button>

        {/* 5. Messages / Chat */}
        <button
          onClick={() => setActiveTab('chat')}
          className={`relative flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'chat' ? 'text-sky-600 font-bold scale-105' : 'text-slate-500 font-medium'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          {unreadMessagesCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadMessagesCount}
            </span>
          )}
          <span className="text-[10px] mt-0.5">Chat</span>
        </button>

        {/* 6. Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'profile' ? 'text-sky-600 font-bold scale-105' : 'text-slate-500 font-medium'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </div>
    </div>
  );
};
