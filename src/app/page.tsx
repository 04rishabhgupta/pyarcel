import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { encodePayload, PyarcelPayload } from "@/lib/compression";

export default function Home() {
  const samplePayload: PyarcelPayload = {
    s: "Rishabh",
    a: false,
    r: "Sakshi",
    rel: "SOULMATE",
    d: "Her Heart",
    i: { "unlimited_love": 1, "head_on_shoulder": 1, "matching_dp": 1 },
    m: "Just a sample Pyarcel to show you how cute this looks! ❤️",
    id: "PYR-14300",
    ts: Date.now(),
    u: "123456789012"
  };
  const sampleLink = `/p/${encodePayload(samplePayload)}`;
  return (
    <main className={`min-h-screen flex flex-col items-center justify-center ${styles.main}`}>
      <div className={styles.hero}>
        <div className={styles.logoWrapper}>
          <Image src="/logo.svg" alt="Pyarcel Logo" width={140} height={140} priority />
        </div>

        <h1 className={`font-serif ${styles.title}`}>Pyarcel</h1>

        <div className={`font-mono ${styles.tagline}`}>
          <p>PACK FEELINGS</p>
          <p>DELIVER SMILES</p>
        </div>

        <div className={styles.actions}>
          <Link href="/create/sender" className={`font-mono ${styles.primaryButton}`}>
            START ORDERING
          </Link>
          <Link href={sampleLink} className={`font-mono ${styles.secondaryButton}`}>
            VIEW SAMPLE RECEIPT
          </Link>
        </div>

        <div className={styles.footerCredits}>
          <p>
            Crafted by <a href="https://github.com/04rishabhgupta" target="_blank" rel="noopener noreferrer">Rishabh Gupta</a> for <a href="https://github.com/sakshiichauhan" target="_blank" rel="noopener noreferrer">Sakshi Chauhan</a>.
          </p>
          <details className={styles.secretDropdown}>
            <summary>...</summary>
            <p>But shhh 🤫 - don't expose me.</p>
          </details>
        </div>
      </div>
    </main>
  );
}
