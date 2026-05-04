# CogniGuard — Real-Time Agentic Negotiation HUD

![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js%2015-000000?logo=nextdotjs&logoColor=white)
![WebSockets](https://img.shields.io/badge/WebSockets-4A90E2?logo=socketdotio&logoColor=white)
![Groq](https://img.shields.io/badge/Groq%20Llama%203-F55036?logo=meta&logoColor=white)
![Deepgram](https://img.shields.io/badge/Deepgram-13EF93?logo=deepgram&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)

🔗 **Live demo:** https://cogni-guard-gxmd-gu5b28euj-khalid-hussains-projects-3458aa41.vercel.app/

---

## Overview

CogniGuard is a real-time agentic heads-up display for high-stakes conversations — negotiations, debates, sales calls, interviews. It listens to live audio, transcribes it as the other side speaks, runs each utterance through an LLM that detects logical fallacies and emotional manipulation, and surfaces counter-arguments + intervention prompts in the UI before you have to respond.

The whole loop — mic → transcript → reasoning → on-screen card — runs in under a second over WebSockets, so the HUD stays in step with the conversation rather than catching up after it.

## How it works

```
   ┌──────────┐   audio   ┌──────────────┐   text    ┌──────────────┐   verdict   ┌─────────┐
   │   Mic    │──────────▶│   Deepgram   │──────────▶│  FastAPI WS  │────────────▶│   HUD   │
   │ (browser)│  WebRTC   │  (real-time  │  partial  │  Orchestrator│   fallacy   │ (Next15)│
   └──────────┘           │     STT)     │  + final  │              │   + counter │         │
                          └──────────────┘           └──────┬───────┘             └─────────┘
                                                            │
                                                            ▼
                                                    ┌────────────────┐
                                                    │  Groq Llama 3  │
                                                    │  fallacy + tone│
                                                    │  + intervention│
                                                    └────────────────┘
```

1. The browser captures the mic and streams chunks over a WebSocket.
2. The FastAPI orchestrator forwards them to Deepgram for streaming transcription.
3. Each finalized utterance is sent to Groq (Llama 3) with a structured prompt asking for: detected fallacies, sentiment, and a suggested counter.
4. The verdict is pushed back over the WebSocket and rendered as a card in the intervention deck.

## Features

- **Fallacy detection** — ad hominem, straw man, false dilemma, anchoring, appeal to fear, and ~15 other patterns flagged with severity + explanation.
- **Sentiment / tone analysis** — tracks emotional escalation across the conversation, not just per-utterance.
- **Live transcript** — partial + final transcription, color-coded by speaker.
- **Intervention deck** — stack of cards with the detected issue, a one-line counter you can use verbatim, and a longer explanation if you want to dig in.
- **Sub-second latency** — Groq's inference speed is the entire reason this works in real time; switching to a slower provider breaks the UX.
- **Stateless server, stateful client** — the FastAPI side keeps no session memory; the HUD is the source of truth for what's been said and what's been flagged.

## Tech stack

| Layer | Choice |
|-------|--------|
| Frontend | Next.js 15 · React · Tailwind · Framer Motion · Recharts |
| Backend | FastAPI · WebSockets · Python 3.10+ |
| STT | Deepgram (streaming) |
| Reasoning | Groq · Llama 3 |

## Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- API keys: **Deepgram**, **Groq**

### 1. Clone & configure

```bash
git clone https://github.com/Khalid147-alt/Cogni-Guard.git
cd Cogni-Guard
cp .env.example .env
# Edit .env and add DEEPGRAM_API_KEY and GROQ_API_KEY
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
python server.py
```

Backend listens on `http://localhost:8000` and exposes the WebSocket at `/ws`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`, click **Activate Guard**, grant microphone permission, and start talking.

## Environment variables

| Variable | Where | Required | Notes |
|----------|-------|----------|-------|
| `DEEPGRAM_API_KEY` | backend `.env` | yes | Streaming STT — free tier available at deepgram.com |
| `GROQ_API_KEY` | backend `.env` | yes | LPU-backed Llama 3 inference at console.groq.com |
| `NEXT_PUBLIC_WS_URL` | frontend `.env.local` | no | Defaults to `ws://localhost:8000/ws` |

## Deployment

Frontend is deployed on Vercel (see live demo link above). The backend is intended to run on a host that supports persistent WebSocket connections — Railway, Fly.io, or Render all work; serverless platforms with short timeouts (e.g. default Vercel functions) do not.

A typical production setup:

1. Deploy `backend/` to Railway. Set `DEEPGRAM_API_KEY` and `GROQ_API_KEY`.
2. Note the public WSS URL Railway gives you.
3. Deploy `frontend/` to Vercel with `NEXT_PUBLIC_WS_URL=wss://your-railway-url/ws`.

## License

MIT
