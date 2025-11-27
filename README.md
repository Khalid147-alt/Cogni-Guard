# CogniGuard

**Real-Time Negotiation & Fallacy Detection HUD**

CogniGuard listens to live audio, transcribes it, detects logical fallacies instantly using LLMs (Groq/Gemini), and displays counter-arguments to the user via a WebSocket-connected frontend.

## Prerequisites

- Python 3.10+
- Node.js 18+
- API Keys: Deepgram, Groq (or Google Gemini)

## Setup in 5 Minutes

### 1. Clone & Configure
```bash
# Clone the repository (if not already)
# cd cogni-guard

# Create .env file
cp .env.example .env
# EDIT .env and add your API keys!
```

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run the Orchestrator
cd backend
python server.py
```
*Backend runs on `http://localhost:8000`*

### 3. Frontend Setup
```bash
# Install Node dependencies
cd frontend
npm install
npm install lucide-react recharts clsx tailwind-merge

# Run the HUD
npm run dev
```
*Frontend runs on `http://localhost:3000`*

## Usage

1. Open `http://localhost:3000`.
2. Click **"Activate Guard"**.
3. Grant microphone permission.
4. Speak (or play audio).
5. Watch the Live Transcript and Fallacy Cards appear in real-time.

## Architecture

- **Frontend**: Next.js 15, Tailwind, Shadcn/UI, Recharts.
- **Backend**: FastAPI, WebSockets.
- **AI**: Deepgram (STT), Groq Llama 3 (Reasoning).
