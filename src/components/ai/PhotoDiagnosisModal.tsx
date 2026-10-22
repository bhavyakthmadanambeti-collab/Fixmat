import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  ShieldAlert,
  Clock,
  Coins,
  ChevronRight,
  X,
  RefreshCw,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIEstimateResult } from '../../types';
import { SAMPLE_AI_PRESETS } from '../../data/mockData';

interface PhotoDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMatchedProviders: (category: string, estimate: AIEstimateResult) => void;
}

export const PhotoDiagnosisModal: React.FC<PhotoDiagnosisModalProps> = ({
  isOpen,
  onClose,
  onSelectMatchedProviders,
}) => {
  const { saveAiEstimate } = useApp();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userDescription, setUserDescription] = useState('');
  const [selectedCategoryHint, setSelectedCategoryHint] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState('');
  const [result, setResult] = useState<AIEstimateResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (preset: (typeof SAMPLE_AI_PRESETS)[0]) => {
    setSelectedImage(preset.image);
    setUserDescription(preset.description);
    setSelectedCategoryHint(preset.category);
    setErrorMsg(null);
  };

  const handleRunDiagnosis = async () => {
    if (!selectedImage && !userDescription.trim()) {
      setErrorMsg('Please upload a photo or select a sample repair problem to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);
    setResult(null);

    // Staged animated feedback
    setAnalysisStage('Uploading high-res image to secure backend...');
    setTimeout(() => setAnalysisStage('Scanning photo with Gemini 3.7 Vision model...'), 700);
    setTimeout(() => setAnalysisStage('Detecting fault components, stress fractures & leakages...'), 1600);
    setTimeout(() => setAnalysisStage('Calculating regional labor & parts rate benchmarks (₹ INR)...'), 2400);

    try {
      const response = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          userDescription,
          categoryHint: selectedCategoryHint,
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const est: AIEstimateResult = {
          ...data.data,
          imageUrl: selectedImage || undefined,
          userDescription: userDescription || undefined,
        };
        setResult(est);
        saveAiEstimate(est);
      } else {
        throw new Error(data.message || 'Diagnosis failed to process.');
      }
    } catch (err: any) {
      console.error('Diagnosis error:', err);
      setErrorMsg('AI diagnosis encountered an issue. Please try again or provide a clearer photo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAll = () => {
    setSelectedImage(null);
    setUserDescription('');
    setSelectedCategoryHint('');
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg sm:text-xl tracking-tight leading-tight">
                AI Photo Diagnosis & Preliminary Estimate
              </h2>
              <p className="text-xs text-sky-100 font-medium">
                FixMate Multimodal Vision Engine • Instant Cost & Parts Calculation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {!result ? (
            <>
              {/* Image Input Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload box */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    1. Upload or Capture Problem Photo
                  </label>

                  {selectedImage ? (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-sky-500 shadow-md group h-56 bg-slate-900">
                      <img
                        src={selectedImage}
                        alt="Selected problem"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedImage(null)}
                          className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                        Photo Ready for AI Scan
                      </div>
                    </div>
                  ) : (
                    <div className="h-56 border-2 border-dashed border-slate-300 hover:border-sky-500 bg-slate-50/70 rounded-2xl flex flex-col items-center justify-center p-4 text-center transition-all">
                      <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
                        <Camera className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        Take a photo or upload from gallery
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                        Clear close-up photos of pipes, breakers, AC units, brakes or appliances work best.
                      </p>

                      <div className="flex items-center gap-2 mt-4">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" /> Select File
                        </button>

                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-colors"
                        >
                          <Camera className="w-3.5 h-3.5" /> Camera
                        </button>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>
                  )}
                </div>

                {/* Problem Description & Category */}
                <div className="flex flex-col justify-between">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      2. Describe the Issue (Optional)
                    </label>
                    <textarea
                      value={userDescription}
                      onChange={e => setUserDescription(e.target.value)}
                      placeholder="e.g. Water is dripping continuously from the drain pipe joint underneath the sink. Started 2 hours ago..."
                      className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all resize-none"
                    />

                    <div className="mt-3">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Category Hint (AI Auto-detects if left blank)
                      </label>
                      <select
                        value={selectedCategoryHint}
                        onChange={e => setSelectedCategoryHint(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-sky-500"
                      >
                        <option value="">Auto-Detect Category from Photo</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Electrical">Electrical</option>
                        <option value="AC & Cooling">AC & Cooling</option>
                        <option value="Appliance Repair">Appliance Repair</option>
                        <option value="Car & Bike">Car & Bike</option>
                        <option value="Carpentry">Carpentry</option>
                        <option value="Painting">Painting</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Electronics">Electronics</option>
                        <option value="General Maintenance">General Maintenance</option>
                      </select>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Try Sample Presets */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    Or Try a Sample Common Issue Photo
                  </span>
                  <span className="text-[11px] text-slate-400">Click to load photo & test AI</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SAMPLE_AI_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectPreset(preset)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all group ${
                        selectedImage === preset.image
                          ? 'border-sky-600 bg-sky-50/80 ring-2 ring-sky-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={preset.image}
                        alt={preset.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-slate-900 truncate group-hover:text-sky-600">
                          {preset.title}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">{preset.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={handleRunDiagnosis}
                  className="w-full bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white py-3.5 px-6 rounded-2xl font-heading font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>{analysisStage || 'Analyzing Photo with Gemini Vision...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                      <span>Run AI Photo Diagnosis & Get Estimate</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Results View */
            <div className="space-y-6 animate-in fade-in zoom-in-95">
              {/* Top Banner with Problem & Category */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-sky-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                        {result.category}
                      </span>
                      <span className="bg-slate-800 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Layers className="w-3 h-3 text-sky-400" />
                        Difficulty: {result.difficulty}
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        Confidence: {result.confidence}
                      </span>
                    </div>

                    <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                      {result.problemTitle}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-xl">
                      {result.summary}
                    </p>
                  </div>

                  {result.imageUrl && (
                    <img
                      src={result.imageUrl}
                      alt="Diagnosed problem"
                      className="w-20 h-20 rounded-xl object-cover ring-2 ring-white/20 shrink-0"
                    />
                  )}
                </div>
              </div>

              {/* Price Estimate Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Labor */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
                    <Wrench className="w-3.5 h-3.5 text-sky-600" /> Estimated Labor
                  </div>
                  <div className="font-heading font-extrabold text-xl text-slate-900 mt-1">
                    ₹{result.laborRange.min} – ₹{result.laborRange.max}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Est. time: {result.estimatedDuration}</div>
                </div>

                {/* 2. Parts */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-600" /> Estimated Parts
                  </div>
                  <div className="font-heading font-extrabold text-xl text-slate-900 mt-1">
                    ₹{result.partsRange.min} – ₹{result.partsRange.max}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{result.possibleParts.length} replacement items</div>
                </div>

                {/* 3. Total */}
                <div className="bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-200 rounded-2xl p-4 text-center">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-sky-700 flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Total Estimated Cost
                  </div>
                  <div className="font-heading font-black text-2xl text-sky-900 mt-1">
                    ₹{result.totalRange.min} – ₹{result.totalRange.max}
                  </div>
                  <div className="text-[10px] text-sky-600 font-semibold mt-0.5">Includes parts & standard labor</div>
                </div>
              </div>

              {/* Possible Replacement Parts Breakdown */}
              {result.possibleParts && result.possibleParts.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-600" />
                    Identified Parts & Materials Required
                  </h4>
                  <div className="space-y-2">
                    {result.possibleParts.map((part, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs border border-slate-100"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-slate-900">{part.partName}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              part.necessity === 'Required'
                                ? 'bg-rose-100 text-rose-700'
                                : part.necessity === 'Recommended'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {part.necessity}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-slate-800">
                          ₹{part.estimatedPriceMin} – ₹{part.estimatedPriceMax}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Advice */}
              {result.safetyTips && result.safetyTips.length > 0 && (
                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Essential Safety Guidelines</span>
                  </div>
                  <ul className="space-y-1 text-xs text-amber-800">
                    {result.safetyTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* MANDATORY DISCLAIMER */}
              <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">
                  <strong>Important:</strong> {result.disclaimer}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetAll}
                  className="w-full sm:w-auto px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Analyze Another Issue
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectMatchedProviders(result.category, result);
                    onClose();
                  }}
                  className="w-full sm:flex-1 bg-sky-600 hover:bg-sky-700 text-white py-3 px-6 rounded-2xl font-heading font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Find Nearby {result.category} Experts</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
