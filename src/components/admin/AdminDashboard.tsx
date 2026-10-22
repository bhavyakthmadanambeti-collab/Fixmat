import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Sliders,
  DollarSign,
  AlertTriangle,
  FileCheck,
  Clock,
  Sparkles,
  Search,
  Settings,
  Lock,
  Phone,
  Layers,
  BarChart3,
  Edit,
  Trash2,
  Plus,
  Save,
  Megaphone,
  Smartphone,
  ExternalLink,
  RefreshCw,
  LogOut,
  Mail,
  Calendar,
  Wrench,
  KeyRound,
  ChevronRight,
  Shield,
  CreditCard,
  QrCode,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AvatarB } from '../common/AvatarB';
import { Provider, Booking, ServiceCategoryInfo, ServiceCategoryType } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    ownerProfile,
    updateOwnerProfile,
    isOwnerAuthenticated,
    ownerLogout,
    setIsOwnerLoginModalOpen,
    appBrandConfig,
    updateAppBrandConfig,
    categories,
    updateCategory,
    addCategory,
    deleteCategory,
    providers,
    updateProvider,
    addProvider,
    deleteProvider,
    approveProviderVerification,
    rejectProviderVerification,
    bookings,
    updateBooking,
    deleteBooking,
    disputes,
    resolveDispute,
    aiEstimatesHistory,
    platformConfig,
    updatePlatformConfig,
    subscriptionPlans,
    updateSubscriptionPlan,
    ownerPaymentConfig,
    updateOwnerPaymentConfig,
  } = useApp();

  type AdminTab = 'payment_details' | 'contact_details' | 'overview' | 'app_brand' | 'categories' | 'providers' | 'bookings' | 'disputes' | 'ai_logs';
  const [activeTab, setActiveTab] = useState<AdminTab>('payment_details');

  // Owner Payment Configuration form state (Amounts sent to this account)
  const [upiId, setUpiId] = useState(ownerPaymentConfig?.upiId || '9030957387@axl');
  const [paymentPhone, setPaymentPhone] = useState(ownerPaymentConfig?.phone || '9030957387');
  const [beneficiaryName, setBeneficiaryName] = useState(ownerPaymentConfig?.beneficiaryName || 'Bhavyakth (FixMate AI)');
  const [bankName, setBankName] = useState(ownerPaymentConfig?.bankName || 'Axis Bank / Direct UPI');
  const [accountNumber, setAccountNumber] = useState(ownerPaymentConfig?.accountNumber || '9030957387');
  const [ifscCode, setIfscCode] = useState(ownerPaymentConfig?.ifscCode || 'UTIB0001001');
  const [qrCodeNote, setQrCodeNote] = useState(ownerPaymentConfig?.qrCodeNote || 'Direct to Owner UPI Account');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // App Brand & Announcement form state
  const [appName, setAppName] = useState(appBrandConfig.appName);
  const [tagline, setTagline] = useState(appBrandConfig.tagline);
  const [playStoreUrl, setPlayStoreUrl] = useState(appBrandConfig.playStoreUrl);
  const [appStoreUrl, setAppStoreUrl] = useState(appBrandConfig.appStoreUrl);
  const [announcementEnabled, setAnnouncementEnabled] = useState(appBrandConfig.announcementEnabled);
  const [announcementText, setAnnouncementText] = useState(appBrandConfig.announcementText);
  const [announcementBadge, setAnnouncementBadge] = useState(appBrandConfig.announcementBadge);

  // Owner profile & contact form state
  const [ownerName, setOwnerName] = useState(ownerProfile.name);
  const [ownerTitle, setOwnerTitle] = useState(ownerProfile.title);
  const [ownerEmail, setOwnerEmail] = useState(ownerProfile.email);
  const [ownerPhone, setOwnerPhone] = useState(ownerProfile.phone);
  const [ownerBio, setOwnerBio] = useState(ownerProfile.bio);
  const [ownerLocation, setOwnerLocation] = useState(ownerProfile.location);

  // Monetization form state
  const [commission, setCommission] = useState(platformConfig.commissionPercentage.toString());
  const [minFee, setMinFee] = useState((platformConfig.minimumCommission || 50).toString());
  const [emergencyMult, setEmergencyMult] = useState(platformConfig.emergencyMultiplier.toString());
  const [supportPhone, setSupportPhone] = useState(platformConfig.supportPhone || '9030957387');

  // Providers search and filter
  const [providerSearch, setProviderSearch] = useState('');
  const [isAddProviderOpen, setIsAddProviderOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);

  // Categories search and add
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategoryInfo | null>(null);

  // New Provider form state
  const [newProvName, setNewProvName] = useState('');
  const [newProvProfession, setNewProvProfession] = useState('');
  const [newProvCategory, setNewProvCategory] = useState<ServiceCategoryType>('Plumbing');
  const [newProvPhone, setNewProvPhone] = useState('+91 ');
  const [newProvEmail, setNewProvEmail] = useState('');
  const [newProvHourly, setNewProvHourly] = useState('350');
  const [newProvRating, setNewProvRating] = useState('4.8');
  const [newProvArea, setNewProvArea] = useState('Hyderabad Network');

  // New Category form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatPrice, setNewCatPrice] = useState('299');
  const [newCatIssues, setNewCatIssues] = useState('General Diagnosis, Urgent Repair');

  // Success banner
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSaveBanner(msg);
    setTimeout(() => setSaveBanner(null), 3000);
  };

  // KPI Calculations
  const pendingProviders = providers.filter(p => !p.verified);
  const verifiedProviders = providers.filter(p => p.verified);
  const totalVolume = bookings.reduce((sum, b) => sum + (b.totalAmount || (b.estimatedLabor + b.estimatedParts) || 0), 0);
  const platformRevenue = Math.round(totalVolume * (platformConfig.commissionPercentage / 100)) + bookings.length * (platformConfig.minimumCommission || 50);

  // Handle Save Payment Details (Destination account for client amounts)
  const handleSavePaymentDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateOwnerPaymentConfig({
      upiId: upiId.trim(),
      phone: paymentPhone.trim(),
      beneficiaryName: beneficiaryName.trim(),
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim(),
      qrCodeNote: qrCodeNote.trim(),
    });
    updatePlatformConfig({
      commissionPercentage: parseFloat(commission) || 12,
      minimumCommission: parseInt(minFee, 10) || 50,
      emergencyMultiplier: parseFloat(emergencyMult) || 1.35,
    });
    showNotification(`Payment Account Saved! Client payments will now route to UPI: ${upiId.trim()} (Phone: ${paymentPhone.trim()})`);
  };

  // Handle Save Contact Details
  const handleSaveContactDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateOwnerProfile({
      name: ownerName.trim(),
      title: ownerTitle.trim(),
      email: ownerEmail.trim(),
      phone: ownerPhone.trim(),
      bio: ownerBio.trim(),
      location: ownerLocation.trim(),
    });
    updatePlatformConfig({
      supportPhone: supportPhone.trim(),
    });
    showNotification('Owner Contact Details & Support Helpline updated successfully!');
  };

  // Handle Save App Brand & Identity
  const handleSaveBrandAndOwner = (e: React.FormEvent) => {
    e.preventDefault();
    updateAppBrandConfig({
      appName,
      tagline,
      playStoreUrl,
      appStoreUrl,
      announcementEnabled,
      announcementText,
      announcementBadge,
    });

    updateOwnerProfile({
      name: ownerName,
      title: ownerTitle,
      email: ownerEmail,
      phone: ownerPhone,
      bio: ownerBio,
      location: ownerLocation,
    });

    showNotification('App Identity, Store URLs, and Owner Profile updated successfully!');
  };


  // Handle Add New Provider
  const handleCreateProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvName || !newProvProfession) return;

    const newProvider: Provider = {
      id: `prov-${Date.now().toString().slice(-4)}`,
      name: newProvName,
      email: newProvEmail || `${newProvName.toLowerCase().replace(/\s+/g, '.')}@fixmate.ai`,
      phone: newProvPhone,
      profession: newProvProfession,
      primaryCategory: newProvCategory,
      secondaryCategories: [],
      verified: true,
      verificationStatus: 'verified',
      rating: parseFloat(newProvRating) || 4.8,
      reviewsCount: 12,
      distanceKm: 1.5,
      experienceYears: 6,
      startingPrice: parseInt(newProvHourly, 10) || 350,
      hourlyRate: parseInt(newProvHourly, 10) || 350,
      availableNow: true,
      serviceArea: newProvArea,
      locationCoordinates: { lat: 17.44, lng: 78.38 },
      about: `Verified professional technician specializing in ${newProvCategory}.`,
      skills: ['Diagnostic Inspection', 'Quality Installation', 'Emergency Repairs'],
      avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=260',
      completedJobs: 24,
      subscriptionTier: 'pro',
      joinedDate: new Date().toISOString().split('T')[0],
      totalEarnings: 18500,
      pendingPayout: 1200,
      govIdSubmitted: 'AADHAAR-VERIFIED',
      certSubmitted: 'Govt Technical Diploma',
      portfolio: [],
    };

    addProvider(newProvider);
    setIsAddProviderOpen(false);
    setNewProvName('');
    setNewProvProfession('');
    showNotification(`New provider ${newProvider.name} added and verified!`);
  };

  // Handle Add New Category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    const newCategory: ServiceCategoryInfo = {
      id: newCatName as ServiceCategoryType,
      name: newCatName,
      iconName: 'Wrench',
      description: newCatDesc || `${newCatName} maintenance and repair services`,
      avgStartingPrice: parseInt(newCatPrice, 10) || 299,
      popularIssues: newCatIssues.split(',').map(s => s.trim()).filter(Boolean),
      bannerGradient: 'from-purple-600 to-indigo-500',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    };

    addCategory(newCategory);
    setIsAddCategoryOpen(false);
    setNewCatName('');
    setNewCatDesc('');
    showNotification(`New service category "${newCategory.name}" added to the platform!`);
  };

  // Filtered providers
  const filteredProviders = providers.filter(p => {
    const q = providerSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.profession.toLowerCase().includes(q) || p.primaryCategory.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Save Notification Banner */}
      {saveBanner && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveBanner}</span>
        </div>
      )}

      {/* Top Owner Identity Strip */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 border border-purple-900/50 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <AvatarB size="lg" customUrl={ownerProfile.customAvatarUrl} showBadge />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-500/30 text-purple-300 border border-purple-400/30 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Shield className="w-3 h-3 text-purple-300" />
                  Owner & Super Admin Portal
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live System Controller
                </span>
              </div>
              <h1 className="font-heading font-black text-2xl text-white mt-1">
                {ownerProfile.name}
              </h1>
              <p className="text-xs text-purple-200">
                {ownerProfile.title} • <span className="font-mono text-purple-300 font-bold">{ownerProfile.email}</span>
              </p>
            </div>
          </div>

          {/* Owner Session & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Active Payment Destination Badge */}
            <div className="bg-emerald-950/80 border border-emerald-500/40 px-3.5 py-2 rounded-2xl text-xs space-y-0.5">
              <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-emerald-400" />
                <span>Client Payments Route</span>
              </div>
              <div className="font-mono text-emerald-200 font-bold">
                UPI: <span className="text-white">{upiId}</span>
              </div>
            </div>

            {/* Owner Hotline */}
            <div className="bg-slate-800/80 border border-slate-700 px-3.5 py-2 rounded-2xl text-xs space-y-0.5">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Private Owner Hotline
              </div>
              <div className="font-mono text-purple-300 font-bold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-purple-400" />
                <span>{ownerProfile.phone}</span>
              </div>
            </div>

            {isOwnerAuthenticated ? (
              <button
                type="button"
                onClick={ownerLogout}
                className="bg-rose-500/20 hover:bg-rose-500 text-rose-200 hover:text-white border border-rose-500/40 px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Log out from Owner Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsOwnerLoginModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Owner Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Owner Controls */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none text-xs">
        <button
          onClick={() => setActiveTab('payment_details')}
          className={`px-3.5 py-2 rounded-2xl font-bold shrink-0 flex items-center gap-1.5 transition-all ${
            activeTab === 'payment_details'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>💳 Payment Details (UPI: {upiId})</span>
        </button>

        <button
          onClick={() => setActiveTab('contact_details')}
          className={`px-3.5 py-2 rounded-2xl font-bold shrink-0 flex items-center gap-1.5 transition-all ${
            activeTab === 'contact_details'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>📞 Owner Contact Details</span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-2xl font-bold shrink-0 transition-all ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          📊 Overview & KPIs
        </button>

        <button
          onClick={() => setActiveTab('app_brand')}
          className={`px-3.5 py-2 rounded-2xl font-bold shrink-0 transition-all ${
            activeTab === 'app_brand'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          ✨ App Branding & Stores
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-3.5 py-2 rounded-2xl font-bold shrink-0 transition-all ${
            activeTab === 'categories'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          🏷️ Service Categories ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab('providers')}
          className={`px-3.5 py-2 rounded-2xl font-bold shrink-0 transition-all ${
            activeTab === 'providers'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          👥 Pros & Technicians ({providers.length})
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-3.5 py-2 rounded-2xl font-bold shrink-0 transition-all ${
            activeTab === 'bookings'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          📅 Bookings Manager ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-3.5 py-2 rounded-2xl font-bold shrink-0 transition-all ${
            activeTab === 'disputes'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          🛡️ Disputes ({disputes.length})
        </button>

        <button
          onClick={() => setActiveTab('ai_logs')}
          className={`px-3.5 py-2 rounded-2xl font-bold shrink-0 transition-all ${
            activeTab === 'ai_logs'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          🤖 AI Diagnostics ({aiEstimatesHistory.length})
        </button>
      </div>

      {/* 1. PAYMENT DETAILS & UPI CONFIGURATION TAB */}
      {activeTab === 'payment_details' && (
        <form onSubmit={handleSavePaymentDetails} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Primary Client Payments Gateway
                </span>
                <span className="text-xs text-slate-400">Direct Account Settlement</span>
              </div>
              <h2 className="font-heading font-black text-2xl text-slate-900 mt-1">
                Client Payments & Owner UPI Account Configuration
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                When clients send payments for repair services, diagnostic charges, or safety fees, all amounts are automatically directed to the account specified below.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                UPI
              </div>
              <div className="text-xs">
                <span className="text-[10px] text-emerald-700 font-bold uppercase block">Active Receiving Account</span>
                <span className="font-mono font-bold text-emerald-950 text-sm">{upiId}</span>
                <span className="block text-[11px] text-emerald-800 font-medium">Phone: {paymentPhone}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Fields: 2 cols */}
            <div className="lg:col-span-2 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* UPI ID */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Owner UPI ID (Where client amounts are sent)
                  </label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="9030957387@axl"
                    className="w-full p-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-600 rounded-xl font-mono font-bold text-slate-900 outline-hidden"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Clients will transfer directly to this UPI address (Google Pay, PhonePe, Paytm, BHIM).
                  </span>
                </div>

                {/* Registered Phone */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Owner Phone Number (For UPI / GPay / PhonePe)
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentPhone}
                    onChange={e => setPaymentPhone(e.target.value)}
                    placeholder="9030957387"
                    className="w-full p-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-600 rounded-xl font-mono font-bold text-slate-900 outline-hidden"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Used for direct phone number lookups on mobile payment apps.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Beneficiary Name */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Beneficiary / Account Holder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={beneficiaryName}
                    onChange={e => setBeneficiaryName(e.target.value)}
                    placeholder="Bhavyakth (FixMate AI)"
                    className="w-full p-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-600 rounded-xl font-bold text-slate-900 outline-hidden"
                  />
                </div>

                {/* Bank Name */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Bank / Financial Institution
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    placeholder="Axis Bank / Direct UPI"
                    className="w-full p-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-600 rounded-xl font-semibold text-slate-900 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Account Number */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Bank Account Number (Optional / Direct Transfer)
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                    placeholder="9030957387"
                    className="w-full p-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-600 rounded-xl font-mono text-slate-900 outline-hidden"
                  />
                </div>

                {/* IFSC Code */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Bank IFSC Code
                  </label>
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={e => setIfscCode(e.target.value)}
                    placeholder="UTIB0001001"
                    className="w-full p-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-600 rounded-xl font-mono uppercase text-slate-900 outline-hidden"
                  />
                </div>
              </div>

              {/* QR Code Note */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Payment Description / QR Code Note
                </label>
                <input
                  type="text"
                  value={qrCodeNote}
                  onChange={e => setQrCodeNote(e.target.value)}
                  placeholder="Direct to Owner UPI Account"
                  className="w-full p-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-600 rounded-xl text-slate-900 outline-hidden"
                />
              </div>

              {/* Marketplace Fees connected to payments */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-heading font-bold text-slate-900 block">
                  Marketplace Fee & Platform Cut Settings
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Commission Cut (%)
                    </label>
                    <input
                      type="number"
                      value={commission}
                      onChange={e => setCommission(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Safety & Platform Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={minFee}
                      onChange={e => setMinFee(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Emergency Surge Multiplier
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={emergencyMult}
                      onChange={e => setEmergencyMult(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Live Preview of Client QR Code & Deep Link */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col items-center text-center space-y-4">
              <span className="text-xs font-heading font-black text-slate-900 uppercase tracking-wider">
                Live Client QR Code Preview
              </span>

              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
                <QRCodeSVG
                  value={`upi://pay?pa=${upiId}&pn=${encodeURIComponent(beneficiaryName)}&am=499&cu=INR&tn=FixMate%20Payment`}
                  size={176}
                  level="M"
                  marginSize={1}
                  title={`Live Preview QR Code for ${upiId}`}
                />
              </div>

              <div className="text-xs space-y-1">
                <div className="font-mono font-bold text-purple-900 text-sm">
                  {upiId}
                </div>
                <div className="text-slate-600 font-medium">
                  Phone: <strong className="font-mono text-slate-900">{paymentPhone}</strong>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  This dynamic QR code and UPI ID will be rendered to clients during checkout.
                </p>
              </div>

              <div className="flex gap-2 w-full pt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(upiId);
                    setCopiedUpi(true);
                    setTimeout(() => setCopiedUpi(false), 2000);
                  }}
                  className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUpi ? 'Copied UPI' : 'Copy UPI'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(paymentPhone);
                    setCopiedPhone(true);
                    setTimeout(() => setCopiedPhone(false), 2000);
                  }}
                  className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPhone ? 'Copied Phone' : 'Copy Phone'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Changes take effect immediately across all client payment screens and invoices.
            </span>
            <button
              type="submit"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-extrabold px-6 py-3 rounded-2xl text-xs shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>Save Payment Account Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* 2. OWNER CONTACT DETAILS TAB */}
      {activeTab === 'contact_details' && (
        <form onSubmit={handleSaveContactDetails} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                Confidential Owner Management
              </span>
              <span className="text-xs text-slate-400">Strictly Private</span>
            </div>
            <h2 className="font-heading font-black text-2xl text-slate-900 mt-1">
              Owner Identity & Official Contact Details
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Update registered owner profile, contact hotlines, customer support numbers, and emergency contacts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Founder & Owner Full Name
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-purple-600 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Professional Role / Title
              </label>
              <input
                type="text"
                required
                value={ownerTitle}
                onChange={e => setOwnerTitle(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-purple-600 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Private Founder Phone Number
              </label>
              <input
                type="text"
                required
                value={ownerPhone}
                onChange={e => setOwnerPhone(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:border-purple-600 outline-hidden"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Primary contact number (9030957387)
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Owner Registered Email (Protected)
              </label>
              <input
                type="email"
                required
                value={ownerEmail}
                onChange={e => setOwnerEmail(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white focus:border-purple-600 outline-hidden"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Used for owner login portal authentication. Hidden from public users.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Customer Support Contact Helpline
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={e => setSupportPhone(e.target.value)}
                placeholder="9030957387"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white focus:border-purple-600 outline-hidden"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Displayed to customers for assistance and booking inquiries.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Primary Service Headquarters / Location
              </label>
              <input
                type="text"
                value={ownerLocation}
                onChange={e => setOwnerLocation(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-purple-600 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Founder Vision & Platform Mission Bio
            </label>
            <textarea
              rows={3}
              value={ownerBio}
              onChange={e => setOwnerBio(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-purple-600 outline-hidden"
            />
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-heading font-extrabold px-6 py-3 rounded-2xl text-xs shadow-md shadow-purple-900/20 flex items-center gap-2 transition-transform active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>Save Contact Details</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Service Providers
              </span>
              <div className="font-heading font-black text-2xl text-slate-900 mt-1">
                {providers.length}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                {verifiedProviders.length} Verified • {pendingProviders.length} Pending
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Marketplace Volume
              </span>
              <div className="font-heading font-black text-2xl text-slate-900 mt-1">
                ₹{totalVolume.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Across {bookings.length} jobs</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Platform Earnings
              </span>
              <div className="font-heading font-black text-2xl text-purple-600 mt-1">
                ₹{platformRevenue.toLocaleString()}
              </div>
              <div className="text-[10px] text-purple-700 font-semibold mt-0.5">
                {platformConfig.commissionPercentage}% cut + platform fees
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                AI Vision Runs
              </span>
              <div className="font-heading font-black text-2xl text-sky-600 mt-1">
                {aiEstimatesHistory.length}
              </div>
              <div className="text-[10px] text-sky-700 font-semibold mt-0.5">Gemini Vision AI</div>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                  <Megaphone className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-sm text-slate-900">App Banner Announcement</h3>
              </div>
              <p className="text-xs text-slate-600">
                {appBrandConfig.announcementEnabled ? appBrandConfig.announcementText : 'Banner is currently disabled.'}
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('app_brand')}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <span>Edit Banner & Branding</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-sm text-slate-900">Service Categories</h3>
              </div>
              <p className="text-xs text-slate-600">
                {categories.length} active service trades configured. Modify pricing or add new categories anytime.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('categories')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Manage Categories</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-sm text-slate-900">Technicians & Jobs</h3>
              </div>
              <p className="text-xs text-slate-600">
                {providers.length} technicians registered. {bookings.length} jobs tracked across Hyderabad and regional hubs.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('providers')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>Manage Technicians</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. APP BRANDING, ANNOUNCEMENTS & OWNER IDENTITY */}
      {activeTab === 'app_brand' && (
        <form onSubmit={handleSaveBrandAndOwner} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="font-heading font-black text-xl text-slate-900">
              App Identity, Branding & Top Banner Controls
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Changes saved here instantly update across the app for all customers and providers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: App Identity */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-sm text-purple-900 border-b pb-2">
                Brand Names & Store URLs
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Application Name
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={e => setAppName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  App Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Play Store URL
                </label>
                <input
                  type="text"
                  value={playStoreUrl}
                  onChange={e => setPlayStoreUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Apple App Store URL
                </label>
                <input
                  type="text"
                  value={appStoreUrl}
                  onChange={e => setAppStoreUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-blue-600"
                />
              </div>

              {/* Announcement Bar Settings */}
              <div className="pt-2">
                <h4 className="font-heading font-bold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5 text-purple-600" />
                  Top Global Announcement Bar
                </h4>

                <div className="space-y-3 bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-950">Enable Announcement Bar</span>
                    <input
                      type="checkbox"
                      checked={announcementEnabled}
                      onChange={e => setAnnouncementEnabled(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-purple-900 mb-1">
                      Announcement Badge Label
                    </label>
                    <input
                      type="text"
                      value={announcementBadge}
                      onChange={e => setAnnouncementBadge(e.target.value)}
                      placeholder="e.g. SALE, NOTICE, UPDATE"
                      className="w-full p-2 bg-white border border-purple-200 rounded-xl text-xs font-bold text-purple-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-purple-900 mb-1">
                      Announcement Message
                    </label>
                    <textarea
                      rows={2}
                      value={announcementText}
                      onChange={e => setAnnouncementText(e.target.value)}
                      className="w-full p-2 bg-white border border-purple-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Owner Profile & Confidential Contact */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-sm text-purple-900 border-b pb-2">
                Owner & Founder Information
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Founder Name
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Founder Title
                </label>
                <input
                  type="text"
                  value={ownerTitle}
                  onChange={e => setOwnerTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Owner Email (Portal Login)
                </label>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={e => setOwnerEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-purple-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Private Hotline Phone
                </label>
                <input
                  type="text"
                  value={ownerPhone}
                  onChange={e => setOwnerPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Founder Bio & Vision
                </label>
                <textarea
                  rows={3}
                  value={ownerBio}
                  onChange={e => setOwnerBio(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location / Coverage Network
                </label>
                <input
                  type="text"
                  value={ownerLocation}
                  onChange={e => setOwnerLocation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-heading font-bold px-6 py-3 rounded-2xl text-xs shadow-md flex items-center gap-2 transition-transform active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>Save App Branding & Owner Identity</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. SERVICE CATEGORIES MANAGER */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-black text-xl text-slate-900">
                Service Categories & Pricing Management
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Edit starting prices, popular repair issues, or create new service categories.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddCategoryOpen(!isAddCategoryOpen)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-heading font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Category</span>
            </button>
          </div>

          {/* Add Category Form Modal/Dropdown */}
          {isAddCategoryOpen && (
            <form onSubmit={handleCreateCategory} className="bg-purple-50/70 border border-purple-200 rounded-3xl p-6 space-y-4 animate-in fade-in">
              <h3 className="font-heading font-bold text-sm text-purple-950 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-purple-600" />
                Create New Service Category
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Solar Energy, Pest Control"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Average Starting Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCatPrice}
                    onChange={e => setNewCatPrice(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Popular Issues (comma-separated)</label>
                  <input
                    type="text"
                    value={newCatIssues}
                    onChange={e => setNewCatIssues(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="Explain what this category covers..."
                  value={newCatDesc}
                  onChange={e => setNewCatDesc(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-xs"
                >
                  Create Category
                </button>
              </div>
            </form>
          )}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-base text-slate-900">{cat.name}</span>
                      <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ₹{cat.avgStartingPrice} starting
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{cat.description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditingCategory(cat)}
                    className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Edit Category Details"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <strong className="text-slate-800">Popular Issues: </strong>
                  {cat.popularIssues.join(' • ')}
                </div>
              </div>
            ))}
          </div>

          {/* Edit Category Modal */}
          {editingCategory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
              <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    Edit Category: {editingCategory.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Average Starting Price (₹)</label>
                    <input
                      type="number"
                      value={editingCategory.avgStartingPrice}
                      onChange={e => setEditingCategory({ ...editingCategory, avgStartingPrice: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={editingCategory.description}
                      onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Popular Issues (comma-separated)</label>
                    <input
                      type="text"
                      value={editingCategory.popularIssues.join(', ')}
                      onChange={e => setEditingCategory({ ...editingCategory, popularIssues: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete category "${editingCategory.name}"?`)) {
                        deleteCategory(editingCategory.id);
                        setEditingCategory(null);
                        showNotification('Category deleted.');
                      }
                    }}
                    className="text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl text-xs font-bold"
                  >
                    Delete Category
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateCategory(editingCategory.id, editingCategory);
                        setEditingCategory(null);
                        showNotification('Category updated successfully!');
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-xs"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. PROVIDERS & TECHNICIANS MANAGER */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-black text-xl text-slate-900">
                Service Providers & Technicians Directory
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Add, verify, suspend, or update rates and profiles for all technicians.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddProviderOpen(!isAddProviderOpen)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-heading font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Technician</span>
            </button>
          </div>

          {/* Add Provider Modal/Form */}
          {isAddProviderOpen && (
            <form onSubmit={handleCreateProvider} className="bg-purple-50/70 border border-purple-200 rounded-3xl p-6 space-y-4 animate-in fade-in">
              <h3 className="font-heading font-bold text-sm text-purple-950 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-purple-600" />
                Register New Technician
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Technician Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Kumar"
                    value={newProvName}
                    onChange={e => setNewProvName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Profession Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Certified Electrician & Inverter Tech"
                    value={newProvProfession}
                    onChange={e => setNewProvProfession(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Category</label>
                  <select
                    value={newProvCategory}
                    onChange={e => setNewProvCategory(e.target.value as ServiceCategoryType)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newProvPhone}
                    onChange={e => setNewProvPhone(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hourly / Diagnostic Rate (₹)</label>
                  <input
                    type="number"
                    value={newProvHourly}
                    onChange={e => setNewProvHourly(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Area</label>
                  <input
                    type="text"
                    value={newProvArea}
                    onChange={e => setNewProvArea(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProviderOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-xs"
                >
                  Add & Verify Provider
                </button>
              </div>
            </form>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search technicians by name, trade, category..."
              value={providerSearch}
              onChange={e => setProviderSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 outline-hidden"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Technician</th>
                  <th className="pb-3">Trade / Category</th>
                  <th className="pb-3">Rating</th>
                  <th className="pb-3">Rate (₹)</th>
                  <th className="pb-3">Verification</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProviders.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-bold text-slate-900 flex items-center gap-2.5">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-9 h-9 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div>{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{p.phone}</div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="text-slate-800 font-semibold">{p.profession}</div>
                      <div className="text-[10px] text-purple-700">{p.primaryCategory}</div>
                    </td>
                    <td className="py-3 text-amber-500 font-bold">
                      ⭐ {p.rating} <span className="text-slate-400 font-normal">({p.reviewsCount})</span>
                    </td>
                    <td className="py-3 font-bold text-slate-800">
                      ₹{p.hourlyRate}/hr
                    </td>
                    <td className="py-3">
                      {p.verified ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!p.verified ? (
                          <button
                            onClick={() => {
                              approveProviderVerification(p.id);
                              showNotification(`${p.name} verified!`);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              rejectProviderVerification(p.id);
                              showNotification(`${p.name} verification revoked.`);
                            }}
                            className="text-slate-400 hover:text-amber-600 px-2 py-1 text-xs font-semibold"
                            title="Revoke Verification"
                          >
                            Revoke
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove provider ${p.name}?`)) {
                              deleteProvider(p.id);
                              showNotification(`Provider ${p.name} deleted.`);
                            }
                          }}
                          className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
                          title="Delete Provider"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. BOOKINGS & JOBS CONTROLLER */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div>
            <h2 className="font-heading font-black text-xl text-slate-900">
              Customer Bookings & Active Jobs Controller
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Change status, override labor/parts totals, or manage any service request.
            </p>
          </div>

          <div className="space-y-3">
            {bookings.map(b => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      #{b.id}
                    </span>
                    <span className="font-heading font-bold text-sm text-slate-900">{b.problemTitle}</span>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {b.serviceCategory}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">Status:</span>
                    <select
                      value={b.status}
                      onChange={e => {
                        updateBooking(b.id, { status: e.target.value as any });
                        showNotification(`Booking #${b.id} status changed to ${e.target.value}`);
                      }}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800"
                    >
                      <option value="request_sent">Request Sent</option>
                      <option value="provider_accepted">Provider Accepted</option>
                      <option value="on_the_way">On The Way</option>
                      <option value="arrived">Arrived</option>
                      <option value="work_started">Work Started</option>
                      <option value="work_completed">Work Completed</option>
                      <option value="payment_completed">Payment Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete booking #${b.id}?`)) {
                          deleteBooking(b.id);
                          showNotification(`Booking #${b.id} removed.`);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Delete Booking"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-600">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Customer</span>
                    <strong className="text-slate-900">{b.customerName}</strong> ({b.customerPhone})
                    <div className="text-[11px] text-slate-500 truncate">{b.customerAddress}</div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Assigned Technician</span>
                    <strong className="text-slate-900">{b.providerName}</strong>
                    <div className="text-[11px] text-slate-500">{b.providerProfession}</div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Amount & Payment</span>
                    <div className="font-heading font-black text-slate-900 text-sm">
                      ₹{b.totalAmount || (b.estimatedLabor + b.estimatedParts)}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${b.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      Payment: {b.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. DISPUTES RESOLUTION */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          <h2 className="font-heading font-black text-xl text-slate-900">
            Dispute Resolution & Customer Protection
          </h2>

          {disputes.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs">
              <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-heading font-bold text-base text-slate-800">
                Zero Active Customer Disputes
              </h3>
              <p className="text-xs text-slate-500 mt-1">Platform satisfaction score is 99.4%</p>
            </div>
          ) : (
            disputes.map(d => (
              <div
                key={d.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      Ticket {d.id}
                    </span>
                    <strong className="ml-2 text-slate-900">{d.reason}</strong>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {d.status}
                  </span>
                </div>

                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {d.details}
                </p>

                <div className="flex items-center justify-between text-slate-500">
                  <span>Customer: <strong>{d.raisedByName}</strong> • Target: <strong>{d.targetName}</strong></span>

                  {d.status === 'open' && (
                    <button
                      onClick={() => {
                        resolveDispute(d.id, {
                          status: 'refunded',
                          notes: 'Full refund issued by Owner Bhavyakth.',
                          refundAmount: 500,
                        });
                        showNotification(`Dispute ${d.id} refunded and resolved!`);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold"
                    >
                      Issue Refund & Close
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 8. AI VISION DIAGNOSTIC LOGS */}
      {activeTab === 'ai_logs' && (
        <div className="space-y-4">
          <h2 className="font-heading font-black text-xl text-slate-900">
            Multimodal AI Vision Runs (Gemini 3.7 Flash)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiEstimatesHistory.map((est, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    {est.category}
                  </span>
                  <span className="text-[10px] text-slate-400">Confidence: {est.confidence}</span>
                </div>

                <h4 className="font-heading font-bold text-sm text-slate-900">{est.problemTitle}</h4>
                <p className="text-slate-600 line-clamp-2">{est.summary}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-bold">
                  <span>Calculated Estimate:</span>
                  <span className="text-sky-700 font-heading">
                    ₹{est.totalRange.min} – ₹{est.totalRange.max}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
