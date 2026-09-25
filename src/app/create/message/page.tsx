"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrder } from "@/lib/store";
import styles from "../create.module.css";

export default function MessagePage() {
  const router = useRouter();
  const { state, updateState } = useOrder();
  
  const [message, setMessage] = useState(state.message);
  const MAX_CHARS = 1500;

  const handleNext = () => {
    updateState({ message });
    router.push("/create/voicenote");
  };

  return (
    <>
      <div className={styles.flowHeader}>
        <h1 className={`font-serif ${styles.flowTitle}`}>Want to add a little note?</h1>
        <p className={styles.flowSubtitle}>Say something you probably wouldn't say out loud...</p>
      </div>

      <div className={styles.flowContent} style={{ flex: 1 }}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <textarea 
            className={styles.input} 
            placeholder="Write your feelings here..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={MAX_CHARS}
            style={{ 
              flex: 1, 
              minHeight: '200px', 
              resize: 'none', 
              fontFamily: 'var(--font-geist-sans)',
              padding: '16px'
            }}
          />
          <div style={{ 
            textAlign: 'right', 
            marginTop: '8px', 
            fontSize: '0.875rem', 
            color: message.length >= MAX_CHARS ? 'var(--foreground)' : 'var(--muted-foreground)' 
          }}>
            {message.length} / {MAX_CHARS}
          </div>
        </div>
      </div>

      <div className={styles.flowFooter}>
        <button 
          className={styles.button} 
          onClick={handleNext}
        >
          {message.trim() ? "PROCEED TO CHECKOUT" : "SKIP & PROCEED"}
        </button>
      </div>
    </>
  );
}
