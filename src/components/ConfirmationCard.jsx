import React, { useState } from 'react';
import { Check, RefreshCw, Edit2, AlertCircle, Sparkles, UserCheck, DollarSign, Package } from 'lucide-react';

export function ConfirmationCard({
  parsedData,
  onConfirm,
  onReRecord,
  onCancel
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [customer, setCustomer] = useState(parsedData.customer || "");
  const [item, setItem] = useState(parsedData.item || "");
  const [amount, setAmount] = useState(parsedData.amount || "");
  const [type, setType] = useState(parsedData.type || "NOGOD");

  const formatBnNumber = (num) => {
    return (num || 0).toLocaleString("bn-BD").replace(/\d/g, (d) => "০১২৩৪পাঁচছয়সাতআটনয়"[d] || d);
  };

  const handleSaveConfirm = () => {
    onConfirm({
      ...parsedData,
      customer,
      item,
      amount: Number(amount),
      type
    });
  };

  const isLowConfidence = parsedData.confidence < 0.7;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#FAF6EE] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-red-900/50 relative overflow-hidden animate-scaleUp">
        {/* Top Ribbon */}
        <div className="flex items-center justify-between border-b-2 border-red-800/30 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-800 text-amber-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-brand text-red-950">
                যা শুনলাম (Ja Shunlam)
              </h3>
              <p className="text-xs text-stone-600 font-ui">
                AI দ্বারা উত্তোলিত লেনদেন তথ্য
              </p>
            </div>
          </div>

          {/* Confidence Badge */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1 border ${
              isLowConfidence
                ? "bg-amber-100 text-amber-800 border-amber-300"
                : "bg-emerald-100 text-emerald-800 border-emerald-300"
            }`}
          >
            {isLowConfidence && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
            <span>কনফিডেন্স: {Math.round(parsedData.confidence * 100)}%</span>
          </div>
        </div>

        {/* Low Confidence Warning Alert */}
        {isLowConfidence && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs font-ui space-y-1">
            <p className="font-bold text-amber-950 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-amber-700" /> কথা পুরোপুরি পরিষ্কার শোনা যায়নি
            </p>
            <p className="text-stone-700">
              দয়া করে এন্ট্রিটি যাচাই করুন অথবা "পুনরায় বলুন" এ ট্যাপ করুন।
            </p>
          </div>
        )}

        {/* Spoken Audio Raw Transcript */}
        {parsedData.rawTranscript && (
          <div className="mb-4 p-3 bg-stone-200/60 rounded-xl text-xs font-mono text-stone-700">
            <span className="font-bold text-stone-900 block mb-0.5 font-ui">
              অডিও ট্রান্সক্রিপ্ট:
            </span>
            <span className="italic">"{parsedData.rawTranscript}"</span>
          </div>
        )}

        {/* Parsed Fields Form or View */}
        {!isEditing ? (
          <div className="space-y-3 font-ui">
            {/* Customer */}
            <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-600">
                <UserCheck className="w-4 h-4 text-red-700" />
                <span className="text-xs font-bold uppercase">খদ্দেরের নাম:</span>
              </div>
              <span className="font-brand font-bold text-lg text-red-950">
                {customer}
              </span>
            </div>

            {/* Item */}
            <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-600">
                <Package className="w-4 h-4 text-stone-700" />
                <span className="text-xs font-bold uppercase">পণ্যের বিবরণ:</span>
              </div>
              <span className="font-medium text-stone-900 text-sm">
                {item}
              </span>
            </div>

            {/* Amount */}
            <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-600">
                <DollarSign className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold uppercase">টাকার পরিমাণ:</span>
              </div>
              <span className="font-mono font-extrabold text-2xl text-emerald-800">
                ৳ {formatBnNumber(amount)}
              </span>
            </div>

            {/* Type */}
            <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-stone-600">লেনদেনের ধরন:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  type === "BAKI"
                    ? "bg-red-100 text-red-800 border border-red-300"
                    : type === "PAYMENT"
                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                }`}
              >
                {type === "BAKI" ? "বাকী হিসাব" : type === "PAYMENT" ? "বাকী পরিশোধ" : "নগদ বিক্রি"}
              </span>
            </div>
          </div>
        ) : (
          /* Editable Form */
          <div className="space-y-3 font-ui text-sm">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">খদ্দেরের নাম:</label>
              <input
                type="text"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 font-bold font-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">পণ্যের বিবরণ:</label>
              <input
                type="text"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">টাকার পরিমাণ (৳):</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">লেনদেনের ধরন:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 font-bold"
              >
                <option value="BAKI">বাকী (Baki - Red Ink)</option>
                <option value="NOGOD">নগদ বিক্রি (Cash Sale - Green Ink)</option>
                <option value="PAYMENT">বাকী পরিশোধ (Payment - Navy Ink)</option>
              </select>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-stone-300 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              onClick={onReRecord}
              className="px-3.5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>পুনরায় বলুন</span>
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3.5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? "সম্পন্ন" : "এডিট করুন"}</span>
            </button>
          </div>

          <button
            onClick={handleSaveConfirm}
            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition transform hover:scale-105"
          >
            <Check className="w-4 h-4" />
            <span>নিশ্চিত করুন (খাতায় লিখুন)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
