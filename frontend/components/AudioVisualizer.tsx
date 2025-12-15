'use client';
import { useEffect, useRef } from 'react';

interface VisualizerProps {
  stream: MediaStream | null;
}

export default function AudioVisualizer({ stream }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!stream || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256; 
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 80;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 15, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 15, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
      const bars = bufferLength;
      const step = (Math.PI * 2) / bars;

      for (let i = 0; i < bars; i++) {
        const barHeight = (dataArray[i] / 255) * 80; 

        const rads = step * i;
        const x1 = centerX + Math.cos(rads) * radius;
        const y1 = centerY + Math.sin(rads) * radius;
        const x2 = centerX + Math.cos(rads) * (radius + barHeight);
        const y2 = centerY + Math.sin(rads) * (radius + barHeight);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        const hue = i * 2 + 220;
        ctx.strokeStyle = `hsla(${hue}, 80%, 60%, 0.8)`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioCtx.state !== 'closed') audioCtx.close();
    };
  }, [stream]);

  return (
    <div className="relative w-[400px] h-[400px] flex items-center justify-center">
      <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full animate-pulse" />
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400} 
        className="relative z-10"
      />
    </div>
  );
}