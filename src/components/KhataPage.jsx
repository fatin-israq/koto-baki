import React from 'react';
import { Tag, Clock, Sparkles } from 'lucide-react';

export function KhataPage({
  selectedDate,
  transactions,
  writingTransactionId,
  onOpenVoiceMic
}) {
  const formatBnNumber = (num) => {
    return (num || 0).toLocaleString("bn-BD").replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
  };

  const formatDateBengali = (dateStr) => {
    try {
      const [year, month, day] = dateStr.split('-');
      const monthNamesBn = [
        "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
        "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
      ];
      const mIdx = parseInt(month, 10) - 1;
      const toBnDigits = (str) => str.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
      return `${toBnDigits(day)} ${monthNamesBn[mIdx]} ${toBnDigits(year)}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto my-4 khata-paper-bg rounded-2xl p-4 sm:p-8 min-h-[640px] overflow-hidden border border-amber-900/20 shadow-2xl">
      {/* Left Stitched Spine Decor */}
      <div className="khata-spine-left">
        <div className="khata-spine-stitch" />
      </div>

      {/* Main Ledger Page Content */}
      <div className="pl-14 sm:pl-16 pr-2 sm:pr-4">
        {/* Page Top Header Stamp */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-red-700/80 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-red-900 text-amber-200 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
              হিসাব পাতা
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-brand text-red-950">
              {formatDateBengali(selectedDate)}
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono font-bold">
            <span className="text-stone-600 bg-stone-200/80 px-2.5 py-1 rounded border border-stone-300">
              মোট এন্ট্রি: {formatBnNumber(transactions.length)} টি
            </span>
            <button
              onClick={onOpenVoiceMic}
              className="flex items-center gap-1 bg-red-800 hover:bg-red-700 text-amber-200 px-3 py-1 rounded transition shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>এন্ট্রি যোগ করুন</span>
            </button>
          </div>
        </div>

        {/* Column Headers in Traditional Khata Style */}
        <div className="grid grid-cols-12 gap-2 text-xs font-bold text-red-950 border-b border-stone-400 pb-2 mb-2 uppercase tracking-wide font-ui">
          <div className="col-span-2 text-stone-700">সময়</div>
          <div className="col-span-3">খদ্দেরের নাম</div>
          <div className="col-span-4">পণ্যের বিবরণ</div>
          <div className="col-span-3 text-right">টাকা (৳) & ধরন</div>
        </div>

        {/* Transactions Rows */}
        {transactions.length === 0 ? (
          <div className="py-16 text-center text-stone-500 font-ui space-y-3">
            <p className="text-lg font-semibold text-stone-600">
              এই দিনে কোনো হিসাব লেখা হয়নি
            </p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              নিচে লাল মাইক বোতামে ট্যাপ করে কথা বলুন — যেমন: <br />
              <span className="text-red-700 font-bold font-ink text-base">"করিম ভাই ৫০ টাকার চিনি বাকী নিল"</span>
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {transactions.map((tx, idx) => {
              const isWriting = writingTransactionId === tx.id;
              let inkClass = "ink-nogod";
              let badgeBg = "bg-emerald-100 text-emerald-800 border-emerald-300";
              let typeLabel = "নগদ";

              if (tx.type === "BAKI") {
                inkClass = "ink-baki";
                badgeBg = "bg-red-100 text-red-800 border-red-300";
                typeLabel = "বাকী";
              } else if (tx.type === "PAYMENT") {
                inkClass = "ink-payment";
                badgeBg = "bg-blue-100 text-blue-800 border-blue-300";
                typeLabel = "জমা";
              }

              return (
                <div
                  key={tx.id}
                  id={`row-${tx.id}`}
                  className={`grid grid-cols-12 gap-2 items-center py-2 border-b border-cyan-700/20 text-sm font-ink transition-all duration-500 rounded px-1 ${
                    isWriting ? "bg-amber-200/80 ring-2 ring-red-600 scale-[1.01]" : "hover:bg-amber-100/50"
                  }`}
                  style={{ minHeight: "38px" }}
                >
                  {/* Time */}
                  <div className="col-span-2 text-xs font-mono text-stone-600 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>{tx.time}</span>
                  </div>

                  {/* Customer */}
                  <div className={`col-span-3 font-bold text-base sm:text-lg ${inkClass}`}>
                    <span className={isWriting ? "ink-entry-text ink-entry-writing" : ""}>
                      {tx.customer}
                    </span>
                  </div>

                  {/* Item Description */}
                  <div className="col-span-4 text-stone-800 text-sm sm:text-base font-medium truncate">
                    {tx.item}
                  </div>

                  {/* Amount & Type Badge */}
                  <div className="col-span-3 text-right flex items-center justify-end gap-2">
                    <span className={`font-mono text-base sm:text-xl font-extrabold ${inkClass}`}>
                      ৳ {formatBnNumber(tx.amount)}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${badgeBg}`}>
                      {typeLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Page Watermark & Summary */}
        <div className="mt-8 pt-4 border-t-2 border-red-800/40 flex justify-between items-center text-xs text-stone-500 font-mono">
          <span>মেসার্স রহিম স্টোর — লাল খাতা</span>
          <span>পৃষ্ঠা নং: ০০৭</span>
        </div>
      </div>
    </div>
  );
}
