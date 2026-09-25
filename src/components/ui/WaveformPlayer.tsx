"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Play, Pause } from "lucide-react";
import styles from "./ReceiptCard.module.css";

export default function WaveformPlayer({ url, orderId }: { url: string; orderId: string }) {
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

  // Generate a random but deterministic barcode-waveform pattern
  const bars = useMemo(() => {
    const arr = [];
    let remainingWidth = 100; // total percentage width
    let i = 0;
    while (remainingWidth > 0) {
      // Bar width between 0.5% and 2.5%
      const width = 0.5 + Math.random() * 2; 
      // Gap width between 0.5% and 1.5%
      const gap = 0.5 + Math.random() * 1; 
      
      if (remainingWidth - width - gap < 0) break;
      
      // Waveform height calculation (sine wave mixed with some noise)
      const height = Math.sin(i * 0.4) * 35 + 45 + Math.random() * 20;
      
      arr.push({ width, gap, height: Math.min(Math.max(height, 10), 100) });
      remainingWidth -= (width + gap);
      i++;
    }
    return arr;
  }, []);

  return (
    <div className={styles.barcodeContainer} style={{ margin: '32px 0 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <audio ref={audioRef} src={url} preload="metadata" />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', width: '280px' }}>
        
        {/* Play / Pause Button */}
        <button 
          onClick={togglePlay}
          style={{ 
            width: 40, height: 40, borderRadius: '50%', 
            background: '#111', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            cursor: 'pointer',
            border: 'none'
          }}
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" style={{ marginLeft: 3 }} />}
        </button>

        {/* Barcode Waveform */}
        <div 
          onClick={togglePlay}
          style={{ 
            flex: 1, 
            height: '50px', 
            display: 'flex',
            alignItems: 'center', // Center vertically to create the waveform shape
            cursor: 'pointer'
          }}
        >
          {bars.map((bar, i) => {
            // Calculate playback progress to color the bars
            const positionPercent = (i / bars.length) * 100;
            const isPlayed = positionPercent <= progress;
            
            return (
              <div key={i} style={{ display: 'flex', width: `${bar.width + bar.gap}%`, height: '100%', alignItems: 'center' }}>
                <div 
                  style={{ 
                    width: `${(bar.width / (bar.width + bar.gap)) * 100}%`, 
                    height: `${bar.height}%`, 
                    background: isPlayed ? '#ccc' : '#111',
                    transition: 'background 0.1s'
                  }} 
                />
                <div style={{ width: `${(bar.gap / (bar.width + bar.gap)) * 100}%`, height: '100%' }} />
              </div>
            );
          })}
        </div>
        
      </div>
      
      {/* Receipt Order ID underneath */}
      <div className={styles.barcodeText}>{orderId}</div>
    </div>
  );
}
