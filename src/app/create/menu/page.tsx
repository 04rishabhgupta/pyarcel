"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PYARCEL_MENU } from "@/lib/data";
import { useOrder } from "@/lib/store";
import styles from "./menu.module.css";
import { ShoppingBag, ChevronRight } from "lucide-react";

export default function MenuPage() {
  const router = useRouter();
  const { state, addItem, decreaseItem, cartTotalItems } = useOrder();
  const [activeCategory, setActiveCategory] = useState(PYARCEL_MENU[0].id);

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    const element = document.getElementById(`category-${id}`);
    if (element) {
      // Offset for sticky headers
      const y = element.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.menuContainer}>
      <header className={styles.header}>
        <h1 className={`font-serif ${styles.headerTitle}`}>What are we packing?</h1>
        <p className={styles.headerSubtitle}>Freshly packed feelings, delivered instantly.</p>
      </header>

      <div className={styles.categoriesWrapper}>
        {PYARCEL_MENU.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.categoryButton} ${activeCategory === cat.id ? styles.active : ''}`}
            onClick={() => scrollToCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <main className={styles.menuContent}>
        {PYARCEL_MENU.map((cat) => (
          <div key={cat.id} id={`category-${cat.id}`} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{cat.name}</h2>
            
            {cat.items.map((item) => {
              const qty = state.items[item.id] || 0;
              
              return (
                <div key={item.id} className={styles.itemCard}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemIcon}>{item.icon}</div>
                    <div className={styles.itemDetails}>
                      <div className={styles.itemName}>{item.name}</div>
                      <div className={styles.itemDescription}>{item.description}</div>
                      <div className={styles.itemPrice}>₹{item.price}</div>
                    </div>
                  </div>
                  
                  {qty === 0 ? (
                    <button className={styles.addBtn} onClick={() => addItem(item.id)}>
                      + ADD
                    </button>
                  ) : (
                    <div className={styles.quantityControls}>
                      <button className={styles.qtyBtn} onClick={() => decreaseItem(item.id)}>-</button>
                      <span className={styles.qtyValue}>
                        {item.isUnlimited ? "∞" : qty}
                      </span>
                      <button className={styles.qtyBtn} onClick={() => addItem(item.id)}>+</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </main>

      {cartTotalItems > 0 && (
        <div className={styles.stickyCart}>
          <div className={styles.cartInfo}>
            <span className={styles.cartItems}>
              {cartTotalItems} item{cartTotalItems > 1 ? 's' : ''} added
            </span>
            <span className={styles.cartSubtext}>Ready to pack?</span>
          </div>
          <button 
            className={styles.viewCartBtn}
            onClick={() => router.push("/create/cart")}
          >
            VIEW CART <ShoppingBag size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
