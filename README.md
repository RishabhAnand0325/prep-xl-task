#  AI Real-Time Audio Visualizer & Transcriber

A high-performance full-stack application that combines stunning real-time audio visualization with live AI-powered transcription. The project uses the **Web Audio API** for the circular equalizer and streams audio chunks to **Google's Gemini 1.5 Flash** model via a **FastAPI** WebSocket backend for near-instant transcription.

##  Features

* **Stunning UI:** Modern Glassmorphism design using **Tailwind CSS v4**.
* **Real-Time Visualization:** Custom circular frequency equalizer rendering at 60 FPS using HTML5 Canvas and the Web Audio API.
* **Live Transcription:** Captures microphone input and streams it to Google Gemini for accurate speech-to-text conversion.
* **Low Latency:** Uses a "Looping Recorder" strategy (1-second chunks) to balance real-time feedback with high AI accuracy.
* **WebSocket Architecture:** Full-duplex communication between the Next.js frontend and Python backend.

##  Tech Stack

### Frontend
* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS v4
* **Audio:** Web Audio API, MediaStream API
* **Language:** TypeScript

### Backend
* **Server:** Python FastAPI
* **Protocol:** WebSockets
* **AI Model:** Google Gemini 1.5 Flash (`google-generativeai`)
* **Processing:** AsyncIO

##  Project Structure

```bash
fullstack-interview-assignment/
├── backend/                 # Python FastAPI Server
│   ├── main.py              # WebSocket entry point & logic
│   ├── gemini_client.py     # Gemini API integration
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # API Keys
├── frontend/                # Next.js Application
│   ├── app/                 # Pages & Layouts
│   ├── components/          # Visualizer & Transcription UI
│   ├── hooks/               # Custom Audio & WebSocket Hooks
│   └── tailwind.config.ts   # (Legacy config, moved to CSS variables in v4)
└── README.md

```

##  Getting Started

Follow these instructions to run the project locally.

### Prerequisites
* **Node.js** (v18+)
* **Python** (v3.9+)
* **Google Gemini API Key** (Get it [here](https://aistudio.google.com/app/apikey))

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Create and activate a virtual environment:
    ```bash
    # Windows
    python -m venv venv
    venv\Scripts\activate

    # macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Create a `.env` file in the `backend/` folder and add your API key:
    ```env
    GOOGLE_API_KEY=your_gemini_api_key_here
    ```

5.  Start the FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```
    *The server will start at `http://localhost:8000`.*

### 2. Frontend Setup

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the Next.js development server:
    ```bash
    npm run dev
    ```
    *The application will start at `http://localhost:3000`.*

---

##  Usage Guide

1.  **Launch:** Open `http://localhost:3000` in your web browser.
2.  **Permissions:** Click "Start Microphone" and allow browser microphone access.
3.  **Visualize:** Speak into your microphone. The circular visualizer will react instantly to the frequency of your voice.
4.  **Transcribe:** Watch the glass panel on the right. Your speech will be transcribed and displayed in real-time chunks (approx. every 1 second).

---

##  Troubleshooting & Optimization

### Why is there a slight delay in transcription?
To ensure high accuracy, we do not stream raw bytes (which causes AI hallucinations). Instead, we use a **"Looping Recorder"** that slices audio into valid 1-second WebM files. This introduces a ~1-second latency but ensures the transcription is accurate and meaningful.

### Common Errors

* **`WebSocket connection failed`**:
    * Ensure the backend server is running on port `8000`.
    * Check console logs for CORS errors (CORS is configured for `localhost:3000` by default).

* **`401 Unauthorized` / API Errors**:
    * Verify your `GOOGLE_API_KEY` in the `backend/.env` file is correct and has active quota.

* **Visualizer is flat/not moving**:
    * Ensure you have selected the correct microphone input in your browser settings.
    * Check if the system volume is not muted.

---

##  License

This project is created by **Rishabh Anand** as a Pre-Interview Assignment.
