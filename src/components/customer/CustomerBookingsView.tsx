import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Phone,
  CreditCard,
  Star,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  FileText,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Booking, BookingStatus } from '../../types';

interface CustomerBookingsViewProps {
  onOpenChat: (providerId: string, bookingId?: string) => void;
  onOpenPayment: (booking: Booking) => void;
  onOpenReview: (booking: Booking) => void;
  onOpenDispute: (booking: Booking) => void;
}

export const CustomerBookingsView: React.FC<CustomerBookingsViewProps> = ({
  onOpenChat,
  onOpenPayment,
  onOpenReview,
  onOpenDispute,
}) => {
  const { bookings, updateBookingStatus, acceptQuotation, declineQuotation, cancelBooking, currentUser } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  const customerBookings = bookings.filter(b => b.customerId === currentUser.id);

  const filtered = customerBookings.filter(b => {
    if (activeFilter === 'active') {
      return b.status !== 'payment_completed' && b.status !== 'review_submitted' && b.status !== 'cancelled';
    }
    if (activeFilter === 'completed') {
      return b.status === 'payment_completed' || b.status === 'review_submitted';
    }
    if (activeFilter === 'cancelled') {
      return b.status === 'cancelled';
    }
    return true;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'request_sent':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Request Sent</span>;
      case 'provider_accepted':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Provider Accepted</span>;
      case 'on_the_way':
        return <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full text-xs font-bold animate-pulse">Technician On The Way 🚗</span>;
      case 'arrived':
        return <span className="bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Arrived at Doorstep</span>;
      case 'work_started':
        return <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full text-xs font-bold">Work In Progress 🔧</span>;
      case 'work_completed':
        return <span className="bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Work Done • Awaiting Payment</span>;
      case 'payment_completed':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Paid & Closed ✓</span>;
      case 'review_submitted':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Completed & Rated ⭐</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Cancelled</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const stepsList: { status: BookingStatus; label: string }[] = [
    { status: 'request_sent', label: 'Requested' },
    { status: 'provider_accepted', label: 'Accepted' },
    { status: 'on_the_way', label: 'On The Way' },
    { status: 'arrived', label: 'Arrived' },
    { status: 'work_started', label: 'Working' },
    { status: 'work_completed', label: 'Completed' },
    { status: 'payment_completed', label: 'Paid' },
  ];

  const getStepIndex = (status: BookingStatus) => {
    if (status === 'cancelled') return -1;
    if (status === 'review_submitted') return 6;
    const idx = stepsList.findIndex(s => s.status === status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
            My Service Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status tracking, live quotes, direct technician chat & payment receipts
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {(['all', 'active', 'completed', 'cancelled'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                activeFilter === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab} ({customerBookings.filter(b => {
                if (tab === 'active') return b.status !== 'payment_completed' && b.status !== 'review_submitted' && b.status !== 'cancelled';
                if (tab === 'completed') return b.status === 'payment_completed' || b.status === 'review_submitted';
                if (tab === 'cancelled') return b.status === 'cancelled';
                return true;
              }).length})
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-base text-slate-800">
            No bookings found in this section
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Ready for your next repair? Request a nearby verified professional or scan an issue with AI.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map(booking => {
            const currentStepIdx = getStepIndex(booking.status);

            return (
              <div
                key={booking.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs hover:shadow-md transition-all space-y-5"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                        {booking.id}
                      </span>
                      {booking.isEmergency && (
                        <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md animate-pulse">
                          🚨 Emergency Priority
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-medium">
                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 className="font-heading font-extrabold text-lg text-slate-900 mt-1">
                      {booking.serviceTitle}
                    </h2>
                    <p className="text-xs text-slate-500">{booking.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                {/* Progress Stepper (if not cancelled) */}
                {booking.status !== 'cancelled' && (
                  <div className="py-2 overflow-x-auto scrollbar-none">
                    <div className="flex items-center min-w-[540px] justify-between relative">
                      {/* Connecting line */}
                      <div className="absolute top-3.5 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
                      <div
                        className="absolute top-3.5 left-6 h-0.5 bg-sky-600 transition-all -z-0"
                        style={{
                          width: `${Math.min(100, Math.max(0, (currentStepIdx / (stepsList.length - 1)) * 100))}%`,
                        }}
                      />

                      {stepsList.map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div key={step.status} className="flex flex-col items-center relative z-10">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isDone
                                  ? 'bg-sky-600 text-white ring-4 ring-sky-100 shadow-xs'
                                  : 'bg-slate-200 text-slate-500'
                              } ${isCurrent ? 'scale-110 ring-4 ring-sky-300' : ''}`}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] font-bold mt-1.5 text-center whitespace-nowrap ${
                                isCurrent ? 'text-sky-700' : isDone ? 'text-slate-800' : 'text-slate-400'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Provider details & Booking Schedule Strip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs">
                  {/* Provider */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
                      {booking.providerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{booking.providerName}</div>
                      <div className="text-slate-500">{booking.providerProfession}</div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                    <div>
                      <div className="font-bold">{booking.scheduledDate}</div>
                      <div className="text-slate-500">{booking.scheduledTime}</div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <div className="truncate">
                      <div className="font-bold">Service Location</div>
                      <div className="text-slate-500 truncate">{booking.customerAddress}</div>
                    </div>
                  </div>
                </div>

                {/* Attached AI Estimate if present */}
                {booking.aiEstimate && (
                  <div className="p-3.5 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-2xl border border-sky-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      <span className="font-bold text-sky-950">AI Preliminary Estimate:</span>
                      <span className="text-sky-800">₹{booking.aiEstimate.totalRange.min} – ₹{booking.aiEstimate.totalRange.max}</span>
                    </div>
                    <span className="text-[11px] text-sky-600 font-semibold">
                      {booking.aiEstimate.possibleParts.length} parts identified
                    </span>
                  </div>
                )}

                {/* Received Quotation Card if technician submitted one */}
                {booking.quotation && (
                  <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                        <FileText className="w-4 h-4 text-amber-600" />
                        <span>Official Quotation from {booking.providerName}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          booking.quotation.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : booking.quotation.status === 'declined'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-200 text-amber-900 animate-pulse'
                        }`}
                      >
                        {booking.quotation.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="bg-white/80 p-2 rounded-xl border border-amber-100">
                        <span className="text-[10px] text-slate-400">Labor Fee</span>
                        <div className="font-bold text-slate-900">₹{booking.quotation.laborFee}</div>
                      </div>
                      <div className="bg-white/80 p-2 rounded-xl border border-amber-100">
                        <span className="text-[10px] text-slate-400">Parts/Spares</span>
                        <div className="font-bold text-slate-900">₹{booking.quotation.partsFee}</div>
                      </div>
                      <div className="bg-white/80 p-2 rounded-xl border border-amber-100">
                        <span className="text-[10px] text-slate-400">Travel/Visit</span>
                        <div className="font-bold text-slate-900">₹{booking.quotation.travelFee}</div>
                      </div>
                      <div className="bg-amber-100/90 p-2 rounded-xl border border-amber-200">
                        <span className="text-[10px] text-amber-800 font-bold">Total Final Quote</span>
                        <div className="font-extrabold text-amber-950 font-heading text-sm">
                          ₹{booking.quotation.totalAmount}
                        </div>
                      </div>
                    </div>

                    {booking.quotation.notes && (
                      <p className="text-xs text-amber-900 italic">
                        Note: {booking.quotation.notes}
                      </p>
                    )}

                    {/* Accept / Decline actions */}
                    {booking.quotation.status === 'pending' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => acceptQuotation(booking.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
                        >
                          ✓ Accept Quotation (₹{booking.quotation.totalAmount})
                        </button>
                        <button
                          onClick={() => declineQuotation(booking.id)}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                        >
                          ✕ Decline & Renegotiate
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  {/* Left: Chat and Call */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenChat(booking.providerId, booking.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-sky-600" />
                      <span>Chat with Technician</span>
                    </button>

                    <button
                      onClick={() => onOpenDispute(booking)}
                      className="text-slate-400 hover:text-rose-600 text-xs font-medium px-2 py-1 flex items-center gap-1 transition-colors"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Need Help / Dispute</span>
                    </button>
                  </div>

                  {/* Right: Status-specific primary triggers */}
                  <div className="flex items-center gap-2">
                    {booking.status === 'work_completed' && (
                      <button
                        onClick={() => onOpenPayment(booking)}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-heading font-bold shadow-md animate-bounce"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay Invoice (₹{booking.estimatedTotal})</span>
                      </button>
                    )}

                    {booking.status === 'payment_completed' && (
                      <button
                        onClick={() => onOpenReview(booking)}
                        className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-xs font-heading font-bold shadow-xs transition-colors"
                      >
                        <Star className="w-4 h-4 fill-white" />
                        <span>Rate & Review Pro</span>
                      </button>
                    )}

                    {booking.status === 'request_sent' && (
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="text-xs text-rose-600 hover:underline px-2 py-1 font-semibold"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
