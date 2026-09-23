"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrder } from "@/lib/store";
import styles from "./checkout.module.css";
import globalStyles from "../create.module.css";
import { encodePayload } from "@/lib/compression";
import { QRCodeSVG } from 'qrcode.react';
import { getMenuItem } from "@/lib/data";
import HeartLoader from "@/components/ui/HeartLoader";

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
  const [utr, setUtr] = useState("");

  const itemsList = Object.entries(state.items).map(([id, qty]) => {
    const item = getMenuItem(id);
    return { id, qty, item };
  }).filter((x) => x.item !== undefined);

  const itemTotal = itemsList.reduce((acc, {qty, item}) => acc + (qty * item!.price), 0);
  const finalTotal = itemTotal === 0 ? 0 : Math.ceil(itemTotal / 10) * 10;
  
  const upiId = "04rishabhgupta-1@okaxis";
  const payeeName = "Rishabh Gupta";
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${finalTotal}&cu=INR&tn=Pyarcel%20Order`;

  const handleCheckout = () => {
    if (utr.trim().length !== 12) {
      alert("Please enter a valid 12-digit UTR transaction ID.");
      return;
    }
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
          ts: Date.now(),
          u: utr
        };
        const encoded = encodePayload(payload);
        router.push(`/receipt?data=${encoded}`);
      }
    }, 1200); // 1.2s per stage
  };

  if (isProcessing) {
    return (
      <div className={styles.processingContainer}>
        <div style={{ marginBottom: '32px' }}>
          <HeartLoader size={64} />
        </div>
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
        <div className={styles.splitContainer}>
          <div className={styles.leftCol}>
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
              <h3 className={styles.paymentTitle}>Payment (₹{finalTotal})</h3>
              <p className={globalStyles.flowSubtitle} style={{ marginBottom: 16 }}>
                Scan the QR code or click it to pay via UPI.
              </p>
              
              <div className={styles.qrWrapper}>
                <QRCodeSVG value={upiLink} size={150} fgColor="var(--foreground)" />
              </div>

              <div className={styles.upiAppButtons}>
                <a href={`gpay://upi/pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${finalTotal}&cu=INR&tn=Pyarcel%20Order`} className={styles.upiAppBtn}>
                  GPay
                </a>
                <a href={`phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${finalTotal}&cu=INR&tn=Pyarcel%20Order`} className={styles.upiAppBtn}>
                  PhonePe
                </a>
                <a href={`paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${finalTotal}&cu=INR&tn=Pyarcel%20Order`} className={styles.upiAppBtn}>
                  Paytm
                </a>
                <a href={upiLink} className={styles.upiAppBtn}>
                  Other Apps
                </a>
              </div>

              <div className={styles.utrGroup}>
                <label className={styles.utrLabel}>Enter 12-Digit UTR</label>
                <input 
                  type="text" 
                  value={utr}
                  onChange={(e) => setUtr(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  placeholder="e.g. 123456789012"
                  className={styles.utrInput} 
                />
              </div>
            </div>
          </div>
          
          <div className={styles.rightCol}>
            <img 
              src="/cat-money.png" 
              alt="Cat asking for money" 
              className={styles.catImage} 
            />
          </div>
        </div>
      </div>

      <div className={globalStyles.flowFooter}>
        <button
          className={globalStyles.button}
          onClick={handleCheckout}
          disabled={utr.length !== 12}
          style={{ opacity: utr.length === 12 ? 1 : 0.5 }}
        >
          VERIFY & PLACE ORDER
        </button>
      </div>
    </>
  );
}
