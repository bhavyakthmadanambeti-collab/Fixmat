import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  Mic,
  MicOff,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  BookmarkCheck,
  FileDown,
  Globe,
  AlertTriangle,
  HelpCircle,
  Cpu,
  Search,
  CheckCircle2,
  ShieldCheck,
  X,
  Share2,
  Wrench,
  StopCircle,
  Languages
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIConversationMessage, AppLanguage } from '../../types';

interface AIAssistantViewProps {
  onBookSpecialist?: (category?: string) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ onBookSpecialist }) => {
  const {
    language,
    setLanguage,
    aiConversations,
    currentConversationId,
    setCurrentConversationId,
    createAIConversation,
    updateAIConversationMessages,
    deleteAIConversation,
    renameAIConversation,
    setActiveTab,
    setSelectedCategory,
  } = useApp();

  // Find active session
  const activeSession =
    aiConversations.find(c => c.id === currentConversationId) ||
    aiConversations[0] ||
    null;

  const [inputPrompt, setInputPrompt] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [beginnerMode, setBeginnerMode] = useState(false);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [newTitleText, setNewTitleText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechActiveId, setSpeechActiveId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editPromptText, setEditPromptText] = useState('');
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isGenerating]);

  // Voice speech synthesis
  const handleSpeak = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device/browser.');
      return;
    }

    if (speechActiveId === msgId) {
      window.speechSynthesis.cancel();
      setSpeechActiveId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown before speaking
    const cleanText = text
      .replace(/[#*_`]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\(.*?\)/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'te' ? 'te-IN' : 'en-IN';
    utterance.rate = 1.0;
    utterance.onend = () => setSpeechActiveId(null);
    utterance.onerror = () => setSpeechActiveId(null);

    setSpeechActiveId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (Voice Input)
  const handleToggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice dictation is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'te' ? 'te-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt(prev => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert('File size exceeds 15MB. Please upload a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setImageBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Stop Generation
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputPrompt).trim();
    if (!messageText && !imageBase64) return;
    if (isGenerating) return;

    setErrorMessage(null);

    let session = activeSession;
    if (!session) {
      session = createAIConversation('New FixMate Diagnosis');
    }

    const userMsg: AIConversationMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
      imageUrl: imageBase64 || undefined,
    };

    const currentMessages = session.messages || [];
    const newMessages = [...currentMessages, userMsg];
    updateAIConversationMessages(session.id, newMessages);

    setInputPrompt('');
    setImageBase64(null);
    setIsGenerating(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Build conversation history for API
      const historyPayload = newMessages.slice(-8).map(m => ({
        role: m.role,
        content: m.content,
        imageUrl: m.imageUrl,
      }));

      const res = await fetch('/api/ai/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: messageText,
          conversationHistory: historyPayload,
          imageBase64: userMsg.imageUrl,
          language,
          beginnerMode,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to receive AI diagnostic assistance.');
      }

      const assistantMsg: AIConversationMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString(),
      };

      updateAIConversationMessages(session.id, [...newMessages, assistantMsg]);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Generation stopped by user');
      } else {
        console.error('AI chat error:', err);
        setErrorMessage(
          err.message || 'Unable to connect to AI Assistant. Please check your internet or retry.'
        );
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  // Regenerate last response
  const handleRegenerate = () => {
    if (!activeSession || activeSession.messages.length === 0) return;
    const lastUserIndex = [...activeSession.messages].reverse().findIndex(m => m.role === 'user');
    if (lastUserIndex === -1) return;
    const actualIndex = activeSession.messages.length - 1 - lastUserIndex;
    const lastUserMsg = activeSession.messages[actualIndex];

    // Truncate messages up to last user message
    const trimmed = activeSession.messages.slice(0, actualIndex + 1);
    updateAIConversationMessages(activeSession.id, trimmed);
    handleSendMessage(lastUserMsg.content);
  };

  // Copy answer to clipboard
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Feedback thumb
  const handleFeedback = (msgId: string, type: 'helpful' | 'unhelpful') => {
    if (!activeSession) return;
    const updated = activeSession.messages.map(m =>
      m.id === msgId ? { ...m, feedback: m.feedback === type ? undefined : type } : m
    );
    updateAIConversationMessages(activeSession.id, updated);
  };

  // Save / Bookmark answer
  const handleToggleSave = (msgId: string) => {
    if (!activeSession) return;
    const updated = activeSession.messages.map(m =>
      m.id === msgId ? { ...m, saved: !m.saved } : m
    );
    updateAIConversationMessages(activeSession.id, updated);
  };

  // Export session to text
  const handleExportText = () => {
    if (!activeSession) return;
    let content = `FixMate AI Diagnosis Report\nTopic: ${activeSession.title}\nDate: ${new Date(activeSession.createdAt).toLocaleString()}\n${'='.repeat(50)}\n\n`;
    activeSession.messages.forEach(m => {
      content += `[${m.role.toUpperCase()}] (${new Date(m.timestamp).toLocaleTimeString()}):\n${m.content}\n\n`;
    });
    content += `\nDisclaimer: FixMate AI preliminary diagnostic. Always follow safety precautions and consult verified professionals for dangerous or high-voltage work.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fixmate-diagnosis-${activeSession.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filter sessions
  const filteredSessions = aiConversations.filter(s =>
    s.title.toLowerCase().includes(searchHistoryQuery.toLowerCase())
  );

  const displayedMessages = activeSession
    ? filterSavedOnly
      ? activeSession.messages.filter(m => m.saved || m.role === 'user')
      : activeSession.messages
    : [];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden h-[82vh] flex flex-col md:flex-row">
      {/* LEFT SIDEBAR: Conversation History & Tools */}
      <aside className="w-full md:w-80 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0">
        {/* Header with New Chat button */}
        <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-sm text-slate-900">
                FixMate AI
              </h2>
              <p className="text-[10px] text-slate-500">Smart Diagnostic Assistant</p>
            </div>
          </div>

          <button
            onClick={() => createAIConversation('New Consultation')}
            className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors active:scale-95"
            title="Start fresh conversation"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>

        {/* Search Conversation History */}
        <div className="p-3 border-b border-slate-200 bg-slate-50">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchHistoryQuery}
              onChange={e => setSearchHistoryQuery(e.target.value)}
              placeholder="Search past diagnoses..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Quick filter for bookmarked answers */}
          <div className="flex items-center justify-between mt-2 pt-1 text-[11px] text-slate-600">
            <button
              onClick={() => setFilterSavedOnly(!filterSavedOnly)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg font-medium transition-colors ${
                filterSavedOnly
                  ? 'bg-amber-100 text-amber-800 font-bold'
                  : 'hover:bg-slate-200 text-slate-600'
              }`}
            >
              <Bookmark className="w-3 h-3 text-amber-600" />
              <span>Saved Answers</span>
            </button>
            <span className="text-[10px] text-slate-400">
              {filteredSessions.length} sessions
            </span>
          </div>
        </div>

        {/* Sessions list */}
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100 p-2 space-y-1">
          {filteredSessions.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              No conversations found. Start a new diagnosis above!
            </div>
          ) : (
            filteredSessions.map(session => {
              const isSelected = session.id === activeSession?.id;
              const isEditing = editingTitleId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => !isEditing && setCurrentConversationId(session.id)}
                  className={`group rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200 shadow-2xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Wrench className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    {isEditing ? (
                      <input
                        type="text"
                        value={newTitleText}
                        onChange={e => setNewTitleText(e.target.value)}
                        onBlur={() => {
                          if (newTitleText.trim()) {
                            renameAIConversation(session.id, newTitleText.trim());
                          }
                          setEditingTitleId(null);
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            if (newTitleText.trim()) {
                              renameAIConversation(session.id, newTitleText.trim());
                            }
                            setEditingTitleId(null);
                          }
                        }}
                        autoFocus
                        className="w-full bg-white border border-blue-400 rounded px-1.5 py-0.5 text-xs text-slate-900"
                      />
                    ) : (
                      <span className="truncate">{session.title}</span>
                    )}
                  </div>

                  {/* Rename and delete buttons */}
                  {!isEditing && (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setEditingTitleId(session.id);
                          setNewTitleText(session.title);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded"
                        title="Rename"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (confirm('Delete this conversation history?')) {
                            deleteAIConversation(session.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Language & Beginner Mode Selector Footer */}
        <div className="p-3 bg-white border-t border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-blue-600" />
              Language:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all ${
                  language === 'te'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                తెలుగు (Telugu)
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-600 text-[11px]">Beginner-friendly:</span>
            <button
              onClick={() => setBeginnerMode(!beginnerMode)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                beginnerMode
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              {beginnerMode ? 'ON (Simple words)' : 'OFF (Standard)'}
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN PANEL: Active Conversation & Chat Canvas */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Top Active Bar */}
        <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50/50">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-sm sm:text-base text-slate-900 truncate">
                {activeSession?.title || 'FixMate AI Diagnostic Consultation'}
              </h3>
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                Live Gemini 3.8
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {language === 'te'
                ? 'తెలుగు మరమ్మతు మార్గదర్శకత్వం • తక్షణ ఫోటో & టెక్స్ట్ విశ్లేషణ'
                : 'Instant repair diagnosis, step-by-step troubleshooting & safety warnings'}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleExportText}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Export conversation to text"
            >
              <FileDown className="w-4 h-4" />
            </button>
            <button
              onClick={handleRegenerate}
              disabled={isGenerating || !activeSession?.messages.length}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-40"
              title="Regenerate last answer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            {onBookSpecialist && (
              <button
                onClick={() => onBookSpecialist()}
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-xl transition-all hidden sm:flex items-center gap-1.5"
              >
                <span>Find Technician</span>
              </button>
            )}
          </div>
        </div>

        {/* Message Thread Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/30">
          {displayedMessages.length === 0 ? (
            <div className="max-w-xl mx-auto my-auto text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-inner">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h4 className="font-heading font-black text-xl text-slate-900">
                  {language === 'te'
                    ? 'మీ మరమ్మతు సమస్యను వివరించండి'
                    : 'Describe your device or repair problem'}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  {language === 'te'
                    ? 'ఫోన్లు, ల్యాప్‌టాప్‌లు, గృహోపకరణాలు, ప్లంబింగ్ లేదా ఎలక్ట్రికల్ సమస్యల ఫోటోను అప్‌లోడ్ చేయండి లేదా టైప్ చేయండి.'
                    : 'Phones, laptops, appliances, electrical circuits, ACs, plumbing, cars & bikes. Ask anything or attach a photo for multimodal diagnosis.'}
                </p>
              </div>

              {/* Sample Starters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-2">
                {[
                  {
                    title: 'Washing machine vibrating & loud spin noise',
                    cat: 'Appliance Repair',
                  },
                  {
                    title: 'Phone screen flickering after minor drop',
                    cat: 'Electronics',
                  },
                  {
                    title: 'AC leaking water from indoor blower unit',
                    cat: 'AC & Cooling',
                  },
                  {
                    title: 'MCB breaker tripping whenever geyser starts',
                    cat: 'Electrical',
                  },
                ].map(starter => (
                  <button
                    key={starter.title}
                    onClick={() => handleSendMessage(starter.title)}
                    className="p-3 bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-2xl text-xs text-slate-700 transition-all text-left shadow-2xs group"
                  >
                    <span className="font-semibold block text-slate-900 group-hover:text-blue-700">
                      {starter.title}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{starter.cat}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            displayedMessages.map(msg => {
              const isUser = msg.role === 'user';
              const isCopied = copiedId === msg.id;
              const isSpeaking = speechActiveId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-3xl ${
                    isUser ? 'ml-auto' : 'mr-auto'
                  }`}
                >
                  {/* Sender identity */}
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400 font-semibold">
                    <span>{isUser ? 'You' : 'FixMate AI Expert'}</span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {/* Message Bubble Card */}
                  <div
                    className={`rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-xs transition-all relative ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                    }`}
                  >
                    {/* User attached photo */}
                    {msg.imageUrl && (
                      <div className="mb-3 rounded-xl overflow-hidden border border-white/20 max-w-sm">
                        <img
                          src={msg.imageUrl}
                          alt="Diagnosis attachment"
                          className="w-full max-h-60 object-cover"
                        />
                      </div>
                    )}

                    {/* Text content with clean markdown formatting */}
                    <div className="whitespace-pre-wrap space-y-2">
                      {msg.content}
                    </div>

                    {/* Bottom toolbar for Assistant answers */}
                    {!isUser && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopy(msg.content, msg.id)}
                            className="p-1 hover:text-slate-900 rounded transition-colors flex items-center gap-1"
                            title="Copy to clipboard"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy'}</span>
                          </button>

                          <button
                            onClick={() => handleSpeak(msg.content, msg.id)}
                            className={`p-1 hover:text-slate-900 rounded transition-colors flex items-center gap-1 ${
                              isSpeaking ? 'text-blue-600 font-bold' : ''
                            }`}
                            title="Listen to answer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{isSpeaking ? 'Speaking...' : 'Listen'}</span>
                          </button>

                          <button
                            onClick={() => handleToggleSave(msg.id)}
                            className={`p-1 hover:text-amber-600 rounded transition-colors flex items-center gap-1 ${
                              msg.saved ? 'text-amber-600 font-bold' : ''
                            }`}
                            title="Save answer"
                          >
                            {msg.saved ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" /> : <Bookmark className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline">{msg.saved ? 'Saved' : 'Save'}</span>
                          </button>
                        </div>

                        {/* Thumbs Feedback */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleFeedback(msg.id, 'helpful')}
                            className={`p-1 rounded transition-colors ${
                              msg.feedback === 'helpful'
                                ? 'text-emerald-600 font-bold'
                                : 'hover:text-emerald-600'
                            }`}
                            title="Helpful solution"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, 'unhelpful')}
                            className={`p-1 rounded transition-colors ${
                              msg.feedback === 'unhelpful'
                                ? 'text-rose-600 font-bold'
                                : 'hover:text-rose-600'
                            }`}
                            title="Not helpful"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Real loading indicator */}
          {isGenerating && (
            <div className="flex items-start gap-2.5 max-w-lg">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 shadow-xs text-xs space-y-2">
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                  <span>Diagnosing issue with Gemini 3.8 Flash...</span>
                  <button
                    onClick={handleStopGeneration}
                    className="inline-flex items-center gap-1 text-[11px] text-rose-600 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200"
                  >
                    <StopCircle className="w-3 h-3" />
                    <span>Stop</span>
                  </button>
                </div>
                <div className="h-1.5 w-48 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full animate-pulse w-3/4" />
                </div>
              </div>
            </div>
          )}

          {/* Error Message banner */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center justify-between gap-2 max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-red-500 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar & Controls */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          {/* Image Preview Thumbnail */}
          {imageBase64 && (
            <div className="mb-2 inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <img
                src={imageBase64}
                alt="Selected"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-[11px] text-slate-700 font-medium">Photo attached for analysis</span>
              <button
                onClick={() => setImageBase64(null)}
                className="text-slate-400 hover:text-red-600 ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Attach Image button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 shrink-0"
              title="Upload photo of phone, appliance, leak, circuit"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            {/* Voice input button */}
            <button
              onClick={handleToggleVoiceInput}
              className={`p-2.5 rounded-xl transition-colors border shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100 border-slate-200'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Voice input (English/Telugu)'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Textarea Input */}
            <div className="flex-1 bg-slate-50 border border-slate-200 focus-within:border-blue-500 focus-within:bg-white rounded-2xl flex items-center px-3.5 py-1.5 transition-colors">
              <textarea
                value={inputPrompt}
                onChange={e => setInputPrompt(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
                placeholder={
                  language === 'te'
                    ? 'మీ మరమ్మతు ప్రశ్నను ఇక్కడ అడగండి (ఉదా: ఏసీ నీరు కారుతోంది...)'
                    : 'Describe issue (e.g., iPhone screen won\'t turn on, AC leaking, MCB tripping)...'
                }
                className="w-full bg-transparent border-none focus:outline-none text-xs sm:text-sm text-slate-800 placeholder-slate-400 resize-none py-1.5 max-h-24"
              />
            </div>

            {/* Send / Stop Button */}
            {isGenerating ? (
              <button
                onClick={handleStopGeneration}
                className="bg-rose-500 hover:bg-rose-600 text-white p-3 rounded-2xl shadow-xs transition-colors shrink-0"
                title="Stop generation"
              >
                <StopCircle className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputPrompt.trim() && !imageBase64}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-3 rounded-2xl shadow-xs transition-all active:scale-95 shrink-0"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-400">
            <span>FixMate AI gives preliminary guidance. High danger jobs require certified technicians.</span>
            <span className="hidden sm:inline">Press Enter to send • Shift+Enter for new line</span>
          </div>
        </div>
      </main>
    </div>
  );
};
