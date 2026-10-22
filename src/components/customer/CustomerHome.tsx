import React, { useState } from 'react';
import {
  Camera,
  Search,
  Sparkles,
  AlertTriangle,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Wrench,
  Zap,
  AirVent,
  Tv,
  Car,
  Hammer,
  Paintbrush,
  Sparkles as CleaningIcon,
  Cpu,
  SlidersHorizontal,
  ArrowRight,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SERVICE_CATEGORIES } from '../../data/mockData';
import { Provider, ServiceCategoryType } from '../../types';

interface CustomerHomeProps {
  onOpenAiScan: () => void;
  onOpenEmergency: () => void;
  onSelectCategory: (category: ServiceCategoryType) => void;
  onSelectProvider: (provider: Provider) => void;
  onRequestBooking: (provider: Provider) => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  onOpenAiScan,
  onOpenEmergency,
  onSelectCategory,
  onSelectProvider,
  onRequestBooking,
}) => {
  const { providers, activeAiEstimate, setActiveTab, userLocation, categories } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Icon mapper helper
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench': return Wrench;
      case 'Zap': return Zap;
      case 'AirVent': return AirVent;
      case 'Tv': return Tv;
      case 'Car': return Car;
      case 'Hammer': return Hammer;
      case 'Paintbrush': return Paintbrush;
      case 'Sparkles': return CleaningIcon;
      case 'Cpu': return Cpu;
      default: return Wrench;
    }
  };

  const displayCategories = categories || SERVICE_CATEGORIES;

  const filteredCategories = displayCategories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.popularIssues.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const bestMatches = providers.filter(p => p.verified).slice(0, 4);

  // Active diagnosis display fallback or live state
  const diagnosisTitle = activeAiEstimate ? activeAiEstimate.problemTitle : 'Pipe Joint Leakage & Pressure Drop';
  const confidencePercent = activeAiEstimate ? 94 : 94;
  const difficulty = activeAiEstimate ? activeAiEstimate.difficulty : 'Medium';
  const laborMin = activeAiEstimate ? activeAiEstimate.laborRange.min : 300;
  const laborMax = activeAiEstimate ? activeAiEstimate.laborRange.max : 700;
  const partsMin = activeAiEstimate ? activeAiEstimate.partsRange.min : 100;
  const partsMax = activeAiEstimate ? activeAiEstimate.partsRange.max : 500;
  const totalMin = activeAiEstimate ? activeAiEstimate.totalRange.min : 400;
  const totalMax = activeAiEstimate ? activeAiEstimate.totalRange.max : 1200;

  return (
    <div className="space-y-6 pb-10">
      {/* High Density 12-Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Hero + Category Grid + Match Cards (8 cols on desktop) */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          {/* 1. Deep Blue Hero Banner */}
          <div className="bg-blue-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-blue-800">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-800 text-blue-200 px-2 py-0.5 rounded">
                  AI-Powered Diagnostics
                </span>
                <span className="text-xs text-blue-200">Serving {userLocation}</span>
              </div>

              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl mb-2 tracking-tight">
                What needs fixing?
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 mb-6 max-w-xl leading-relaxed">
                Upload a photo and let AI diagnose the problem instantly, calculate fair ₹ INR pricing, and match verified local experts.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-white rounded-xl flex items-center px-3.5 shadow-xs">
                  <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search plumber, electrician, mechanic..."
                    className="w-full bg-transparent border-none focus:outline-none text-slate-800 text-xs py-3 placeholder-slate-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={onOpenAiScan}
                  className="bg-white text-blue-900 px-5 py-3 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-xs active:scale-95 shrink-0"
                >
                  <Camera className="w-4 h-4 text-blue-600" />
                  <span>AI Photo Estimate</span>
                </button>
              </div>
            </div>

            <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-blue-800 rounded-full opacity-50 blur-3xl pointer-events-none" />
          </div>

          {/* 2. Compact 5-Col High Density Service Categories Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-bold text-sm text-slate-800">
                Service Categories
              </h3>
              <button
                onClick={() => setActiveTab('providers')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
              >
                <span>View all trades</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { id: 'Plumbing', name: 'Plumbing', icon: Wrench, color: 'bg-blue-50 text-blue-600' },
                { id: 'Electrical', name: 'Electrical', icon: Zap, color: 'bg-yellow-50 text-yellow-600' },
                { id: 'AC & Cooling', name: 'AC & Cooling', icon: AirVent, color: 'bg-teal-50 text-teal-600' },
                { id: 'Car & Bike', name: 'Car & Bike', icon: Car, color: 'bg-indigo-50 text-indigo-600' },
                { id: 'Carpentry', name: 'Carpentry', icon: Hammer, color: 'bg-purple-50 text-purple-600' },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectCategory(item.id as ServiceCategoryType)}
                    className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col items-center gap-2 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group text-center"
                  >
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${item.color} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. High Density AI Service Matching / Best Matches */}
          <div className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-2xs">
            <div className="px-5 py-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm text-slate-800">
                  AI Service Matching
                </h3>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  Top Recommended
                </span>
              </div>
              <span className="text-xs font-medium text-slate-400">
                Verified Pros Near You
              </span>
            </div>

            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bestMatches.map(provider => {
                const initials = provider.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                return (
                  <div
                    key={provider.id}
                    className="p-3.5 border border-slate-200/80 rounded-xl bg-slate-50/60 hover:bg-slate-50 hover:border-blue-300 transition-all flex gap-3.5 group"
                  >
                    {/* Avatar Initials / Photo */}
                    <div className="relative shrink-0">
                      <img
                        src={provider.avatar}
                        alt={provider.name}
                        className="w-12 h-12 rounded-lg object-cover ring-1 ring-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      {provider.availableNow && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {provider.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                            provider.availableNow
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {provider.availableNow ? 'Available' : 'Busy'}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {provider.profession} • {provider.experienceYears} yrs exp.
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-1">
                        <span className="flex items-center gap-0.5 font-bold text-amber-500">
                          ⭐ {provider.rating}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span>{provider.distanceKm} km away</span>
                        <span className="text-slate-300">|</span>
                        <span className="font-semibold text-slate-900">₹{provider.startingPrice}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => onSelectProvider(provider)}
                          className="flex-1 bg-white border border-slate-200 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors text-center"
                        >
                          Profile
                        </button>
                        <button
                          type="button"
                          onClick={() => onRequestBooking(provider)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg text-xs font-bold transition-colors shadow-2xs text-center"
                        >
                          Request Quote
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: High Density AI Problem Analysis Card (4 cols on desktop) */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-900 rounded-2xl p-5 text-white flex flex-col shadow-xl border border-slate-800 h-full justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800">
                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    AI Problem Analysis
                  </h3>
                  <p className="text-[11px] text-slate-400">Multimodal Gemini 3.7 Vision</p>
                </div>
              </div>

              {/* Active Diagnosis Preview Block */}
              <div className="bg-slate-800/90 rounded-xl p-3.5 mb-4 border border-slate-700 space-y-3">
                <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                  Active Issue Diagnosis
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-slate-700/80 rounded-lg border border-slate-600 flex items-center justify-center shrink-0 overflow-hidden">
                    {activeAiEstimate?.annotatedImageUrl ? (
                      <img
                        src={activeAiEstimate.annotatedImageUrl}
                        alt="Diagnosis"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-6 h-6 border-2 border-dashed border-slate-400 rounded-sm flex items-center justify-center">
                        <Wrench className="w-3 h-3 text-slate-400" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-white truncate">
                      {diagnosisTitle}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {activeAiEstimate ? `Detected Issue • ${activeAiEstimate.category}` : 'High Precision Vision Scan'}
                    </div>
                  </div>
                </div>

                {/* Meters */}
                <div className="space-y-2 pt-2 border-t border-slate-700/80 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Confidence:</span>
                    <span className="text-emerald-400 font-bold">{confidencePercent}% High</span>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Repair Difficulty:</span>
                    <span className="text-amber-400 font-bold">{difficulty}</span>
                  </div>

                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[94%] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Estimated Cost Breakdown */}
              <div className="space-y-3">
                <div className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span>Estimated Cost Breakdown (₹ INR)</span>
                </div>

                <div className="space-y-2 text-xs bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-400 text-[11px]">Estimated Labor</span>
                    <span className="font-bold text-slate-200">₹{laborMin} – ₹{laborMax}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-400 text-[11px]">Estimated Spare Parts</span>
                    <span className="font-bold text-slate-200">₹{partsMin} – ₹{partsMax}</span>
                  </div>

                  <div className="flex justify-between items-center pt-1.5">
                    <span className="text-slate-300 font-bold text-xs">Total Estimate</span>
                    <span className="text-blue-400 font-heading font-black text-base">
                      ₹{totalMin} – ₹{totalMax}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-blue-500/10 rounded-lg text-[10px] text-blue-200/90 leading-relaxed border border-blue-500/20">
                  AI preliminary calculation based on regional part catalogs & technician rates in {userLocation}.
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={onOpenAiScan}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-heading font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>📷 Upload New Problem Photo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('providers')}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs transition-colors text-center"
              >
                Compare All Matched Technicians
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* 4. Secondary Features / All 12 Trades Full Grid */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-900">
              All 12 Certified Repair Categories
            </h3>
            <p className="text-[11px] text-slate-500">
              Instant transparent quotes with 30-day FixMate workmanship guarantee
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
            100% Verified
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {filteredCategories.map(cat => {
            const Icon = getCategoryIcon(cat.iconName);
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="p-3 bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 rounded-xl text-left transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-white shadow-2xs border border-slate-200/60 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                    {cat.name}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Starts ₹<strong className="text-slate-800">{cat.avgStartingPrice}</strong>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
