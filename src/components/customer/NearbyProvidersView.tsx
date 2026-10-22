import React, { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Star,
  CheckCircle2,
  SlidersHorizontal,
  Clock,
  Navigation,
  Map as MapIcon,
  List,
  Sparkles,
  Phone,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Provider, ServiceCategoryType } from '../../types';
import { SERVICE_CATEGORIES } from '../../data/mockData';

interface NearbyProvidersViewProps {
  onSelectProvider: (provider: Provider) => void;
  onRequestBooking: (provider: Provider) => void;
  onOpenAiScan: () => void;
}

export const NearbyProvidersView: React.FC<NearbyProvidersViewProps> = ({
  onSelectProvider,
  onRequestBooking,
  onOpenAiScan,
}) => {
  const {
    providers,
    selectedCategory,
    setSelectedCategory,
    userLocation,
    categories,
  } = useApp();

  const displayCategories = categories || SERVICE_CATEGORIES;

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState<'nearest' | 'rating' | 'price' | 'experience'>('rating');
  const [filterAvailableNow, setFilterAvailableNow] = useState(false);
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);

  // Filter & Sort
  const filteredProviders = providers
    .filter(p => {
      // Category filter
      if (selectedCategory && selectedCategory !== 'all') {
        const matchesPrimary = p.primaryCategory === selectedCategory;
        const matchesSecondary = p.secondaryCategories?.includes(selectedCategory as ServiceCategoryType);
        if (!matchesPrimary && !matchesSecondary) return false;
      }

      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesProf = p.profession.toLowerCase().includes(q);
        const matchesSkills = p.skills.some(s => s.toLowerCase().includes(q));
        const matchesArea = p.serviceArea.toLowerCase().includes(q);
        if (!matchesName && !matchesProf && !matchesSkills && !matchesArea) return false;
      }

      // Toggle filters
      if (filterAvailableNow && !p.availableNow) return false;
      if (filterVerifiedOnly && !p.verified) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'nearest') return a.distanceKm - b.distanceKm;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.startingPrice - b.startingPrice;
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      return 0;
    });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
              Nearby Skilled Experts
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified professionals serving <strong className="text-slate-700">{userLocation}</strong>
            </p>
          </div>

          {/* Toggle Map / List & AI Fast Scan */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAiScan}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>AI Photo Diagnosis</span>
            </button>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Map Radar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search input + Sort options */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, skill, area, or service..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="rating">Sort: Highest Rated ⭐</option>
              <option value="nearest">Sort: Nearest Distance 📍</option>
              <option value="price">Sort: Lowest Starting Price 💰</option>
              <option value="experience">Sort: Most Experienced 🎖️</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center gap-2">
            <button
              onClick={() => setFilterAvailableNow(!filterAvailableNow)}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${
                filterAvailableNow
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${filterAvailableNow ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
              <span>Available Now</span>
            </button>

            <button
              onClick={() => setFilterVerifiedOnly(!filterVerifiedOnly)}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${
                filterVerifiedOnly
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Verified Only</span>
            </button>
          </div>
        </div>

        {/* Category Pills Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
              !selectedCategory || selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Services ({providers.length})
          </button>

          {displayCategories.map(cat => {
            const count = providers.filter(p => p.primaryCategory === cat.id || p.secondaryCategories?.includes(cat.id)).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Rendering */}
      {viewMode === 'map' ? (
        /* Simulated Radar Map View */
        <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 relative overflow-hidden min-h-[460px] flex flex-col justify-between">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Top radar status */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-slate-300">Live GPS Technician Dispatch Grid</span>
            </div>
            <span className="text-xs font-mono text-blue-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              Center: {userLocation}
            </span>
          </div>

          {/* Interactive Map Visual Grid with Pulsing Markers */}
          <div className="relative z-10 my-8 flex items-center justify-center">
            <div className="relative w-72 h-72 rounded-full border border-blue-500/30 flex items-center justify-center">
              {/* Inner radar rings */}
              <div className="w-52 h-52 rounded-full border border-blue-500/20 flex items-center justify-center" />
              <div className="w-32 h-32 rounded-full border border-blue-500/40 flex items-center justify-center" />

              {/* User Center Pin */}
              <div className="absolute w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/50">
                <MapPin className="w-3.5 h-3.5 fill-current" />
              </div>

              {/* Provider Markers scattered on radar */}
              {filteredProviders.slice(0, 6).map((p, idx) => {
                const angle = (idx * 60) * (Math.PI / 180);
                const radius = 60 + (idx % 3) * 35;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectProvider(p)}
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                    className="absolute group z-20"
                    title={`${p.name} (${p.profession})`}
                  >
                    <div className="relative">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400 shadow-md group-hover:scale-125 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      {p.availableNow && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full ring-1 ring-white" />
                      )}
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 bg-slate-900/90 text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      {p.name} • ₹{p.startingPrice}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 bg-slate-800/80 backdrop-blur-md rounded-xl p-3 border border-slate-700 text-xs text-slate-300 flex items-center justify-between">
            <span>Showing {filteredProviders.length} active experts in radar zone</span>
            <button
              onClick={() => setViewMode('list')}
              className="text-blue-400 font-bold hover:underline"
            >
              Switch to Detailed List View →
            </button>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProviders.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-800">
                No providers match current filters
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try broadening your search keyword, resetting category filters, or using the AI photo diagnosis tool.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                  setFilterAvailableNow(false);
                  setFilterVerifiedOnly(false);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredProviders.map(provider => (
              <div
                key={provider.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Profile Strip */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="relative">
                      <img
                        src={provider.avatar}
                        alt={provider.name}
                        className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-blue-400 transition-all shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      {provider.availableNow && (
                        <span
                          className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full ring-1 ring-emerald-600/20"
                          title="Available Now"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-heading font-extrabold text-base text-slate-900 truncate">
                          {provider.name}
                        </h3>
                        {provider.verified && (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" title="Verified Professional" />
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-500 truncate">{provider.profession}</p>

                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{provider.rating}</span>
                          <span className="text-slate-400 text-[10px]">({provider.reviewsCount})</span>
                        </div>
                        <span className="text-slate-500 text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-blue-600" />
                          {provider.distanceKm} km away
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3 text-[10px]">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                      {provider.experienceYears} Years Exp
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-medium">
                      {provider.completedJobs} Completed Jobs
                    </span>
                    {provider.subscriptionTier === 'pro' && (
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md font-bold">
                        PRO Partner
                      </span>
                    )}
                    {provider.subscriptionTier === 'business' && (
                      <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md font-bold">
                        👑 Elite Partner
                      </span>
                    )}
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {provider.skills.slice(0, 3).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-slate-50 text-slate-600 text-[10px] px-2 py-0.5 rounded border border-slate-100"
                      >
                        {skill}
                      </span>
                    ))}
                    {provider.skills.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-medium self-center">
                        +{provider.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {provider.about}
                  </p>
                </div>

                {/* Bottom Pricing & Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      Starting Inspection
                    </div>
                    <div className="font-heading font-black text-base text-slate-900">
                      ₹{provider.startingPrice}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectProvider(provider)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => onRequestBooking(provider)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-2xs transition-colors"
                    >
                      Request Service
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
