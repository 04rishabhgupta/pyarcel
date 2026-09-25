"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useOrder } from "@/lib/store";
import styles from "../create.module.css";
import { Mic, Square, Play, RotateCcw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VoiceNotePage() {
  const router = useRouter();
  const { state, updateState } = useOrder();
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(
    state.voiceNoteBlob ? URL.createObjectURL(state.voiceNoteBlob) : null
  );
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorderRef.current?.mimeType || '';
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        updateState({ voiceNoteBlob: audioBlob });
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access is required to record a voice note.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    updateState({ voiceNoteBlob: null });
  };

  const handleNext = () => {
    router.push("/create/checkout");
  };

  return (
    <>
      <div className={styles.flowHeader}>
        <h1 className={`font-serif ${styles.flowTitle}`}>Add a Voice Note? (+₹9)</h1>
        <p className={styles.flowSubtitle}>Make it even more personal. Record a short audio message.</p>
      </div>

      <div className={styles.flowContent} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {!audioUrl ? (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: isRecording ? '#FFEAEA' : '#F4F1EB',
                border: `2px solid ${isRecording ? 'var(--primary)' : 'var(--border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                animation: isRecording ? 'pulse 1.5s infinite' : 'none'
              }}
            >
              {isRecording ? <Square size={32} color="var(--primary)" /> : <Mic size={32} color="var(--foreground)" />}
            </button>
            <p style={{ marginTop: 24, fontWeight: 'bold' }}>
              {isRecording ? "Recording... Tap to stop" : "Tap to record"}
            </p>
            <style jsx>{`
              @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(242, 132, 130, 0.4); }
                70% { box-shadow: 0 0 0 20px rgba(242, 132, 130, 0); }
                100% { box-shadow: 0 0 0 0 rgba(242, 132, 130, 0); }
              }
            `}</style>
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: '400px', background: '#F4F1EB', padding: 24, borderRadius: 16 }}>
            <audio ref={audioRef} src={audioUrl} controls style={{ width: '100%', marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button 
                onClick={deleteRecording}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', 
                  borderRadius: 20, border: '1px solid var(--border)', background: 'white' 
                }}
              >
                <RotateCcw size={16} /> Re-record
              </button>
            </div>
          </div>
        )}

      </div>

      <div className={styles.flowFooter}>
        <button 
          className={styles.button} 
          onClick={handleNext}
        >
          {audioUrl ? "SAVE & PROCEED" : "SKIP & PROCEED"}
        </button>
      </div>
    </>
  );
}
