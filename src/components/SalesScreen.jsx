import React from 'react';
import { ShoppingBag, TrendingUp, DollarSign, Calendar, Filter } from 'lucide-react';

export function SalesScreen({ transactions, selectedDate, dailyMetrics }) {
  const formatBnNumber = (num) => {
    return (num || 0).toLocaleString("bn-BD").replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
  };

  const currentTxs = transactions[selectedDate] || [];
  const nogodTxs = currentTxs.filter((t) => t.type === "NOGOD");
  const bakiTxs = currentTxs.filter((t) => t.type === "BAKI");
  const paymentTxs = currentTxs.filter((t) => t.type === "PAYMENT");

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 text-stone-100 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-amber-300 font-brand text-xl font-bold">
            <ShoppingBag className="w-6 h-6" />
            <span>বিক্রি খাতা (Sales & Revenue Breakdown)</span>
          </div>
          <p className="text-xs text-stone-400 font-ui mt-1">
            দৈনিক ক্যাশ ও বাকী বিক্রির বিস্তারিত বিবরণী
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-stone-950 px-4 py-2 rounded-2xl border border-stone-800">
            <span className="text-[10px] text-stone-400 block font-ui">আজকের মোট বিক্রি:</span>
            <span className="text-2xl font-extrabold font-mono text-amber-400">
              ৳ {formatBnNumber(dailyMetrics.totalSales)}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-5 text-emerald-100 space-y-2">
          <span className="text-xs font-bold font-ui text-emerald-300 uppercase">নগদ বিক্রি</span>
          <div className="text-3xl font-bold font-mono text-emerald-400">
            ৳ {formatBnNumber(dailyMetrics.nogodCash - dailyMetrics.bakiPaid)}
          </div>
          <p className="text-xs text-emerald-200/70 font-ui">
            মোট {formatBnNumber(nogodTxs.length)} টি ক্যাশ ট্রানজ্যাকশন
          </p>
        </div>

        <div className="bg-red-950/40 border border-red-800/60 rounded-2xl p-5 text-red-100 space-y-2">
          <span className="text-xs font-bold font-ui text-red-300 uppercase">বাকী বিক্রি</span>
          <div className="text-3xl font-bold font-mono text-red-400">
            ৳ {formatBnNumber(dailyMetrics.bakiAdded)}
          </div>
          <p className="text-xs text-red-200/70 font-ui">
            মোট {formatBnNumber(bakiTxs.length)} টি বাকী ট্রানজ্যাকশন
          </p>
        </div>

        <div className="bg-blue-950/40 border border-blue-800/60 rounded-2xl p-5 text-blue-100 space-y-2">
          <span className="text-xs font-bold font-ui text-blue-300 uppercase">বাকী আদায়</span>
          <div className="text-3xl font-bold font-mono text-blue-400">
            ৳ {formatBnNumber(dailyMetrics.bakiPaid)}
          </div>
          <p className="text-xs text-blue-200/70 font-ui">
            মোট {formatBnNumber(paymentTxs.length)} টি জমা প্রাপ্তি
          </p>
        </div>
      </div>

      {/* Sales Transactions List */}
      <div className="bg-stone-900 rounded-3xl p-6 border border-stone-800 space-y-4">
        <h4 className="text-base font-bold font-brand text-stone-100">
          আজকের বিস্তারিত ট্রানজ্যাকশন লগ
        </h4>

        {currentTxs.length === 0 ? (
          <p className="py-8 text-center text-stone-500 text-sm font-ui">
            এই তারিখের জন্য কোনো বিক্রি এন্ট্রি নেই
          </p>
        ) : (
          <div className="space-y-2">
            {currentTxs.map((tx) => (
              <div
                key={tx.id}
                className="p-4 bg-stone-950 rounded-2xl border border-stone-800 flex items-center justify-between font-ui"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-stone-400">{tx.time}</span>
                    <span className="font-bold text-stone-200">{tx.customer}</span>
                  </div>
                  <p className="text-sm text-stone-300 mt-0.5">{tx.item}</p>
                </div>

                <div className="text-right">
                  <span
                    className={`text-lg font-bold font-mono ${
                      tx.type === "BAKI"
                        ? "text-red-400"
                        : tx.type === "PAYMENT"
                        ? "text-blue-400"
                        : "text-emerald-400"
                    }`}
                  >
                    ৳ {formatBnNumber(tx.amount)}
                  </span>
                  <span className="block text-[10px] text-stone-500 font-mono">
                    {tx.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
