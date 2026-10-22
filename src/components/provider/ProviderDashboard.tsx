import React, { useState } from 'react';
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Star,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  FileText,
  Crown,
  ChevronRight,
  MapPin,
  Phone,
  MessageSquare,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Booking, BookingStatus } from '../../types';

interface ProviderDashboardProps {
  onOpenChat: (customerId: string, bookingId?: string) => void;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({ onOpenChat }) => {
  const {
    providers,
    bookings,
    updateBookingStatus,
    sendQuotation,
    toggleProviderAvailability,
    upgradeProviderTier,
    currentUser,
    platformConfig,
  } = useApp();

  // Active provider (default to Ramesh or first provider)
  const currentProvider = providers.find(p => p.id === 'p1') || providers[0];

  // Provider's bookings
  const myBookings = bookings.filter(b => b.providerId === currentProvider.id);
  const newRequests = myBookings.filter(b => b.status === 'request_sent');
  const activeJobs = myBookings.filter(
    b => b.status === 'provider_accepted' || b.status === 'on_the_way' || b.status === 'arrived' || b.status === 'work_started'
  );
  const completedJobs = myBookings.filter(b => b.status === 'work_completed' || b.status === 'payment_completed' || b.status === 'review_submitted');

  // Quotation Modal state
  const [selectedBookingForQuote, setSelectedBookingForQuote] = useState<Booking | null>(null);
  const [quoteLabor, setQuoteLabor] = useState('450');
  const [quoteParts, setQuoteParts] = useState('320');
  const [quoteTravel, setQuoteTravel] = useState('50');
  const [quoteNotes, setQuoteNotes] = useState('Includes 1x high-grade replacement pipe joint and 30-day workmanship guarantee.');

  // Tab
  const [activeSubTab, setActiveSubTab] = useState<'requests' | 'active' | 'earnings' | 'plans'>('requests');

  const handleSendQuote = () => {
    if (!selectedBookingForQuote) return;

    sendQuotation(
      selectedBookingForQuote.id,
      parseFloat(quoteLabor) || 0,
      parseFloat(quoteParts) || 0,
      parseFloat(quoteTravel) || 0,
      quoteNotes
    );

    setSelectedBookingForQuote(null);
  };

  const totalEarnings = currentProvider.totalEarnings;
  const pendingPayout = currentProvider.pendingPayout;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Availability Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentProvider.avatar}
                alt={currentProvider.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400"
                referrerPolicy="no-referrer"
              />
              {currentProvider.availableNow && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full ring-2 ring-emerald-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                  {currentProvider.name}
                </h1>
                {currentProvider.verified && (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Partner
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentProvider.profession} • {currentProvider.serviceArea}
              </p>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700 p-2.5 rounded-2xl">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-200">
                {currentProvider.availableNow ? 'Online & Available' : 'Off Duty / Busy'}
              </div>
              <div className="text-[10px] text-slate-400">
                {currentProvider.availableNow ? 'Receiving Instant Leads' : 'Not listed in instant radar'}
              </div>
            </div>

            <button
              onClick={() => toggleProviderAvailability(currentProvider.id)}
              className={`p-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                currentProvider.availableNow
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {currentProvider.availableNow ? (
                <ToggleRight className="w-6 h-6" />
              ) : (
                <ToggleLeft className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Earnings */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Net Earnings
          </div>
          <div className="font-heading font-black text-2xl text-slate-900 mt-1">
            ₹{totalEarnings.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +18% this week
          </div>
        </div>

        {/* 2. Pending Payout */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Pending Escrow Payout
          </div>
          <div className="font-heading font-black text-2xl text-sky-600 mt-1">
            ₹{pendingPayout.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Auto-clears every Tuesday</div>
        </div>

        {/* 3. Completed Jobs */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Completed Jobs
          </div>
          <div className="font-heading font-black text-2xl text-slate-900 mt-1">
            {currentProvider.completedJobs}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">100% completion rate</div>
        </div>

        {/* 4. Rating */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Customer Rating
          </div>
          <div className="font-heading font-black text-2xl text-amber-500 mt-1 flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{currentProvider.rating}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Based on {currentProvider.reviewsCount} reviews
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('requests')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeSubTab === 'requests'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Incoming Requests ({newRequests.length})
        </button>

        <button
          onClick={() => setActiveSubTab('active')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeSubTab === 'active'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Active Jobs In-Progress ({activeJobs.length})
        </button>

        <button
          onClick={() => setActiveSubTab('earnings')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeSubTab === 'earnings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Wallet & Payouts
        </button>

        <button
          onClick={() => setActiveSubTab('plans')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeSubTab === 'plans'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          👑 Subscription Tier ({currentProvider.subscriptionTier.toUpperCase()})
        </button>
      </div>

      {/* 1. INCOMING REQUESTS TAB */}
      {activeSubTab === 'requests' && (
        <div className="space-y-4">
          {newRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <h3 className="font-heading font-bold text-base text-slate-800">
                You are all caught up!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                New customer bookings and emergency dispatch signals will appear here immediately.
              </p>
            </div>
          ) : (
            newRequests.map(b => (
              <div
                key={b.id}
                className="bg-white border-2 border-sky-300 rounded-3xl p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-sky-100 text-sky-800 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md">
                        {b.id}
                      </span>
                      {b.isEmergency && (
                        <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md animate-pulse">
                          🚨 Emergency Priority
                        </span>
                      )}
                      <span className="text-xs text-slate-400">
                        {b.scheduledDate} • {b.scheduledTime}
                      </span>
                    </div>
                    <h3 className="font-heading font-extrabold text-base text-slate-900 mt-1">
                      {b.serviceTitle}
                    </h3>
                    <p className="text-xs text-slate-600">{b.description}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Estimated Total</div>
                    <div className="font-heading font-extrabold text-lg text-slate-900">
                      ₹{b.estimatedTotal}
                    </div>
                  </div>
                </div>

                {/* Customer info & AI Estimate preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Customer Name & Address:</span>
                    <strong className="text-slate-900">{b.customerName}</strong>
                    <div className="text-slate-600 truncate">{b.customerAddress}</div>
                  </div>

                  {b.aiEstimate && (
                    <div className="bg-sky-50/80 p-2.5 rounded-xl border border-sky-200">
                      <div className="font-bold text-sky-900 flex items-center gap-1 text-[11px]">
                        <Sparkles className="w-3 h-3 text-sky-600" />
                        AI Diagnosis Attached: {b.aiEstimate.problemTitle}
                      </div>
                      <div className="text-[10px] text-sky-700 mt-0.5">
                        Est. Parts: ₹{b.aiEstimate.partsRange.min} - ₹{b.aiEstimate.partsRange.max}
                      </div>
                    </div>
                  )}
                </div>

                {/* Accept / Reject actions */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    onClick={() => onOpenChat(b.customerId, b.id)}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                    <span>Chat with Customer</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateBookingStatus(b.id, 'cancelled')}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Decline
                    </button>

                    <button
                      onClick={() => updateBookingStatus(b.id, 'provider_accepted')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
                    >
                      ✓ Accept Lead & Confirm
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. ACTIVE JOBS TAB */}
      {activeSubTab === 'active' && (
        <div className="space-y-4">
          {activeJobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="font-heading font-bold text-base text-slate-800">
                No active jobs currently in progress
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Accepted jobs will show here so you can update progress and send quotations.
              </p>
            </div>
          ) : (
            activeJobs.map(job => (
              <div
                key={job.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        {job.id}
                      </span>
                      <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md font-bold">
                        Current Status: {job.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-heading font-extrabold text-base text-slate-900 mt-1">
                      {job.serviceTitle}
                    </h3>
                    <div className="text-xs text-slate-500">{job.customerAddress} • Phone: {job.customerPhone}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenChat(job.customerId, job.id)}
                      className="p-2 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat</span>
                    </button>

                    <button
                      onClick={() => setSelectedBookingForQuote(job)}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{job.quotation ? 'Revise Quote' : 'Send Quote'}</span>
                    </button>
                  </div>
                </div>

                {/* Status Stepper Progression Controls */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Update Job Stage in Real-time
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => updateBookingStatus(job.id, 'on_the_way')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                        job.status === 'on_the_way'
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      🚗 On The Way
                    </button>

                    <button
                      onClick={() => updateBookingStatus(job.id, 'arrived')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                        job.status === 'arrived'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      📍 Arrived at Site
                    </button>

                    <button
                      onClick={() => updateBookingStatus(job.id, 'work_started')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                        job.status === 'work_started'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      🔧 Work In Progress
                    </button>

                    <button
                      onClick={() => updateBookingStatus(job.id, 'work_completed')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                        job.status === 'work_completed'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      }`}
                    >
                      ✓ Work Completed
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. WALLET & PAYOUTS TAB */}
      {activeSubTab === 'earnings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-heading font-extrabold text-lg text-slate-900">
              Wallet Balance & Payout
            </h3>
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400">Available for Instant Bank Transfer</span>
              <div className="font-heading font-black text-3xl text-emerald-400">
                ₹{pendingPayout.toLocaleString()}
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Linked Bank Account:</span>
                <strong className="text-slate-900">HDFC Bank (•••• 4819)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>IFSC Code:</span>
                <strong className="text-slate-900">HDFC0001234</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Commission Rate:</span>
                <strong className="text-slate-900">{platformConfig.commissionPercentage}% on completion</strong>
              </div>
            </div>

            <button
              onClick={() => alert(`Instant payout request for ₹${pendingPayout} initiated to your bank account.`)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-heading font-bold text-xs shadow-md transition-colors"
            >
              Request Instant Withdrawal (₹{pendingPayout})
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-heading font-extrabold text-lg text-slate-900">
              Recent Payout History
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { date: '12 Aug 2026', amount: '₹3,450', status: 'Deposited to HDFC Bank' },
                { date: '05 Aug 2026', amount: '₹4,890', status: 'Deposited to HDFC Bank' },
                { date: '28 Jul 2026', amount: '₹2,900', status: 'Deposited to HDFC Bank' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                  <div>
                    <strong className="text-slate-900 block">{item.amount}</strong>
                    <span className="text-[11px] text-slate-400">{item.date}</span>
                  </div>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. SUBSCRIPTION PLANS TAB */}
      {activeSubTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              tier: 'free',
              name: 'Starter Tier',
              price: '₹0 / month',
              commission: '15% per job',
              features: ['Standard radar matching', 'Up to 20 jobs/mo', 'Basic chat support'],
            },
            {
              tier: 'pro',
              name: 'Pro Partner',
              price: '₹999 / month',
              commission: '8% per job',
              badge: '⭐ Most Popular',
              features: ['Priority dispatch queue', 'Unlimited leads', 'PRO verified badge on search', 'AI Photo Estimate matching'],
            },
            {
              tier: 'business',
              name: 'Business Elite',
              price: '₹2,499 / month',
              commission: '5% per job',
              badge: '👑 Max Earnings',
              features: ['#1 Radar Placement', '0% surge commission', 'Dedicated account manager', 'Custom branding & invoices'],
            },
          ].map((plan: any) => {
            const isCurrent = currentProvider.subscriptionTier === plan.tier;
            return (
              <div
                key={plan.tier}
                className={`bg-white rounded-3xl p-6 border flex flex-col justify-between transition-all ${
                  isCurrent ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-md' : 'border-slate-200'
                }`}
              >
                <div>
                  {plan.badge && (
                    <span className="text-[10px] font-bold uppercase bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md mb-2 inline-block">
                      {plan.badge}
                    </span>
                  )}
                  <h4 className="font-heading font-extrabold text-lg text-slate-900">{plan.name}</h4>
                  <div className="font-heading font-black text-2xl text-slate-900 mt-1">{plan.price}</div>
                  <div className="text-xs text-sky-600 font-semibold mt-0.5">{plan.commission}</div>

                  <ul className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    {plan.features.map((feat: string, fIdx: number) => (
                      <li key={fIdx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  disabled={isCurrent}
                  onClick={() => upgradeProviderTier(currentProvider.id, plan.tier)}
                  className={`w-full mt-6 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs'
                  }`}
                >
                  {isCurrent ? 'Current Active Plan' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* SEND QUOTATION MODAL */}
      {selectedBookingForQuote && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col">
            <div className="bg-slate-900 text-white p-6 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-lg">
                  Send Quotation to {selectedBookingForQuote.customerName}
                </h3>
                <p className="text-xs text-slate-400">Booking {selectedBookingForQuote.id}</p>
              </div>
              <button
                onClick={() => setSelectedBookingForQuote(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Labor (₹)</label>
                  <input
                    type="number"
                    value={quoteLabor}
                    onChange={e => setQuoteLabor(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Parts (₹)</label>
                  <input
                    type="number"
                    value={quoteParts}
                    onChange={e => setQuoteParts(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Travel (₹)</label>
                  <input
                    type="number"
                    value={quoteTravel}
                    onChange={e => setQuoteTravel(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Quote Description & Warranty</label>
                <textarea
                  value={quoteNotes}
                  onChange={e => setQuoteNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 resize-none"
                />
              </div>

              <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 flex items-center justify-between font-bold text-sky-950">
                <span>Total Quotation:</span>
                <span className="text-base font-heading">
                  ₹{(parseFloat(quoteLabor) || 0) + (parseFloat(quoteParts) || 0) + (parseFloat(quoteTravel) || 0)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSendQuote}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-2xl font-heading font-bold text-xs shadow-md transition-colors"
              >
                Send Quotation to Customer Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
