"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrder } from "@/lib/store";
import styles from "../create.module.css";
import { Gift } from "lucide-react";

const RELATIONSHIPS = [
  "Girlfriend",
  "Boyfriend",
  "Crush",
  "Wife",
  "Husband",
  "Fiancé",
  "Best Friend",
  "Situationship",
  "Other"
];

export default function RecipientPage() {
  const router = useRouter();
  const { state, updateState } = useOrder();
  
  const [name, setName] = useState(state.recipient);
  const [relationship, setRelationship] = useState(state.relationship);

  const handleNext = () => {
    updateState({ recipient: name, relationship });
    router.push("/create/destination");
  };

  return (
    <>
      <div className={styles.flowHeader}>
        <div style={{ marginBottom: 16 }}>
          <Gift size={32} color="var(--primary)" />
        </div>
        <h1 className={`font-serif ${styles.flowTitle}`}>Who are you ordering for?</h1>
        <p className={styles.flowSubtitle}>The lucky person receiving this pyarcel.</p>
      </div>

      <div className={styles.flowContent}>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            Their Name
          </label>
          <input 
            type="text" 
            className={styles.input} 
            placeholder="e.g. Riya" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 12, fontWeight: 500 }}>
            Relationship (Optional)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {RELATIONSHIPS.map((rel) => (
              <button
                key={rel}
                className={`${styles.selectorButton} ${relationship === rel ? styles.selected : ''}`}
                style={{ width: 'auto', padding: '8px 16px', borderRadius: '100px' }}
                onClick={() => setRelationship(relationship === rel ? "" : rel)}
              >
                {rel}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.flowFooter}>
        <button 
          className={styles.button} 
          onClick={handleNext}
          disabled={!name.trim()}
        >
          NEXT
        </button>
      </div>
    </>
  );
}
