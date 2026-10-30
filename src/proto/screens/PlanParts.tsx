"use client";

import type { Ref } from "react";
import { coverageFor, coverageLabel, findDestination } from "../data";
import { selectionPrice, useApp, useMoney } from "../store";
import { Img } from "../ui/Img";
import { CartAdd } from "../ui/icons";
import { BackButton, CartButton, CurrencyButton, Hero, ShareButton, Stepper, TopBar, cx, ui, useSheetOpen } from "../ui/parts";
import styles from "./plans.module.css";

export function PlanTopBar() {
  const { state } = useApp();
  const dest = findDestination(state.destination);
  return (
    <TopBar
      leading={<BackButton />}
      title={dest.name}
      actions={
        <>
          <ShareButton />
          <CartButton />
          <CurrencyButton />
        </>
      }
    />
  );
}

/** Large plans header (photo, destination pill, compatibility); scrolls under the pinned PlanTopBar. */
export function PlanHero({ headerRef }: { headerRef: Ref<HTMLElement> }) {
  const { state, actions } = useApp();
  const dest = findDestination(state.destination);
  const coverage = coverageLabel(coverageFor(dest));
  const destOpen = useSheetOpen("destination");
  const coverageOpen = useSheetOpen("coverage");
  return (
    <>
      <Hero src="/img/hero-balloons.webp" height="calc(var(--sb-h) + 190px)" shade="up" />
      <header className={cx(styles.header, ui.collapseFade)} ref={headerRef}>
        <div className={ui.headerRowSpace} />
        <div className={styles.regionRow}>
          <h1 className="sr-only">{dest.name} eSIM plans</h1>
          <button
            type="button"
            className={styles.regionBtn}
            onClick={() => actions.openOverlay("destination")}
            aria-haspopup="dialog"
            aria-expanded={destOpen}
            aria-label={`Destination: ${dest.name}. Change destination`}
          >
            <span>{dest.name}</span>
            <Img src="/icons/caret-down-dark.svg" size={16} eager className={cx(ui.caret, destOpen && ui.caretUp)} />
          </button>
          <div className={styles.regionInfo}>
            <button
              type="button"
              className={styles.regionCount}
              onClick={() => actions.openOverlay("coverage")}
              aria-haspopup="dialog"
              aria-expanded={coverageOpen}
              aria-label={`Coverage: ${coverage}. Show the list`}
            >
              {coverage}
              <Img src="/icons/caret-down-white.svg" size={16} eager className={cx(ui.caret, coverageOpen && ui.caretUp)} />
            </button>
            <button
              type="button"
              className={styles.regionList}
              onClick={() => actions.openOverlay("regionInfo")}
              aria-haspopup="dialog"
            >
              <Img src="/icons/question-white.svg" width={13} height={15} eager />
              Available Region list
            </button>
          </div>
        </div>
        <div className={styles.compat}>
          <span className={styles.compatInfo}>
            <Img src="/icons/check-circle-green.svg" size={22} eager style={{ margin: 1 }} />
            Compatible with this device
          </span>
          <button type="button" className={styles.compatLink} onClick={() => actions.navigate("guide")}>
            User guide
          </button>
        </div>
      </header>
    </>
  );
}

export function PlanBottomBar({ onCheckout }: { onCheckout: () => void }) {
  const { state, actions } = useApp();
  const money = useMoney();
  const subtotal = selectionPrice(state) * state.qty;
  return (
    <div className={ui.barStack}>
      <div className={ui.bar}>
        <div className={ui.amount}>
          <span className={ui.amountLabel}>Subtotal (Tax&nbsp;excluded)</span>
          <span className={ui.amountValue} aria-live="polite">
            {money(subtotal)}
          </span>
        </div>
        <Stepper value={state.qty} onChange={actions.setQty} label="Number of eSIMs" />
      </div>
      <div className={ui.bar}>
        <button
          type="button"
          className={cx(ui.btn, ui.btnDark, ui.cartAddBtn)}
          aria-label="Add to cart"
          onClick={() => {
            actions.addToCart();
            const what = `${state.qty} ${findDestination(state.destination).name} eSIM${state.qty > 1 ? "s" : ""}`;
            actions.toast("cart", "Added to cart", what);
          }}
        >
          <CartAdd />
        </button>
        <button type="button" className={cx(ui.btn, ui.btnPrimary)} style={{ flex: "1 1 0" }} onClick={onCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
}

export function CouponRibbon() {
  return (
    <span className={styles.ribbon} aria-hidden="true">
      <span className={styles.ribbonCircle}>
        <Img src="/icons/flag-disc.svg" size={32} />
      </span>
      <span className={styles.ribbonTab}>
        <Img src="/icons/coupon-outline.svg" size={24} />
      </span>
      <Img src="/icons/ribbon-fold.svg" width={5} height={3} className={styles.ribbonFold} />
    </span>
  );
}
