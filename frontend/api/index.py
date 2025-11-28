import os
import asyncio
import json
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from transcription import Transcriber
from reasoning import ReasoningAgent
from utils import SilenceGate

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("CogniGuard")

app = FastAPI(title="CogniGuard Orchestrator")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for hackathon/dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "CogniGuard Backend is Running"}

@app.websocket("/ws/audio-stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("WebSocket connected")

    transcriber = Transcriber()
    reasoning_agent = ReasoningAgent(provider="groq") # Default to Groq
    silence_gate = SilenceGate()

    async def on_transcript(text: str):
        """
        Callback for when Deepgram returns a transcript.
        """
        # Send raw transcript to UI immediately
        await websocket.send_json({
            "type": "transcript",
            "text": text
        })

        # Process through Silence Gate
        sentences = silence_gate.process_chunk(text)
        
        for sentence in sentences:
            logger.info(f"Analyzing sentence: {sentence}")
            # Analyze with LLM
            analysis = await reasoning_agent.analyze(sentence)
            
            # Send analysis to UI
            await websocket.send_json({
                "type": "analysis",
                "text": sentence,
                "data": analysis
            })

    # Start Transcriber
    started = await transcriber.start(on_transcript)
    if not started:
        await websocket.close(code=1011)
        return

    try:
        while True:
            # Receive audio blob
            data = await websocket.receive_bytes()
            logger.info(f"Received audio chunk: {len(data)} bytes")
            await transcriber.send_audio(data)
            
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        await transcriber.stop()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
