"use client";

import { useState } from "react";
import { AuthFlow } from "../auth/AuthFlow";
import { useApp } from "../store";
import { Field, SelectField } from "../ui/Field";
import { cx, ui, useCollapse } from "../ui/parts";
import {
  CardHead,
  CartItemsCard,
  CheckoutHero,
  CheckoutTopBar,
  ConsentRow,
  CouponRow,
  PaymentRow,
  TotalsBar,
} from "./CartParts";
import plans from "./plans.module.css";
import styles from "./cart.module.css";

const COUNTRIES = ["France", "Germany", "Japan", "Spain", "Taiwan", "United Kingdom", "United States"];

type BillingForm = {
  first: string;
  last: string;
  company: string;
  vat: string;
  address: string;
  address2: string;
  zip: string;
  city: string;
  country: string;
};

const EMPTY: BillingForm = { first: "", last: "", company: "", vat: "", address: "", address2: "", zip: "", city: "", country: "" };
const SAMPLE: BillingForm = {
  first: "Zylan",
  last: "Weather",
  company: "",
  vat: "",
  address: "12 Rue de la Lumière",
  address2: "",
  zip: "75011",
  city: "Paris",
  country: "France",
};

const REQUIRED: (keyof BillingForm)[] = ["first", "last", "address", "zip", "city", "country"];

function BillingFormCard({ onDone }: { onDone: () => void }) {
  const { state, actions } = useApp();
  const [f, setF] = useState<BillingForm>(EMPTY);
  const [tried, setTried] = useState(false);
  const set = (k: keyof BillingForm) => (v: string) => setF({ ...f, [k]: v });
  const err = (k: keyof BillingForm) => (tried && REQUIRED.includes(k) && !f[k].trim() ? "Required" : null);
  const fill = () => setF({ ...SAMPLE, first: state.user?.name ?? SAMPLE.first });

  return (
    <form
      className={styles.billingForm}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        if (REQUIRED.some((k) => !f[k].trim())) return;
        actions.setBilling({
          name: `${f.first} ${f.last}`,
          line: `${f.address}${f.address2 ? `, ${f.address2}` : ""},${f.zip} ${f.city},${f.country}`,
        });
        onDone();
      }}
    >
      <button type="button" className={styles.sampleLink} onClick={fill}>
        Fill sample address
      </button>
      <Field label="First name" autoComplete="given-name" value={f.first} onChange={set("first")} error={err("first")} />
      <Field label="Last name" autoComplete="family-name" value={f.last} onChange={set("last")} error={err("last")} />
      <Field label="Enterprise (optional)" autoComplete="organization" value={f.company} onChange={set("company")} />
      <Field label="VAT (optional)" value={f.vat} onChange={set("vat")} />
      <Field label="Address" autoComplete="address-line1" value={f.address} onChange={set("address")} error={err("address")} />
      <Field label="Address 2 (optional)" autoComplete="address-line2" value={f.address2} onChange={set("address2")} />
      <Field label="Zip code" autoComplete="postal-code" value={f.zip} onChange={set("zip")} error={err("zip")} />
      <Field label="City" autoComplete="address-level2" value={f.city} onChange={set("city")} error={err("city")} />
      <SelectField label="Country" value={f.country} onChange={set("country")} options={COUNTRIES} error={err("country")} />
      <button type="submit" className={cx(ui.btn, ui.btnPrimary, ui.btnBlock)}>
        Continue
      </button>
    </form>
  );
}

export function CheckoutScreen() {
  const { state, actions } = useApp();
  const [contactOpen, setContactOpen] = useState(true);
  const [billingOpen, setBillingOpen] = useState(true);
  const [tried, setTried] = useState(false);
  const [consentNudge, setConsentNudge] = useState(0);
  const { screenRef, scrollRef, headerRef } = useCollapse();

  const step = !state.user ? 1 : !state.billing ? 2 : !state.payment ? 3 : 4;
  const missing = {
    contact: !state.user,
    billing: !state.billing,
    payment: !state.payment,
    consent: !state.consent,
  };

  const purchase = () => {
    setTried(true);
    if (missing.consent && !missing.contact && !missing.billing) setConsentNudge((n) => n + 1);
    if (Object.values(missing).some(Boolean) || state.cart.length === 0) return;
    actions.purchase();
    actions.openOverlay("success");
  };

  const problems = [
    missing.contact && "sign in",
    missing.billing && "add a billing address",
    missing.payment && "choose a payment method",
    missing.consent && "confirm device compatibility",
  ].filter(Boolean) as string[];

  return (
    <div className={ui.screen} ref={screenRef}>
      <CheckoutTopBar title="Checkout" />
      <div className={ui.scroll} ref={scrollRef}>
        <CheckoutHero title="Checkout" photo="/img/hero-balloons.webp" step={step} headerRef={headerRef} />
        <div className={cx(plans.panel, styles.panelInner)}>
          {state.user ? (
            <section className={styles.card} aria-label="Contact information">
              <div className={styles.signedIn}>
                <span className={styles.cardTitle}>Hi, {state.user.name}</span>
                <span className={styles.cardSub}>eSIM will be sent to {state.user.email}.</span>
              </div>
            </section>
          ) : (
            <section
              className={cx(styles.card, contactOpen && styles.cardOpen, tried && missing.contact && styles.cardError)}
              aria-label="Contact information"
            >
              <CardHead
                title="Contact information"
                open={contactOpen}
                onToggle={() => setContactOpen(!contactOpen)}
                controls="contact-body"
              />
              {contactOpen ? (
                <div id="contact-body">
                  <AuthFlow />
                </div>
              ) : null}
            </section>
          )}

          <section
            className={cx(
              styles.card,
              state.user && !state.billing && billingOpen && styles.cardOpen,
              tried && missing.billing && styles.cardError,
            )}
            aria-label="Billing address"
          >
            {state.billing ? (
              <CardHead
                title={`${state.billing.name} - \n${state.billing.line}`}
                sub="Billing address"
                open={false}
                onToggle={() => {
                  actions.setBilling(null);
                  setBillingOpen(true);
                }}
              />
            ) : (
              <>
                <CardHead
                  title="Billing address"
                  open={!!state.user && billingOpen}
                  onToggle={state.user ? () => setBillingOpen(!billingOpen) : () => setContactOpen(true)}
                  controls="billing-body"
                />
                {state.user && billingOpen ? (
                  <div id="billing-body">
                    <BillingFormCard onDone={() => setBillingOpen(false)} />
                  </div>
                ) : null}
              </>
            )}
          </section>

          <CartItemsCard />
          <CouponRow />
          <PaymentRow error={tried && missing.payment} />
          <ConsentRow error={tried && missing.consent} nudge={consentNudge} />
          {tried && problems.length ? (
            <p className={styles.errorSummary} role="alert">
              To purchase, please {problems.join(", ")}.
            </p>
          ) : null}
        </div>
      </div>
      <TotalsBar label="Purchase" onPress={purchase} payment />
    </div>
  );
}
