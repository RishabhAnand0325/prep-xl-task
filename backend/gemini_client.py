import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class GeminiStreamer:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.5-flash-lite')

    async def transcribe_chunk(self, audio_bytes):
        try:
            response = await self.model.generate_content_async([
                """
                You are a professional transcriber. 
                Transcribe the spoken words in this audio clearly. 
                If there are no words, return nothing.
                Do not add timestamps or descriptions like [Silence].
                """,
                {
                    "mime_type": "audio/webm",
                    "data": audio_bytes
                }
            ])
            return response.text.strip() + " "
        except Exception as e:
            print(f"Gemini Error: {e}")
            return ""