"use client";

import { useId, useState, type ReactNode } from "react";
import { FAQS, GUIDE_LINKS } from "../data";
import { useApp, type RouteId } from "../store";
import { Img } from "./Img";
import { ChatSupport, ChevronLeft, NavAccount, NavHome, NavSim, XMark } from "./icons";
import styles from "./ui.module.css";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/* ---------- header buttons ---------- */

export function BackButton({ soft, ghost, onClick }: { soft?: boolean; ghost?: boolean; onClick?: () => void }) {
  const { actions } = useApp();
  return (
    <button
      type="button"
      className={cx(styles.roundBtn, soft && styles.roundBtnSoft, ghost && styles.roundBtnGhost)}
      onClick={onClick ?? actions.back}
      aria-label="Back"
    >
      <ChevronLeft className={styles.chevronBack} />
    </button>
  );
}

export function ShareButton() {
  return (
    <button type="button" className={styles.roundBtn} aria-label="Share" onClick={() => undefined}>
      <Img src="/icons/share-white.svg" size={22} eager />
    </button>
  );
}

export function CartButton({ soft, badge = true }: { soft?: boolean; badge?: boolean }) {
  const { state, actions } = useApp();
  const count = state.cart.length;
  return (
    <button
      type="button"
      className={cx(styles.roundBtn, soft && styles.roundBtnSoft)}
      onClick={() => actions.navigate("cart")}
      aria-label={count ? `Cart, ${count} items` : "Cart"}
    >
      <Img src="/icons/cart-white.svg" width={20} height={20} eager />
      {badge && count > 0 ? (
        <span className={styles.badge} aria-hidden="true">
          {count}
        </span>
      ) : null}
    </button>
  );
}

export function CurrencyButton({ soft }: { soft?: boolean }) {
  return (
    <button type="button" className={cx(styles.roundBtn, soft && styles.roundBtnSoft)} aria-label="Currency: Euro">
      <span aria-hidden="true">€</span>
      <Img src="/icons/caret-down-white.svg" size={16} eager />
    </button>
  );
}

export function CloseButton({ onClick, label = "Close" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" className={styles.closeBtn} onClick={onClick} aria-label={label}>
      <XMark />
    </button>
  );
}

/* ---------- hero photo ---------- */

export function Hero({
  src,
  height,
  shade,
  rounded,
  position,
}: {
  src: string;
  height: string;
  shade: "up" | "down";
  rounded?: boolean;
  position?: string;
}) {
  return (
    <div
      className={cx(styles.hero, shade === "up" ? styles.heroShadeUp : styles.heroShadeDown, rounded && styles.heroRounded)}
      style={{ height }}
      aria-hidden="true"
    >
      <Img src={src} className={styles.heroImg} style={position ? { objectPosition: position } : undefined} eager />
    </div>
  );
}

/* ---------- bottom nav ---------- */

const TABS: { id: RouteId; label: string; icon: (p: { className?: string; active?: boolean }) => ReactNode }[] = [
  { id: "home", label: "Home", icon: NavHome },
  { id: "myEsim", label: "My eSIM", icon: NavSim },
  { id: "profile", label: "Profile", icon: NavAccount },
];

export function BottomNav({ active }: { active: RouteId }) {
  const { actions } = useApp();
  return (
    <nav className={styles.bottomNav} aria-label="Main">
      {TABS.map((t) => {
        const Icon = t.icon;
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            className={cx(styles.navItem, isActive && styles.navItemActive)}
            aria-current={isActive ? "page" : undefined}
            onClick={() => actions.tab(t.id)}
          >
            <Icon active={isActive} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ---------- FAQ accordion ---------- */

export function FaqSection({ title = "FAQ" }: { title?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();
  return (
    <section className={styles.section} aria-labelledby={`${baseId}-h`}>
      <h2 id={`${baseId}-h`} className={styles.h20}>
        {title}
      </h2>
      <div className={cx(styles.card, styles.faqCard)}>
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className={cx(styles.faqItem, isOpen && styles.faqOpen)}>
              <button
                type="button"
                className={styles.faqQ}
                aria-expanded={isOpen}
                aria-controls={`${baseId}-a${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{f.q}</span>
                <Img src="/icons/caret-down-gray.svg" size={24} className={styles.faqArrow} />
              </button>
              <div id={`${baseId}-a${i}`} className={styles.faqA} role="region" aria-label={f.q}>
                <div className={styles.faqAInner}>
                  <p>{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
        <button type="button" className={styles.chatBtn}>
          <ChatSupport />
          Chat with us
        </button>
      </div>
    </section>
  );
}

/* ---------- user guide links ---------- */

export function GuideLinksSection() {
  const { actions } = useApp();
  return (
    <section className={styles.section} aria-labelledby="guide-links-h">
      <div className={styles.sectionHead}>
        <h2 id="guide-links-h" className={styles.h20}>
          eSIM User Guide
        </h2>
        <button type="button" className={styles.linkSf}>
          <Img src="/icons/download.svg" size={24} />
          Install eSIM PDF
        </button>
      </div>
      <div className={cx(styles.card, styles.guideLinks)}>
        {GUIDE_LINKS.map((l, i) => (
          <span key={l} style={{ display: "contents" }}>
            <button type="button" className={styles.guideLink} onClick={() => actions.navigate("guide")}>
              {l}
            </button>
            {i < GUIDE_LINKS.length - 1 ? <span className={styles.guideSep} aria-hidden="true" /> : null}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ---------- quantity stepper ---------- */

export function Stepper({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className={styles.stepper} role="group" aria-label={label}>
      <button
        type="button"
        className={styles.stepBtn}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <Img src="/icons/minus.svg" size={24} />
      </button>
      <span className={styles.stepValue} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={styles.stepBtn}
        onClick={() => onChange(value + 1)}
        disabled={value >= 9}
        aria-label="Increase quantity"
      >
        <Img src="/icons/plus.svg" size={24} />
      </button>
    </div>
  );
}

export function Radio({ checked }: { checked: boolean }) {
  return <Img src={checked ? "/icons/radio-on.svg" : "/icons/radio-off.svg"} size={24} className={styles.radio} />;
}

export { styles as ui };
