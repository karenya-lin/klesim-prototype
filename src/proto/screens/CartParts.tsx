"use client";

import { useEffect, useId, useRef, useState, type ReactNode, type Ref } from "react";
import { currencyOf } from "../data";
import { PAYMENT_LABEL, cartTotals, useApp, useMoney } from "../store";
import { Img } from "../ui/Img";
import { AlertCircle, ChatSupport, ChevronSmall } from "../ui/icons";
import { BackButton, CloseButton, CurrencyButton, Hero, ShareButton, TopBar, cx, ui } from "../ui/parts";
import styles from "./cart.module.css";

export function CheckoutTopBar({ title, share }: { title: string; share?: boolean }) {
  return (
    <TopBar
      leading={<BackButton />}
      title={title}
      actions={
        <>
          {share ? <ShareButton /> : null}
          <CurrencyButton />
        </>
      }
    />
  );
}

/** Large cart / checkout header (photo, title, steps); scrolls under the pinned CheckoutTopBar. */
export function CheckoutHero({
  title,
  photo,
  step,
  headerRef,
}: {
  title: string;
  photo: string;
  step?: number;
  headerRef: Ref<HTMLElement>;
}) {
  return (
    <>
      <Hero src={photo} height="calc(var(--sb-h) + 114px)" shade="up" />
      <header className={cx(styles.header, ui.collapseFade)} ref={headerRef}>
        <div className={ui.headerRowSpace} />
        <div className={cx(styles.titleRow, step ? styles.titleRowSplit : null)}>
          <h1 className={styles.title}>{title}</h1>
          {step ? <StepIndicator step={step} /> : null}
        </div>
      </header>
    </>
  );
}

const STEP_NAMES = ["Contact", "Billing address", "Payment", "Review"];

/** Progress dots with the current step named under them, so the dots never have to be decoded. */
function StepIndicator({ step }: { step: number }) {
  return (
    <div className={styles.stepsCol}>
      <div className={styles.steps} aria-hidden="true">
        {STEP_NAMES.map((n, i) => (
          <span key={n} style={{ display: "contents" }}>
            {i > 0 ? <span className={styles.stepLine} /> : null}
            {i + 1 === step ? (
              <span className={styles.stepPill}>{step}</span>
            ) : (
              <span className={cx(styles.stepDot, i + 1 < step && styles.stepDotDone)} />
            )}
          </span>
        ))}
      </div>
      <p className={styles.stepLabel}>
        Step {step} of {STEP_NAMES.length}: {STEP_NAMES[step - 1]}
      </p>
    </div>
  );
}

export function CardHead({
  title,
  sub,
  open,
  onToggle,
  controls,
}: {
  title: ReactNode;
  sub?: ReactNode;
  open?: boolean;
  onToggle?: () => void;
  controls?: string;
}) {
  const inner = (
    <>
      <span className={styles.cardHeadText}>
        <span className={styles.cardTitle}>{title}</span>
        {sub ? <span className={styles.cardSub}>{sub}</span> : null}
      </span>
      {onToggle ? (
        <Img src="/icons/caret-down-gray.svg" size={24} className={cx(styles.arrow, open && styles.arrowUp)} />
      ) : null}
    </>
  );
  return onToggle ? (
    <button type="button" className={styles.cardHead} aria-expanded={open} aria-controls={controls} onClick={onToggle}>
      {inner}
    </button>
  ) : (
    <div className={styles.cardHead}>{inner}</div>
  );
}

/**
 * Removing a line leaves an inline "removed · Undo" row at the top of the list (no timer, so it can be reached
 * by keyboard); focus moves to Undo, and back to the restored line after undoing.
 */
export function CartItemsCard({ defaultOpen }: { defaultOpen?: boolean }) {
  const { state, actions } = useApp();
  const money = useMoney();
  const [open, setOpen] = useState(!!defaultOpen);
  const totals = cartTotals(state);
  const linesRef = useRef<HTMLDivElement>(null);
  const undoRef = useRef<HTMLButtonElement>(null);
  const [focusTarget, setFocusTarget] = useState<{ key: string | null; n: number }>({ key: null, n: 0 });
  const removed = state.removed;

  useEffect(() => {
    if (!focusTarget.n) return;
    if (focusTarget.key) {
      linesRef.current?.querySelector<HTMLElement>(`[data-line="${focusTarget.key}"] button`)?.focus();
    } else {
      undoRef.current?.focus();
    }
  }, [focusTarget]);

  const undoRow = removed ? (
    <div className={styles.removed}>
      <span>{removed.item.title} removed from your cart.</span>
      <button
        ref={undoRef}
        type="button"
        className={styles.undoBtn}
        aria-label={`Undo removing ${removed.item.title}`}
        onClick={() => {
          actions.undoRemove();
          setFocusTarget((f) => ({ key: removed.item.key, n: f.n + 1 }));
        }}
      >
        Undo
      </button>
    </div>
  ) : null;

  return (
    <section className={cx(styles.card, open && styles.cardOpen)} aria-label="Cart items">
      <CardHead
        title={open ? `Cart items (${totals.count})` : `Cart items (${totals.count}) - ${money(totals.product)}`}
        sub="Up to 10 eSIMs per order"
        open={open}
        onToggle={() => setOpen(!open)}
        controls="cart-lines"
      />
      {open ? (
        <div
          id="cart-lines"
          ref={linesRef}
          style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}
        >
          {undoRow}
          {state.cart.length === 0 ? (
            <div className={styles.empty}>
              <p>Your cart is empty.</p>
              <button type="button" className={cx(ui.btn, ui.btnPrimary)} onClick={() => actions.tab("home")}>
                Browse destinations
              </button>
            </div>
          ) : (
            state.cart.map((c, i) => (
              <div key={c.key} style={{ display: "contents" }}>
                {i > 0 ? <span className={styles.divider} aria-hidden="true" /> : null}
                <div className={styles.line} data-line={c.key}>
                  <div className={styles.lineHead}>
                    <span className={styles.flagRing} aria-hidden="true">
                      {c.flag ? <Img src={c.flag} size={36} /> : <Img src="/icons/klesim-mark.svg" size={28} />}
                    </span>
                    <Img src="/icons/esim-card.svg" width={60} height={40} />
                    <span className={styles.lineInfo}>
                      <strong>{c.title}</strong>
                      <span>{c.detail}</span>
                    </span>
                  </div>
                  <div className={styles.lineBottom}>
                    <span className={styles.linePrice}>
                      {c.was ? (
                        <span className={styles.lineWas}>
                          <span className="sr-only">was </span>
                          {money(c.was)}
                        </span>
                      ) : null}
                      <span className={styles.lineNow}>{money(c.price)}</span>
                    </span>
                    <div className={ui.stepper} role="group" aria-label={`${c.title} quantity`}>
                      {c.qty <= 1 ? (
                        <button
                          type="button"
                          className={ui.stepBtn}
                          aria-label={`Remove ${c.title}`}
                          onClick={() => {
                            actions.removeCartItem(c.key);
                            setFocusTarget((f) => ({ key: null, n: f.n + 1 }));
                          }}
                        >
                          <Img src="/icons/trash.svg" size={24} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={ui.stepBtn}
                          aria-label="Decrease quantity"
                          onClick={() => actions.setCartQty(c.key, c.qty - 1)}
                        >
                          <Img src="/icons/minus.svg" size={24} />
                        </button>
                      )}
                      <span className={ui.stepValue} aria-live="polite">
                        {c.qty}
                      </span>
                      <button
                        type="button"
                        className={ui.stepBtn}
                        aria-label="Increase quantity"
                        disabled={c.qty >= 9}
                        onClick={() => actions.setCartQty(c.key, c.qty + 1)}
                      >
                        <Img src="/icons/plus.svg" size={24} />
                      </button>
                    </div>
                  </div>
                </div>
                {c.note ? (
                  <div className={styles.important}>
                    <strong>Important</strong>
                    <p>{c.note}</p>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      ) : null}
    </section>
  );
}

export function CouponRow() {
  const { state, actions } = useApp();
  const money = useMoney();
  const totals = cartTotals(state);
  const has = state.coupons.length > 0;
  return (
    <section className={styles.card}>
      <button
        type="button"
        className={styles.cardHead}
        onClick={() => actions.openOverlay("coupon")}
        aria-haspopup="dialog"
      >
        <span className={styles.cardHeadText}>
          <span className={styles.cardTitle}>
            {has ? `Coupon (${state.coupons.length}) - ${money(totals.coupon)}` : "Have a coupon code?"}
          </span>
        </span>
        <span className={styles.rowAction}>{has ? "Change" : "Add"}</span>
        <span className={cx(styles.iconCircle, has && styles.iconCircleDark)}>
          <Img src={has ? "/icons/coupon-white.svg" : "/icons/coupon.svg"} size={24} />
        </span>
      </button>
    </section>
  );
}

export function PaymentRow({ error }: { error?: boolean }) {
  const { state, actions } = useApp();
  const p = state.payment;
  return (
    <section className={cx(styles.card, error && styles.cardError)}>
      <button
        type="button"
        className={styles.cardHead}
        onClick={() => actions.openOverlay("payment")}
        aria-haspopup="dialog"
        aria-describedby={error ? "payment-error" : undefined}
      >
        <span className={styles.cardHeadText}>
          <span className={styles.cardTitle}>{p ? PAYMENT_LABEL[p] : "Choose payment method"}</span>
          {error ? (
            <span id="payment-error" className="sr-only">
              Choose a payment method to continue.
            </span>
          ) : null}
          {p === "card" ? (
            <span className={styles.cardSub}>Card details are entered with the payment provider</span>
          ) : p ? (
            <span className={styles.cardSub}>Payment method</span>
          ) : null}
        </span>
        {p ? <span className={styles.rowAction}>Change</span> : null}
        <span className={cx(styles.iconCircle, p && styles.iconCircleSelected)}>
          <Img src="/icons/payment.svg" size={24} />
        </span>
      </button>
    </section>
  );
}

/**
 * `nudge`: bump it when Purchase is pressed without consent; the row then scrolls into view and takes focus,
 * so the inline error is seen and read out. Ids come from useId because Cart and Checkout stay mounted together.
 */
export function ConsentRow({ error, nudge = 0 }: { error?: boolean; nudge?: number }) {
  const { state, actions } = useApp();
  const checked = state.consent;
  const id = useId();
  const rowRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!nudge) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rowRef.current?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    inputRef.current?.focus({ preventScroll: true });
  }, [nudge]);

  return (
    <div className={styles.consent} ref={rowRef}>
      <div className={styles.consentRow}>
        <span className={styles.checkbox}>
          <Img
            src={checked ? "/icons/checkbox-on.svg" : error ? "/icons/checkbox-error.svg" : "/icons/checkbox-off.svg"}
            size={24}
          />
          <input
            ref={inputRef}
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => actions.setConsent(e.target.checked)}
            aria-invalid={error || undefined}
            aria-describedby={error ? `${id}-text ${id}-error` : `${id}-text`}
          />
        </span>
        <label htmlFor={id} id={`${id}-text`} className={styles.consentText}>
          I confirm that my device is compatible with eSIM.
          <br />
          <br />
          By clicking “Purchase”, you agree to the{" "}
          <a href="#refund" onClick={(e) => e.preventDefault()}>
            Refund&nbsp;Policy
          </a>{" "}
          and{" "}
          <a href="#terms" onClick={(e) => e.preventDefault()}>
            Terms&nbsp;of&nbsp;Service
          </a>
          .
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className={styles.consentError}>
          <AlertCircle />
          Tick the box to confirm your device supports eSIM.
        </p>
      ) : null}
    </div>
  );
}

/** Help at the point of purchase; same row pattern as coupon and payment. */
export function HelpRow() {
  const { actions } = useApp();
  return (
    <section className={styles.card}>
      <button
        type="button"
        className={styles.cardHead}
        onClick={() => actions.toast("info", "Opening chat", "A support agent will reply here")}
      >
        <span className={styles.cardHeadText}>
          <span className={styles.cardTitle}>Need help?</span>
        </span>
        <span className={styles.rowAction}>Chat with us</span>
        <span className={styles.iconCircle}>
          <ChatSupport />
        </span>
      </button>
    </section>
  );
}

/** `payment`: the step where the order is paid, so the charge currency and amount are spelled out. */
export function TotalsBar({ label, onPress, payment }: { label: string; onPress: () => void; payment?: boolean }) {
  const { state } = useApp();
  const money = useMoney();
  const [open, setOpen] = useState(false);
  const t = cartTotals(state);
  const cur = currencyOf(state.currency);
  return (
    <div className={styles.totals}>
      {open ? (
        <div className={styles.totalsPanel} id="totals-panel">
          <div className={styles.totalsHead}>
            <h2 className={ui.h20}>Total amount</h2>
            <CloseButton onClick={() => setOpen(false)} label="Close total amount" />
          </div>
          <div className={styles.totalRow}>
            <span>Product</span>
            <span>{money(t.product)}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Coupon</span>
            <span>-{money(t.coupon)}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Service fee</span>
            <span>{money(t.fee)}</span>
          </div>
          <div className={styles.totalRow}>
            <span>VAT</span>
            <span>{money(t.vat)}</span>
          </div>
        </div>
      ) : null}
      <div className={ui.bar}>
        <button
          type="button"
          className={styles.amountBtn}
          aria-expanded={open}
          aria-controls="totals-panel"
          onClick={() => setOpen(!open)}
        >
          <span className={styles.amountLabelRow}>
            <span className={ui.amountLabel}>Total amount</span>
            <ChevronSmall up={!open} />
          </span>
          <span className={ui.amountValue}>{money(t.total)}</span>
          {payment ? (
            <span className={styles.chargeLine}>
              You’ll be charged in {cur.code}
            </span>
          ) : null}
        </button>
        <button
          type="button"
          className={cx(ui.btn, ui.btnPrimary, styles.buy, payment && styles.buyWide)}
          onClick={onPress}
        >
          {payment ? `${label} ${money(t.total)}` : label}
        </button>
      </div>
    </div>
  );
}
