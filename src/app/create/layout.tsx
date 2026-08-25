import { OrderProvider } from "@/lib/store";
import styles from "./create.module.css";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrderProvider>
      <div className={styles.createLayout}>
        <div className={styles.container}>
          {children}
        </div>
      </div>
    </OrderProvider>
  );
}
