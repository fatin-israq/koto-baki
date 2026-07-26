import React, { useState } from 'react';
import { Wallet, MessageCircle, DollarSign, Send, Copy, Check, Search, PhoneCall, AlertCircle, Sparkles } from 'lucide-react';

export function BakiScreen({ customers, totalGlobalBaki, onAddPaymentTransaction }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomerForReminder, setSelectedCustomerForReminder] = useState(null);
  const [selectedCustomerForPayment, setSelectedCustomerForPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [copiedReminder, setCopiedReminder] = useState(false);

  const formatBnNumber = (num) => {
    return (num || 0).toLocaleString("bn-BD").replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  ).sort((a, b) => b.totalBaki - a.totalBaki);

  // Generate polite Bengali WhatsApp reminder text
  const generateReminderText = (cust) => {
    return `আসসালামু আলাইকুম ${cust.displayName},\n\nমেসার্স রহিম স্টোরে (কারওয়ান বাজার) আপনার মোট ৳ ${formatBnNumber(cust.totalBaki)} টাকা বাকী রয়েছে।\n\nঅনুগ্রহ করে সুবিধামতো সময়ে বাকী পরিশোধ করার জন্য বিনীত অনুরোধ করা হলো।\n\nধন্যবাদ,\nমোঃ রহিম উল্লাহ\nমেসার্স রহিম স্টোর\nফোন: 01711-234567`;
  };

  const handleCopyReminder = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedReminder(true);
    setTimeout(() => setCopiedReminder(false), 2000);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (selectedCustomerForPayment && paymentAmount > 0) {
      onAddPaymentTransaction({
        customer: selectedCustomerForPayment.displayName,
        customerId: selectedCustomerForPayment.id,
        item: "বাকী পরিষদ জমা",
        amount: Number(paymentAmount),
        type: "PAYMENT"
      });
      setSelectedCustomerForPayment(null);
      setPaymentAmount("");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-amber-900 text-stone-100 rounded-3xl p-6 shadow-xl border border-red-700/50 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-300 font-brand text-xl font-bold">
            <Wallet className="w-6 h-6" />
            <span>বাকী খাতা (কার কাছে কত বাকী)</span>
          </div>
          <p className="text-xs text-stone-300 font-ui mt-1">
            দোকানের সমস্ত বকেয়া পাওনার তালিকা ও হোয়াটসঅ্যাপ রিমাইন্ডার
          </p>
        </div>

        <div className="bg-black/30 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-right">
          <span className="text-xs text-amber-200/80 uppercase tracking-wider block font-ui">
            সর্বমোট পাওনা বাকী:
          </span>
          <span className="text-3xl font-extrabold font-mono text-amber-300">
            ৳ {formatBnNumber(totalGlobalBaki)}
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 bg-stone-900 p-2 rounded-2xl border border-stone-800">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-stone-500" />
          <input
            type="text"
            placeholder="খদ্দেরের নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 font-ui"
          />
        </div>
      </div>

      {/* Customer Baki Debt Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCustomers.map((cust) => {
          const hasBaki = cust.totalBaki > 0;
          return (
            <div
              key={cust.id}
              className={`bg-stone-900 rounded-2xl p-5 border transition duration-300 space-y-4 shadow-md ${
                hasBaki ? "border-red-900/60 hover:border-red-600" : "border-stone-800 opacity-80"
              }`}
            >
              {/* Header Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold font-brand text-xl shadow"
                    style={{ backgroundColor: cust.avatarColor || '#C62828' }}
                  >
                    {cust.displayName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold font-brand text-stone-100">
                      {cust.displayName}
                    </h4>
                    <p className="text-xs text-stone-400 font-ui">
                      {cust.phone} • {cust.address}
                    </p>
                  </div>
                </div>

                {/* Trust Score Badge */}
                <span
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
                    cust.trustScore === "উত্তম"
                      ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                      : cust.trustScore === "মাঝারি"
                      ? "bg-amber-950 text-amber-300 border-amber-800"
                      : "bg-red-950 text-red-300 border-red-800"
                  }`}
                >
                  {cust.trustScore}
                </span>
              </div>

              {/* Amount Owed Display */}
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <span className="text-xs text-stone-400 font-ui">পাওনা বকেয়া বাকী:</span>
                <span className={`text-2xl font-extrabold font-mono ${hasBaki ? "text-red-400" : "text-emerald-400"}`}>
                  ৳ {formatBnNumber(cust.totalBaki)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-stone-800">
                {hasBaki && (
                  <>
                    <button
                      onClick={() => setSelectedCustomerForReminder(cust)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-bold font-ui flex items-center justify-center gap-2 border border-emerald-700/50 transition"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>রিমাইন্ডার পাঠান</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCustomerForPayment(cust);
                        setPaymentAmount(cust.totalBaki);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold font-ui flex items-center justify-center gap-2 shadow transition"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>জমা জমা নিন</span>
                    </button>
                  </>
                )}

                {!hasBaki && (
                  <div className="w-full text-center text-xs text-emerald-400 font-mono py-1">
                    ✓ বাকী পরিশোধিত (কোনো পাওনা নেই)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* WhatsApp Bengali Reminder Modal */}
      {selectedCustomerForReminder && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-800 text-stone-100 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-brand text-lg font-bold">
                <MessageCircle className="w-5 h-5" />
                <span>হোয়াটসঅ্যাপ বাকী রিমাইন্ডার</span>
              </div>
              <button
                onClick={() => setSelectedCustomerForReminder(null)}
                className="text-stone-400 hover:text-stone-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-stone-400 font-ui">প্রস্তুতকৃত বাংলা মেসেজ:</label>
              <textarea
                rows={6}
                readOnly
                value={generateReminderText(selectedCustomerForReminder)}
                className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs font-ui focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => handleCopyReminder(generateReminderText(selectedCustomerForReminder))}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold font-ui flex items-center justify-center gap-2 transition"
              >
                {copiedReminder ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedReminder ? "কপি হয়েছে!" : "মেসেজ কপি করুন"}</span>
              </button>

              <a
                href={`https://wa.me/88${selectedCustomerForReminder.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  generateReminderText(selectedCustomerForReminder)
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-ui flex items-center justify-center gap-2 shadow-lg transition"
              >
                <Send className="w-4 h-4" />
                <span>হোয়াটসঅ্যাপে পাঠান</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Payment Receive Modal */}
      {selectedCustomerForPayment && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handlePaymentSubmit}
            className="w-full max-w-md bg-[#FAF6EE] rounded-3xl p-6 shadow-2xl border-4 border-emerald-900/50 text-stone-950 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-300 pb-3">
              <h3 className="text-xl font-bold font-brand text-emerald-950">
                বাকী পরিশোধ গ্রহণ
              </h3>
              <button
                type="button"
                onClick={() => setSelectedCustomerForPayment(null)}
                className="text-stone-500 hover:text-stone-900"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <p className="text-xs text-stone-600">খদ্দেরের নাম:</p>
              <p className="text-lg font-bold font-brand text-emerald-900">
                {selectedCustomerForPayment.displayName}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                বর্তমান মোট বাকী: ৳ {formatBnNumber(selectedCustomerForPayment.totalBaki)}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                জমা প্রাপ্ত টাকার পরিমাণ (৳):
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-stone-300 text-stone-950 font-mono font-extrabold text-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedCustomerForPayment(null)}
                className="px-4 py-2 rounded-xl bg-stone-200 text-stone-800 text-xs font-bold font-ui"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm font-ui shadow-lg shadow-emerald-900/30 transition"
              >
                জমা নিশ্চিত করুন (খাতায় লিখুন)
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
