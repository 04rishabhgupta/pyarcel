"use client";

import { useRouter } from "next/navigation";
import { useOrder } from "@/lib/store";
import { getMenuItem } from "@/lib/data";
import styles from "./cart.module.css";
import { CheckCircle2 } from "lucide-react";
import globalStyles from "../create.module.css";

export default function CartPage() {
  const router = useRouter();
  const { state, addItem, decreaseItem, cartTotalItems } = useOrder();

  const handleNext = () => {
    router.push("/create/message");
  };

  if (cartTotalItems === 0) {
    return (
      <div className={globalStyles.flowContent}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🥺</div>
          <h2 className="font-serif italic text-3xl">Your Pyarcel is empty</h2>
          <p className={globalStyles.flowSubtitle}>Add a little love to get started.</p>
          <button 
            className={globalStyles.button} 
            onClick={() => router.push("/create/menu")}
            style={{ marginTop: '24px' }}
          >
            BROWSE FEELINGS
          </button>
        </div>
      </div>
    );
  }

  const itemsList = Object.entries(state.items).map(([id, qty]) => {
    const item = getMenuItem(id);
    return { id, qty, item };
  }).filter((x) => x.item !== undefined);

  const itemTotal = itemsList.reduce((acc, {qty, item}) => acc + (qty * item!.price), 0);
  const hasBundle = itemsList.some(x => x.id === "all_of_the_above");
  const finalTotal = itemTotal === 0 ? 0 : (hasBundle ? itemTotal : Math.ceil(itemTotal / 10) * 10);
  const cutenessFee = finalTotal - itemTotal;

  return (
    <>
      <div className={globalStyles.flowHeader}>
        <h1 className={`font-serif ${globalStyles.flowTitle}`}>Your Pyarcel</h1>
        <p className={globalStyles.flowSubtitle}>Review your feelings before packing.</p>
      </div>

      <div className={globalStyles.flowContent}>
        <div className={styles.cartList}>
          {itemsList.map(({ id, qty, item }) => (
            <div key={id} className={styles.cartItem}>
              <div className={styles.cartItemName}>
                {item!.icon} {item!.name}
              </div>
              <div className={styles.cartItemQty}>
                <button className={styles.qtyBtn} onClick={() => decreaseItem(id)}>-</button>
                <span className={styles.qtyValue}>{item!.isUnlimited ? "∞" : qty}</span>
                <button className={styles.qtyBtn} onClick={() => addItem(id)}>+</button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.billDetails}>
          <h3 className={styles.billTitle}>Bill Details</h3>
          
          <div className={styles.billRow}>
            <span>Item Total</span>
            <span>₹{itemTotal}</span>
          </div>
          <div className={styles.billRow}>
            <span>Cuteness Fee</span>
            <span>₹{cutenessFee}</span>
          </div>
          
          <div className={`${styles.billRow} ${styles.total}`}>
            <span>TOTAL</span>
            <span>₹{finalTotal}</span>
          </div>
        </div>

        <div className={styles.couponSection}>
          <div>
            <div className={styles.couponCode}>LOVE100</div>
            <div className={styles.couponMsg}>"Obviously applied."</div>
          </div>
          <CheckCircle2 size={24} color="var(--background)" />
        </div>
      </div>

      <div className={globalStyles.flowFooter}>
        <button 
          className={globalStyles.button} 
          onClick={handleNext}
        >
          PACK MY PYARCEL
        </button>
      </div>
    </>
  );
}
