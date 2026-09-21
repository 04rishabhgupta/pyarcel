import { PyarcelPayload } from "@/lib/compression";
import { getMenuItem } from "@/lib/data";
import styles from "./ReceiptCard.module.css";

export default function ReceiptCard({ payload }: { payload: PyarcelPayload }) {
  const date = new Date(payload.ts);
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();
  
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const itemTotal = Object.entries(payload.i).reduce((acc, [id, qty]) => {
    const item = getMenuItem(id);
    return acc + (item ? item.price * qty : 0);
  }, 0);
  const finalTotal = itemTotal === 0 ? 0 : Math.ceil(itemTotal / 10) * 10;
  const cutenessFee = finalTotal - itemTotal;

  return (
    <div className={styles.receiptWrapper}>
      <div className={styles.header}>
        <h2 className={styles.brand}>PYARCEL</h2>
        <div className={styles.subBrand}>PACKED WITH LOVE</div>
      </div>

      <div className={styles.divider} />

      <div className={styles.row}>
        <span className={styles.label}>ORDER #</span>
        <span className={styles.value}>{payload.id}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>DATE</span>
        <span className={styles.value}>{formattedDate} {formattedTime}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>TYPE</span>
        <span className={styles.value}>DIGITAL DELIVERY</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.row}>
        <span className={styles.label}>ORDERED BY</span>
        <span className={styles.value}>{payload.a ? "SOMEONE SPECIAL" : payload.s.toUpperCase()}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>DELIVER TO</span>
        <span className={styles.value}>{payload.r.toUpperCase()}</span>
      </div>
      {payload.rel && (
        <div className={styles.row}>
          <span className={styles.label}>RELATIONSHIP</span>
          <span className={styles.value}>{payload.rel.toUpperCase()}</span>
        </div>
      )}
      <div className={styles.row}>
        <span className={styles.label}>DESTINATION</span>
        <span className={styles.value}>{payload.d.toUpperCase()}</span>
      </div>

      <div className={styles.divider} />
      
      <div className={styles.sectionTitle}>ITEMS</div>
      
      {Object.entries(payload.i).map(([id, qty]) => {
        const item = getMenuItem(id);
        if (!item) return null;
        
        return (
          <div key={id} className={styles.itemRow}>
            <div className={styles.itemQtyName}>
              <span className={styles.itemQty}>{item.isUnlimited ? "∞" : qty} x</span>
              <span className={styles.itemName}>{item.icon} {item.name}</span>
            </div>
          </div>
        );
      })}

      <div className={styles.divider} />

      <div className={styles.sectionTitle}>BILL DETAILS</div>
      <div className={styles.billRow}>
        <span>Item Total</span>
        <span>₹***</span>
      </div>
      <div className={styles.billRow}>
        <span>Couple Discount</span>
        <span>99% APPLIED</span>
      </div>
      <div className={styles.billRow}>
        <span>Cuteness Fee</span>
        <span>WAIVED</span>
      </div>

      <div className={styles.divider} />
      
      <div className={`${styles.billRow} ${styles.billTotal}`}>
        <span>TOTAL</span>
        <span>PAID WITH LOVE ❤️</span>
      </div>
      
      <div className={styles.row} style={{ marginTop: '16px' }}>
        <span className={styles.label}>PAYMENT METHOD</span>
        <span className={styles.value}>UPI</span>
      </div>
      {payload.u && (
        <div className={styles.row}>
          <span className={styles.label}>TRANSACTION ID</span>
          <span className={styles.value}>{payload.u}</span>
        </div>
      )}

      <div className={styles.divider} />

      <div className={styles.row}>
        <span className={styles.label}>DELIVERY PARTNER</span>
        <span className={styles.value}>CUPID</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>EST. DELIVERY</span>
        <span className={styles.value}>RIGHT NOW</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>DISTANCE</span>
        <span className={styles.value}>3,742 HEARTBEATS</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.footer}>
        <div style={{ marginBottom: 16 }}>
          100% NON-REFUNDABLE LOVE.
        </div>
        <div className={styles.divider} />
        <div className={styles.stars}>♥ ♥ ♥ ♥ ♥</div>
        <div>WOULD ORDER AGAIN.</div>
      </div>

      {payload.m && (
        <>
          <div className={styles.divider} />
          <div className={styles.sectionTitle}>MESSAGE FROM SENDER</div>
          <div className={styles.messageSection}>
            "{payload.m}"
          </div>
        </>
      )}

      <div className={styles.barcodeContainer}>
        <div className={styles.barcodeLines}></div>
        <div className={styles.barcodeText}>{payload.id}</div>
      </div>

      <div className={styles.divider} />
      <div style={{ textAlign: 'center', marginTop: 16, fontWeight: 'bold' }}>
        ORDER DELIVERED ❤️
      </div>
    </div>
  );
}
