Mudi Dokan Khata

Voice-first digital khata — Project Plan & Build Spec

Build with Gemma @ Bangladesh Hybrid Hackathon ’26 — Native Audio & Voice Track



1. Overview

Mudi Dokan Khata is a voice-first bookkeeping app for small Bangladeshi shop owners. The shopkeeper speaks a transaction naturally in Bangla — a sale, a customer taking baki (credit), or a payment against existing baki — and the app turns that speech directly into a structured ledger entry, with no typing at any point.

The product's identity is built around the ta‍li khata: the ruled paper ledger book shop owners already use. The interface is designed to feel like that physical book — not like a generic app that happens to log numbers.

1.1 Track & official scope

Track: Native Audio & Voice — “best application leveraging Gemma 4's native audio processing”

Localized theme: Voice-First “Mudi Dokan” Bookkeeper

Why this fits: Gemma 4's native audio input turns raw speech directly into structured data in one pass — no separate transcription step — which is exactly what the track rewards

1.2 What makes this submission distinct

Beyond-chatbot requirement is satisfied structurally: the model's output is a ledger row, not a conversation

Local-context grounding: baki (informal credit) is a real, specific Bangladeshi shopkeeper behavior — not a generic “bookkeeping app” feature

The physical-khata art direction and page-turn interaction make the demo memorable on sight, before a judge even hears the pitch

2. Problems Being Solved

No structured record-keeping — sales and baki are tracked from memory or in a paper khata, with no history to show a bank or resolve disputes

Typing is a barrier, not a feature — a POS-style app that needs taps and menus mid-transaction doesn't get adopted

Speech is messy and ambiguous — one sentence can mix a customer name, an amount, an item, and a transaction type, all code-switched and informal

Same customer, different phrasing — “Karim bhai” and “Karim” need to resolve to one ledger identity, not fork into two

Numbers spoken informally can be misheard — a bad transcription should never silently corrupt the ledger

Trust in a black box — the shopkeeper needs to see what was understood before it's saved

3. Signature Experience — the Full Interaction Flow

This is the sequence the team is building toward. Each numbered step below is a distinct build task.

3.1 App open

A short (2–3 second) pre-rendered video plays: a physical khata book cover opening. Muted autoplay, tap anywhere to skip.

Video transitions directly into the home screen (revenue card + quick-action grid + recent entries) already prototyped.

3.2 Recording a transaction

Shopkeeper taps the mic (floating action button).

All homepage components (revenue card, grid, recent list) hide. Only the khata page background remains, full screen.

A listening indicator (waveform) appears over the bare page while audio is captured.

Audio is sent to the backend, which calls Gemma 4 (native audio input) and gets back structured fields: customer, item, amount, type, confidence.

A “Ja Shunlam” (“what I heard”) card appears over the khata background, showing the parsed fields with Confirm / Re-record actions. Low-confidence results are flagged instead of silently accepted.

3.3 Confirmation animation — the signature moment

On Confirm, a single choreographed sequence plays (built as one GSAP timeline):

The current day's khata page is shown at a zoomed-out level, with that day's existing entries visible as handwritten-style rows.

The view zooms into the next empty line on the page.

The new entry is written into that empty space with a brief ink-appearing animation (progressive reveal, not an instant paste).

The view zooms back out, revealing the full day's page with the new entry now included.

Build note: a full stroke-by-stroke ink animation (tracing individual letters like a pen) requires converting text to SVG paths and is a stretch goal. The one-day-feasible version is a fast progressive text reveal with a subtle ink-blot flourish at the end of the entry — visually reads as “being written” without the added complexity.

3.4 Browsing other days

Changing the date triggers a page-turn transition (via StPageFlip) — the current page visually flips like a real book, landing on the selected date's page with that day's entries already written in.

Each page always represents one calendar day's hishabs (transactions), matching how a physical khata is actually organized.

4. Visual & Art Direction

4.1 Identity

Reference: an actual tali khata book — ruled paper, a red vertical margin line, a stitched spine, aged paper tone.

Ink-color convention carried over from the existing mockup: red = baki (owed to shopkeeper), green = cash sale, navy = payment received. This mirrors how shopkeepers already mark their paper ledgers, so it needs no explanation.

4.2 Typography

Display / brand: Baloo Da 2 (Bengali, bold, rounded — close to hand-painted shop signage)

UI text: Hind Siliguri (clean Bengali UI sans)

Written ledger entries: a Bangla handwriting-style face (shortlist to test: Ranga, Atma) — pick one during the design pass, prioritizing legibility over decoration

Data / amounts: JetBrains Mono, for a stamped-receipt numeric feel

4.3 Assets to prepare

Khata page background art (paper texture + ruled lines + margin, matching the existing mockup CSS but exported as a real image/illustration for animation layering)

Intro video: fastest path is real stop-motion phone footage of a physical khata book opening, lightly color-graded to match the app's palette

5. System Architecture

Browser (mic capture) → FastAPI backend → Gemma 4 (E4B or 12B, native audio) → structured JSON returned → backend resolves customer identity (fuzzy match) and writes to SQLite → frontend renders the confirmation card, then the write-in animation, then the updated khata page.

5.1 A critical model-hosting decision

Google AI Studio's hosted playground currently only serves the Gemma 4 31B and 26B MoE sizes. Native audio input is only available on the E2B, E4B, and 12B (Unified) sizes. This means the team cannot simply call Gemma through the default AI Studio API — the model has to be run directly:

Recommended: run Gemma 4 E4B or 12B via a Hugging Face transformers pipeline (task="any-to-any") on a Kaggle Notebook, which gives a free GPU and fits naturally since Kaggle is already the hackathon's official platform. Wrap it in a small FastAPI/Flask server and expose it with ngrok or a Cloudflare Tunnel.

Backup: if a teammate has a GPU laptop (16GB+ VRAM or unified memory for the 12B, less for E4B), run it locally via Ollama for lower latency and a true offline demo path.

Action item for hour one: send one real audio clip through the chosen path before building anything on top of it, to confirm the audio-in → JSON-out call actually works as expected.

5.2 Data model



6. Tech Stack



7. Project Structure
```
mudi-dokan/
├── frontend/
│   ├── public/
│   │   ├── intro-video.mp4
│   │   ├── khata-page-bg.png
│   │   └── fonts/
│   ├── src/
│   │   ├── components/
│   │   │   ├── IntroAnimation.jsx
│   │   │   ├── HomeScreen.jsx
│   │   │   ├── RevenueCard.jsx
│   │   │   ├── QuickActionGrid.jsx
│   │   │   ├── MicButton.jsx
│   │   │   ├── ListeningOverlay.jsx
│   │   │   ├── ConfirmationCard.jsx        // "Ja Shunlam"
│   │   │   ├── WriteInAnimation.jsx        // GSAP zoom-write-zoom sequence
│   │   │   ├── KhataPage.jsx               // renders one day's page
│   │   │   ├── PageFlipView.jsx            // StPageFlip wrapper, date nav
│   │   │   ├── BakiScreen.jsx
│   │   │   ├── SalesScreen.jsx
│   │   │   └── CustomersScreen.jsx
│   │   ├── hooks/
│   │   │   ├── useAudioRecorder.js
│   │   │   └── useLedgerData.js
│   │   ├── api/client.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
├── backend/
│   ├── main.py                    // FastAPI app
│   ├── routers/
│   │   ├── transcribe.py
│   │   └── ledger.py
│   ├── models.py                  // SQLAlchemy models
│   ├── schemas.py                 // Pydantic schemas
│   ├── services/
│   │   ├── gemma_client.py        // calls the model server
│   │   └── customer_matcher.py    // RapidFuzz matching
│   ├── db.py
│   └── requirements.txt
├── model-server/                  // runs on Kaggle Notebook or local GPU
│   ├── gemma_audio_pipeline.py
│   └── requirements.txt
└── README.md
```


8. Team Role Split (4 people)

Person A — AI / model pipeline: model-server/, gemma_client.py, prompt and JSON schema design, testing against real varied Bangla phrases

Person B — Backend: FastAPI app, routers, database models, customer fuzzy-matching

Person C — Frontend (core screens): home screen, revenue card, quick-action grid, baki/sales/customers screens — largely carried over from the existing mockup

Person D — Frontend (motion & art direction): intro video, mic-hides-UI transition, confirmation card, the write-in GSAP sequence, the StPageFlip date navigation, khata background art

9. Build Timeline



10. Risks & Fallbacks

Model hosting: Kaggle notebook sessions and tunnels can drop — keep a local Ollama fallback ready on one laptop

Audio model mix-up: don't build against AI Studio's default 31B/26B endpoint — it doesn't accept audio. Verify the real path in hour one

Animation scope creep: the write-in and page-flip sequences are the most time-expensive part of the build — get the functional core (voice → ledger) working first, then layer animation with a feature flag to fall back to instant transitions if time runs short

Live demo network risk: if the model is cloud-hosted, have a recorded backup video of one full successful run in case connectivity fails during judging

11. Demo Script (draft)

Open the app cold — let the khata book-opening video play once, unprompted

Tap the mic and speak a clean sale in Bangla — show the Ja Shunlam confirmation, then the full write-in animation

Speak a baki (credit) transaction for a new customer — point out the red-ink convention appearing

Speak a payment against that same customer's baki — show the baki total updating down

Deliberately speak an ambiguous/mumbled amount — show the low-confidence flag catching it instead of silently logging a wrong number

Change the date to show the page-turn transition and a previous day's entries

Close on the “who owes me” baki screen — the clearest single-screen pitch for why this matters to a real shop owner