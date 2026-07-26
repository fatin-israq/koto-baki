import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import IntroAnimation from './components/IntroAnimation';
import WriteInAnimation from './components/WriteInAnimation';
import PageFlipView from './components/PageFlipView';
import { fetchLedger, transcribeAudio, createTransaction } from './services/api';

// Demo transcripts simulating Gemma 4's Native Audio JSON results (used as fallback or for testing)
const demoTranscripts = [
  { heard: "“করিম ভাইকে ২০০ টাকার বাকিতে একটা শার্ট দিলাম”", customer: "করিম ভাই", item: "শার্ট", amount: 200, type: "baki", confidence: 0.94 },
  { heard: "“রহিমা আপা ৫০ টাকার চা-বিস্কুট কিনলেন, ক্যাশ”", customer: "রহিমা আপা", item: "চা ও বিস্কুট", amount: 50, type: "sale", confidence: 0.97 },
  { heard: "“জামাল ভাই আগের বাকি থেকে ৩০০ টাকা শোধ করলেন”", customer: "জামাল ভাই", item: "বাকি পরিশোধ", amount: 300, type: "poroshod", confidence: 0.91 },
  { heard: "“নতুন কাস্টমার, দুই কেজি চাল, ১২০ টাকা ক্যাশ”", customer: "নতুন কাস্টমার", item: "চাল (২ কেজি)", amount: 120, type: "sale", confidence: 0.89 },
  { heard: "“...পনেরো... না পঞ্চাশ টাকা বাকি রাখলো... আফতাব”", customer: "আফতাব", item: "(অস্পষ্ট)", amount: 50, type: "baki", confidence: 0.52 }
];

const typeLabel = {
  baki: "বাকি দেওয়া",
  sale: "বিক্রি (ক্যাশ)",
  poroshod: "বাকি পরিশোধ"
};

function Icon({ name }) {
  const icons = {
    home: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    baki: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path d="M5 4h11l3 3v13H5V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M9 10h7M9 14h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    sales: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path d="M4 17 10 11 14 15 20 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 7h5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    customers: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="17" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M15.5 13.2c2.4.3 4 1.9 4.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    all: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <rect x="4" y="4" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M8 9h8M8 12.5h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    )
  };
  return icons[name] || null;
}

export function App() {
  const [appState, setAppState] = useState("intro"); // intro | main
  const [screen, setScreen] = useState("home"); // home | baki | sales | customers | all
  const [micState, setMicState] = useState("idle"); // idle | listening | preview
  const [isAnimating, setIsAnimating] = useState(false);
  const [demoIndex, setDemoIndex] = useState(0);
  const [pendingEntry, setPendingEntry] = useState(null);
  const [newlyAddedId, setNewlyAddedId] = useState(null);
  const [activeReminderCustomer, setActiveReminderCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize with sample ledger data
  const [ledger, setLedger] = useState([]);

  useEffect(() => {
    fetchLedger().then(setLedger).catch(err => {
      console.error("Failed to fetch ledger, falling back to demo", err);
      setLedger(demoTranscripts.map((t, index) => ({ ...t, id: index + 1 })));
    });
  }, []);

  // Compute shop totals
  const saleTotal = ledger.filter((e) => e.type === "sale").reduce((s, e) => s + e.amount, 0);

  const bakiByCust = {};
  ledger.forEach((e) => {
    if (e.type === "baki") bakiByCust[e.customer] = (bakiByCust[e.customer] || 0) + e.amount;
    if (e.type === "poroshod") bakiByCust[e.customer] = (bakiByCust[e.customer] || 0) - e.amount;
  });
  const bakiTotal = Object.values(bakiByCust).reduce((s, v) => s + Math.max(v, 0), 0);

  // Trigger Mic Listening using Web Speech API
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please try using Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'bn-BD'; // Bengali language code
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setMicState("listening");

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      try {
        const result = await transcribeAudio(null, transcript);
        setPendingEntry(result);
        setMicState("preview");
      } catch (e) {
        console.error(e);
        setMicState("idle");
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setMicState("idle");
    };

    recognition.onend = () => {
      // If ended but still listening (no result came), reset state
      setMicState((prev) => (prev === "listening" ? "idle" : prev));
    };

    recognition.start();
  };

  const retryMic = () => {
    setMicState("idle");
    setPendingEntry(null);
  };

  const confirmEntry = () => {
    if (pendingEntry) {
      setMicState("idle");
      setIsAnimating(true);
    }
  };

  const handleAnimationComplete = async () => {
    try {
      const newEntry = await createTransaction(pendingEntry);
      setLedger((prev) => [...prev, newEntry]);
      setNewlyAddedId(newEntry.id);
      setDemoIndex((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to save transaction", err);
    } finally {
      setIsAnimating(false);
      setPendingEntry(null);
    }

    try {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#9E2B25', '#3F6B4A', '#C98A2B', '#2E4C6D']
      });
    } catch {
      // fallback
    }
  };

  // Filter ledger based on search query
  const filteredLedger = ledger.filter((e) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.customer.toLowerCase().includes(q) ||
      e.item.toLowerCase().includes(q) ||
      (typeLabel[e.type] && typeLabel[e.type].toLowerCase().includes(q))
    );
  });

  const rowHTML = (e) => {
    const sign = e.type === "poroshod" ? "−" : "+";
    const isNew = e.id === newlyAddedId;
    return (
      <div key={e.id || Math.random()} className={`ledger-row ${isNew ? "newly-added" : ""}`}>
        <div className="row-info">
          <div className="who">{e.customer}</div>
          <div className="what">{e.item} · <span className={`type-badge ${e.type}`}>{typeLabel[e.type]}</span></div>
        </div>
        <div className={`amt ${e.type}`}>
          {sign}৳{e.amount}
        </div>
      </div>
    );
  };

  const activeBakiCustomers = Object.entries(bakiByCust)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  // Mock grouping for Page Flip
  const chunkedLedger = [];
  for (let i = 0; i < ledger.length; i += 5) {
    chunkedLedger.push([`২৪ জুলাই ২০২৬ (পৃষ্ঠা ${Math.floor(i/5)+1})`, ledger.slice(i, i + 5)]);
  }
  if (chunkedLedger.length === 0) {
    chunkedLedger.push(["আজ", []]);
  }

  return (
    <>
      {appState === "intro" && <IntroAnimation onComplete={() => setAppState("main")} />}
      <div className="device-container">
        <div className="device">
        {/* Red Margin Line */}
        <div className="margin-rule" />

        {/* Desktop Sidebar (visible >= 768px) */}
        <aside className="pc-sidebar">
          <div className="pc-brand">
            <div className="logo-icon">📖</div>
            <div className="brand-text">
              <span className="main-title">মুদি দোকান খাতা</span>
              <small className="sub-title">Mudi Dokan — Voice Ledger</small>
            </div>
          </div>

          <button className="pc-mic-btn" onClick={startListening} title="কথা বলুন / হিসাব যোগ করুন">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M19 11a7 7 0 0 1-14 0M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>🎤 কন্ঠস্বরে হিসাব লিখুন</span>
          </button>

          <nav className="pc-nav">
            <button
              className={`pc-nav-item ${screen === "home" ? "active" : ""}`}
              onClick={() => setScreen("home")}
            >
              <Icon name="home" />
              <span>ড্যাশবোর্ড</span>
            </button>
            <button
              className={`pc-nav-item ${screen === "baki" ? "active" : ""}`}
              onClick={() => setScreen("baki")}
            >
              <Icon name="baki" />
              <span>বাকির খাতা</span>
              {bakiTotal > 0 && <span className="nav-badge baki">৳{bakiTotal}</span>}
            </button>
            <button
              className={`pc-nav-item ${screen === "sales" ? "active" : ""}`}
              onClick={() => setScreen("sales")}
            >
              <Icon name="sales" />
              <span>বিক্রির হিসাব</span>
              {saleTotal > 0 && <span className="nav-badge sale">৳{saleTotal}</span>}
            </button>
            <button
              className={`pc-nav-item ${screen === "customers" ? "active" : ""}`}
              onClick={() => setScreen("customers")}
            >
              <Icon name="customers" />
              <span>কাস্টমার তালিকা</span>
            </button>
            <button
              className={`pc-nav-item ${screen === "all" ? "active" : ""}`}
              onClick={() => setScreen("all")}
            >
              <Icon name="all" />
              <span>সব হিসাব</span>
              <span className="nav-badge neutral">{ledger.length}</span>
            </button>
          </nav>

          <div className="pc-sidebar-footer">
            <div className="quick-summary-box">
              <div className="stat-item">
                <span className="lbl">আজকের বিক্রি</span>
                <span className="val sale">৳{saleTotal}</span>
              </div>
              <div className="stat-item">
                <span className="lbl">মোট বাকি</span>
                <span className="val baki">৳{bakiTotal}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Wrapper */}
        <div className="main-content-wrapper">
          {/* Mobile Header (visible < 768px) */}
          <header className="mobile-header">
            {screen === "home" ? (
              <div className="brand">
                মুদি দোকান খাতা
                <small>Mudi Dokan — voice ledger</small>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="back-arrow" onClick={() => setScreen("home")}>
                  ←
                </div>
                <div className="brand" style={{ fontSize: '17px' }}>
                  {screen === "baki" && "বাকির খাতা"}
                  {screen === "sales" && "বিক্রির হিসাব"}
                  {screen === "customers" && "কাস্টমার তালিকা"}
                  {screen === "all" && "সব হিসাব"}
                </div>
              </div>
            )}
          </header>

          {/* PC Header (visible >= 768px) */}
          <header className="pc-header">
            <div className="pc-page-title">
              {screen === "home" && "দোকানের হিসাব ড্যাশবোর্ড"}
              {screen === "baki" && "বাকির খাতা ও পাওনা তালিকা"}
              {screen === "sales" && "বিক্রি ও জমা লেনদেন"}
              {screen === "customers" && "কাস্টমার তালিকা ও বাকি স্থিতি"}
              {screen === "all" && "সকল লেনদেনের রেজিস্টার"}
            </div>

            <div className="pc-header-controls">
              <div className="search-bar">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 search-icon">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="কাস্টমার বা পণ্যের নাম দিয়ে খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="clear-search-btn" onClick={() => setSearchQuery("")}>✕</button>
                )}
              </div>

              <button className="pc-quick-voice-btn" onClick={startListening}>
                🎙️ নতুন হিসাব
              </button>
            </div>
          </header>

          {/* Main Scrollable Area */}
          <main className={micState !== "idle" || isAnimating ? "is-recording" : ""}>
            {/* Screen 1: HOME */}
            {screen === "home" && (
              <>
                {/* Revenue Hero Card */}
                <div className="revenue-card">
                  <div className="label">আজকের বিক্রি</div>
                  <div className="amount">৳{saleTotal}</div>
                  <div className="subrow">
                    <div className="sub baki">
                      মোট বাকি<b>৳{bakiTotal}</b>
                    </div>
                    <div className="sub">
                      আজকের হিসাব<b>{ledger.length}টি</b>
                    </div>
                  </div>
                </div>

                {/* Quick Action Grid */}
                <div className="grid">
                  <div className="tile baki" onClick={() => setScreen("baki")}>
                    <div className="icon-box"><Icon name="baki" /></div>
                    <div className="t-label">বাকির খাতা</div>
                  </div>
                  <div className="tile sales" onClick={() => setScreen("sales")}>
                    <div className="icon-box"><Icon name="sales" /></div>
                    <div className="t-label">বিক্রির হিসাব</div>
                  </div>
                  <div className="tile customers" onClick={() => setScreen("customers")}>
                    <div className="icon-box"><Icon name="customers" /></div>
                    <div className="t-label">কাস্টমার তালিকা</div>
                  </div>
                  <div className="tile all" onClick={() => setScreen("all")}>
                    <div className="icon-box"><Icon name="all" /></div>
                    <div className="t-label">সব হিসাব</div>
                  </div>
                </div>

                {/* Recent Ledger Preview */}
                <div className="section-head">
                  <div className="h">সাম্প্রতিক</div>
                  <div className="link" onClick={() => setScreen("all")}>
                    সব দেখুন →
                  </div>
                </div>

                <div className="recent-ledger-container">
                  {filteredLedger.length ? (
                    filteredLedger.slice().reverse().slice(0, 2).map(rowHTML)
                  ) : (
                    <div className="empty-note">
                      এখনো কোনো হিসাব লেখা হয়নি
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Screen 2: BAKI Summary */}
            {screen === "baki" && (
              <div className="screen-container">
                <div className="baki-total">
                  <div className="num">৳{bakiTotal}</div>
                  <div className="lbl">মোট বাকি পাওনা</div>
                </div>

                <div className="baki-list-grid">
                  {Object.entries(bakiByCust)
                    .filter(([name, v]) => {
                      if (v <= 0) return false;
                      if (!searchQuery.trim()) return true;
                      return name.toLowerCase().includes(searchQuery.toLowerCase());
                    }).length ? (
                    Object.entries(bakiByCust)
                      .filter(([, v]) => v > 0)
                      .filter(([name]) => !searchQuery.trim() || name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .sort((a, b) => b[1] - a[1])
                      .map(([name, amt]) => (
                        <div key={name} className="baki-person">
                          <div>
                            <div className="name">{name}</div>
                            <button
                              onClick={() => setActiveReminderCustomer(name === activeReminderCustomer ? null : name)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--navy)',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                padding: 0,
                                marginTop: '4px'
                              }}
                            >
                              {activeReminderCustomer === name ? "রিমাইন্ডার বন্ধ" : "📲 হোয়াটসঅ্যাপ রিমাইন্ডার"}
                            </button>

                            {activeReminderCustomer === name && (
                              <div className="reminder-modal">
                                <b>হোয়াটসঅ্যাপ মেসেজ:</b>
                                <textarea
                                  readOnly
                                  rows={3}
                                  value={`আসসালামু আলাইকুম ${name}, মুদি দোকান খাতায় আপনার ৳${amt} বাকী রয়েছে। অনুগ্রহ করে পরিশোধ করুন।`}
                                />
                                <a
                                  href={`https://wa.me/?text=${encodeURIComponent(`আসসালামু আলাইকুম ${name}, আপনার ৳${amt} বাকী রয়েছে।`)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    display: 'inline-block',
                                    background: 'var(--sale-green)',
                                    color: '#fff',
                                    padding: '5px 12px',
                                    borderRadius: '6px',
                                    textDecoration: 'none',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    marginTop: '4px'
                                  }}
                                >
                                  মেসেজ পাঠান →
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="amt">৳{amt}</div>
                        </div>
                      ))
                  ) : (
                    <div className="empty-note">
                      {searchQuery ? "এই নামে কোনো বাকিদার পাওয়া যায়নি" : "কারো কাছে বাকি নেই"}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Screen 3: SALES Breakdown */}
            {screen === "sales" && (
              <div className="screen-container">
                <div className="sales-summary-header">
                  <div className="lbl">মোট বিক্রি (ক্যাশ ও জমা)</div>
                  <div className="val">৳{saleTotal}</div>
                </div>

                <div className="sales-list">
                  {filteredLedger.filter((e) => e.type === "sale" || e.type === "poroshod").length ? (
                    filteredLedger
                      .filter((e) => e.type === "sale" || e.type === "poroshod")
                      .slice()
                      .reverse()
                      .map(rowHTML)
                  ) : (
                    <div className="empty-note">
                      {searchQuery ? "কোনো বিক্রি খুঁজে পাওয়া যায়নি" : "এখনো বিক্রি নেই"}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Screen 4: CUSTOMERS */}
            {screen === "customers" && (
              <div className="screen-container">
                {(() => {
                  const byCust = {};
                  ledger.forEach((e) => {
                    byCust[e.customer] = byCust[e.customer] || { count: 0, balance: 0 };
                    byCust[e.customer].count++;
                    if (e.type === "baki") byCust[e.customer].balance += e.amount;
                    if (e.type === "poroshod") byCust[e.customer].balance -= e.amount;
                  });
                  const rows = Object.entries(byCust).filter(([name]) => {
                    if (!searchQuery.trim()) return true;
                    return name.toLowerCase().includes(searchQuery.toLowerCase());
                  });

                  return rows.length ? (
                    <div className="customers-list">
                      {rows.map(([name, d]) => (
                        <div key={name} className="cust-row">
                          <div>
                            <div className="name">{name}</div>
                            <div className="meta">{d.count}টি লেনদেন</div>
                          </div>
                          <div className={`bal ${d.balance > 0 ? "owe" : "clear"}`}>
                            {d.balance > 0 ? "৳" + d.balance + " বাকি" : "পরিষ্কার"}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-note">
                      {searchQuery ? "কোনো কাস্টমার পাওয়া যায়নি" : "এখনো কোনো কাস্টমার নেই"}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Screen 5: ALL Transactions */}
            {screen === "all" && (
              <div className="screen-container">
                <div className="all-header">সকল লেনদেনের তালিকা ({filteredLedger.length}টি)</div>
                <div className="all-ledger-list">
                  {filteredLedger.length ? (
                    filteredLedger.slice().reverse().map(rowHTML)
                  ) : (
                    <div className="empty-note">
                      {searchQuery ? "কোনো লেনদেন পাওয়া যায়নি" : "এখনো কোনো হিসাব লেখা হয়নি"}
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>

          {isAnimating && pendingEntry && (
            <WriteInAnimation 
              entry={pendingEntry} 
              existingEntriesCount={ledger.length}
              onComplete={handleAnimationComplete} 
            />
          )}

          {/* Centered & Enlarged FAB Mic Button (Mobile view trigger & Desktop float) */}
          {screen === "home" && (
            <div className="fab" onClick={startListening} title="কথা বলুন / হিসাব যোগ করুন">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" stroke="#1E2A38" strokeWidth="1.8"/>
                <path d="M19 11a7 7 0 0 1-14 0M12 18v3" stroke="#1E2A38" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </div>

        {/* Mic Listening / "Ja Shunlam" Preview Overlay Sheet / Modal */}
        {micState !== "idle" && (
          <div className="sheet-backdrop" onClick={(e) => e.target === e.currentTarget && retryMic()}>
            <div className="sheet">
              {micState === "listening" && (
                <div className="listening">
                  <div className="bars">
                    <span /><span /><span /><span /><span />
                  </div>
                  <div className="hero-label">শুনছি...</div>
                  <div className="transcript">বলুন — কাস্টমারের নাম, জিনিস, টাকার পরিমাণ</div>
                </div>
              )}

              {micState === "preview" && pendingEntry && (
                <>
                  <div className="heard">যা শুনলাম: {pendingEntry.heard}</div>

                  <div className="field-row">
                    <span className="k">কাস্টমার</span>
                    <span className="v">{pendingEntry.customer}</span>
                  </div>
                  <div className="field-row">
                    <span className="k">জিনিস</span>
                    <span className="v">{pendingEntry.item}</span>
                  </div>
                  <div className="field-row">
                    <span className="k">টাকা</span>
                    <span className="v">৳{pendingEntry.amount}</span>
                  </div>
                  <div className="field-row">
                    <span className="k">ধরন</span>
                    <span className={`type-chip ${pendingEntry.type}`}>
                      {typeLabel[pendingEntry.type]}
                    </span>
                  </div>

                  {pendingEntry.confidence < 0.7 && (
                    <div className="confidence-warning">
                      ⚠ স্পষ্ট শোনা যায়নি — মিলিয়ে দেখে নিশ্চিত করুন
                    </div>
                  )}

                  <div className="action-row">
                    <button className="btn retry" onClick={retryMic}>
                      আবার বলুন
                    </button>
                    <button className="btn confirm" onClick={confirmEntry}>
                      ঠিক আছে, যোগ করুন
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
