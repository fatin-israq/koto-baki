import React, { useState } from 'react';
import confetti from 'canvas-confetti';

// Demo transcripts simulating Gemma 4's Native Audio JSON results
const demoTranscripts = [
  { heard: "“করিম ভাইকে ২০০ টাকার বাকিতে একটা শার্ট দিলাম”", customer: "করিম ভাই", item: "শার্ট", amount: 200, type: "baki", confidence: 0.94 },
  { heard: "“রহিমা আপা ৫০ টাকার চা-বিস্কুট কিনলেন, ক্যাশ”", customer: "রহিমা আপা", item: "চা ও বিস্কুট", amount: 50, type: "sale", confidence: 0.97 },
  { heard: "“জামাল ভাই আগের বাকি থেকে ৩০০ টাকা শোধ করলেন”", customer: "জামাল ভাই", item: "বাকি পরিশোধ", amount: 300, type: "poroshod", confidence: 0.91 },
  { heard: "“নতুন কাস্টমার, দুই কেজি চাল, ১২০ টাকা ক্যাশ”", customer: "নতুন কাস্টমার", item: "চাল (২ কেজি)", amount: 120, type: "sale", confidence: 0.89 },
  { heard: "“...পনেরো... না পঞ্চাশ টাকা বাকি রাখলো... আফতাব”", customer: "আফতাব", item: "(অস্পষ্ট)", amount: 50, type: "baki", confidence: 0.52 }
];

const typeLabel = {
  baki: "বাকি দেওয়া",
  sale: "বিক্রি (ক্যাশ)",
  poroshod: "বাকি পরিশোধ"
};

function Icon({ name }) {
  const icons = {
    baki: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M5 4h11l3 3v13H5V4Z" stroke="#9E2B25" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M9 10h7M9 14h7" stroke="#9E2B25" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    sales: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M4 17 10 11 14 15 20 7" stroke="#3F6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 7h5v5" stroke="#3F6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    customers: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <circle cx="9" cy="8" r="3" stroke="#2E4C6D" strokeWidth="1.6"/>
        <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" stroke="#2E4C6D" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="17" cy="9" r="2.2" stroke="#2E4C6D" strokeWidth="1.5"/>
        <path d="M15.5 13.2c2.4.3 4 1.9 4.5 4" stroke="#2E4C6D" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    all: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <rect x="4" y="4" width="16" height="16" rx="2.5" stroke="#A66E1E" strokeWidth="1.6"/>
        <path d="M8 9h8M8 12.5h8M8 16h5" stroke="#A66E1E" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    )
  };
  return icons[name] || null;
}

export function App() {
  const [screen, setScreen] = useState("home"); // home | baki | sales | customers | all
  const [micState, setMicState] = useState("idle"); // idle | listening | preview
  const [demoIndex, setDemoIndex] = useState(0);
  const [pendingEntry, setPendingEntry] = useState(null);
  const [newlyAddedId, setNewlyAddedId] = useState(null);
  const [activeReminderCustomer, setActiveReminderCustomer] = useState(null);

  // Initialize with empty ledger data so initial state is clean while preserving labels
  const [ledger, setLedger] = useState([]);

  // Compute shop totals
  const saleTotal = ledger.filter((e) => e.type === "sale").reduce((s, e) => s + e.amount, 0);

  const bakiByCust = {};
  ledger.forEach((e) => {
    if (e.type === "baki") bakiByCust[e.customer] = (bakiByCust[e.customer] || 0) + e.amount;
    if (e.type === "poroshod") bakiByCust[e.customer] = (bakiByCust[e.customer] || 0) - e.amount;
  });
  const bakiTotal = Object.values(bakiByCust).reduce((s, v) => s + Math.max(v, 0), 0);

  // Trigger Mic Listening
  const startListening = () => {
    setMicState("listening");
    setTimeout(() => {
      const entry = demoTranscripts[demoIndex % demoTranscripts.length];
      setPendingEntry(entry);
      setMicState("preview");
    }, 1300);
  };

  const retryMic = () => {
    setMicState("idle");
    setPendingEntry(null);
  };

  const confirmEntry = () => {
    if (pendingEntry) {
      const newEntry = { ...pendingEntry, id: Date.now() };
      setLedger((prev) => [...prev, newEntry]);
      setNewlyAddedId(newEntry.id);
      setDemoIndex((prev) => prev + 1);

      // Ink write-in flourish effect
      try {
        confetti({
          particleCount: 20,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#9E2B25', '#3F6B4A', '#C98A2B']
        });
      } catch {
        // fallback
      }
    }
    setMicState("idle");
    setPendingEntry(null);
  };

  const rowHTML = (e) => {
    const sign = e.type === "poroshod" ? "−" : "+";
    const isNew = e.id === newlyAddedId;
    return (
      <div key={e.id || Math.random()} className={`ledger-row ${isNew ? "newly-added" : ""}`}>
        <div>
          <div className="who">{e.customer}</div>
          <div className="what">{e.item} · {typeLabel[e.type]}</div>
        </div>
        <div className={`amt ${e.type}`}>
          {sign}৳{e.amount}
        </div>
      </div>
    );
  };

  return (
    <div className="device">
      {/* Red Margin Line */}
      <div className="margin-rule" />

      {/* Header */}
      <header>
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

      {/* Main Content Body */}
      <main>
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
            <div className="grid-label">দ্রুত দেখুন</div>
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

            {ledger.length ? (
              ledger.slice().reverse().slice(0, 2).map(rowHTML)
            ) : (
              <div className="empty-note">এখনো কোনো হিসাব লেখা হয়নি</div>
            )}
          </>
        )}

        {/* Screen 2: BAKI Summary */}
        {screen === "baki" && (
          <div>
            <div className="baki-total">
              <div className="num">৳{bakiTotal}</div>
              <div className="lbl">মোট বাকি পাওনা</div>
            </div>
            {Object.entries(bakiByCust).filter(([, v]) => v > 0).length ? (
              Object.entries(bakiByCust)
                .filter(([, v]) => v > 0)
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
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0,
                          marginTop: '2px'
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
                              padding: '4px 10px',
                              borderRadius: '6px',
                              textDecoration: 'none',
                              fontSize: '11px',
                              fontWeight: 'bold'
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
              <div className="empty-note">কারো কাছে বাকি নেই</div>
            )}
          </div>
        )}

        {/* Screen 3: SALES Breakdown */}
        {screen === "sales" && (
          <div>
            {ledger.filter((e) => e.type === "sale" || e.type === "poroshod").length ? (
              ledger
                .filter((e) => e.type === "sale" || e.type === "poroshod")
                .slice()
                .reverse()
                .map(rowHTML)
            ) : (
              <div className="empty-note">এখনো বিক্রি নেই</div>
            )}
          </div>
        )}

        {/* Screen 4: CUSTOMERS */}
        {screen === "customers" && (
          <div>
            {(() => {
              const byCust = {};
              ledger.forEach((e) => {
                byCust[e.customer] = byCust[e.customer] || { count: 0, balance: 0 };
                byCust[e.customer].count++;
                if (e.type === "baki") byCust[e.customer].balance += e.amount;
                if (e.type === "poroshod") byCust[e.customer].balance -= e.amount;
              });
              const rows = Object.entries(byCust);
              return rows.length ? (
                rows.map(([name, d]) => (
                  <div key={name} className="cust-row">
                    <div>
                      <div className="name">{name}</div>
                      <div className="meta">{d.count}টি লেনদেন</div>
                    </div>
                    <div className={`bal ${d.balance > 0 ? "owe" : "clear"}`}>
                      {d.balance > 0 ? "৳" + d.balance + " বাকি" : "পরিষ্কার"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-note">এখনো কোনো কাস্টমার নেই</div>
              );
            })()}
          </div>
        )}

        {/* Screen 5: ALL Transactions */}
        {screen === "all" && (
          <div>
            {ledger.length ? (
              ledger.slice().reverse().map(rowHTML)
            ) : (
              <div className="empty-note">এখনো কোনো হিসাব লেখা হয়নি</div>
            )}
          </div>
        )}
      </main>

      {/* Centered & Enlarged FAB Mic Button */}
      <div className="fab" onClick={startListening} title="কথা বলুন / হিসাব যোগ করুন">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" stroke="#1E2A38" strokeWidth="1.8"/>
          <path d="M19 11a7 7 0 0 1-14 0M12 18v3" stroke="#1E2A38" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Mic Listening / "Ja Shunlam" Preview Overlay Sheet */}
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
  );
}
