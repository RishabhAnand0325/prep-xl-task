from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import base64
from gemini_client import GeminiStreamer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

gemini_client = GeminiStreamer()

@app.websocket("/ws/transcribe")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Client connected")
    
    try:
        while True:
            raw_message = await websocket.receive_text()
            message_data = json.loads(raw_message)
            
            if "audio" in message_data:
                audio_bytes = base64.b64decode(message_data["audio"])
                
                transcript_chunk = await gemini_client.transcribe_chunk(audio_bytes)
                
                if transcript_chunk:
                    response = { "text": transcript_chunk }
                    await websocket.send_text(json.dumps(response))
            
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error: {e}")
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)