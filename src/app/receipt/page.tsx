"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { decodePayload, PyarcelPayload } from "@/lib/compression";
import ReceiptCard from "@/components/ui/ReceiptCard";
import styles from "./receipt.module.css";
import globalStyles from "../create/create.module.css";
import { Copy, Share, ExternalLink } from "lucide-react";
import Link from "next/link";

function ReceiptContent() {
  const searchParams = useSearchParams();
  const [payload, setPayload] = useState<PyarcelPayload | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      const decoded = decodePayload(data);
      setPayload(decoded);
      
      const fullUrl = `${window.location.origin}/p#${data}`;
      
      // Default to full URL while shortening
      setShareUrl(fullUrl);
      
      // Shorten the URL
      fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: fullUrl })
      })
      .then(res => res.json())
      .then(result => {
        if (result.shortUrl) {
          setShareUrl(result.shortUrl);
        }
      })
      .catch(err => {
        console.error("Failed to shorten url", err);
      });
    }
  }, [searchParams]);

  if (!payload) {
    return (
      <div className={styles.receiptPage}>
        <div style={{ textAlign: 'center', marginTop: 100 }}>
          <h2 className="font-serif text-2xl">Invalid Pyarcel</h2>
          <p className="text-muted-foreground mt-4">We couldn't find this order.</p>
          <Link href="/" className={globalStyles.button} style={{ marginTop: 24, display: 'inline-block', width: 'auto' }}>
            GO HOME
          </Link>
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${payload.s} sent you a Pyarcel ❤️`,
          text: "Your digital parcel has arrived. Open it to see what's inside.",
          url: shareUrl
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className={styles.receiptPage}>
      <div className={styles.container}>
        <div className={styles.successHeader}>
          <h1 className={`font-serif ${styles.title}`}>Your Pyarcel is ready ❤️</h1>
          <p className={styles.subtitle}>Copy the link and send it to {payload.r}</p>
        </div>

        <div className={styles.actionsContainer}>
          <div className={styles.linkPreview}>
            {shareUrl}
          </div>
          <div className={styles.buttonGroup}>
            <button className={globalStyles.button} onClick={handleCopy}>
              <Copy size={18} style={{ marginRight: 8 }} />
              {copied ? "COPIED!" : "COPY LINK"}
            </button>
            <button className={`${globalStyles.button} ${globalStyles.buttonSecondary}`} onClick={handleShare}>
              <Share size={18} style={{ marginRight: 8 }} />
              SHARE
            </button>
            <Link 
              href={`/p#${searchParams.get("data")}`} 
              target="_blank"
              className={`${globalStyles.button} ${globalStyles.buttonSecondary}`}
              style={{ background: 'transparent', border: '1px solid var(--border)' }}
            >
              <ExternalLink size={18} style={{ marginRight: 8 }} />
              OPEN PYARCEL
            </Link>
          </div>
        </div>

        <div className={styles.receiptContainer}>
          <ReceiptCard payload={payload} />
        </div>
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={<div className={styles.receiptPage}><p>Loading...</p></div>}>
      <ReceiptContent />
    </Suspense>
  );
}
