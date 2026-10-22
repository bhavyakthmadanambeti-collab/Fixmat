import React, { useState } from 'react';
import { X, Star, CheckCircle2, ThumbsUp, Sparkles, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';

interface ReviewModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const { addReview } = useApp();

  const [overallRating, setOverallRating] = useState(5);
  const [punctualityRating, setPunctualityRating] = useState(5);
  const [qualityRating, setQualityRating] = useState(5);
  const [valueRating, setValueRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !booking) return null;

  const handleSubmitReview = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      addReview({
        bookingId: booking.id,
        providerId: booking.providerId,
        rating: overallRating,
        comment: comment.trim() || 'Great service and prompt professional resolution.',
        punctualityRating,
        qualityRating,
        valueRating,
      });
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1400);
    }, 600);
  };

  const renderStars = (current: number, setRating: (r: number) => void) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="p-1 hover:scale-110 transition-transform focus:outline-none"
        >
          <Star
            className={`w-5 h-5 ${
              star <= current
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 pb-4 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
              Verified Feedback
            </span>
            <h2 className="font-heading font-extrabold text-xl mt-1">
              Rate {booking.providerName}
            </h2>
            <p className="text-xs text-amber-100">{booking.serviceTitle}</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Review Submitted!
              </h3>
              <p className="text-xs text-slate-500">
                Thank you for helping the FixMate AI community keep quality high.
              </p>
            </div>
          ) : (
            <>
              {/* Overall Satisfaction */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-center space-y-2">
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">
                  Overall Experience
                </span>
                <div className="flex justify-center">{renderStars(overallRating, setOverallRating)}</div>
                <span className="text-xs font-semibold text-amber-800">
                  {overallRating === 5 ? 'Exceptional 🌟' : overallRating === 4 ? 'Very Good 👍' : overallRating === 3 ? 'Average 👌' : 'Needs Improvement'}
                </span>
              </div>

              {/* Sub categories */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">Punctuality & Arrival</span>
                  {renderStars(punctualityRating, setPunctualityRating)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">Repair Quality & Finish</span>
                  {renderStars(qualityRating, setQualityRating)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">Price Transparency</span>
                  {renderStars(valueRating, setValueRating)}
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Detailed Review / Experience
                </label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Share details about technician behavior, speed of repair, parts used..."
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitReview}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-2xl font-heading font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4 fill-white" />
                <span>Submit Verified Rating</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
