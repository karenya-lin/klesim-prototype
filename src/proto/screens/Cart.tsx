"use client";

import { useState } from "react";
import { useApp } from "../store";
import { cx, ui, useCollapse } from "../ui/parts";
import {
  CartItemsCard,
  CheckoutHero,
  CheckoutTopBar,
  ConsentRow,
  CouponRow,
  HelpRow,
  PaymentRow,
  TotalsBar,
} from "./CartParts";
import plans from "./plans.module.css";
import styles from "./cart.module.css";

export function CartScreen() {
  const { state, actions } = useApp();
  const [tried, setTried] = useState(false);
  const [consentNudge, setConsentNudge] = useState(0);
  const signedIn = !!state.user && !!state.billing;
  const paymentError = tried && !state.payment;
  const consentError = tried && !state.consent;
  const { screenRef, scrollRef, headerRef } = useCollapse();

  const purchase = () => {
    setTried(true);
    if (!state.consent) setConsentNudge((n) => n + 1);
    if (!state.payment || !state.consent || state.cart.length === 0) return;
    actions.purchase();
    actions.openOverlay("success");
  };

  return (
    <div className={ui.screen} ref={screenRef}>
      <CheckoutTopBar title="Cart" share={signedIn} />
      <div className={ui.scroll} ref={scrollRef}>
        <CheckoutHero
          title="Cart"
          photo={signedIn ? "/img/hero-balloons.webp" : "/img/hero-wing-bw.webp"}
          headerRef={headerRef}
        />
        <div className={cx(plans.panel, styles.panelInner)}>
          <CartItemsCard defaultOpen={!signedIn} />
          <CouponRow />
          <PaymentRow error={paymentError} />
          <ConsentRow error={consentError} nudge={consentNudge} />
          {paymentError || consentError ? (
            <p className={styles.errorSummary} role="alert">
              {paymentError && consentError
                ? "Choose a payment method and confirm your device is compatible."
                : paymentError
                  ? "Choose a payment method."
                  : "Confirm your device is compatible with eSIM."}
            </p>
          ) : null}
          <HelpRow />
        </div>
      </div>
      <TotalsBar
        label={signedIn ? "Purchase" : "Checkout"}
        onPress={signedIn ? purchase : () => actions.navigate("checkout")}
        payment={signedIn}
      />
    </div>
  );
}
