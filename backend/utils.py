import re
from typing import List, Optional

class SilenceGate:
    """
    Buffers incoming partial transcripts and releases them only when a complete sentence is detected.
    This prevents sending incomplete context to the LLM and saves API calls.
    """
    def __init__(self):
        self.buffer = ""
        # Regex for sentence endings (., !, ?) followed by space or end of string
        self.sentence_end_pattern = re.compile(r'(?<=[.!?])\s+')

    def process_chunk(self, text: str) -> List[str]:
        """
        Appends new text to buffer and returns a list of complete sentences found.
        Remaining incomplete text stays in the buffer.
        """
        self.buffer += " " + text
        self.buffer = self.buffer.strip()

        sentences = []
        
        # Split by sentence delimiters
        parts = self.sentence_end_pattern.split(self.buffer)
        
        # If we have more than one part, it means we found at least one sentence delimiter
        if len(parts) > 1:
            # All parts except the last one are complete sentences
            sentences = parts[:-1]
            # The last part is the start of the next sentence (or empty)
            self.buffer = parts[-1]
        
        return sentences

    def flush(self) -> str:
        """
        Returns whatever is left in the buffer.
        """
        remaining = self.buffer
        self.buffer = ""
        return remaining
