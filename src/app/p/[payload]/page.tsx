"use client";

import { useEffect, useState, use } from "react";
import { decodePayload, PyarcelPayload } from "@/lib/compression";
import ReceiptCard from "@/components/ui/ReceiptCard";
import styles from "./recipient.module.css";
import globalStyles from "../../create/create.module.css";
import Link from "next/link";

export default function RecipientPage({ params }: { params: Promise<{ payload: string }> }) {
  const resolvedParams = use(params);
  const { payload } = resolvedParams;
  
  const [data, setData] = useState<PyarcelPayload | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (payload) {
      const decoded = decodePayload(payload);
      if (decoded) {
        setData(decoded);
      } else {
        setError(true);
      }
    }
  }, [payload]);

  if (error) {
    return (
      <div className={globalStyles.flowContent} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
        <div>
          <h2 className={`font-serif ${globalStyles.flowTitle}`}>This Pyarcel couldn't be found</h2>
          <p className={globalStyles.flowSubtitle} style={{ marginTop: '16px' }}>Looks like Cupid dropped the parcel.</p>
          <div style={{ marginTop: '32px' }}>
            <Link href="/" className={globalStyles.button} style={{ display: 'inline-block', width: 'auto' }}>
              CREATE YOUR OWN
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className={styles.recipientPage}></div>;
  }

  const senderName = data.a ? "Someone Special" : data.s;

  if (!isOpened) {
    return (
      <div className={globalStyles.flowContent} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
        <div className={styles.introContainer}>
          <span className={styles.introIcon}>📦</span>
          <h1 className={`font-serif ${globalStyles.flowTitle}`}>
            {senderName} just sent something your way...
          </h1>
          <p className={globalStyles.flowSubtitle} style={{ marginTop: '16px', marginBottom: '32px' }}>Your Pyarcel has arrived.</p>
          
          <button className={globalStyles.button} onClick={() => setIsOpened(true)}>
            TAP TO OPEN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={globalStyles.flowContent} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', paddingTop: '40px' }}>
      <div className={styles.receiptReveal}>
        <ReceiptCard payload={data} />
        
        <div className={styles.footer}>
          ❤️ Delivered with love.
        </div>
        
        <div style={{ textAlign: 'center', marginTop: 60, paddingBottom: 40 }}>
          <Link href="/" style={{ color: 'var(--foreground)', textDecoration: 'underline', fontSize: '1rem', fontWeight: 'bold' }}>
            CREATE YOUR OWN PYARCEL
          </Link>
        </div>
      </div>
    </div>
  );
}
