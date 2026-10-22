import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  User,
  Provider,
  Booking,
  ChatMessage,
  NotificationItem,
  AIEstimateResult,
  ProviderQuote,
  SubscriptionPlan,
  PlatformConfig,
  ProviderDocumentRecord,
  DisputeRecord,
  OwnerProfile,
  ProviderReview,
  AppBrandConfig,
  ServiceCategoryInfo,
  OwnerPaymentConfig,
  AppLanguage,
  ThemeMode,
  AIConversationSession,
  AIConversationMessage,
} from '../types';
import {
  OWNER_PROFILE,
  INITIAL_PROVIDERS,
  SUBSCRIPTION_PLANS,
  INITIAL_PLATFORM_CONFIG,
  INITIAL_BOOKINGS,
  INITIAL_DISPUTES,
  INITIAL_DOCUMENTS,
  SERVICE_CATEGORIES,
  INITIAL_OWNER_PAYMENT_CONFIG,
} from '../data/mockData';
import { APP_CONFIG } from '../config/appConfig';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  ownerProfile: OwnerProfile;
  updateOwnerProfile: (profile: Partial<OwnerProfile>) => void;
  updateOwnerAvatar: (url: string) => void;

  // Owner Authentication & Portal
  isOwnerAuthenticated: boolean;
  isOwnerLoginModalOpen: boolean;
  setIsOwnerLoginModalOpen: (open: boolean) => void;
  ownerLogin: (email: string, password: string) => { success: boolean; message?: string };
  ownerLogout: () => void;

  // Owner Payment Configuration (All client payments route here)
  ownerPaymentConfig: OwnerPaymentConfig;
  updateOwnerPaymentConfig: (updates: Partial<OwnerPaymentConfig>) => void;
  processPayment: (bookingId: string, paymentMethod?: string) => void;

  // App Branding & Dynamic Announcements
  appBrandConfig: AppBrandConfig;
  updateAppBrandConfig: (updates: Partial<AppBrandConfig>) => void;

  // Service Categories (Dynamic control)
  categories: ServiceCategoryInfo[];
  updateCategory: (id: string, updates: Partial<ServiceCategoryInfo>) => void;
  addCategory: (category: ServiceCategoryInfo) => void;
  deleteCategory: (id: string) => void;

  // Providers
  providers: Provider[];
  updateProvider: (id: string, updates: Partial<Provider>) => void;
  addProvider: (provider: Provider) => void;
  deleteProvider: (id: string) => void;
  approveProviderVerification: (id: string) => void;
  rejectProviderVerification: (id: string) => void;
  selectedProvider: Provider | null;
  setSelectedProvider: (provider: Provider | null) => void;
  
  // Bookings
  bookings: Booking[];
  createBooking: (bookingData: Partial<Booking>) => Booking;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status'], note?: string) => void;
  submitQuote: (quote: Omit<ProviderQuote, 'id' | 'createdAt' | 'status'>) => void;
  respondToQuote: (quoteId: string, bookingId: string, accept: boolean) => void;
  completePayment: (bookingId: string, paymentMethod: Booking['paymentMethod'], amount: number) => void;
  submitReview: (review: Omit<ProviderReview, 'id' | 'date'>) => void;
  
  // Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (bookingId: string, text: string, attachments?: { imageUrl?: string; aiEstimateAttachment?: AIEstimateResult; quoteAttachment?: ProviderQuote }) => void;
  
  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void;
  
  // AI Diagnostics
  activeAiEstimate: AIEstimateResult | null;
  setActiveAiEstimate: (est: AIEstimateResult | null) => void;
  estimateHistory: AIEstimateResult[];
  aiEstimatesHistory: AIEstimateResult[];
  saveAiEstimate: (est: AIEstimateResult) => void;
  
  // Platform & Admin
  platformConfig: PlatformConfig;
  updatePlatformConfig: (config: Partial<PlatformConfig>) => void;
  subscriptionPlans: SubscriptionPlan[];
  updateSubscriptionPlan: (id: string, updates: Partial<SubscriptionPlan>) => void;
  upgradeProviderPlan: (providerId: string, tier: Provider['subscriptionTier']) => void;
  documents: ProviderDocumentRecord[];
  reviewDocument: (docId: string, status: 'verified' | 'rejected', notes?: string) => void;
  disputes: DisputeRecord[];
  createDispute: (dispute: Omit<DisputeRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  resolveDispute: (disputeId: string, resolution: { status: 'resolved' | 'refunded'; notes: string; refundAmount?: number }) => void;
  
  // Selected Category & Location
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  userLocation: string;
  setUserLocation: (loc: string) => void;
  
  // Theme & Language
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  // AI Assistant Conversations History
  aiConversations: AIConversationSession[];
  currentConversationId: string | null;
  setCurrentConversationId: (id: string | null) => void;
  createAIConversation: (initialTitle?: string) => AIConversationSession;
  updateAIConversationMessages: (sessionId: string, messages: AIConversationMessage[]) => void;
  deleteAIConversation: (sessionId: string) => void;
  renameAIConversation: (sessionId: string, newTitle: string) => void;

  // Navigation tabs helper
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Role & Profile state
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');

  // Theme & Language
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    return (localStorage.getItem('fixmate_lang') as AppLanguage) || 'en';
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('fixmate_lang', lang);
  };

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('fixmate_theme') as ThemeMode) || 'light';
  });

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    localStorage.setItem('fixmate_theme', t);
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // AI Assistant Conversations State
  const [aiConversations, setAiConversations] = useState<AIConversationSession[]>(() => {
    const saved = localStorage.getItem('fixmate_ai_conversations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'conv-demo-1',
        title: 'AC Leaking Water Indoors',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
        category: 'AC & Cooling',
        messages: [
          {
            id: 'm1',
            role: 'user',
            content: 'My split AC indoor unit is dripping water down the bedroom wall. What should I check first?',
            timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          },
          {
            id: 'm2',
            role: 'assistant',
            content: `Here is a step-by-step diagnostic guide for your split AC leak:

### 1. Most Likely Causes
1. **Clogged Condensate Drain Line**: Slime or algae blockage in the drain pipe causes water to back up and overflow the indoor pan (80% of cases).
2. **Improper Drain Hose Slope**: If the hose lacks a downward angle, gravity prevents smooth runoff.
3. **Dirty Air Filters & Evaporator Coil**: Low airflow causes coil frost that melts rapidly and overflows the drain tray.

### 2. Immediate Safe Steps
- **Step 1:** Turn off the AC from the remote and main isolator switch to prevent electrical hazards.
- **Step 2:** Place a dry towel and bucket beneath the indoor blower.
- **Step 3:** Open the front plastic cover, slide out the washable mesh filters, and wash them with lukewarm water.
- **Step 4:** Inspect the external drain pipe exit outside. If you see dirt or no water dripping while the AC runs, gently flush the line.

⚠️ **Caution:** Do not poke sharp wires into the internal evaporator coils. If refrigerant leakage or pump failure is suspected, book a verified FixMate HVAC technician.`,
            timestamp: new Date(Date.now() - 3600000 * 23).toISOString(),
            feedback: 'helpful',
            saved: true,
          }
        ]
      }
    ];
  });

  const [currentConversationId, setCurrentConversationId] = useState<string | null>(() => {
    return 'conv-demo-1';
  });

  const saveAiConversations = (conversations: AIConversationSession[]) => {
    setAiConversations(conversations);
    localStorage.setItem('fixmate_ai_conversations', JSON.stringify(conversations));
  };

  const createAIConversation = (initialTitle: string = 'New FixMate Diagnosis'): AIConversationSession => {
    const newSession: AIConversationSession = {
      id: `conv-${Date.now()}`,
      title: initialTitle,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newSession, ...aiConversations];
    saveAiConversations(updated);
    setCurrentConversationId(newSession.id);
    return newSession;
  };

  const updateAIConversationMessages = (sessionId: string, messages: AIConversationMessage[]) => {
    const updated = aiConversations.map(conv => {
      if (conv.id === sessionId) {
        // Auto-title from first user prompt if still default
        let newTitle = conv.title;
        if (conv.title === 'New FixMate Diagnosis' || conv.title.startsWith('New Consultation')) {
          const firstUserMsg = messages.find(m => m.role === 'user');
          if (firstUserMsg) {
            newTitle = firstUserMsg.content.slice(0, 36) + (firstUserMsg.content.length > 36 ? '...' : '');
          }
        }
        return {
          ...conv,
          title: newTitle,
          messages,
          updatedAt: new Date().toISOString(),
        };
      }
      return conv;
    });
    saveAiConversations(updated);
  };

  const deleteAIConversation = (sessionId: string) => {
    const filtered = aiConversations.filter(c => c.id !== sessionId);
    saveAiConversations(filtered);
    if (currentConversationId === sessionId) {
      setCurrentConversationId(filtered[0]?.id || null);
    }
  };

  const renameAIConversation = (sessionId: string, newTitle: string) => {
    const updated = aiConversations.map(c => (c.id === sessionId ? { ...c, title: newTitle } : c));
    saveAiConversations(updated);
  };
  
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile>(() => {
    const saved = localStorage.getItem('fixmate_owner_profile');
    return saved ? JSON.parse(saved) : OWNER_PROFILE;
  });

  // Owner Authentication & Modal state
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('fixmate_owner_auth') === 'true';
  });
  const [isOwnerLoginModalOpen, setIsOwnerLoginModalOpen] = useState(false);

  const ownerLogin = (email: string, password: string): { success: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanEmail === 'bhavyakthmadanambeti@gmail.com' && cleanPass === 'bhavyakth') {
      setIsOwnerAuthenticated(true);
      localStorage.setItem('fixmate_owner_auth', 'true');
      setCurrentRole('admin');
      setActiveTab('admin_dashboard');
      return { success: true };
    }

    return {
      success: false,
      message: 'Invalid owner credentials. Access restricted to authorized app owner.',
    };
  };

  const ownerLogout = () => {
    setIsOwnerAuthenticated(false);
    localStorage.removeItem('fixmate_owner_auth');
    setCurrentRole('customer');
    setActiveTab('home');
  };

  // Owner Payment Configuration (Where client payments are sent)
  const [ownerPaymentConfig, setOwnerPaymentConfig] = useState<OwnerPaymentConfig>(() => {
    const saved = localStorage.getItem('fixmate_owner_payment');
    return saved ? JSON.parse(saved) : INITIAL_OWNER_PAYMENT_CONFIG;
  });

  const updateOwnerPaymentConfig = (updates: Partial<OwnerPaymentConfig>) => {
    setOwnerPaymentConfig(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('fixmate_owner_payment', JSON.stringify(next));
      return next;
    });
  };

  const updateOwnerAvatar = (url: string) => {
    setOwnerProfile(prev => {
      const next = { ...prev, customAvatarUrl: url };
      localStorage.setItem('fixmate_owner_profile', JSON.stringify(next));
      return next;
    });
  };

  // App Branding & Dynamic Announcement state
  const [appBrandConfig, setAppBrandConfig] = useState<AppBrandConfig>(() => {
    const saved = localStorage.getItem('fixmate_app_brand');
    return saved
      ? JSON.parse(saved)
      : {
          appName: 'FixMate AI',
          tagline: 'See the problem. Get an estimate. Find the right expert.',
          heroHeadline: 'Fix Anything with Multimodal AI & Verified Pros',
          playStoreUrl: APP_CONFIG.PLAY_STORE_URL,
          appStoreUrl: APP_CONFIG.APP_STORE_URL,
          announcementEnabled: true,
          announcementText: '⚡ Owner Control Portal Active: Real-time configuration enabled for Founder Bhavyakth.',
          announcementBadge: 'LIVE',
        };
  });

  const updateAppBrandConfig = (updates: Partial<AppBrandConfig>) => {
    setAppBrandConfig(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('fixmate_app_brand', JSON.stringify(next));
      return next;
    });
  };

  // Dynamic Service Categories state (Owner can edit/add/delete any category)
  const [categories, setCategories] = useState<ServiceCategoryInfo[]>(() => {
    const saved = localStorage.getItem('fixmate_categories');
    return saved ? JSON.parse(saved) : SERVICE_CATEGORIES;
  });

  const updateCategory = (id: string, updates: Partial<ServiceCategoryInfo>) => {
    setCategories(prev => {
      const next = prev.map(c => (c.id === id ? { ...c, ...updates } : c));
      localStorage.setItem('fixmate_categories', JSON.stringify(next));
      return next;
    });
  };

  const addCategory = (category: ServiceCategoryInfo) => {
    setCategories(prev => {
      const next = [...prev, category];
      localStorage.setItem('fixmate_categories', JSON.stringify(next));
      return next;
    });
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => {
      const next = prev.filter(c => c.id !== id);
      localStorage.setItem('fixmate_categories', JSON.stringify(next));
      return next;
    });
  };

  const [currentUser, setCurrentUser] = useState<User>(() => {
    return {
      id: 'cust-1',
      name: 'Ananya Sharma',
      email: 'ananya.sharma@example.com',
      role: 'customer',
      phone: '+91 98491 10293',
      address: 'Flat 402, Sunshine Heights, Gachibowli, Hyderabad',
      city: 'Hyderabad',
      createdAt: '2025-10-12',
    };
  });

  // Switch user details when role switches
  useEffect(() => {
    if (currentRole === 'admin') {
      setCurrentUser({
        id: 'admin-bhavyakth',
        name: ownerProfile.name, // Bhavyakth
        email: ownerProfile.email,
        role: 'admin',
        phone: ownerProfile.phone, // 9030957387
        address: 'FixMate AI Headquarters, Financial District, Hyderabad',
        city: 'Hyderabad',
        avatar: ownerProfile.avatar,
        createdAt: '2024-01-01',
      });
    } else if (currentRole === 'provider') {
      setCurrentUser({
        id: 'prov-1',
        name: 'Rajesh Sharma',
        email: 'rajesh.plumbing@gmail.com',
        role: 'provider',
        phone: '+91 98450 11234',
        address: 'Shop 12, Main Road, Kukatpally, Hyderabad',
        city: 'Hyderabad',
        avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=260',
        createdAt: '2023-04-10',
      });
    } else {
      setCurrentUser({
        id: 'cust-1',
        name: 'Ananya Sharma',
        email: 'ananya.sharma@example.com',
        role: 'customer',
        phone: '+91 98491 10293',
        address: 'Flat 402, Sunshine Heights, Gachibowli, Hyderabad',
        city: 'Hyderabad',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=260',
        createdAt: '2025-10-12',
      });
    }
  }, [currentRole, ownerProfile]);

  const updateOwnerProfile = (updates: Partial<OwnerProfile>) => {
    setOwnerProfile(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('fixmate_owner_profile', JSON.stringify(next));
      return next;
    });
  };

  // 2. Providers
  const [providers, setProviders] = useState<Provider[]>(() => {
    const saved = localStorage.getItem('fixmate_providers');
    return saved ? JSON.parse(saved) : INITIAL_PROVIDERS;
  });

  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const updateProvider = (id: string, updates: Partial<Provider>) => {
    setProviders(prev => {
      const updated = prev.map(p => (p.id === id ? { ...p, ...updates } : p));
      localStorage.setItem('fixmate_providers', JSON.stringify(updated));
      return updated;
    });
  };

  const addProvider = (newProv: Provider) => {
    setProviders(prev => {
      const next = [newProv, ...prev];
      localStorage.setItem('fixmate_providers', JSON.stringify(next));
      return next;
    });
  };

  const deleteProvider = (id: string) => {
    setProviders(prev => {
      const next = prev.filter(p => p.id !== id);
      localStorage.setItem('fixmate_providers', JSON.stringify(next));
      return next;
    });
  };

  const approveProviderVerification = (id: string) => {
    updateProvider(id, { verified: true, verificationStatus: 'verified' });
  };

  const rejectProviderVerification = (id: string) => {
    updateProvider(id, { verified: false, verificationStatus: 'rejected' });
  };

  // 3. Bookings
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('fixmate_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const createBooking = (bookingData: Partial<Booking>): Booking => {
    const newId = `FM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      id: newId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone || '+91 98491 10293',
      customerAddress: currentUser.address || 'Hitech City, Hyderabad',
      providerId: bookingData.providerId || 'prov-1',
      providerName: bookingData.providerName || 'Rajesh Sharma',
      providerProfession: bookingData.providerProfession || 'Master Plumber',
      providerAvatar: bookingData.providerAvatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=260',
      serviceCategory: bookingData.serviceCategory || 'Plumbing',
      problemTitle: bookingData.problemTitle || 'Repair Inspection Request',
      description: bookingData.description || '',
      photos: bookingData.photos || [],
      isEmergency: !!bookingData.isEmergency,
      aiEstimate: bookingData.aiEstimate,
      scheduledDate: bookingData.scheduledDate || new Date().toISOString().split('T')[0],
      scheduledTime: bookingData.scheduledTime || 'Within 45 Mins',
      status: 'request_sent',
      statusHistory: [
        {
          status: 'request_sent',
          timestamp: new Date().toISOString(),
          updatedBy: currentUser.name,
          note: bookingData.isEmergency ? '🚨 Emergency priority service requested.' : 'Service request submitted.',
        },
      ],
      estimatedLabor: bookingData.estimatedLabor || 350,
      estimatedParts: bookingData.estimatedParts || 150,
      platformFee: Math.round((bookingData.estimatedLabor || 350) * 0.1),
      totalAmount: (bookingData.estimatedLabor || 350) + (bookingData.estimatedParts || 150) + Math.round((bookingData.estimatedLabor || 350) * 0.1),
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      ...bookingData,
    };

    setBookings(prev => {
      const next = [newBooking, ...prev];
      localStorage.setItem('fixmate_bookings', JSON.stringify(next));
      return next;
    });

    // Send instant notification to provider
    addNotification({
      userId: newBooking.providerId,
      role: 'provider',
      title: newBooking.isEmergency ? '🚨 Urgent Emergency Service Request!' : 'New Service Request',
      message: `${newBooking.customerName} requested ${newBooking.serviceCategory}: "${newBooking.problemTitle}" at ${newBooking.customerAddress}.`,
      type: 'booking',
      targetId: newBooking.id,
    });

    return newBooking;
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => {
      const next = prev.map(b => (b.id === id ? { ...b, ...updates } : b));
      localStorage.setItem('fixmate_bookings', JSON.stringify(next));
      return next;
    });
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => {
      const next = prev.filter(b => b.id !== id);
      localStorage.setItem('fixmate_bookings', JSON.stringify(next));
      return next;
    });
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status'], note?: string) => {
    setBookings(prev => {
      const updated = prev.map(b => {
        if (b.id === bookingId) {
          const newHistory = [
            ...b.statusHistory,
            {
              status,
              timestamp: new Date().toISOString(),
              updatedBy: currentUser.name,
              note,
            },
          ];
          return { ...b, status, statusHistory: newHistory };
        }
        return b;
      });
      localStorage.setItem('fixmate_bookings', JSON.stringify(updated));
      return updated;
    });

    // Notify customer
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (targetBooking) {
      let msg = `Your booking #${bookingId} status updated to: ${status.replace(/_/g, ' ').toUpperCase()}`;
      if (status === 'provider_accepted') msg = `${targetBooking.providerName} accepted your booking request!`;
      if (status === 'on_the_way') msg = `${targetBooking.providerName} is on the way to your location.`;
      if (status === 'arrived') msg = `${targetBooking.providerName} has arrived at your address.`;
      if (status === 'work_started') msg = `Repair work has officially commenced.`;
      if (status === 'work_completed') msg = `Work completed! Please review itemized bill and complete payment.`;

      addNotification({
        userId: targetBooking.customerId,
        role: 'customer',
        title: 'Booking Status Update',
        message: msg,
        type: 'booking',
        targetId: bookingId,
      });
    }
  };

  const submitQuote = (quoteData: Omit<ProviderQuote, 'id' | 'createdAt' | 'status'>) => {
    const newQuote: ProviderQuote = {
      id: `qt-${Date.now()}`,
      ...quoteData,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    setBookings(prev => {
      const updated = prev.map(b => {
        if (b.id === quoteData.bookingId) {
          return {
            ...b,
            quote: newQuote,
            totalAmount: newQuote.finalPrice,
          };
        }
        return b;
      });
      localStorage.setItem('fixmate_bookings', JSON.stringify(updated));
      return updated;
    });

    const targetBooking = bookings.find(b => b.id === quoteData.bookingId);
    if (targetBooking) {
      addNotification({
        userId: targetBooking.customerId,
        role: 'customer',
        title: 'New Quotation Received',
        message: `${targetBooking.providerName} sent an itemized quote of ₹${newQuote.finalPrice} for booking #${targetBooking.id}.`,
        type: 'quote',
        targetId: targetBooking.id,
      });

      // Add chat message with quote attachment
      sendChatMessage(targetBooking.id, `I have submitted an itemized quotation of ₹${newQuote.finalPrice}. Notes: ${newQuote.notes}`, {
        quoteAttachment: newQuote,
      });
    }
  };

  const respondToQuote = (quoteId: string, bookingId: string, accept: boolean) => {
    setBookings(prev => {
      const updated = prev.map(b => {
        if (b.id === bookingId && b.quote && b.quote.id === quoteId) {
          const updatedQuote: ProviderQuote = {
            ...b.quote,
            status: accept ? 'accepted' : 'declined',
          };
          return {
            ...b,
            quote: updatedQuote,
            status: accept ? (b.status === 'request_sent' ? 'provider_accepted' : b.status) : b.status,
          };
        }
        return b;
      });
      localStorage.setItem('fixmate_bookings', JSON.stringify(updated));
      return updated;
    });

    const targetBooking = bookings.find(b => b.id === bookingId);
    if (targetBooking) {
      addNotification({
        userId: targetBooking.providerId,
        role: 'provider',
        title: accept ? 'Quotation Accepted! 🎉' : 'Quotation Declined',
        message: `${targetBooking.customerName} has ${accept ? 'accepted' : 'declined'} your quotation of ₹${targetBooking.quote?.finalPrice}.`,
        type: 'quote',
        targetId: bookingId,
      });
    }
  };

  const completePayment = (bookingId: string, paymentMethod: Booking['paymentMethod'], amount: number) => {
    const txnRef = `UPI-TXN-${Date.now().toString().slice(-8)}`;
    setBookings(prev => {
      const updated = prev.map(b => {
        if (b.id === bookingId) {
          const history = [
            ...b.statusHistory,
            {
              status: 'payment_completed' as const,
              timestamp: new Date().toISOString(),
              updatedBy: currentUser.name,
              note: `Payment of ₹${amount} received via ${paymentMethod?.toUpperCase()}. Ref: ${txnRef}`,
            },
          ];
          return {
            ...b,
            status: 'payment_completed' as const,
            paymentStatus: 'paid' as const,
            paymentMethod,
            paidAt: new Date().toISOString(),
            transactionRef: txnRef,
            receiptUrl: `/receipts/${bookingId}.pdf`,
            statusHistory: history,
          };
        }
        return b;
      });
      localStorage.setItem('fixmate_bookings', JSON.stringify(updated));
      return updated;
    });

    // Update provider earnings
    const target = bookings.find(b => b.id === bookingId);
    if (target) {
      const commissionRate = platformConfig.commissionPercentage / 100;
      const commission = Math.max(platformConfig.minimumCommission, Math.round(amount * commissionRate));
      const providerEarnings = amount - commission;

      updateProvider(target.providerId, {
        totalEarnings: (providers.find(p => p.id === target.providerId)?.totalEarnings || 0) + providerEarnings,
        pendingPayout: (providers.find(p => p.id === target.providerId)?.pendingPayout || 0) + providerEarnings,
        completedJobs: (providers.find(p => p.id === target.providerId)?.completedJobs || 0) + 1,
      });

      addNotification({
        userId: target.providerId,
        role: 'provider',
        title: 'Payment Received! 💰',
        message: `₹${providerEarnings} credited to your FixMate wallet for booking #${bookingId} (after ₹${commission} platform fee).`,
        type: 'payment',
        targetId: bookingId,
      });
    }
  };

  const processPayment = (bookingId: string, paymentMethod: string = 'upi') => {
    const target = bookings.find(b => b.id === bookingId);
    const labor = target?.quotation?.laborFee || target?.estimatedLabor || 350;
    const parts = target?.quotation?.partsFee || target?.estimatedParts || 0;
    const platFee = target?.platformFee || platformConfig.minimumCommission || 50;
    const subtotal = labor + parts + platFee;
    const grandTotal = subtotal + Math.round(subtotal * 0.05);
    completePayment(bookingId, paymentMethod as any, grandTotal);
  };

  const submitReview = (reviewData: Omit<ProviderReview, 'id' | 'date'>) => {
    const newReview: ProviderReview = {
      id: `rev-${Date.now()}`,
      ...reviewData,
      date: new Date().toISOString().split('T')[0],
    };

    // Update booking status
    setBookings(prev => {
      const updated = prev.map(b => {
        if (b.id === reviewData.bookingId) {
          const history = [
            ...b.statusHistory,
            {
              status: 'review_submitted' as const,
              timestamp: new Date().toISOString(),
              updatedBy: currentUser.name,
              note: `Customer left a ${reviewData.overallRating}-star review.`,
            },
          ];
          return {
            ...b,
            status: 'review_submitted' as const,
            statusHistory: history,
          };
        }
        return b;
      });
      localStorage.setItem('fixmate_bookings', JSON.stringify(updated));
      return updated;
    });

    // Recalculate provider rating
    const targetProv = providers.find(p => p.id === reviewData.providerId);
    if (targetProv) {
      const newCount = targetProv.reviewsCount + 1;
      const newRating = Number(((targetProv.rating * targetProv.reviewsCount + reviewData.overallRating) / newCount).toFixed(1));
      updateProvider(targetProv.id, {
        reviewsCount: newCount,
        rating: newRating,
      });

      addNotification({
        userId: targetProv.id,
        role: 'provider',
        title: 'New Customer Review! ⭐',
        message: `${reviewData.customerName} gave you a ${reviewData.overallRating}-star review: "${reviewData.comment.slice(0, 60)}..."`,
        type: 'system',
        targetId: reviewData.bookingId,
      });
    }
  };

  // 4. Chat Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('fixmate_chats');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'msg-1',
            bookingId: 'FM-7821',
            senderId: 'cust-1',
            senderRole: 'customer',
            senderName: 'Ananya Sharma',
            text: 'Hello Rajesh ji, water is leaking from the sink p-trap. How soon can you arrive?',
            timestamp: '2026-08-19T09:32:00Z',
            read: true,
          },
          {
            id: 'msg-2',
            bookingId: 'FM-7821',
            senderId: 'prov-1',
            senderRole: 'provider',
            senderName: 'Rajesh Sharma',
            text: 'Namaste Ananya ji! I have packed standard PVC rubber seals and heavy-duty teflon tape. Leaving in 5 mins and will arrive by 11:00 AM.',
            timestamp: '2026-08-19T09:36:00Z',
            read: true,
          },
        ];
  });

  const sendChatMessage = (
    bookingId: string,
    text: string,
    attachments?: { imageUrl?: string; aiEstimateAttachment?: AIEstimateResult; quoteAttachment?: ProviderQuote }
  ) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      bookingId,
      senderId: currentUser.id,
      senderRole: currentRole,
      senderName: currentUser.name,
      text,
      imageUrl: attachments?.imageUrl,
      aiEstimateAttachment: attachments?.aiEstimateAttachment,
      quoteAttachment: attachments?.quoteAttachment,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setChatMessages(prev => {
      const next = [...prev, newMsg];
      localStorage.setItem('fixmate_chats', JSON.stringify(next));
      return next;
    });
  };

  // 5. Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('fixmate_notifications');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'notif-1',
            userId: 'cust-1',
            role: 'customer',
            title: 'Welcome to FixMate AI',
            message: 'Diagnose any home or vehicle repair instantly with AI photo scan. Developed by Bhavyakth.',
            type: 'system',
            read: false,
            createdAt: '2026-08-19T08:00:00Z',
          },
          {
            id: 'notif-2',
            userId: 'cust-1',
            role: 'customer',
            title: 'Technician Dispatched',
            message: 'Rajesh Sharma is on the way for Booking #FM-7821.',
            type: 'booking',
            targetId: 'FM-7821',
            read: false,
            createdAt: '2026-08-19T10:15:00Z',
          },
        ];
  });

  const addNotification = (notifData: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      ...notifData,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => {
      const next = [newNotif, ...prev];
      localStorage.setItem('fixmate_notifications', JSON.stringify(next));
      return next;
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => {
      const next = prev.map(n => (n.id === id ? { ...n, read: true } : n));
      localStorage.setItem('fixmate_notifications', JSON.stringify(next));
      return next;
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('fixmate_notifications', JSON.stringify(next));
      return next;
    });
  };

  // 6. AI Estimates
  const [activeAiEstimate, setActiveAiEstimate] = useState<AIEstimateResult | null>(null);
  const [estimateHistory, setEstimateHistory] = useState<AIEstimateResult[]>(() => {
    const saved = localStorage.getItem('fixmate_ai_estimates');
    return saved ? JSON.parse(saved) : [];
  });

  const saveAiEstimate = (est: AIEstimateResult) => {
    setActiveAiEstimate(est);
    setEstimateHistory(prev => {
      const next = [est, ...prev.filter(e => e.id !== est.id)];
      localStorage.setItem('fixmate_ai_estimates', JSON.stringify(next));
      return next;
    });
  };

  // 7. Platform & Admin
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>(() => {
    const saved = localStorage.getItem('fixmate_platform_config');
    return saved ? JSON.parse(saved) : INITIAL_PLATFORM_CONFIG;
  });

  const updatePlatformConfig = (updates: Partial<PlatformConfig>) => {
    setPlatformConfig(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('fixmate_platform_config', JSON.stringify(next));
      return next;
    });
  };

  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(() => {
    const saved = localStorage.getItem('fixmate_sub_plans');
    return saved ? JSON.parse(saved) : SUBSCRIPTION_PLANS;
  });

  const updateSubscriptionPlan = (id: string, updates: Partial<SubscriptionPlan>) => {
    setSubscriptionPlans(prev => {
      const next = prev.map(p => (p.id === id ? { ...p, ...updates } : p));
      localStorage.setItem('fixmate_sub_plans', JSON.stringify(next));
      return next;
    });
  };

  const upgradeProviderPlan = (providerId: string, tier: Provider['subscriptionTier']) => {
    updateProvider(providerId, { subscriptionTier: tier });
    addNotification({
      userId: providerId,
      role: 'provider',
      title: 'Subscription Plan Activated! 🚀',
      message: `Your account has been upgraded to the FixMate ${tier.toUpperCase()} plan.`,
      type: 'system',
    });
  };

  const [documents, setDocuments] = useState<ProviderDocumentRecord[]>(() => {
    const saved = localStorage.getItem('fixmate_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const reviewDocument = (docId: string, status: 'verified' | 'rejected', notes?: string) => {
    setDocuments(prev => {
      const next = prev.map(d => (d.id === docId ? { ...d, status, notes, reviewedAt: new Date().toISOString() } : d));
      localStorage.setItem('fixmate_documents', JSON.stringify(next));
      return next;
    });

    const targetDoc = documents.find(d => d.id === docId);
    if (targetDoc) {
      if (status === 'verified') {
        updateProvider(targetDoc.providerId, { verified: true, verificationStatus: 'verified' });
      } else {
        updateProvider(targetDoc.providerId, { verified: false, verificationStatus: 'rejected' });
      }
      addNotification({
        userId: targetDoc.providerId,
        role: 'provider',
        title: status === 'verified' ? 'Documents Approved! ✅' : 'Document Verification Update',
        message: status === 'verified'
          ? 'Your identity documents have been verified by Admin Bhavyakth. You now display the Verified Professional badge.'
          : `Document verification declined. Note: ${notes || 'Please resubmit clearer documents.'}`,
        type: 'verification',
      });
    }
  };

  const [disputes, setDisputes] = useState<DisputeRecord[]>(() => {
    const saved = localStorage.getItem('fixmate_disputes');
    return saved ? JSON.parse(saved) : INITIAL_DISPUTES;
  });

  const createDispute = (disputeData: Omit<DisputeRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newDispute: DisputeRecord = {
      id: `disp-${Date.now()}`,
      ...disputeData,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDisputes(prev => {
      const next = [newDispute, ...prev];
      localStorage.setItem('fixmate_disputes', JSON.stringify(next));
      return next;
    });

    // Notify Admin Bhavyakth
    addNotification({
      userId: 'admin-bhavyakth',
      role: 'admin',
      title: 'New Dispute Lodged',
      message: `${newDispute.raisedByName} reported "${newDispute.reason}" for booking #${newDispute.bookingId}.`,
      type: 'dispute',
      targetId: newDispute.id,
    });
  };

  const resolveDispute = (disputeId: string, resolution: { status: 'resolved' | 'refunded'; notes: string; refundAmount?: number }) => {
    setDisputes(prev => {
      const next = prev.map(d => (d.id === disputeId ? { ...d, ...resolution, updatedAt: new Date().toISOString() } : d));
      localStorage.setItem('fixmate_disputes', JSON.stringify(next));
      return next;
    });

    const targetDisp = disputes.find(d => d.id === disputeId);
    if (targetDisp) {
      if (resolution.status === 'refunded' && resolution.refundAmount) {
        // mark booking refunded
        setBookings(prev => {
          const updated = prev.map(b => (b.id === targetDisp.bookingId ? { ...b, paymentStatus: 'refunded' as const } : b));
          localStorage.setItem('fixmate_bookings', JSON.stringify(updated));
          return updated;
        });
      }

      addNotification({
        userId: targetDisp.raisedById,
        role: targetDisp.raisedByRole,
        title: 'Dispute Resolved',
        message: `Your dispute for booking #${targetDisp.bookingId} has been resolved by Admin Bhavyakth. ${resolution.notes}`,
        type: 'dispute',
        targetId: disputeId,
      });
    }
  };

  // 8. Cross-Device Cloud Synchronization Effect
  useEffect(() => {
    const syncFromCloud = async () => {
      try {
        const res = await fetch('/api/sync');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const { bookings: sBookings, messages: sMessages, estimates: sEstimates, notifications: sNotifs, disputes: sDisputes } = json.data;
            if (sBookings && sBookings.length > 0) {
              setBookings(prev => {
                // Merge server bookings with local
                const map = new Map();
                [...sBookings, ...prev].forEach(b => map.set(b.id, b));
                const merged = Array.from(map.values());
                localStorage.setItem('fixmate_bookings', JSON.stringify(merged));
                return merged;
              });
            }
            if (sMessages && sMessages.length > 0) {
              setChatMessages(prev => {
                const map = new Map();
                [...sMessages, ...prev].forEach(m => map.set(m.id, m));
                const merged = Array.from(map.values());
                localStorage.setItem('fixmate_chats', JSON.stringify(merged));
                return merged;
              });
            }
            if (sNotifs && sNotifs.length > 0) {
              setNotifications(prev => {
                const map = new Map();
                [...sNotifs, ...prev].forEach(n => map.set(n.id, n));
                const merged = Array.from(map.values());
                localStorage.setItem('fixmate_notifications', JSON.stringify(merged));
                return merged;
              });
            }
          }
        }
      } catch (err) {
        // Fallback to local storage if offline
      }
    };

    syncFromCloud();

    // Re-sync on window focus & periodic interval for live cross-device mirroring
    const handleFocus = () => syncFromCloud();
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(syncFromCloud, 15000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  // 9. Navigation & UI state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<string>('Hitech City, Hyderabad');
  const [activeTab, setActiveTab] = useState<string>('home');

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        setCurrentUser,
        ownerProfile,
        updateOwnerProfile,
        updateOwnerAvatar,
        isOwnerAuthenticated,
        isOwnerLoginModalOpen,
        setIsOwnerLoginModalOpen,
        ownerLogin,
        ownerLogout,
        ownerPaymentConfig,
        updateOwnerPaymentConfig,
        processPayment,
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
        selectedProvider,
        setSelectedProvider,
        bookings,
        createBooking,
        updateBooking,
        deleteBooking,
        updateBookingStatus,
        submitQuote,
        respondToQuote,
        completePayment,
        submitReview,
        chatMessages,
        sendChatMessage,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        activeAiEstimate,
        setActiveAiEstimate,
        estimateHistory,
        aiEstimatesHistory: estimateHistory,
        saveAiEstimate,
        platformConfig,
        updatePlatformConfig,
        subscriptionPlans,
        updateSubscriptionPlan,
        upgradeProviderPlan,
        documents,
        reviewDocument,
        disputes,
        createDispute,
        resolveDispute,
        selectedCategory,
        setSelectedCategory,
        userLocation,
        setUserLocation,
        language,
        setLanguage,
        theme,
        setTheme,
        toggleTheme,
        aiConversations,
        currentConversationId,
        setCurrentConversationId,
        createAIConversation,
        updateAIConversationMessages,
        deleteAIConversation,
        renameAIConversation,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
