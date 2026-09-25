"use client";

import { useState } from "react";
import { PyarcelPayload } from "@/lib/compression";
import ReceiptCard from "@/components/ui/ReceiptCard";
import styles from "../p/recipient.module.css";
import globalStyles from "../create/create.module.css";
import Link from "next/link";
import Switch from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import FloatingDecorations from "@/components/ui/FloatingDecorations";

export default function SamplePage() {
  const [isOpened, setIsOpened] = useState(false);
  const [isBundle, setIsBundle] = useState(false);

  const samplePayload: PyarcelPayload = {
    s: "Someone Special",
    a: false,
    r: "Someone Extra Special",
    rel: "SOULMATE",
    d: "Her Heart",
    i: { "unlimited_love": 1, "head_on_shoulder": 1, "matching_dp": 1 },
    m: "Just a sample Pyarcel to show you how cute this looks! ❤️",
    id: "PYR-14300",
    ts: Date.now(),
    u: "123456789012"
  };

  const bundlePayload: PyarcelPayload = {
    s: "Someone Special",
    a: false,
    r: "Someone Extra Special",
    rel: "SOULMATE",
    d: "Her Heart",
    i: { "all_of_the_above": 1 },
    m: "I got you the ultimate bundle because you're extra special! ✨",
    id: "PYR-99999",
    ts: Date.now(),
    u: "987654321098",
    th: "pink",
    v: "https://www.w3schools.com/html/horse.ogg"
  };

  const data = isBundle ? bundlePayload : samplePayload;
  const senderName = data.a ? "Someone Special" : data.s;

  if (!isOpened) {
    return (
      <div className={globalStyles.flowContent} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '40px 20px' }}>
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
    <div className={globalStyles.flowContent} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', paddingTop: '40px', paddingLeft: '20px', paddingRight: '20px' }}>
      {isBundle && <FloatingDecorations />}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', padding: '16px', background: 'rgba(0,0,0,0.03)', borderRadius: '12px' }}>
        <button onClick={() => setIsBundle(false)} className={cn("font-mono text-sm font-bold", !isBundle ? "text-gray-900" : "text-gray-400")}>
          Standard
        </button>
        <Switch checked={isBundle} onCheckedChange={setIsBundle} />
        <button onClick={() => setIsBundle(true)} className={cn("font-mono text-sm font-bold", isBundle ? "text-pink-600" : "text-gray-400")}>
          All of the Above
        </button>
      </div>

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
