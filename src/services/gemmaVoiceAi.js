// Gemma 4 Native Audio Extraction Engine Simulator
import { INITIAL_CUSTOMERS, VOICE_PRESETS } from './mockData';

/**
 * Fuzzy matches spoken customer name to existing customer records
 */
export function matchCustomer(spokenName, customerList = INITIAL_CUSTOMERS) {
  if (!spokenName || spokenName.includes("নগদ") || spokenName.includes("অজ্ঞাত")) {
    return { name: "নগদ খদ্দের", id: null, isNew: false };
  }

  const cleanSpoken = spokenName.trim().toLowerCase();

  for (const cust of customerList) {
    const mainName = cust.name.toLowerCase();
    const dispName = cust.displayName.toLowerCase();
    
    // Direct or partial containment check
    if (
      cleanSpoken.includes(mainName) || 
      mainName.includes(cleanSpoken) ||
      cleanSpoken.includes(dispName) ||
      dispName.includes(cleanSpoken)
    ) {
      return { name: cust.displayName, id: cust.id, isNew: false };
    }
  }

  // If no match found, treat as new customer
  return { name: spokenName, id: null, isNew: true };
}

/**
 * Simulates passing raw audio / spoken text into Gemma 4 (Native Audio Input)
 * Returns extracted JSON schema: { customer, customerId, item, amount, type, confidence, rawTranscript }
 */
export async function parseSpokenTransaction(spokenInput, customerList = INITIAL_CUSTOMERS) {
  // Simulate processing delay (800ms) for realistic AI model inference feel
  await new Promise((resolve) => setTimeout(resolve, 850));

  let matchedPreset = null;

  if (typeof spokenInput === "string") {
    matchedPreset = VOICE_PRESETS.find(
      (p) => p.spokenText.toLowerCase() === spokenInput.toLowerCase() || p.id === spokenInput
    );
  }

  if (matchedPreset) {
    const custMatch = matchCustomer(matchedPreset.parsed.customer, customerList);
    return {
      ...matchedPreset.parsed,
      customer: custMatch.name,
      customerId: custMatch.id,
      rawTranscript: matchedPreset.spokenText
    };
  }

  // Heuristic parser for arbitrary free-form spoken Bangla text
  const text = typeof spokenInput === "string" ? spokenInput : "করিম ভাই ২০০ টাকার তেল বাকী নিল";

  // Extract amount (digits or spoken Bengali numbers)
  const digitMatch = text.match(/(\d+)/);
  let amount = digitMatch ? parseInt(digitMatch[1], 10) : 100;

  // Determine transaction type
  let type = "NOGOD";
  if (text.includes("বাকী") || text.includes("বাকি") || text.includes("ধারে") || text.includes("নিল")) {
    type = "BAKI";
  } else if (text.includes("জমা") || text.includes("পরিশোধ") || text.includes("ফেরত") || text.includes("দিল")) {
    type = "PAYMENT";
  }

  // Extract customer name substring
  let customerSpoken = "নগদ খদ্দের";
  if (text.includes("করিম")) customerSpoken = "করিম ভাই";
  else if (text.includes("শাহ আলম")) customerSpoken = "শাহ আলম সাহেব";
  else if (text.includes("জসিম")) customerSpoken = "জসিম মাস্টার";
  else if (text.includes("ফারুক")) customerSpoken = "ফারুক ড্রাইভার";
  else if (text.includes("রফিক")) customerSpoken = "রফিক ভাই";
  else {
    const words = text.split(" ");
    if (words.length > 0 && !words[0].match(/\d+/)) {
      customerSpoken = words[0];
    }
  }

  const custMatch = matchCustomer(customerSpoken, customerList);

  // Extract item description
  let item = "পণ্য ক্রয়";
  if (text.includes("তেল")) item = "সয়াবিন তেল (১ লিটার)";
  else if (text.includes("চিনি")) item = "চিনি (১ কেজি)";
  else if (text.includes("চা")) item = "চা পাতা (২০০ গ্রাম)";
  else if (text.includes("চাল")) item = "মিনিকেট চাল (৫ কেজি)";
  else if (text.includes("আটা")) item = "গম আটা (১ বস্তা)";
  else if (type === "PAYMENT") item = "আগের বাকী জমা পরিশোধ";

  // Determine confidence score
  const isAmbiguous = text.length < 8 || text.includes("হুমম") || text.includes("অস্পষ্ট");
  const confidence = isAmbiguous ? 0.55 : 0.96;

  return {
    customer: custMatch.name,
    customerId: custMatch.id,
    item,
    amount,
    type,
    confidence,
    rawTranscript: text
  };
}
