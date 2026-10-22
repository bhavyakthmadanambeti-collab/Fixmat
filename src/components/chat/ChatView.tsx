import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Image as ImageIcon,
  Paperclip,
  Phone,
  PhoneCall,
  Sparkles,
  CheckCircle2,
  FileText,
  User,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatMessage, Provider } from '../../types';

interface ChatViewProps {
  initialProviderId?: string;
  initialBookingId?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({
  initialProviderId,
  initialBookingId,
}) => {
  const {
    chatMessages,
    sendChatMessage,
    providers,
    currentUser,
    currentRole,
    acceptQuotation,
    declineQuotation,
    activeAiEstimate,
  } = useApp();

  const [selectedProviderId, setSelectedProviderId] = useState<string>(
    initialProviderId || providers[0]?.id || 'p1'
  );
  const [inputMessage, setInputMessage] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [showCallPrompt, setShowCallPrompt] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeProvider = providers.find(p => p.id === selectedProviderId) || providers[0];

  // Filter messages for current thread
  const threadMessages = chatMessages.filter(
    m =>
      (m.senderId === selectedProviderId && m.receiverId === currentUser.id) ||
      (m.senderId === currentUser.id && m.receiverId === selectedProviderId) ||
      (m.bookingId && initialBookingId && m.bookingId === initialBookingId)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages]);

  const handleSend = () => {
    if (!inputMessage.trim() && !attachedImage) return;

    sendChatMessage({
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentRole,
      receiverId: selectedProviderId,
      message: inputMessage.trim(),
      imageUrl: attachedImage || undefined,
      bookingId: initialBookingId,
    });

    setInputMessage('');
    setAttachedImage(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAttachedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleShareAiEstimate = () => {
    if (!activeAiEstimate) return;

    sendChatMessage({
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentRole,
      receiverId: selectedProviderId,
      message: `Shared FixMate AI Diagnosis: "${activeAiEstimate.problemTitle}" (Est: ₹${activeAiEstimate.totalRange.min} - ₹${activeAiEstimate.totalRange.max})`,
      imageUrl: activeAiEstimate.imageUrl,
      bookingId: initialBookingId,
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden h-[75vh] flex flex-col md:flex-row">
      {/* Left Conversations Sidebar */}
      <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50/70 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="font-heading font-extrabold text-base text-slate-900">
            Messages & Technicians
          </h2>
          <p className="text-[11px] text-slate-500">Direct real-time consultation</p>
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
          {providers.map(provider => {
            const isSelected = provider.id === selectedProviderId;
            const lastMsg = chatMessages
              .filter(m => m.senderId === provider.id || m.receiverId === provider.id)
              .pop();

            return (
              <button
                key={provider.id}
                onClick={() => setSelectedProviderId(provider.id)}
                className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${
                  isSelected ? 'bg-sky-50 border-r-4 border-sky-600' : 'hover:bg-slate-100'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={provider.avatar}
                    alt={provider.name}
                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  {provider.availableNow && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-slate-900 truncate">
                      {provider.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {provider.distanceKm} km
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{provider.profession}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {lastMsg ? lastMsg.message : 'Tap to start conversation'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Chat Stream */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
        {/* Chat Stream Header */}
        {activeProvider ? (
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-2xs shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={activeProvider.avatar}
                alt={activeProvider.name}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-bold text-sm text-slate-900">
                    {activeProvider.name}
                  </h3>
                  {activeProvider.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  )}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span>{activeProvider.profession}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">Online & Available</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {activeAiEstimate && (
                <button
                  onClick={handleShareAiEstimate}
                  className="hidden sm:flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  <span>Send AI Diagnosis</span>
                </button>
              )}

              <button
                onClick={() => setShowCallPrompt(!showCallPrompt)}
                className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 p-2 rounded-xl text-xs font-bold transition-colors"
                title="Direct Phone Call"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Call</span>
              </button>
            </div>
          </div>
        ) : null}

        {/* Call Banner */}
        {showCallPrompt && activeProvider && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs flex items-center justify-between shrink-0 animate-in slide-in-from-top">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>Calling <strong>{activeProvider.name}</strong> at <strong>{activeProvider.phone}</strong></span>
            </div>
            <button
              onClick={() => setShowCallPrompt(false)}
              className="text-white hover:text-slate-200 font-bold text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {threadMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-sm text-slate-700">
                Start chatting with {activeProvider?.name}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Share photos of your problem, ask for rough quotes, or confirm technician arrival time.
              </p>
            </div>
          ) : (
            threadMessages.map(msg => {
              const isMe = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md rounded-2xl p-3.5 text-xs shadow-2xs space-y-2 ${
                      isMe
                        ? 'bg-sky-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {/* Attached Image if present */}
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="Shared attachment"
                        className="rounded-xl max-h-48 w-full object-cover mb-2 border border-black/10"
                      />
                    )}

                    {/* Text content */}
                    {msg.message && <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>}

                    {/* Quotation Attached Card */}
                    {msg.quotation && (
                      <div
                        className={`p-3 rounded-xl border text-xs space-y-2 mt-2 ${
                          isMe
                            ? 'bg-sky-700/80 border-sky-400 text-white'
                            : 'bg-amber-50 border-amber-200 text-amber-950'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            Official Service Quotation
                          </span>
                          <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-white/30">
                            {msg.quotation.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1 text-[11px]">
                          <div>Labor: ₹{msg.quotation.laborFee}</div>
                          <div>Parts: ₹{msg.quotation.partsFee}</div>
                          <div className="font-bold">Total: ₹{msg.quotation.totalAmount}</div>
                        </div>

                        {msg.quotation.status === 'pending' && !isMe && (
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => msg.bookingId && acceptQuotation(msg.bookingId)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg font-bold text-[11px]"
                            >
                              Accept Quote
                            </button>
                            <button
                              onClick={() => msg.bookingId && declineQuotation(msg.bookingId)}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-2 py-1 rounded-lg font-bold text-[11px]"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      className={`text-[10px] text-right font-medium ${
                        isMe ? 'text-sky-200' : 'text-slate-400'
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-white border-t border-slate-200 shrink-0">
          {attachedImage && (
            <div className="relative inline-block mb-2 rounded-xl overflow-hidden border border-slate-300">
              <img src={attachedImage} alt="Attachment preview" className="w-16 h-16 object-cover" />
              <button
                onClick={() => setAttachedImage(null)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Attach Photo"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={`Message ${activeProvider?.name || 'Technician'}...`}
              className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
            />

            <button
              onClick={handleSend}
              disabled={!inputMessage.trim() && !attachedImage}
              className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl disabled:opacity-40 transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
