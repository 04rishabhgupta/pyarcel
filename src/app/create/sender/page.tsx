"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrder } from "@/lib/store";
import styles from "../create.module.css";

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
        <h1 className={`font-serif ${styles.flowTitle}`}>Who's ordering?</h1>
        <p className={styles.flowSubtitle}>Don't worry, we won't tell anyone unless you want us to.</p>
      </div>

      <div className={styles.flowContent}>
        <div>
          <label className={styles.label}>
            Your Name
          </label>
          <input 
            type="text" 
            className={styles.input} 
            placeholder="" 
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
