"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

export default function WaveformPlayer({ url }: { url: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Generate some fake waveform bars
  const bars = Array.from({ length: 30 }).map((_, i) => {
    // Generate a pseudo-random height that looks like a waveform
    const height = Math.sin(i * 0.5) * 50 + 50 + Math.random() * 20;
    return height;
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: 'rgba(0,0,0,0.03)', borderRadius: 12 }}>
      <audio ref={audioRef} src={url} preload="metadata" />
      
      <button 
        onClick={togglePlay}
        style={{ 
          width: 40, height: 40, borderRadius: '50%', 
          background: 'var(--primary)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{ marginLeft: 2 }} />}
      </button>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, height: 30 }}>
        {bars.map((h, i) => {
          const isPlayed = (i / bars.length) * 100 <= progress;
          return (
            <div 
              key={i} 
              style={{
                flex: 1,
                height: `${h}%`,
                background: isPlayed ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                borderRadius: 2,
                transition: 'background 0.1s'
              }} 
            />
          );
        })}
      </div>
    </div>
  );
}
