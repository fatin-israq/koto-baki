import React from 'react';
import { ShoppingBag, DollarSign, ArrowUpRight, ArrowDownLeft, AlertCircle } from 'lucide-react';

export function RevenueCard({ dailyMetrics, totalGlobalBaki }) {
  const formatBnNumber = (num) => {
    return (num || 0).toLocaleString("bn-BD").replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-4">
      {/* Total Daily Sales */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-stone-900 shadow-lg shadow-amber-900/20 border border-amber-300/40 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-950/80 font-ui">
            মোট বিক্রি (আজ)
          </span>
          <div className="p-2 rounded-xl bg-amber-950/10 text-amber-950">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-amber-950">
            ৳ {formatBnNumber(dailyMetrics.totalSales)}
          </div>
          <p className="text-[11px] font-medium text-amber-950/70 mt-1">
            আজকের সার্বিক বিক্রয় পরিমাণ
          </p>
        </div>
      </div>

      {/* Today's Cash Collected */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-4 text-white shadow-lg shadow-emerald-950/20 border border-emerald-400/30 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-100/90 font-ui">
            আজকের নগদ ক্যাশ
          </span>
          <div className="p-2 rounded-xl bg-white/10 text-emerald-200">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white">
            ৳ {formatBnNumber(dailyMetrics.nogodCash)}
          </div>
          <p className="text-[11px] font-medium text-emerald-100/80 mt-1">
            ক্যাশ বিক্রি + বাকী আদায়
          </p>
        </div>
      </div>

      {/* New Baki Added Today */}
      <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl p-4 text-white shadow-lg shadow-red-950/20 border border-red-400/30 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-red-100/90 font-ui">
            নতুন বাকী (আজ)
          </span>
          <div className="p-2 rounded-xl bg-white/10 text-rose-200">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white">
            ৳ {formatBnNumber(dailyMetrics.bakiAdded)}
          </div>
          <p className="text-[11px] font-medium text-red-100/80 mt-1">
            আজকে খদ্দেররা বাকী নিল
          </p>
        </div>
      </div>

      {/* Total Global Unpaid Baki Owed */}
      <div className="bg-stone-900 rounded-2xl p-4 text-stone-100 shadow-lg shadow-black/40 border border-stone-800 flex flex-col justify-between col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-red-400 font-ui flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> সর্বমোট পাওনা বাকী
          </span>
          <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-red-400">
            ৳ {formatBnNumber(totalGlobalBaki)}
          </div>
          <p className="text-[11px] font-medium text-stone-400 mt-1">
            সকল খদ্দেরের বকেয়া হিসাব
          </p>
        </div>
      </div>
    </div>
  );
}
