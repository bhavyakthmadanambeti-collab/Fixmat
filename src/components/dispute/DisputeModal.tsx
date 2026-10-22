import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';

interface DisputeModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const { raiseDispute } = useApp();

  const [reason, setReason] = useState('Price charged does not match quotation');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !booking) return null;

  const reasons = [
    'Price charged does not match quotation or preliminary estimate',
    'Technician arrived significantly late or failed to show up',
    'Repair quality was defective or problem recurred immediately',
    'Unprofessional conduct or property damage during work',
    'Spare parts claimed were not installed',
  ];

  const handleSubmit = () => {
    if (!description.trim()) {
      alert('Please provide details regarding the dispute.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      raiseDispute({
        bookingId: booking.id,
        customerId: booking.customerId,
        customerName: booking.customerName,
        providerId: booking.providerId,
        providerName: booking.providerName,
        reason,
        description,
      });

      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 pb-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg">
                Raise Dispute / Customer Support
              </h2>
              <p className="text-xs text-slate-400">Booking {booking.id} • Admin Meditated</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Dispute Ticket Registered
              </h3>
              <p className="text-xs text-slate-500">
                Our operations team (Bhavyakth & Support) will review your case, withhold provider payout, and contact both parties within 2 hours.
              </p>
            </div>
          ) : (
            <>
              {/* Reason Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Primary Issue Reason
                </label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-500"
                >
                  {reasons.map((r, idx) => (
                    <option key={idx} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Detailed Explanation
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Explain what happened, differences in agreed amounts, or workmanship defects..."
                  rows={4}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white resize-none"
                />
              </div>

              {/* Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 leading-relaxed">
                FixMate Trust & Guarantee protects payments. If work was substandard, payments are frozen until resolution or full refund is provided.
              </div>

              {/* Submit */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-2xl font-heading font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Submit Dispute Ticket</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
