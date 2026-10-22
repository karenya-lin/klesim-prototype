import type { ReactNode } from "react";
import { BrandMark } from "@/proto/ui/Brand";
import styles from "./Stage.module.css";

export function Stage({ children }: { children: ReactNode }) {
  return (
    <main className={styles.stage}>
      <aside className={styles.caption} aria-label="About this prototype">
        <BrandMark size={40} />
        <h1 className={styles.title}>KLeSIM, a travel eSIM app prototype</h1>
        <p className={styles.note}>
          Concept recreation of a design by Karenya Lin. Brand and data are placeholders.
        </p>
        <ul className={styles.hints}>
          <li>Browse destinations and plans</li>
          <li>Check out with a placeholder card</li>
          <li>Install guide and My eSIM</li>
        </ul>
      </aside>
      <div className={styles.device}>
        <div className={styles.screen} id="phone-screen">
          {children}
        </div>
      </div>
    </main>
  );
}
