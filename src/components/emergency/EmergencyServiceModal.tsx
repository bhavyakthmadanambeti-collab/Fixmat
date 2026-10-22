import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Flame,
  Droplets,
  Zap,
  Car,
  Key,
  ShieldAlert,
  Clock,
  MapPin,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceCategoryType } from '../../types';

interface EmergencyServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmergencyDispatched: (bookingId: string) => void;
}

export const EmergencyServiceModal: React.FC<EmergencyServiceModalProps> = ({
  isOpen,
  onClose,
  onEmergencyDispatched,
}) => {
  const { providers, userLocation, currentUser, createBooking } = useApp();

  const [selectedEmergency, setSelectedEmergency] = useState<string>('water_leak');
  const [address, setAddress] = useState(currentUser.address || `Flat 402, Sunshine Heights, ${userLocation}`);
  const [phone, setPhone] = useState(currentUser.phone || '+91 98765 43210');
  const [isDispatching, setIsDispatching] = useState(false);

  if (!isOpen) return null;

  const emergencyTypes = [
    {
      id: 'water_leak',
      title: 'Major Water Pipe Burst / Flooding',
      category: 'Plumbing' as ServiceCategoryType,
      icon: Droplets,
      color: 'bg-blue-600',
      estArrival: '15-25 Mins',
    },
    {
      id: 'electrical_spark',
      title: 'MCB Sparking / Total Power Outage',
      category: 'Electrical' as ServiceCategoryType,
      icon: Zap,
      color: 'bg-amber-600',
      estArrival: '20-30 Mins',
    },
    {
      id: 'vehicle_breakdown',
      title: 'Vehicle Engine Stall / Flat Tyre Highway',
      category: 'Car & Bike' as ServiceCategoryType,
      icon: Car,
      color: 'bg-rose-600',
      estArrival: '20-35 Mins',
    },
    {
      id: 'door_lockout',
      title: 'Locked Out / Broken Main Door Lock',
      category: 'Carpentry' as ServiceCategoryType,
      icon: Key,
      color: 'bg-purple-600',
      estArrival: '25-35 Mins',
    },
  ];

  const currentSelection = emergencyTypes.find(e => e.id === selectedEmergency) || emergencyTypes[0];

  // Find nearest available provider for this emergency category
  const availableProvider =
    providers.find(p => p.primaryCategory === currentSelection.category && p.availableNow) ||
    providers.find(p => p.primaryCategory === currentSelection.category) ||
    providers[0];

  const handleDispatch = () => {
    setIsDispatching(true);

    setTimeout(() => {
      const newBooking = createBooking({
        customerId: currentUser.id,
        customerName: currentUser.name,
        customerPhone: phone,
        customerAddress: address,
        providerId: availableProvider.id,
        providerName: availableProvider.name,
        providerProfession: availableProvider.profession,
        category: currentSelection.category,
        serviceTitle: `EMERGENCY: ${currentSelection.title}`,
        description: `High Priority Emergency Dispatch at ${address}. Immediate on-site response requested.`,
        scheduledDate: 'Immediate',
        scheduledTime: 'Now (< 25 mins)',
        isEmergency: true,
        estimatedLabor: availableProvider.startingPrice + 150,
        estimatedParts: 0,
        platformFee: 49,
        estimatedTotal: availableProvider.startingPrice + 199,
      });

      setIsDispatching(false);
      onEmergencyDispatched(newBooking.id);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden my-6 flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white p-6 pb-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-800/80 px-2 py-0.5 rounded-md">
                1-Tap Fast Response
              </span>
              <h2 className="font-heading font-extrabold text-xl tracking-tight mt-0.5">
                Emergency Priority Dispatch
              </h2>
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
          {/* Emergency type selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Emergency Situation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {emergencyTypes.map(item => {
                const Icon = item.icon;
                const isSelected = item.id === selectedEmergency;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedEmergency(item.id)}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50/70 ring-2 ring-rose-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl ${item.color} text-white flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        {item.title}
                      </div>
                      <span className="text-[10px] text-rose-700 font-bold block mt-1">
                        Est: {item.estArrival}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matched Nearest Pro */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <img
                src={availableProvider.avatar}
                alt={availableProvider.name}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-300"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>{availableProvider.name}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                </div>
                <div className="text-slate-500 text-[11px]">
                  {availableProvider.profession} • {availableProvider.distanceKm} km away
                </div>
              </div>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Available Now
            </span>
          </div>

          {/* Location & Phone inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Emergency Location
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Direct Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Action */}
          <button
            type="button"
            disabled={isDispatching}
            onClick={handleDispatch}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3.5 px-6 rounded-2xl font-heading font-extrabold text-sm shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
          >
            {isDispatching ? (
              <span>Dispatching Technician Priority Signal...</span>
            ) : (
              <>
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>Confirm Immediate Priority Dispatch</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
