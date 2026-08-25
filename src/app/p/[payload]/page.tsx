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
      <div className={styles.recipientPage}>
        <div style={{ textAlign: 'center' }}>
          <h2 className="font-serif text-2xl">This Pyarcel couldn't be found</h2>
          <p className="text-muted-foreground mt-4">Looks like Cupid dropped the parcel.</p>
          <Link href="/" className={globalStyles.button} style={{ marginTop: 24, display: 'inline-block', width: 'auto' }}>
            CREATE YOUR OWN PYARCEL
          </Link>
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
      <div className={styles.recipientPage}>
        <div className={styles.introContainer}>
          <span className={styles.introIcon}>📦</span>
          <h1 className={`font-serif ${styles.introTitle}`}>
            {senderName} just sent something your way...
          </h1>
          <p className={styles.introSubtitle}>Your Pyarcel has arrived.</p>
          
          <button className={styles.openBtn} onClick={() => setIsOpened(true)}>
            TAP TO OPEN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.recipientPage} style={{ alignItems: 'flex-start' }}>
      <div className={styles.receiptReveal}>
        <ReceiptCard payload={data} />
        
        <div className={styles.footer}>
          ❤️ Delivered with love.
        </div>
        
        <div style={{ textAlign: 'center', marginTop: 60, paddingBottom: 40 }}>
          <Link href="/" style={{ color: 'var(--muted-foreground)', textDecoration: 'underline', fontSize: '0.875rem' }}>
            Create your own Pyarcel
          </Link>
        </div>
      </div>
    </div>
  );
}
