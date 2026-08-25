"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrder } from "@/lib/store";
import styles from "./checkout.module.css";
import globalStyles from "../create.module.css";
import { encodePayload } from "@/lib/compression";

const STAGES = [
  "Order Confirmed",
  "Packing Your Feelings",
  "Wrapping the Hugs",
  "Sealing the Kisses",
  "Cupid Has Picked It Up",
  "On the Way to Their Heart",
  "Delivered ❤️"
];

export default function CheckoutPage() {
  const router = useRouter();
  const { state } = useOrder();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);

  const handleCheckout = () => {
    setIsProcessing(true);
    
    // Animate through stages
    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage < STAGES.length) {
        setCurrentStage(stage);
      } else {
        clearInterval(interval);
        // Generate payload and redirect to receipt
        const orderId = `PYR-${Math.floor(10000 + Math.random() * 90000)}`;
        const payload = {
          s: state.sender,
          a: state.isAnonymous,
          r: state.recipient,
          rel: state.relationship,
          d: state.destination,
          i: state.items,
          m: state.message,
          id: orderId,
          ts: Date.now()
        };
        const encoded = encodePayload(payload);
        router.push(`/receipt?data=${encoded}`);
      }
    }, 1200); // 1.2s per stage
  };

  if (isProcessing) {
    return (
      <div className={styles.processingContainer}>
        <div className={styles.spinner}></div>
        <h2 className={`font-serif ${styles.processingStage}`}>
          {STAGES[currentStage]}
        </h2>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${(currentStage / (STAGES.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={globalStyles.flowHeader}>
        <h1 className={`font-serif ${globalStyles.flowTitle}`}>Almost ready to deliver.</h1>
        <p className={globalStyles.flowSubtitle}>Review your order before sending.</p>
      </div>

      <div className={globalStyles.flowContent}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>From</span>
            <span className={styles.summaryValue}>{state.isAnonymous ? "Someone Special" : state.sender}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>To</span>
            <span className={styles.summaryValue}>{state.recipient}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Destination</span>
            <span className={styles.summaryValue}>{state.destination}</span>
          </div>
        </div>

        <div className={styles.paymentSection}>
          <h3 className={styles.paymentTitle}>Payment Method</h3>
          <div className={styles.paymentMethod}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>❤️</span>
              <span style={{ fontWeight: 600 }}>Pure Feelings</span>
            </div>
            <span style={{ fontWeight: 600 }}>₹0</span>
          </div>
        </div>
      </div>

      <div className={globalStyles.flowFooter}>
        <button 
          className={globalStyles.button} 
          onClick={handleCheckout}
        >
          PLACE PYARCEL ORDER
        </button>
      </div>
    </>
  );
}
