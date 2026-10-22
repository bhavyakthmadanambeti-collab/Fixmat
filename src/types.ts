export type UserRole = 'customer' | 'provider' | 'admin';

export type ServiceCategoryType =
  | 'Plumbing'
  | 'Electrical'
  | 'AC & Cooling'
  | 'Appliance Repair'
  | 'Car & Bike'
  | 'Carpentry'
  | 'Painting'
  | 'Cleaning'
  | 'Electronics'
  | 'General Maintenance';

export interface ServiceCategoryInfo {
  id: ServiceCategoryType;
  name: string;
  iconName: string;
  description: string;
  avgStartingPrice: number;
  popularIssues: string[];
  bannerGradient: string;
  badgeColor: string;
}

export type SubscriptionTier = 'free' | 'pro' | 'business';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  priceMonthly: number;
  features: string[];
  leadLimit: string;
  placementBadge: string;
  analyticsAccess: boolean;
  commissionDiscountPct: number;
  popular?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  address?: string;
  city?: string;
  createdAt: string;
}

export interface OwnerProfile {
  name: string;
  role: string;
  title: string;
  phone: string; // "9030957387" - strictly private
  email: string;
  avatar: string; // Professional letter B avatar
  customAvatarUrl?: string;
  bio: string;
  experience: string;
  location: string;
  appCredit: string;
}

export interface ProviderPortfolioItem {
  id: string;
  title: string;
  service: string;
  imageUrl: string;
  completionTime: string;
}

export interface ProviderReview {
  id: string;
  bookingId: string;
  providerId: string;
  customerName: string;
  customerAvatar?: string;
  overallRating: number;
  professionalismRating: number;
  qualityRating: number;
  valueRating: number;
  comment: string;
  photos?: string[];
  date: string;
}

export interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  profession: string;
  primaryCategory: ServiceCategoryType;
  secondaryCategories: ServiceCategoryType[];
  verified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'suspended';
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  experienceYears: number;
  startingPrice: number;
  hourlyRate: number;
  availableNow: boolean;
  serviceArea: string;
  locationCoordinates: { lat: number; lng: number };
  about: string;
  skills: string[];
  avatar: string;
  completedJobs: number;
  subscriptionTier: SubscriptionTier;
  portfolio: ProviderPortfolioItem[];
  joinedDate: string;
  totalEarnings: number;
  pendingPayout: number;
  govIdSubmitted?: string;
  certSubmitted?: string;
}

export interface AIPartEstimate {
  partName: string;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  necessity: 'Required' | 'Recommended' | 'Optional';
}

export interface AIEstimateResult {
  id: string;
  problemTitle: string;
  category: ServiceCategoryType;
  difficulty: 'Low' | 'Medium' | 'High' | 'Expert';
  summary: string;
  possibleParts: AIPartEstimate[];
  laborRange: { min: number; max: number };
  partsRange: { min: number; max: number };
  totalRange: { min: number; max: number };
  safetyTips: string[];
  estimatedDuration: string;
  confidence: 'High' | 'Medium' | 'Preliminary';
  disclaimer: string;
  imageUrl?: string;
  userDescription?: string;
  createdAt: string;
}

export type BookingStatus =
  | 'request_sent'
  | 'provider_accepted'
  | 'on_the_way'
  | 'arrived'
  | 'work_started'
  | 'work_completed'
  | 'payment_completed'
  | 'review_submitted'
  | 'cancelled';

export interface ProviderQuote {
  id: string;
  bookingId: string;
  providerId: string;
  labor: number;
  parts: number;
  travelFee: number;
  discount: number;
  platformFee: number;
  finalPrice: number;
  notes: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface BookingStatusUpdate {
  status: BookingStatus;
  timestamp: string;
  note?: string;
  updatedBy: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  providerId: string;
  providerName: string;
  providerProfession: string;
  providerAvatar: string;
  serviceCategory: ServiceCategoryType;
  problemTitle: string;
  description: string;
  photos: string[];
  isEmergency?: boolean;
  aiEstimate?: AIEstimateResult;
  scheduledDate: string;
  scheduledTime: string;
  status: BookingStatus;
  statusHistory: BookingStatusUpdate[];
  quote?: ProviderQuote;
  estimatedLabor: number;
  estimatedParts: number;
  platformFee: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: 'upi' | 'gpay' | 'phonepe' | 'card' | 'netbanking' | 'cash';
  paidAt?: string;
  transactionRef?: string;
  receiptUrl?: string;
  createdAt: string;
  disputeId?: string;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  imageUrl?: string;
  aiEstimateAttachment?: AIEstimateResult;
  quoteAttachment?: ProviderQuote;
  timestamp: string;
  read: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  role: UserRole;
  title: string;
  message: string;
  type: 'booking' | 'quote' | 'payment' | 'system' | 'dispute' | 'verification';
  targetId?: string; // bookingId or disputeId
  read: boolean;
  createdAt: string;
}

export interface DisputeRecord {
  id: string;
  bookingId: string;
  raisedByRole: UserRole;
  raisedByName: string;
  raisedById: string;
  targetName: string;
  targetRole: UserRole;
  reason: 'Poor service' | 'Overcharging' | 'No-show' | 'Property damage' | 'Misconduct' | 'False claims' | 'Payment problems' | 'Customer cancellation' | 'Unsafe working conditions' | 'Other';
  details: string;
  status: 'open' | 'under_review' | 'resolved' | 'refunded';
  resolutionNotes?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderDocumentRecord {
  id: string;
  providerId: string;
  providerName: string;
  govIdType: 'Aadhaar' | 'Driving License' | 'PAN Card' | 'Passport';
  govIdNumber: string;
  govIdImageUrl: string;
  certificateName: string;
  certificateImageUrl: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  notes?: string;
}

export interface PlatformConfig {
  commissionPercentage: number;
  minimumCommission: number;
  emergencyMultiplier: number;
  supportPhone: string;
  enableInstantPayouts: boolean;
  requireProviderBackgroundCheck: boolean;
  aiConfidenceThreshold: number;
  defaultCity: string;
}

export interface AppBrandConfig {
  appName: string;
  tagline: string;
  heroHeadline: string;
  playStoreUrl: string;
  appStoreUrl: string;
  announcementEnabled: boolean;
  announcementText: string;
  announcementBadge: string;
}

export interface OwnerPaymentConfig {
  upiId: string; // "9030957387@axl"
  phone: string; // "9030957387"
  beneficiaryName: string; // "Bhavyakth (FixMate AI)"
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  qrCodeNote: string;
}

export type AppLanguage = 'en' | 'te'; // English and Telugu
export type ThemeMode = 'light' | 'dark';

export interface AIConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  imageUrl?: string;
  feedback?: 'helpful' | 'unhelpful';
  saved?: boolean;
}

export interface AIConversationSession {
  id: string;
  title: string;
  messages: AIConversationMessage[];
  createdAt: string;
  updatedAt: string;
  category?: string;
}

