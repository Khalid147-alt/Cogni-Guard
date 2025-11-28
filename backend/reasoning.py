import os
import json
import logging
from groq import Groq
import google.generativeai as genai
from typing import Dict, Any

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are a Fallacy Detection Expert. Your task is to analyze the provided text for logical fallacies, manipulation attempts, or cognitive biases.
Output MUST be a valid JSON object with the following structure:
{
    "fallacy_detected": boolean,
    "fallacy_name": string (or null if none),
    "counter_argument": string (short and punchy, or null if none),
    "risk_score": integer (1-100, where 1 is safe and 100 is high manipulation risk)
}
If no fallacy is detected, set "fallacy_detected" to false, "risk_score" to a low value (e.g., < 20), and others to null.
Analyze strictly and quickly.
"""

class ReasoningAgent:
    def __init__(self, provider: str = "groq"):
        self.provider = provider
        self.groq_client = None
        self.gemini_model = None

        if self.provider == "groq":
            api_key = os.getenv("GROQ_API_KEY")
            if not api_key:
                logger.warning("GROQ_API_KEY not found, falling back to Gemini if available or failing.")
            else:
                self.groq_client = Groq(api_key=api_key)
        
        if self.provider == "gemini" or not self.groq_client:
            api_key = os.getenv("GOOGLE_API_KEY")
            if api_key:
                genai.configure(api_key=api_key)
                self.gemini_model = genai.GenerativeModel('gemini-1.5-flash', system_instruction=SYSTEM_PROMPT)
                self.provider = "gemini"
            else:
                if not self.groq_client:
                    raise ValueError("No valid API keys found for Groq or Gemini.")

    async def analyze(self, text: str) -> Dict[str, Any]:
        """
        Analyzes the text for fallacies using the selected provider.
        """
        if not text or len(text.strip()) < 5:
            return {"fallacy_detected": False, "risk_score": 0}

        try:
            if self.provider == "groq" and self.groq_client:
                return self._analyze_groq(text)
            elif self.provider == "gemini" and self.gemini_model:
                return self._analyze_gemini(text)
            else:
                logger.error("No provider configured.")
                return {"error": "No provider configured"}
        except Exception as e:
            logger.error(f"Error in reasoning: {e}")
            return {"error": str(e)}

    def _analyze_groq(self, text: str) -> Dict[str, Any]:
        completion = self.groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Analyze this statement: \"{text}\""}
            ],
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        content = completion.choices[0].message.content
        return json.loads(content)

    def _analyze_gemini(self, text: str) -> Dict[str, Any]:
        response = self.gemini_model.generate_content(f"Analyze this statement: \"{text}\"")
        # Gemini might not always return pure JSON without markdown code blocks, so we clean it
        content = response.text
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
        return json.loads(content.strip())
