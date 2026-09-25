"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrder } from "@/lib/store";
import styles from "./checkout.module.css";
import globalStyles from "../create.module.css";
import { encodePayload } from "@/lib/compression";
import { getMenuItem } from "@/lib/data";
import HeartLoader from "@/components/ui/HeartLoader";
import Script from "next/script";

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

  const itemsList = Object.entries(state.items).map(([id, qty]) => {
    const item = getMenuItem(id);
    return { id, qty, item };
  }).filter((x) => x.item !== undefined);

  const itemTotal = itemsList.reduce((acc, {qty, item}) => acc + (qty * item!.price), 0);
  const hasBundle = itemsList.some(x => x.id === "all_of_the_above");
  let finalTotal = itemTotal === 0 ? 0 : (hasBundle ? itemTotal : Math.ceil(itemTotal / 10) * 10);
  if (state.voiceNoteBlob) {
    finalTotal += 9;
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const pyarcelOrderId = `PYR-${Math.floor(10000 + Math.random() * 90000)}`;
      
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal * 100, // paise
          currency: "INR",
          receipt: pyarcelOrderId,
        }),
      });

      const order = await res.json();

      if (!res.ok) {
        throw new Error(order.error || "Failed to create order");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Pyarcel",
        description: "Gift Delivery Order",
        order_id: order.order_id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyResult = await verifyRes.json();

            if (verifyResult.success) {
              let voiceNoteUrl = undefined;
              if (state.voiceNoteBlob) {
                try {
                  const formData = new FormData();
                  formData.append("file", state.voiceNoteBlob);
                  const uploadRes = await fetch("/api/upload-audio", {
                    method: "POST",
                    body: formData,
                  });
                  if (uploadRes.ok) {
                    const blobData = await uploadRes.json();
                    voiceNoteUrl = blobData.url;
                  }
                } catch (e) {
                  console.error("Audio upload failed", e);
                }
              }
              startSuccessAnimation(pyarcelOrderId, response.razorpay_payment_id, voiceNoteUrl);
            } else {
              alert("Payment verification failed. Please contact support.");
              setIsProcessing(false);
            }
          } catch (err) {
            console.error(err);
            alert("An error occurred during verification.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: state.sender || "Sender",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#F2A900", // Example brand color
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      alert(error.message || "Something went wrong.");
      setIsProcessing(false);
    }
  };

  const startSuccessAnimation = (orderId: string, utr: string, vnUrl?: string) => {
    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage < STAGES.length) {
        setCurrentStage(stage);
      } else {
        clearInterval(interval);
        // Generate payload and redirect to receipt
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
          u: utr,
          th: state.theme,
          v: vnUrl
        };
        const encoded = encodePayload(payload);
        router.push(`/receipt?data=${encoded}`);
      }
    }, 1200); // 1.2s per stage
  };

  if (isProcessing && currentStage > 0) {
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
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
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
              <h3 className={styles.paymentTitle}>Payment Summary</h3>
              {state.voiceNoteBlob && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Voice Note Add-on</span>
                  <span className={styles.summaryValue}>₹9</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Total Amount</span>
                <span className={styles.summaryValue}>₹{finalTotal}</span>
              </div>
              <p className={globalStyles.flowSubtitle} style={{ marginTop: 16 }}>
                You will be redirected to Razorpay to complete your secure payment.
              </p>
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
          onClick={handlePayment}
          disabled={isProcessing || finalTotal < 1}
        >
          {isProcessing && currentStage === 0 ? "INITIALIZING..." : `PAY ₹${finalTotal} & PLACE ORDER`}
        </button>
      </div>
    </>
  );
}
