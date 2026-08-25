"use client";

import { useRouter } from "next/navigation";
import { useOrder } from "@/lib/store";
import { getMenuItem } from "@/lib/data";
import styles from "./cart.module.css";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import globalStyles from "../create.module.css";

export default function CartPage() {
  const router = useRouter();
  const { state, addItem, decreaseItem, cartTotalItems } = useOrder();

  const handleNext = () => {
    router.push("/create/message");
  };

  if (cartTotalItems === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🥺</div>
        <h2 className="font-serif text-2xl">Your Pyarcel is empty</h2>
        <p className="text-muted-foreground">Add a little love to get started.</p>
        <button 
          className={globalStyles.button} 
          onClick={() => router.push("/create/menu")}
          style={{ marginTop: '24px' }}
        >
          BROWSE FEELINGS
        </button>
      </div>
    );
  }

  const itemsList = Object.entries(state.items).map(([id, qty]) => {
    const item = getMenuItem(id);
    return { id, qty, item };
  }).filter((x) => x.item !== undefined);

  return (
    <div className={styles.cartPage}>
      <div className={styles.cartContainer}>
        <div className={styles.cartHeader}>
          <button onClick={() => router.back()} style={{ color: 'var(--foreground)' }}>
            <ArrowLeft size={24} />
          </button>
          <h1 className={`font-serif ${styles.cartTitle}`}>Your Pyarcel</h1>
        </div>

        <div className={styles.cartList}>
          {itemsList.map(({ id, qty, item }) => (
            <div key={id} className={styles.cartItem}>
              <div>
                <div className={styles.cartItemName}>{item!.icon} {item!.name}</div>
                <div className={styles.cartItemPrice}>₹{item!.price}</div>
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
            <span>₹0</span>
          </div>
          <div className={styles.billRow}>
            <span>Love Tax</span>
            <span>₹0</span>
          </div>
          <div className={styles.billRow}>
            <span>Platform Fee</span>
            <span>₹999</span>
          </div>
          <div className={`${styles.billRow} ${styles.discount}`}>
            <span>Platform Discount</span>
            <span>-₹999</span>
          </div>
          <div className={styles.billRow}>
            <span>Delivery Fee</span>
            <span>₹49</span>
          </div>
          <div className={`${styles.billRow} ${styles.discount}`}>
            <span>Cupid Discount</span>
            <span>-₹49</span>
          </div>
          
          <div className={`${styles.billRow} ${styles.total}`}>
            <span>TOTAL</span>
            <span>₹0</span>
          </div>
        </div>

        <div className={styles.couponSection}>
          <div>
            <div className={styles.couponCode}>LOVE100</div>
            <div className={styles.couponMsg}>"Obviously applied."</div>
          </div>
          <CheckCircle2 size={24} color="#10b981" />
        </div>
      </div>

      <div className={styles.stickyFooter}>
        <button 
          className={globalStyles.button} 
          onClick={handleNext}
        >
          PACK MY PYARCEL ❤️
        </button>
      </div>
    </div>
  );
}
