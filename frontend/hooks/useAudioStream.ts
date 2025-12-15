import { useState, useRef, useCallback, useEffect } from 'react';

interface UseAudioStreamReturn {
  isRecording: boolean;
  transcript: string;
  stream: MediaStream | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
}

export default function useAudioStream(): UseAudioStreamReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startSlice = (currentStream: MediaStream) => {
    const recorder = new MediaRecorder(currentStream, { mimeType: 'audio/webm' });
    mediaRecorderRef.current = recorder;

    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      if (blob.size > 0 && socketRef.current?.readyState === WebSocket.OPEN) {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64Audio = (reader.result as string).split(',')[1];
            socketRef.current?.send(JSON.stringify({ audio: base64Audio }));
        };
      }
      if (currentStream.active) {
         startSlice(currentStream);
      }
    };

    recorder.start();
    recordingTimeoutRef.current = setTimeout(() => {
      if (recorder.state === 'recording') {
        recorder.stop();
      }
    }, 1000); 
  };

  const startRecording = useCallback(async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(audioStream);
      setIsRecording(true);
      setTranscript(""); 
      socketRef.current = new WebSocket('ws://localhost:8000/ws/transcribe');
      
      socketRef.current.onopen = () => {
        console.log('Connected to Backend');
        startSlice(audioStream);
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.text) {
          setTranscript((prev) => prev + " " + data.text);
        }
      };
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (socketRef.current) {
      socketRef.current.close();
    }

    setIsRecording(false);
    setStream(null);
  }, [stream]);

  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.close();
      if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
    };
  }, []);

  return { isRecording, transcript, stream, startRecording, stopRecording };
}