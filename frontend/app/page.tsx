'use client';

import useAudioStream from '../hooks/useAudioStream';
import AudioVisualizer from '../components/AudioVisualizer';
import TranscriptionBox from '../components/TranscriptionBox';

export default function Home() {
  const { isRecording, transcript, stream, startRecording, stopRecording } = useAudioStream();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-dark-mesh z-0 opacity-80" />

      <div className="z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-center justify-center space-y-10">
            <div className="glass-panel p-2 w-[420px] h-[420px] flex items-center justify-center relative group transition-all duration-500 hover:shadow-[0_0_40px_rgba(124,58,237,0.3)]">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                
                <div className="relative w-full h-full bg-black/40 rounded-xl flex items-center justify-center backdrop-blur-xl overflow-hidden">
                   {isRecording ? (
                     <AudioVisualizer stream={stream} />
                   ) : (
                     <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                            </svg>
                        </div>
                        <div className="text-gray-400 font-light tracking-widest text-sm">
                            WAITING FOR INPUT
                        </div>
                     </div>
                   )}
                </div>
            </div>
            <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`glass-btn px-10 py-4 rounded-full font-semibold tracking-wide text-white flex items-center gap-4 shadow-lg ${
                    isRecording 
                    ? 'bg-red-500/10 border-red-500/40 hover:bg-red-500/20' 
                    : 'bg-emerald-500/10 border-emerald-500/40 hover:bg-emerald-500/20'
                }`}
            >
                {isRecording ? (
                    <>
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        STOP RECORDING
                    </>
                ) : (
                    <>
                        <span className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]"/>
                        START MICROPHONE
                    </>
                )}
            </button>
        </div>
        <TranscriptionBox text={transcript} />

      </div>
    </main>
  );
}