# কত বাকি (Koto Baki)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

A voice-first digital khata (ledger) built for small Bangladeshi shop owners. 

Instead of typing out transactions, shopkeepers can simply speak them naturally in Bangla—whether it's a cash sale, a customer taking *baki* (credit), or a payment against existing *baki*. The application leverages **Gemma 4's native audio processing** to instantly parse the speech and convert it into a structured ledger entry.

> [!NOTE]
> This project was developed as part of the **Gemma @ Bangladesh Hybrid Hackathon ’26 (Native Audio & Voice Track)**.

## Key Features

- **Voice-First Input:** Speak transactions naturally; no manual data entry or complex POS interfaces required.
- **Physical Khata Experience:** The UI is designed to mimic a traditional ruled paper ledger (*tali khata*), complete with page-turn animations and handwritten-style entries.
- **Smart Parsing:** Handles informal speech, code-switching, and extracts key fields (customer name, item, amount, transaction type) automatically.
- **Confidence Checks:** Low-confidence interpretations from the model are flagged for user confirmation before being saved to the ledger.

## Architecture & Tech Stack

The application is split into a frontend UI, a backend API, and a model server for processing audio.

- **Frontend:** React, Vite, GSAP (for animations), and React Pageflip.
- **Backend:** Python, FastAPI, SQLite (with SQLAlchemy).
- **AI / ML:** Gemma 4 (E4B or 12B) utilizing native audio input.

## Getting Started

To run the project locally, you will need to set up both the backend server and the frontend development server.

### Prerequisites

- Node.js (v18+)
- Python (3.10+)
- A running instance of the Gemma 4 audio model pipeline (typically hosted via a Kaggle notebook or locally via Hugging Face/Ollama).

### 1. Start the Backend API

The backend relies on FastAPI and SQLite to store your ledger data.

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

> [!TIP]
> By default, the backend will run on `http://localhost:8000`. Ensure that your environment variables or model server configurations are pointing to your active Gemma 4 instance.

### 2. Start the Frontend Application

The frontend is a Vite-powered React app.

```bash
# In the root directory of the project
npm install
npm run dev
```

> [!IMPORTANT]
> The frontend development server usually starts on `http://localhost:5173`. Open this URL in your browser to experience the digital khata interface.
