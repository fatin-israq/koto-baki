import React from 'react';
import { BookOpen, Calendar, ChevronLeft, ChevronRight, Mic, Users, Wallet, FileText, Sparkles, Volume2 } from 'lucide-react';

export function Header({
  shopInfo,
  selectedDate,
  datesList,
  onDateChange,
  activeTab,
  onTabChange,
  onOpenPresets
}) {
  // Format date in Bengali
  const formatDateBengali = (dateStr) => {
    try {
      const [year, month, day] = dateStr.split('-');
      const monthNamesBn = [
        "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
        "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
      ];
      const mIdx = parseInt(month, 10) - 1;

      // Convert numerals to Bengali digits
      const toBnDigits = (str) =>
        str.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

      return `${toBnDigits(day)} ${monthNamesBn[mIdx]} ${toBnDigits(year)}`;
    } catch {
      return dateStr;
    }
  };

  const handlePrevDate = () => {
    const idx = datesList.indexOf(selectedDate);
    if (idx < datesList.length - 1) {
      onDateChange(datesList[idx + 1]);
    }
  };

  const handleNextDate = () => {
    const idx = datesList.indexOf(selectedDate);
    if (idx > 0) {
      onDateChange(datesList[idx - 1]);
    }
  };

  return (
    <header className="bg-stone-900 border-b border-stone-800 text-stone-100 sticky top-0 z-30 shadow-md">
      {/* Top Banner & AI Engine Status */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Shop Name Banner */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center shadow-lg shadow-red-950/50 border border-red-400/30">
            <BookOpen className="w-6 h-6 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-brand text-amber-300 tracking-wide">
                {shopInfo.name}
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-900/60 text-red-200 font-mono border border-red-700/50">
                লাল খাতা
              </span>
            </div>
            <p className="text-xs text-stone-400 font-ui flex items-center gap-2">
              <span>{shopInfo.owner}</span>
              <span>•</span>
              <span>{shopInfo.address}</span>
            </p>
          </div>
        </div>

        {/* Date Selector with Book Flip Controls */}
        <div className="flex items-center bg-stone-800/90 rounded-xl p-1 border border-stone-700/80 shadow-inner">
          <button
            onClick={handlePrevDate}
            disabled={datesList.indexOf(selectedDate) >= datesList.length - 1}
            title="আগের দিন"
            className="p-1.5 rounded-lg text-stone-400 hover:text-amber-300 hover:bg-stone-700/60 disabled:opacity-30 disabled:hover:bg-transparent transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="px-3 py-1 flex items-center gap-2 text-sm font-semibold font-ui text-stone-200">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{formatDateBengali(selectedDate)}</span>
          </div>

          <button
            onClick={handleNextDate}
            disabled={datesList.indexOf(selectedDate) <= 0}
            title="পরের দিন"
            className="p-1.5 rounded-lg text-stone-400 hover:text-amber-300 hover:bg-stone-700/60 disabled:opacity-30 disabled:hover:bg-transparent transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* AI Voice Engine Badge & Preset Launcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30 transition shadow-sm"
          >
            <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>ভয়েস সিমুলেটর</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Gemma 4 AI: Online</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-stone-950/80 border-t border-stone-800/80">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-around sm:justify-start gap-1 sm:gap-4 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => onTabChange("dashboard")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === "dashboard"
                ? "bg-red-800 text-amber-200 shadow-md shadow-red-950"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>আজকের হিসাব</span>
          </button>

          <button
            onClick={() => onTabChange("khata")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === "khata"
                ? "bg-red-800 text-amber-200 shadow-md shadow-red-950"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>খাতার পাতা</span>
          </button>

          <button
            onClick={() => onTabChange("baki")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === "baki"
                ? "bg-red-800 text-amber-200 shadow-md shadow-red-950"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>বাকী খাতা</span>
          </button>

          <button
            onClick={() => onTabChange("customers")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === "customers"
                ? "bg-red-800 text-amber-200 shadow-md shadow-red-950"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>খদ্দের তালিকা</span>
          </button>
        </div>
      </div>
    </header>
  );
}
