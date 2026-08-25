"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrder } from "@/lib/store";
import styles from "../create.module.css";
import { Heart } from "lucide-react";

export default function SenderPage() {
  const router = useRouter();
  const { state, updateState } = useOrder();
  
  const [name, setName] = useState(state.sender);
  const [isAnonymous, setIsAnonymous] = useState(state.isAnonymous);

  const handleNext = () => {
    updateState({ 
      sender: isAnonymous ? "Someone Special" : name, 
      isAnonymous 
    });
    router.push("/create/recipient");
  };

  return (
    <>
      <div className={styles.flowHeader}>
        <div style={{ marginBottom: 16 }}>
          <Heart size={32} color="var(--primary)" />
        </div>
        <h1 className={`font-serif ${styles.flowTitle}`}>Who's ordering?</h1>
        <p className={styles.flowSubtitle}>Don't worry, we won't tell anyone unless you want us to.</p>
      </div>

      <div className={styles.flowContent}>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            Your Name
          </label>
          <input 
            type="text" 
            className={styles.input} 
            placeholder="e.g. Rishabh" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isAnonymous}
          />
        </div>

        <label className={styles.checkboxContainer}>
          <input 
            type="checkbox" 
            className={styles.checkbox}
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <span>Keep me anonymous 👀</span>
        </label>
      </div>

      <div className={styles.flowFooter}>
        <button 
          className={styles.button} 
          onClick={handleNext}
          disabled={!isAnonymous && !name.trim()}
        >
          NEXT
        </button>
      </div>
    </>
  );
}
