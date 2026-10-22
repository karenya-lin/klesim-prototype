"use client";

import { GUIDE_STEPS } from "../data";
import { Img } from "../ui/Img";
import { BackButton, CartButton, CurrencyButton, FaqSection, GuideLinksSection, Hero, ShareButton, cx, ui } from "../ui/parts";
import plans from "./plans.module.css";
import styles from "./guide.module.css";

export function GuideScreen() {
  return (
    <div className={ui.screen}>
      <Hero src="/img/hero-forest.webp" height="calc(var(--sb-h) + 120px)" shade="up" position="50% 52%" />
      <header className={styles.header}>
        <div className={ui.headerRow}>
          <BackButton />
          <div className={ui.headerGroup}>
            <ShareButton />
            <CartButton />
            <CurrencyButton />
          </div>
        </div>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>User guide</h1>
          <span className={cx(plans.compat, styles.compat)}>
            <span className={plans.compatInfo}>
              <Img src="/icons/check-circle-green.svg" size={22} eager style={{ margin: 1 }} />
              Compatible with this device
            </span>
          </span>
        </div>
      </header>
      <div className={cx(ui.scroll, plans.panel)}>
        <div className={styles.inner}>
          <ol className={styles.steps}>
            {GUIDE_STEPS.map((s, i) => (
              <li key={s.title} className={styles.step}>
                <span className={styles.rail} aria-hidden="true">
                  <span className={styles.num}>{i + 1}</span>
                  {i < GUIDE_STEPS.length - 1 ? <span className={styles.line} /> : null}
                </span>
                <span className={styles.stepText}>
                  <span className={styles.stepTitle}>{s.title}</span>
                  <span className={styles.stepBody}>{s.body}</span>
                </span>
              </li>
            ))}
          </ol>
          <GuideLinksSection />
          <FaqSection />
        </div>
      </div>
    </div>
  );
}
