const API_BASE = "http://localhost:8000/api";

export async function fetchLedger() {
    const res = await fetch(`${API_BASE}/ledger`);
    if (!res.ok) throw new Error("Failed to fetch ledger");
    return await res.json();
}

export async function fetchCustomers() {
    const res = await fetch(`${API_BASE}/customers`);
    if (!res.ok) throw new Error("Failed to fetch customers");
    return await res.json();
}

export async function createTransaction(txData) {
    const res = await fetch(`${API_BASE}/ledger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txData)
    });
    if (!res.ok) throw new Error("Failed to create transaction");
    return await res.json();
}

export async function transcribeAudio(audioBlob = null, text = null) {
    const formData = new FormData();
    if (audioBlob) {
        formData.append("file", audioBlob, "audio.wav");
    }
    if (text) {
        formData.append("text", text);
    }
    
    const res = await fetch(`${API_BASE}/transcribe`, {
        method: "POST",
        body: formData
    });
    
    if (!res.ok) throw new Error("Failed to transcribe audio");
    return await res.json();
}
