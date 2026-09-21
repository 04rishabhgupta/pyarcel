"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrder } from "@/lib/store";
import styles from "../create.module.css";

const DESTINATIONS = [
  { id: "heart", label: "Their Heart", icon: "❤️" },
  { id: "college", label: "College", icon: "🏫" },
  { id: "home", label: "Home", icon: "🏠" },
  { id: "whatsapp", label: "WhatsApp", icon: "📱" },
  { id: "anywhere", label: "Anywhere", icon: "🌍" },
];

export default function DestinationPage() {
  const router = useRouter();
  const { state, updateState } = useOrder();
  
  const [destination, setDestination] = useState(state.destination || "Their Heart");

  const handleNext = () => {
    updateState({ destination });
    router.push("/create/menu");
  };

  return (
    <>
      <div className={styles.flowHeader}>
        <h1 className={`font-serif ${styles.flowTitle}`}>Where are we delivering this Pyarcel?</h1>
        <p className={styles.flowSubtitle}>Just for the vibes. No actual physical address needed.</p>
      </div>

      <div className={styles.flowContent}>
        <div className={styles.radioGrid}>
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              className={`${styles.radioCard} ${destination === dest.label ? styles.selected : ''}`}
              onClick={() => setDestination(dest.label)}
            >
              <div className={styles.radioIcon}>{dest.icon}</div>
              <div style={{ fontWeight: 500 }}>{dest.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.flowFooter}>
        <button 
          className={styles.button} 
          onClick={handleNext}
        >
          BROWSE MENU
        </button>
      </div>
    </>
  );
}
