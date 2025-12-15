'use client';

interface TranscriptionBoxProps {
  text: string;
}

export default function TranscriptionBox({ text }: TranscriptionBoxProps) {
  return (
    <div className="glass-panel p-8 h-[500px] flex flex-col relative overflow-hidden group">
      <h2 className="text-xl font-light text-white/80 mb-4 border-b border-white/10 pb-2 tracking-wider">
        LIVE TRANSCRIPTION
      </h2>
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar text-white/80 leading-relaxed font-light font-mono text-sm">
        {text ? (
           <p className="animate-pulse">{text}</p> 
        ) : (
           <span className="text-white/30 italic">Initialize microphone to begin streaming...</span>
        )}
      </div>
      
      {/* Decorative Overlay for glass effect */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
}