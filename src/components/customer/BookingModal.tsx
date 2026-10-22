import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Camera,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Coins,
  ChevronRight,
  Upload
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Provider, ServiceCategoryType } from '../../types';

interface BookingModalProps {
  isOpen: boolean;
  provider: Provider | null;
  onClose: () => void;
  onBookingCreated: (bookingId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  provider,
  onClose,
  onBookingCreated,
}) => {
  const { currentUser, activeAiEstimate, createBooking, platformConfig, userLocation } = useApp();

  const [serviceTitle, setServiceTitle] = useState('');
  const [category, setCategory] = useState<ServiceCategoryType>('Plumbing');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('Today');
  const [scheduledTime, setScheduledTime] = useState('2:00 PM - 4:00 PM');
  const [address, setAddress] = useState(currentUser.address || `Flat 402, Sunshine Heights, ${userLocation}`);
  const [phone, setPhone] = useState(currentUser.phone || '+91 98765 43210');
  const [isEmergency, setIsEmergency] = useState(false);
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);
  const [includeAiEstimate, setIncludeAiEstimate] = useState(true);

  // Sync with provider if available
  React.useEffect(() => {
    if (provider) {
      setCategory(provider.primaryCategory);
      setServiceTitle(`${provider.profession} Inspection & Repair`);
    } else if (activeAiEstimate) {
      setCategory(activeAiEstimate.category as ServiceCategoryType);
      setServiceTitle(activeAiEstimate.problemTitle);
      setDescription(activeAiEstimate.summary);
      if (activeAiEstimate.imageUrl) {
        setAttachedPhoto(activeAiEstimate.imageUrl);
      }
    }
  }, [provider, activeAiEstimate]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAttachedPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmBooking = () => {
    if (!serviceTitle.trim() || !address.trim() || !phone.trim()) {
      alert('Please fill in service title, address, and phone number.');
      return;
    }

    const estLabor = activeAiEstimate && includeAiEstimate ? activeAiEstimate.laborRange.min : (provider ? provider.startingPrice : 299);
    const estParts = activeAiEstimate && includeAiEstimate ? activeAiEstimate.partsRange.min : 0;
    const platformFee = platformConfig.minimumPlatformFee;
    const estTotal = estLabor + estParts + platformFee;

    const newBooking = createBooking({
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: phone,
      customerAddress: address,
      providerId: provider ? provider.id : 'p1',
      providerName: provider ? provider.name : 'Verified Technician',
      providerProfession: provider ? provider.profession : `${category} Expert`,
      category: category,
      serviceTitle: serviceTitle,
      description: description || 'Inspection and repair needed as per problem description.',
      photos: attachedPhoto ? [attachedPhoto] : [],
      aiEstimate: (activeAiEstimate && includeAiEstimate) ? activeAiEstimate : undefined,
      scheduledDate: scheduledDate,
      scheduledTime: scheduledTime,
      isEmergency: isEmergency,
      estimatedLabor: estLabor,
      estimatedParts: estParts,
      platformFee: platformFee,
      estimatedTotal: estTotal,
    });

    onBookingCreated(newBooking.id);
    onClose();
  };

  const estInspection = provider ? provider.startingPrice : 299;
  const platformFee = platformConfig.minimumPlatformFee;
  const totalEstimated = (activeAiEstimate && includeAiEstimate)
    ? activeAiEstimate.totalRange.min + platformFee
    : estInspection + platformFee;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-indigo-600 p-6 text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
              Secure Service Booking
            </span>
            <h2 className="font-heading font-extrabold text-xl mt-1 tracking-tight">
              {provider ? `Book ${provider.name}` : 'Request Repair Service'}
            </h2>
            <p className="text-xs text-sky-100 mt-0.5">
              Verified technician dispatch with zero advance fees
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Provider Card Mini Banner if selected */}
          {provider && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <img
                src={provider.avatar}
                alt={provider.name}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-sm text-slate-900">{provider.name}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                </div>
                <div className="text-xs text-slate-500">{provider.profession} • ⭐ {provider.rating} ({provider.reviewsCount})</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400">Starting fee</div>
                <div className="font-heading font-bold text-sm text-slate-900">₹{provider.startingPrice}</div>
              </div>
            </div>
          )}

          {/* AI Estimate Integration Badge if available */}
          {activeAiEstimate && (
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                    <span>Attached AI Diagnosis:</span>
                    <span className="text-sky-700 font-semibold">{activeAiEstimate.problemTitle}</span>
                  </div>
                  <div className="text-[11px] text-sky-800 mt-0.5">
                    Est. Range: ₹{activeAiEstimate.totalRange.min} – ₹{activeAiEstimate.totalRange.max} ({activeAiEstimate.possibleParts.length} parts identified)
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-1.5 text-xs text-sky-900 font-semibold cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={includeAiEstimate}
                  onChange={e => setIncludeAiEstimate(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span>Share with Pro</span>
              </label>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Service Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Service or Problem Title
              </label>
              <input
                type="text"
                value={serviceTitle}
                onChange={e => setServiceTitle(e.target.value)}
                placeholder="e.g. Kitchen Sink Drain Leakage Repair"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>

            {/* Date & Slot Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Preferred Date
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Today', 'Tomorrow', 'This Weekend'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setScheduledDate(d)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-colors ${
                        scheduledDate === d
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Time Slot
                </label>
                <select
                  value={scheduledTime}
                  onChange={e => setScheduledTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM (Morning)</option>
                  <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM (Afternoon)</option>
                  <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM (Evening)</option>
                  <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM (Late)</option>
                  <option value="Immediate (< 45 mins)">Immediate (&lt; 45 mins)</option>
                </select>
              </div>
            </div>

            {/* Address & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Service Address / Flat No.
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Flat No, Apartment, Street name"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Description & Additional Photo */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Special Instructions / Problem Details
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Explain any specific symptoms or landmarks..."
                rows={2}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white resize-none"
              />
            </div>
          </div>

          {/* Pricing breakdown overview */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Estimated Inspection & Labor</span>
              <span className="font-semibold text-slate-900">₹{activeAiEstimate && includeAiEstimate ? activeAiEstimate.laborRange.min : estInspection}</span>
            </div>
            {activeAiEstimate && includeAiEstimate && (
              <div className="flex items-center justify-between text-slate-600">
                <span>Estimated Replacement Parts</span>
                <span className="font-semibold text-slate-900">₹{activeAiEstimate.partsRange.min}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-slate-600">
              <span>FixMate Platform Safety Fee</span>
              <span className="font-semibold text-slate-900">₹{platformFee}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-bold text-slate-900">
              <span>Total Preliminary Estimate</span>
              <span className="font-heading font-black text-sky-700">₹{totalEstimated}</span>
            </div>
            <p className="text-[10px] text-slate-400 italic">
              *Pay only after job completion. No advance payment required.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmBooking}
            className="bg-sky-600 hover:bg-sky-700 text-white py-2.5 px-6 rounded-2xl font-heading font-bold text-xs shadow-md transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Request Technician</span>
          </button>
        </div>
      </div>
    </div>
  );
};
