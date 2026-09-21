import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
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
          <Link href="/p/example" className={`font-mono ${styles.secondaryButton}`}>
            VIEW SAMPLE RECEIPT
          </Link>
        </div>
      </div>
    </main>
  );
}
