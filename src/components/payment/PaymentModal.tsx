import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  CreditCard,
  QrCode,
  CheckCircle2,
  Lock,
  Sparkles,
  Download,
  ShieldCheck,
  Building,
  Smartphone,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';

interface PaymentModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  booking,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const { processPayment, platformConfig, ownerPaymentConfig } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('742');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen || !booking) return null;

  const laborFee = booking.quotation?.laborFee || booking.estimatedLabor;
  const partsFee = booking.quotation?.partsFee || booking.estimatedParts;
  const platformFee = booking.platformFee || platformConfig.minimumCommission || 50;
  const subtotal = laborFee + partsFee + platformFee;
  const taxes = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal + taxes;

  const upiId = ownerPaymentConfig?.upiId || '9030957387@axl';
  const ownerPhone = ownerPaymentConfig?.phone || '9030957387';
  const beneficiaryName = ownerPaymentConfig?.beneficiaryName || 'Bhavyakth (FixMate AI)';

  // Standard UPI URI format
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(beneficiaryName)}&am=${grandTotal}&cu=INR&tn=${encodeURIComponent(`FixMate Service #${booking.id}`)}`;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText(ownerPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handlePayNow = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const txId = `UPI-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      setTransactionId(txId);
      processPayment(booking.id, paymentMethod);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1600);
  };

  const handleFinish = () => {
    setIsSuccess(false);
    onPaymentSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 pb-5 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Lock className="w-3 h-3" /> 256-Bit Encrypted
              </span>
              <span className="text-xs text-slate-400">Booking {booking.id}</span>
            </div>
            <h2 className="font-heading font-extrabold text-xl text-white mt-1">
              Secure Service Payment
            </h2>
          </div>

          {!isSuccess && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!isSuccess ? (
            <>
              {/* Itemized Invoice Breakdown */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200 pb-1.5">
                  <span>Item Description</span>
                  <span>Amount (₹)</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <span>Technician Labor & Work Charge</span>
                  <span className="font-semibold text-slate-900">₹{laborFee}</span>
                </div>

                {partsFee > 0 && (
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Replacement Parts & Consumables</span>
                    <span className="font-semibold text-slate-900">₹{partsFee}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-700">
                  <span>FixMate Safety & Assurance Fee</span>
                  <span className="font-semibold text-slate-900">₹{platformFee}</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <span>GST Taxes (5%)</span>
                  <span className="font-semibold text-slate-900">₹{taxes}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-base font-extrabold text-slate-900">
                  <span>Grand Total Payable</span>
                  <span className="font-heading font-black text-sky-600 text-lg">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                  Select Payment Method
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold ring-2 ring-sky-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto mb-1 text-sky-600" />
                    <span className="text-xs">UPI (Instant)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold ring-2 ring-sky-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
                    <span className="text-xs">Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold ring-2 ring-sky-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
                    }`}
                  >
                    <Building className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                    <span className="text-xs">Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Method Form */}
              {paymentMethod === 'upi' && (
                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                  {/* Account Destination Details Card */}
                  <div className="bg-white p-3.5 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Direct Payment to Verified Account
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        Official Receiver
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {/* UPI ID */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Owner UPI ID</span>
                          <span className="font-mono font-bold text-slate-900">{upiId}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-2.5 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-800 text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* Phone Number */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Owner Phone</span>
                          <span className="font-mono font-bold text-slate-900">{ownerPhone}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyPhone}
                          className="px-2.5 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors"
                          title="Copy Phone Number"
                        >
                          {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedPhone ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-slate-600 block">Choose UPI App or Scan</span>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
                    {[
                      { id: 'gpay', name: 'Google Pay', color: 'text-blue-600' },
                      { id: 'phonepe', name: 'PhonePe', color: 'text-purple-600' },
                      { id: 'paytm', name: 'Paytm', color: 'text-sky-600' },
                      { id: 'qr', name: 'Scan QR', color: 'text-slate-800' },
                    ].map(app => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setUpiApp(app.id as any)}
                        className={`p-2 rounded-xl border text-[11px] transition-colors ${
                          upiApp === app.id
                            ? 'bg-white border-sky-500 text-sky-700 font-bold shadow-xs'
                            : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                        }`}
                      >
                        <span className={app.color}>{app.name}</span>
                      </button>
                    ))}
                  </div>

                  {upiApp === 'qr' ? (
                    <div className="text-center p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-[11px] font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Dynamic UPI QR Code Generated</span>
                      </div>

                      <div className="w-48 h-48 bg-white border-2 border-slate-900/10 rounded-2xl mx-auto flex items-center justify-center p-3 shadow-md relative">
                        <QRCodeSVG
                          value={upiDeepLink}
                          size={168}
                          level="M"
                          marginSize={1}
                          title={`UPI QR Code for ${upiId}`}
                          className="w-full h-full"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs text-slate-800 font-bold">
                          Scan to pay <span className="text-emerald-700 font-extrabold text-sm">₹{grandTotal}</span> directly to
                        </div>
                        <div className="font-mono text-xs font-black text-purple-700 bg-purple-50 py-1 px-2.5 rounded-lg inline-block border border-purple-200/60">
                          {upiId}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Beneficiary: <strong className="text-slate-700">{beneficiaryName}</strong> ({ownerPhone})
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 font-medium">
                        Compatible with Google Pay, PhonePe, Paytm, BHIM & all Indian banking UPI apps.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-3">
                      <div className="text-xs text-slate-700 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Ready to pay ₹{grandTotal} via <strong>{upiApp.toUpperCase()}</strong> to <strong>{upiId}</strong> ({ownerPhone}).</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={upiDeepLink}
                          className="inline-flex items-center gap-1.5 text-xs text-sky-700 hover:text-sky-800 font-bold bg-sky-50 hover:bg-sky-100 px-3.5 py-2 rounded-xl transition-colors border border-sky-200"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Launch {upiApp.toUpperCase()} App</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => setUpiApp('qr')}
                          className="inline-flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-800 font-bold bg-purple-50 hover:bg-purple-100 px-3.5 py-2 rounded-xl transition-colors border border-purple-200"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Switch to Dynamic QR Code</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700">
                    <span className="block font-bold mb-1">Direct Bank Account Transfer:</span>
                    <p className="text-[11px] text-slate-600">
                      Bank: <strong>{ownerPaymentConfig.bankName || 'Axis Bank'}</strong><br />
                      Account No: <strong className="font-mono">{ownerPaymentConfig.accountNumber || ownerPhone}</strong><br />
                      IFSC: <strong className="font-mono">{ownerPaymentConfig.ifscCode || 'UTIB0001001'}</strong><br />
                      Beneficiary: <strong>{beneficiaryName}</strong>
                    </p>
                  </div>
                </div>
              )}

              {/* Pay Trigger Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePayNow}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-6 rounded-2xl font-heading font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Payment (₹{grandTotal})...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Pay ₹{grandTotal}</span>
                  </>
                )}
              </button>
            </>
          ) : (
            /* Digital Receipt on Success */
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                  Payment Successful!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Transaction Reference: <strong className="font-mono text-slate-800">{transactionId}</strong>
                </p>
              </div>

              {/* Printable Invoice Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <span className="font-heading font-bold text-slate-900 text-sm">FixMate AI Tax Invoice</span>
                    <div className="text-[10px] text-slate-400">{new Date().toLocaleString()}</div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                    PAID (UPI)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>
                    <span className="text-slate-400 block">Customer:</span>
                    <strong className="text-slate-800">{booking.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Service Provider:</span>
                    <strong className="text-slate-800">{booking.providerName}</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50/80 border border-emerald-100 rounded-xl text-[11px] text-emerald-900">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase block">Credited To Official Owner Account</span>
                  <div className="font-semibold mt-0.5">
                    UPI ID: <strong className="font-mono text-emerald-950">{upiId}</strong> • Phone: <strong className="font-mono text-emerald-950">{ownerPhone}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900 text-sm">
                  <span>Total Amount Paid:</span>
                  <span className="font-heading font-black text-emerald-700">₹{grandTotal}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => alert('Invoice receipt PDF downloaded.')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download Receipt
                </button>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-2xl font-heading font-bold text-xs shadow-md transition-colors"
              >
                Done • Rate & Review Professional
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
