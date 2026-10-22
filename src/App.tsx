import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { AppInstallBanner } from './components/common/AppInstallBanner';
import { CustomerHome } from './components/customer/CustomerHome';
import { NearbyProvidersView } from './components/customer/NearbyProvidersView';
import { ProviderProfileModal } from './components/customer/ProviderProfileModal';
import { BookingModal } from './components/customer/BookingModal';
import { CustomerBookingsView } from './components/customer/CustomerBookingsView';
import { ChatView } from './components/chat/ChatView';
import { PaymentModal } from './components/payment/PaymentModal';
import { ReviewModal } from './components/reviews/ReviewModal';
import { EmergencyServiceModal } from './components/emergency/EmergencyServiceModal';
import { DisputeModal } from './components/dispute/DisputeModal';
import { AboutModal } from './components/about/AboutModal';
import { PhoneAccessModal } from './components/common/PhoneAccessModal';
import { OwnerLoginModal } from './components/admin/OwnerLoginModal';
import { ProviderDashboard } from './components/provider/ProviderDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OwnerProfileView } from './components/profile/OwnerProfileView';
import { PhotoDiagnosisModal } from './components/ai/PhotoDiagnosisModal';
import { Provider, Booking, ServiceCategoryType, AIEstimateResult } from './types';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    setCurrentRole,
    setSelectedCategory,
    saveAiEstimate,
  } = useApp();

  // Modal states
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isPhoneAccessModalOpen, setIsPhoneAccessModalOpen] = useState(false);

  // Selected entities for modals
  const [selectedProviderForModal, setSelectedProviderForModal] = useState<Provider | null>(null);
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState<Provider | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [disputeBooking, setDisputeBooking] = useState<Booking | null>(null);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  const [chatProviderId, setChatProviderId] = useState<string | undefined>(undefined);
  const [chatBookingId, setChatBookingId] = useState<string | undefined>(undefined);

  // Handlers
  const handleOpenAiScan = () => setIsAiModalOpen(true);
  const handleOpenEmergency = () => setIsEmergencyModalOpen(true);
  const handleOpenAbout = () => setIsAboutModalOpen(true);
  const handleOpenPhoneAccess = () => setIsPhoneAccessModalOpen(true);

  const handleSelectCategory = (cat: ServiceCategoryType) => {
    setSelectedCategory(cat);
    setActiveTab('providers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProvider = (provider: Provider) => {
    setSelectedProviderForModal(provider);
  };

  const handleRequestBooking = (provider: Provider) => {
    setSelectedProviderForBooking(provider);
    setIsBookingModalOpen(true);
  };

  const handleStartChat = (provider: Provider, bookingId?: string) => {
    setChatProviderId(provider.id);
    setChatBookingId(bookingId);
    setActiveTab('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPayment = (booking: Booking) => {
    setPaymentBooking(booking);
    setIsPaymentModalOpen(true);
  };

  const handleOpenReview = (booking: Booking) => {
    setReviewBooking(booking);
    setIsReviewModalOpen(true);
  };

  const handleOpenDispute = (booking: Booking) => {
    setDisputeBooking(booking);
    setIsDisputeModalOpen(true);
  };

  const handleAiDiagnosisMatches = (category: string, estimate: AIEstimateResult) => {
    setSelectedCategory(category as ServiceCategoryType);
    setActiveTab('providers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingCreated = (bookingId: string) => {
    setActiveTab('bookings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* 1. Official Google Play Store & App Installation Banner */}
      <AppInstallBanner />

      {/* 2. Main Layout with Sidebar and Content Container */}
      <div className="flex-1 flex min-w-0">
        {/* High Density Desktop Left Icon Sidebar */}
        <Sidebar
          onOpenAiScan={handleOpenAiScan}
          onOpenEmergency={handleOpenEmergency}
          onOpenAbout={handleOpenAbout}
          onOpenPhoneAccess={handleOpenPhoneAccess}
        />

        {/* Main Column (Header + Router Content + Footer) */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          {/* Top Header */}
          <Header
            onOpenEmergency={handleOpenEmergency}
            onOpenAiScan={handleOpenAiScan}
            onOpenAbout={handleOpenAbout}
            onOpenPhoneAccess={handleOpenPhoneAccess}
          />

          {/* View Router */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {activeTab === 'home' && currentRole === 'customer' && (
              <CustomerHome
                onOpenAiScan={handleOpenAiScan}
                onOpenEmergency={handleOpenEmergency}
                onSelectCategory={handleSelectCategory}
                onSelectProvider={handleSelectProvider}
                onRequestBooking={handleRequestBooking}
              />
            )}

            {activeTab === 'providers' && (
              <NearbyProvidersView
                onSelectProvider={handleSelectProvider}
                onRequestBooking={handleRequestBooking}
                onOpenAiScan={handleOpenAiScan}
              />
            )}

            {activeTab === 'bookings' && (
              <CustomerBookingsView
                onOpenChat={(pId, bId) => {
                  setChatProviderId(pId);
                  setChatBookingId(bId);
                  setActiveTab('chat');
                }}
                onOpenPayment={handleOpenPayment}
                onOpenReview={handleOpenReview}
                onOpenDispute={handleOpenDispute}
              />
            )}

            {activeTab === 'chat' && (
              <ChatView
                initialProviderId={chatProviderId}
                initialBookingId={chatBookingId}
              />
            )}

            {activeTab === 'provider_dashboard' && (
              <ProviderDashboard
                onOpenChat={(cId, bId) => {
                  setChatProviderId('p1');
                  setChatBookingId(bId);
                  setActiveTab('chat');
                }}
              />
            )}

            {activeTab === 'admin_dashboard' && (
              <AdminDashboard />
            )}

            {activeTab === 'profile' && (
              <OwnerProfileView />
            )}
          </main>

          {/* Footer */}
          <Footer
            onOpenAbout={handleOpenAbout}
            onOpenEmergency={handleOpenEmergency}
            onOpenAiScan={handleOpenAiScan}
          />
        </div>
      </div>

      {/* Global Modals */}
      <PhotoDiagnosisModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSelectMatchedProviders={handleAiDiagnosisMatches}
      />

      <EmergencyServiceModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onEmergencyDispatched={handleBookingCreated}
      />

      <ProviderProfileModal
        provider={selectedProviderForModal}
        onClose={() => setSelectedProviderForModal(null)}
        onRequestBooking={handleRequestBooking}
        onStartChat={handleStartChat}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        provider={selectedProviderForBooking}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedProviderForBooking(null);
        }}
        onBookingCreated={handleBookingCreated}
      />

      <PaymentModal
        booking={paymentBooking}
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setPaymentBooking(null);
        }}
        onPaymentSuccess={() => {
          if (paymentBooking) {
            setReviewBooking(paymentBooking);
            setIsReviewModalOpen(true);
          }
        }}
      />

      <ReviewModal
        booking={reviewBooking}
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setReviewBooking(null);
        }}
      />

      <DisputeModal
        booking={disputeBooking}
        isOpen={isDisputeModalOpen}
        onClose={() => {
          setIsDisputeModalOpen(false);
          setDisputeBooking(null);
        }}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      <PhoneAccessModal
        isOpen={isPhoneAccessModalOpen}
        onClose={() => setIsPhoneAccessModalOpen(false)}
      />

      <OwnerLoginModal />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onOpenAiScan={handleOpenAiScan} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
