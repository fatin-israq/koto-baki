// Mock Database for Mudi Dokan Khata

export const INITIAL_SHOP_INFO = {
  name: "মেসার্স রহিম স্টোর",
  owner: "মোঃ রহিম উল্লাহ",
  address: "কারওয়ান বাজার, ঢাকা",
  phone: "01711-234567",
  established: "২০১৫",
  activeYear: "২০২৬"
};

export const INITIAL_CUSTOMERS = [
  {
    id: "cust-1",
    name: "আব্দুল করিম",
    displayName: "করিম ভাই",
    phone: "01819-987654",
    address: "বাসা ১২, রোড ৪, কারওয়ান বাজার",
    totalBaki: 1250,
    lastTransactionDate: "২০২৬-০৭-২৬",
    trustScore: "উত্তম",
    avatarColor: "#C62828"
  },
  {
    id: "cust-2",
    name: "শাহ আলম",
    displayName: "শাহ আলম সাহেব",
    phone: "01730-112233",
    address: "দোকান ৪, সবজি মার্কেট",
    totalBaki: 3400,
    lastTransactionDate: "২০২৬-০৭-২৫",
    trustScore: "মাঝারি",
    avatarColor: "#D84315"
  },
  {
    id: "cust-3",
    name: "মোঃ জসিম উদ্দিন",
    displayName: "জসিম মাস্টার",
    phone: "01912-334455",
    address: "কারওয়ান বাজার প্রাইমারি স্কুল",
    totalBaki: 680,
    lastTransactionDate: "২০২৬-০৭-২৬",
    trustScore: "উত্তম",
    avatarColor: "#1565C0"
  },
  {
    id: "cust-4",
    name: "ফারুক হোসেন",
    displayName: "ফারুক ড্রাইভার",
    phone: "01680-556677",
    address: "বাস টার্মিনাল গ্যারেজ",
    totalBaki: 2150,
    lastTransactionDate: "২০২৬-০৭-২৪",
    trustScore: "ঝুঁকিপূর্ণ",
    avatarColor: "#AD1457"
  },
  {
    id: "cust-5",
    name: "রফিকুল ইসলাম",
    displayName: "রফিক ভাই",
    phone: "01552-889900",
    address: "মৌচাক গলি",
    totalBaki: 0,
    lastTransactionDate: "২০২৬-০৭-২৬",
    trustScore: "উত্তম",
    avatarColor: "#2E7D32"
  }
];

// Transactions organized by date (YYYY-MM-DD)
export const INITIAL_TRANSACTIONS = {
  "2026-07-26": [
    {
      id: "tx-101",
      time: "সকাল ০৯:১৫",
      customer: "করিম ভাই",
      customerId: "cust-1",
      item: "১ কেজি চিনি ও ১ প্যাকেট চা পাতা",
      amount: 220,
      type: "BAKI", // BAKI | NOGOD | PAYMENT
      notes: "বাকী হিসাব",
      confidence: 0.98
    },
    {
      id: "tx-102",
      time: "সকাল ১০:৩০",
      customer: "নগদ খদ্দের",
      customerId: null,
      item: "২ লিটার রূপচাঁদা সয়াবিন তেল",
      amount: 380,
      type: "NOGOD",
      notes: "ক্যাশ বিক্রি",
      confidence: 0.99
    },
    {
      id: "tx-103",
      time: "দুপুর ১২:১০",
      customer: "জসিম মাস্টার",
      customerId: "cust-3",
      item: "আগের বাকী পরিশোধ",
      amount: 500,
      type: "PAYMENT",
      notes: "ক্যাশ গ্রহণ",
      confidence: 0.97
    },
    {
      id: "tx-104",
      time: "দুপুর ০২:৪৫",
      customer: "রফিক ভাই",
      customerId: "cust-5",
      item: "৫ কেজি মিনিকেট চাল",
      amount: 360,
      type: "NOGOD",
      notes: "ক্যাশ বিক্রি",
      confidence: 0.95
    }
  ],
  "2026-07-25": [
    {
      id: "tx-095",
      time: "সকাল ০৮:৪৫",
      customer: "শাহ আলম সাহেব",
      customerId: "cust-2",
      item: "১ বস্তা আটা (৫০ কেজি)",
      amount: 2200,
      type: "BAKI",
      notes: "দোকানের জন্য বাকী",
      confidence: 0.96
    },
    {
      id: "tx-096",
      time: "দুপুর ০১:২০",
      customer: "নগদ খদ্দের",
      customerId: null,
      item: "মশলার প্যাকেট ও গুঁড়ো দুধ",
      amount: 450,
      type: "NOGOD",
      notes: "নগদ বিক্রি",
      confidence: 0.99
    },
    {
      id: "tx-097",
      time: "বিকেল ০৫:১০",
      customer: "করিম ভাই",
      customerId: "cust-1",
      item: "আগের জমা বাবদ",
      amount: 1000,
      type: "PAYMENT",
      notes: "নগদ জমা",
      confidence: 0.98
    }
  ],
  "2026-07-24": [
    {
      id: "tx-088",
      time: "সকাল ১০:০০",
      customer: "ফারুক ড্রাইভার",
      customerId: "cust-4",
      item: "ডিটারজেন্ট ও সাবান কেস",
      amount: 1150,
      type: "BAKI",
      notes: "বাকী নেওয়া হলো",
      confidence: 0.94
    },
    {
      id: "tx-089",
      time: "বিকাল ০৪:৩০",
      customer: "নগদ খদ্দের",
      customerId: null,
      item: "ডাল, পেঁয়াজ ও রসুন",
      amount: 620,
      type: "NOGOD",
      notes: "ক্যাশ বিক্রি",
      confidence: 0.98
    }
  ]
};

// Test preset Bangla audio prompts for judging/demoing
export const VOICE_PRESETS = [
  {
    id: "preset-1",
    label: "করিম ভাই বাকী নিল",
    spokenText: "করিম ভাই ৫০ টাকার চিনি বাকী নিল",
    parsed: {
      customer: "করিম ভাই",
      customerId: "cust-1",
      item: "চিনি (৫০০ গ্রাম)",
      amount: 50,
      type: "BAKI",
      confidence: 0.97
    }
  },
  {
    id: "preset-2",
    label: "শাহ আলম জমা দিলেন",
    spokenText: "শাহ আলম সাহেব ১০০০ টাকা জমা দিলেন",
    parsed: {
      customer: "শাহ আলম সাহেব",
      customerId: "cust-2",
      item: "বাকী পরিশোধ জমা",
      amount: 1000,
      type: "PAYMENT",
      confidence: 0.98
    }
  },
  {
    id: "preset-3",
    label: "নগদ চাল বিক্রি",
    spokenText: "আজকে ১ বস্তা চাল নগদ ১৪০০ টাকায় বিক্রি হলো",
    parsed: {
      customer: "নগদ খদ্দের",
      customerId: null,
      item: "১ বস্তা মিনিকেট চাল",
      amount: 1400,
      type: "NOGOD",
      confidence: 0.99
    }
  },
  {
    id: "preset-4",
    label: "অস্পষ্ট ভয়েস (লো কনফিডেন্স)",
    spokenText: "হুমম জসিমmaster কিছু একটা বাকী নিল মনে হয় ২০০ টাকা...",
    parsed: {
      customer: "জসিম মাস্টার",
      customerId: "cust-3",
      item: "অস্পষ্ট পণ্য বিবরণ",
      amount: 200,
      type: "BAKI",
      confidence: 0.58 // Low confidence flag
    }
  }
];
