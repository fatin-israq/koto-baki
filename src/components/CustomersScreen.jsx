import React, { useState } from 'react';
import { Users, Search, Phone, MapPin, History, FileText, ChevronRight } from 'lucide-react';

export function CustomersScreen({ customers, transactions }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustHistory, setSelectedCustHistory] = useState(null);

  const formatBnNumber = (num) => {
    return (num || 0).toLocaleString("bn-BD").replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  // Get transactions for a given customer across all dates
  const getCustomerTransactions = (cust) => {
    const list = [];
    Object.keys(transactions).forEach((date) => {
      transactions[date].forEach((tx) => {
        if (tx.customerId === cust.id || tx.customer === cust.displayName) {
          list.push({ ...tx, date });
        }
      });
    });
    return list;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-900 p-6 rounded-3xl border border-stone-800 text-stone-100 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-amber-300 font-brand text-xl font-bold">
            <Users className="w-6 h-6" />
            <span>খদ্দের তালিকা (Customer Directory)</span>
          </div>
          <p className="text-xs text-stone-400 font-ui mt-1">
            দোকানের সমস্ত স্থায়ী ও নিয়মিত খদ্দেরদের প্রোফাইল ও লেনদেন তথ্য
          </p>
        </div>

        <div className="text-xs font-mono bg-stone-800 px-4 py-2 rounded-xl text-stone-300 border border-stone-700">
          মোট খদ্দের: {formatBnNumber(customers.length)} জন
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-3 text-stone-500" />
        <input
          type="text"
          placeholder="খদ্দেরের নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 font-ui"
        />
      </div>

      {/* Customers List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cust) => {
          const custTxs = getCustomerTransactions(cust);
          return (
            <div
              key={cust.id}
              className="bg-stone-900 rounded-2xl p-5 border border-stone-800 hover:border-amber-500/50 transition duration-300 space-y-4 shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold font-brand text-xl shadow"
                    style={{ backgroundColor: cust.avatarColor || '#C62828' }}
                  >
                    {cust.displayName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold font-brand text-stone-100">
                      {cust.displayName}
                    </h4>
                    <p className="text-xs text-stone-400 font-mono">
                      {cust.phone}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-stone-400 space-y-1 font-ui">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" />
                    <span>{cust.address}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-stone-500" />
                    <span>সর্বশেষ লেনদেন: {cust.lastTransactionDate}</span>
                  </p>
                </div>
              </div>

              {/* Status and Action */}
              <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 block font-ui">বর্তমান পাওনা:</span>
                  <span className={`text-lg font-bold font-mono ${cust.totalBaki > 0 ? "text-red-400" : "text-emerald-400"}`}>
                    ৳ {formatBnNumber(cust.totalBaki)}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedCustHistory(cust)}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1 transition"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>হিসাব দেখুন</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Ledger History Modal */}
      {selectedCustHistory && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#FAF6EE] rounded-3xl p-6 shadow-2xl border-4 border-amber-900/40 text-stone-950 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-stone-300 pb-3">
              <div>
                <h3 className="text-xl font-bold font-brand text-red-950">
                  {selectedCustHistory.displayName} — ব্যক্তিগত খাতা
                </h3>
                <p className="text-xs text-stone-600 font-ui">
                  ফোন: {selectedCustHistory.phone} • ঠিকানায়: {selectedCustHistory.address}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustHistory(null)}
                className="text-stone-500 hover:text-stone-950 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* History Table */}
            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {getCustomerTransactions(selectedCustHistory).length === 0 ? (
                <p className="py-8 text-center text-stone-500 text-sm font-ui">
                  কোনো অতীত লেনদেন রেকর্ড পাওয়া যায়নি
                </p>
              ) : (
                getCustomerTransactions(selectedCustHistory).map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between font-ui"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-stone-500">{tx.date} • {tx.time}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            tx.type === "BAKI"
                              ? "bg-red-100 text-red-800"
                              : tx.type === "PAYMENT"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {tx.type === "BAKI" ? "বাকী" : tx.type === "PAYMENT" ? "জমা" : "নগদ"}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-stone-900 mt-0.5">
                        {tx.item}
                      </p>
                    </div>

                    <span
                      className={`text-lg font-bold font-mono ${
                        tx.type === "BAKI"
                          ? "text-red-700"
                          : tx.type === "PAYMENT"
                          ? "text-blue-800"
                          : "text-emerald-700"
                      }`}
                    >
                      ৳ {formatBnNumber(tx.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-stone-300 flex justify-between items-center text-xs text-stone-600 font-mono">
              <span>মোট পাওনা বাকী: ৳ {formatBnNumber(selectedCustHistory.totalBaki)}</span>
              <button
                onClick={() => setSelectedCustHistory(null)}
                className="px-4 py-1.5 rounded-xl bg-stone-900 text-amber-200 font-bold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
