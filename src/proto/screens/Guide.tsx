"use client";

import { GUIDE_STEPS } from "../data";
import { Img } from "../ui/Img";
import {
  BackButton,
  CartButton,
  CurrencyButton,
  FaqSection,
  GuideLinksSection,
  Hero,
  ShareButton,
  TopBar,
  cx,
  ui,
  useCollapse,
} from "../ui/parts";
import plans from "./plans.module.css";
import styles from "./guide.module.css";

export function GuideScreen() {
  const { screenRef, scrollRef, headerRef } = useCollapse();
  return (
    <div className={ui.screen} ref={screenRef}>
      <TopBar
        leading={<BackButton />}
        title="User guide"
        actions={
          <>
            <ShareButton />
            <CartButton />
            <CurrencyButton />
          </>
        }
      />
      <div className={ui.scroll} ref={scrollRef}>
        <Hero src="/img/hero-forest.webp" height="calc(var(--sb-h) + 120px)" shade="up" position="50% 52%" />
        <header className={cx(styles.header, ui.collapseFade)} ref={headerRef}>
          <div className={ui.headerRowSpace} />
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
        <div className={cx(plans.panel, styles.inner)}>
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
