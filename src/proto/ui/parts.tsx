"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { FAQS, GUIDE_LINKS, currencyOf } from "../data";
import { useApp, type OverlayId, type RouteId } from "../store";
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

/** True while the given sheet is open (false as soon as it starts closing), for caret triggers. */
export function useSheetOpen(id: OverlayId) {
  const { state } = useApp();
  return state.overlay?.id === id && !state.overlay.closing;
}

export function CurrencyButton({ soft }: { soft?: boolean }) {
  const { state, actions } = useApp();
  const cur = currencyOf(state.currency);
  const open = useSheetOpen("currency");
  return (
    <button
      type="button"
      className={cx(styles.roundBtn, soft && styles.roundBtnSoft)}
      aria-label={`Currency: ${cur.name} (${cur.code}). Change currency`}
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={() => actions.openOverlay("currency")}
    >
      <span aria-hidden="true">{cur.symbol}</span>
      <Img src="/icons/caret-down-white.svg" size={16} eager className={cx(styles.caret, open && styles.caretUp)} />
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

/* ---------- collapsing top bar ---------- */

/**
 * Scroll-linked header collapse. Writes `--k` (0 expanded, 1 collapsed) on the screen root from the
 * screen's own scroll container, so the bar animates with transform / opacity and never re-renders per frame.
 * The large header scrolls with the content; `headerRef` marks where it ends.
 * Reduced motion: the bar switches between the two states instead of following the scroll.
 */
export function useCollapse() {
  const screenRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const screen = screenRef.current;
    const scroller = scrollRef.current;
    if (!screen || !scroller) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dist = 1;
    let frame = 0;
    let lastK = -1;
    let lastCollapsed = false;

    const measure = () => {
      const bar = screen.querySelector<HTMLElement>("[data-topbar]");
      const header = headerRef.current;
      const bottom = header ? header.offsetTop + header.offsetHeight : 0;
      dist = Math.max(1, bottom - (bar?.offsetHeight ?? 0));
    };
    const update = () => {
      frame = 0;
      const raw = Math.min(1, Math.max(0, scroller.scrollTop / dist));
      const k = reduce.matches ? (raw >= 0.5 ? 1 : 0) : raw;
      if (k !== lastK) {
        lastK = k;
        screen.style.setProperty("--k", k.toFixed(3));
      }
      const next = raw >= 0.5;
      if (next !== lastCollapsed) {
        lastCollapsed = next;
        setCollapsed(next);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const refresh = () => {
      measure();
      update();
    };

    refresh();
    const ro = new ResizeObserver(refresh);
    ro.observe(screen);
    if (headerRef.current) ro.observe(headerRef.current);
    scroller.addEventListener("scroll", onScroll, { passive: true });
    reduce.addEventListener("change", refresh);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      scroller.removeEventListener("scroll", onScroll);
      reduce.removeEventListener("change", refresh);
    };
  }, []);

  return { screenRef, scrollRef, headerRef, collapsed };
}

/**
 * The pinned top row of a screen: leading control (back or logo), a compact title that fades in
 * as the large header scrolls away, and the screen's actions. Sits over the scroll container.
 */
export function TopBar({ leading, title, actions }: { leading?: ReactNode; title?: string; actions?: ReactNode }) {
  return (
    <div className={styles.topBar} data-topbar>
      <div className={styles.topBarBg} aria-hidden="true" />
      <div className={styles.topBarRow}>
        {leading}
        {title ? (
          <span className={styles.topBarTitle} aria-hidden="true">
            {title}
          </span>
        ) : null}
        <div className={cx(styles.headerGroup, styles.topBarActions)}>{actions}</div>
      </div>
    </div>
  );
}

/** Search shortcut that only appears in the collapsed bar, once the search field has scrolled away. */
export function BarSearchButton({ shown, soft, onClick }: { shown: boolean; soft?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={cx(styles.roundBtn, soft && styles.roundBtnSoft, styles.topBarReveal)}
      aria-label="Search destinations"
      onClick={onClick}
      inert={!shown}
    >
      <Img src="/icons/search-white.svg" size={22} eager />
    </button>
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
        <ChatButton />
      </div>
    </section>
  );
}

/** Support chat entry; the prototype has no chat, so a toast confirms the press. */
export function ChatButton() {
  const { actions } = useApp();
  return (
    <button
      type="button"
      className={styles.chatBtn}
      onClick={() => actions.toast("info", "Opening chat", "A support agent will reply here")}
    >
      <ChatSupport />
      Chat with us
    </button>
  );
}

/* ---------- user guide links ---------- */

export function GuideLinksSection() {
  const { actions } = useApp();
  const headingId = useId();
  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className={styles.sectionHead}>
        <h2 id={headingId} className={styles.h20}>
          eSIM user guide
        </h2>
        <button type="button" className={styles.linkSf}>
          <Img src="/icons/download.svg" size={24} />
          PDF guide
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

/**
 * Radio-group keyboard pattern (ARIA APG): the checked radio is the group's only Tab stop, and the arrow keys
 * move to the next / previous radio and check it. Spread on every `role="radio"` button.
 */
const RADIO_STEP: Partial<Record<string, number>> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };

export function radioKeys(checked: boolean) {
  return {
    tabIndex: checked ? 0 : -1,
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      const step = RADIO_STEP[e.key];
      const group = e.currentTarget.closest('[role="radiogroup"]');
      if (!step || !group) return;
      const radios = Array.from(group.querySelectorAll<HTMLElement>('[role="radio"]'));
      const next = radios[(radios.indexOf(e.currentTarget) + step + radios.length) % radios.length];
      e.preventDefault();
      next.focus();
      next.click();
    },
  };
}

export function Radio({ checked }: { checked: boolean }) {
  return <Img src={checked ? "/icons/radio-on.svg" : "/icons/radio-off.svg"} size={24} className={styles.radio} />;
}

export { styles as ui };
