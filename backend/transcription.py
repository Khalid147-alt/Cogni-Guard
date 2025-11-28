import os
import asyncio
import logging
from deepgram import DeepgramClient
from typing import AsyncGenerator, Callable

logger = logging.getLogger(__name__)

class Transcriber:
    def __init__(self):
        self.api_key = os.getenv("DEEPGRAM_API_KEY")
        if not self.api_key:
            raise ValueError("DEEPGRAM_API_KEY not found in environment variables")
        
        self.client = DeepgramClient(self.api_key)
        self.dg_connection = None

    async def start(self, on_message: Callable[[str], None]):
        """
        Starts the Deepgram Live Transcription connection.
        """
        try:
            self.dg_connection = self.client.listen.asyncwebsocket.v("1")

            def on_message_handler(self, result, **kwargs):
                sentence = result.channel.alternatives[0].transcript
                if len(sentence) > 0:
                    logger.info(f"Deepgram Transcript: {sentence}")
                    on_message(sentence)

            def on_error_handler(self, error, **kwargs):
                logger.error(f"Deepgram Error: {error}")

            self.dg_connection.on("Results", on_message_handler)
            self.dg_connection.on("Error", on_error_handler)

            options = {
                "model": "nova-2",
                "language": "en-US",
                "smart_format": True,
                "interim_results": True, 
                "punctuation": True,
            }

            if await self.dg_connection.start(options) is False:
                logger.error("Failed to connect to Deepgram")
                return False
            
            logger.info("Connected to Deepgram")
            return True

        except Exception as e:
            logger.error(f"Error starting Transcriber: {e}")
            return False

    async def send_audio(self, audio_data: bytes):
        """
        Sends raw audio data to Deepgram.
        """
        if self.dg_connection:
            await self.dg_connection.send(audio_data)

    async def stop(self):
        """
        Closes the connection.
        """
        if self.dg_connection:
            await self.dg_connection.finish()
            self.dg_connection = None
