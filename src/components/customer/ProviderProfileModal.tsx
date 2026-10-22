import React, { useState } from 'react';
import {
  X,
  Star,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  Phone,
  MessageSquare,
  Award,
  Briefcase,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Provider } from '../../types';

interface ProviderProfileModalProps {
  provider: Provider | null;
  onClose: () => void;
  onRequestBooking: (provider: Provider) => void;
  onStartChat: (provider: Provider) => void;
}

export const ProviderProfileModal: React.FC<ProviderProfileModalProps> = ({
  provider,
  onClose,
  onRequestBooking,
  onStartChat,
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reviews'>('about');
  const [showCallPrompt, setShowCallPrompt] = useState(false);

  if (!provider) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Modal Header Cover */}
        <div className="relative bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white p-6 pb-4 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={provider.avatar}
                alt={provider.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
                referrerPolicy="no-referrer"
              />
              {provider.availableNow && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full ring-2 ring-emerald-400/40"
                  title="Available for Instant Dispatch"
                />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-white">
                  {provider.name}
                </h2>
                {provider.verified && (
                  <span className="inline-flex items-center gap-1 bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                    Verified Pro
                  </span>
                )}
              </div>
              <p className="text-xs text-sky-200 mt-0.5">{provider.profession}</p>

              <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{provider.rating}</span>
                  <span className="text-slate-400 font-normal">({provider.reviewsCount} reviews)</span>
                </div>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  {provider.distanceKm} km ({provider.serviceArea.split(',')[0]})
                </span>
                <span>•</span>
                <span>{provider.experienceYears} Years Exp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 py-2 shrink-0">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'about'
                ? 'bg-white text-sky-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            About & Skills
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'portfolio'
                ? 'bg-white text-sky-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Work Portfolio ({provider.portfolio?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'reviews'
                ? 'bg-white text-sky-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Verified Reviews ({provider.reviewsCount})
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'about' && (
            <div className="space-y-6">
              {/* About text */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Professional Bio
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {provider.about}
                </p>
              </div>

              {/* Skills and Specializations */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Core Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {provider.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Service Details & Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Service Area Coverage
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-1">
                    {provider.serviceArea}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Pricing Benchmark
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-1">
                    Starts from ₹{provider.startingPrice} • ₹{provider.hourlyRate}/hr
                  </div>
                </div>
              </div>

              {/* Verification & ID Badges */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-emerald-900">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold">Government Verified Professional</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">
                    Background checked, Aadhaar verified, and trade certified by FixMate AI Trust & Safety.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Previous Completed Projects & Repairs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {provider.portfolio?.map(item => (
                  <div
                    key={item.id}
                    className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow bg-slate-50"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3.5">
                      <div className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                        {item.service}
                      </div>
                      <h4 className="font-heading font-bold text-xs text-slate-900 mt-0.5">
                        {item.title}
                      </h4>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Completed in {item.completionTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-heading font-black text-3xl text-slate-900">
                    {provider.rating}
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 mt-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <span className="font-bold text-slate-900">{provider.completedJobs}+</span> verified jobs
                  <br />
                  <span className="font-bold text-slate-900">100%</span> completion rate
                </div>
              </div>

              {/* Sample Verified Reviews */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Kavita M. (Verified Customer)</span>
                    <span className="text-[11px] text-slate-400">2 days ago</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Arrived within 25 minutes for an emergency leak. Fixed the p-trap compression fitting cleanly and explained proper maintenance. Highly recommended!
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Ravi Teja (Verified Customer)</span>
                    <span className="text-[11px] text-slate-400">1 week ago</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Very transparent pricing matching the AI preliminary estimate. Carried all spare parts and finished work on time without extra charges.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call dialog prompt */}
        {showCallPrompt && (
          <div className="bg-sky-50 border-t border-sky-200 p-4 flex items-center justify-between text-xs text-sky-900 shrink-0">
            <div>
              <div className="font-bold">Connect with {provider.name}</div>
              <div className="text-[11px] text-sky-700">Available phone: {provider.phone}</div>
            </div>
            <button
              onClick={() => setShowCallPrompt(false)}
              className="px-3 py-1 bg-sky-600 text-white rounded-lg font-bold text-xs"
            >
              Done
            </button>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onStartChat(provider)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-sky-600" />
              <span>Chat</span>
            </button>

            <button
              onClick={() => setShowCallPrompt(!showCallPrompt)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Call</span>
            </button>
          </div>

          <button
            onClick={() => {
              onRequestBooking(provider);
              onClose();
            }}
            className="flex-1 max-w-xs bg-sky-600 hover:bg-sky-700 text-white py-2.5 px-5 rounded-2xl font-heading font-bold text-xs shadow-md transition-colors text-center"
          >
            Request Service Booking
          </button>
        </div>
      </div>
    </div>
  );
};
