"use client";

import { useState } from "react";
import { CURRENCIES, DESTINATIONS, PLANS, SHEET_DESTINATIONS, destinationMeta, findDestination } from "../data";
import {
  PAYMENT_LABEL,
  SAMPLE_COUPONS,
  cartTotals,
  maskEmail,
  useApp,
  useMoney,
  type Coupon,
  type PaymentId,
} from "../store";
import { Img } from "../ui/Img";
import { ChatSupport, QuestionCircle } from "../ui/icons";
import { cx, ui } from "../ui/parts";
import { Sheet } from "./Sheet";
import home from "../screens/home.module.css";
import styles from "./sheets.module.css";

const FLAGS: Record<string, string> = {
  france: "/icons/flag-france.svg",
  japan: "/icons/flag-japan.svg",
  spain: "/icons/flag-spain.svg",
};

function Globe() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="#276CB4" />
      <path
        d="M3 16h26M16 2c3.6 3.6 5.4 8.2 5.4 14S19.6 26.4 16 30c-3.6-3.6-5.4-8.2-5.4-14S12.4 5.6 16 2Z"
        stroke="#fff"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function FlagChip({ name }: { name: string }) {
  const src = FLAGS[name.toLowerCase()];
  return (
    <span className={styles.flagChip} aria-hidden="true">
      {src ? <Img src={src} size={32} /> : <Globe />}
    </span>
  );
}

/* ---------- Choose destination (84:13657) ---------- */

type DestTab = "popular" | "country" | "regional";

export function DestinationSheet() {
  const { state, actions } = useApp();
  const money = useMoney();
  const [tab, setTab] = useState<DestTab>("popular");
  const [picked, setPicked] = useState(findDestination(state.destination).id);

  const list =
    tab === "popular"
      ? SHEET_DESTINATIONS.map((id) => DESTINATIONS.find((d) => d.id === id)!)
      : DESTINATIONS.filter((d) => (tab === "country" ? d.kind === "country" : d.kind === "region"));

  return (
    <Sheet
      title="Choose destination"
      titleText="destination picker"
      footer={
        <button
          type="button"
          className={cx(ui.btn, ui.btnPrimary, ui.btnBlock)}
          onClick={() => {
            const d = DESTINATIONS.find((x) => x.id === picked);
            if (d) actions.setDestination(d.name);
            actions.closeOverlay();
          }}
        >
          Continue
        </button>
      }
    >
      <button
        type="button"
        className={styles.searchBar}
        onClick={() => actions.closeOverlay(() => actions.navigate("search", "fade"))}
      >
        <span>Find destination</span>
        <Img src="/icons/search-dark.svg" size={24} />
      </button>
      <div className={styles.tabs} role="tablist" aria-label="Destination type">
        {(
          [
            ["popular", "Popular"],
            ["country", "Country"],
            ["regional", "Regional Package"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={cx(home.tab, tab === id && home.tabActive)}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.options} role="radiogroup" aria-label="Destinations">
        {list.map((d) => {
          const selected = picked === d.id;
          return (
            <button
              key={d.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={cx(styles.option, selected && styles.optionSelected)}
              onClick={() => setPicked(d.id)}
            >
              <Img src="/icons/esim-card.svg" width={60} height={40} />
              <span className={styles.optionText}>
                <span className={styles.optionTitle}>{d.name}</span>
                <span className={styles.optionMeta}>{destinationMeta(d, money)}</span>
              </span>
              {selected ? (
                <span className={styles.check}>
                  <Img src="/icons/check-circle-blue.svg" size={22} />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}

/* ---------- Plan details (72:5301) ---------- */

export function DetailsSheet() {
  const { state } = useApp();
  const money = useMoney();
  const plan = PLANS.find((p) => p.id === (state.overlay?.planId ?? state.planId)) ?? PLANS[1];
  const dest = findDestination(state.destination);
  const rows: { title: string; body: string; icon?: "arrow" | "question" | "chat" }[] = [
    { title: "Speed", body: "Check country-specific speed details", icon: "arrow" },
    { title: "Service", body: "Data only" },
    { title: "Network", body: "Check country-specific network details", icon: "arrow" },
    {
      title: "Activation",
      body: "Automatically activates when connected to the network, or 60 days after purchase",
      icon: "question",
    },
    { title: "Rechargeable", body: plan.kind === "total" ? "Yes" : "No", icon: "question" },
    {
      title: "Coverage",
      body: "Coverage may not include certain designated countries (or multiple countries) and their overseas territories. Please confirm with customer service before purchase.",
      icon: "chat",
    },
    { title: "Provider", body: "Local partner network" },
    { title: "Refund Policy", body: "See KLeSIM refund policy", icon: "arrow" },
  ];
  return (
    <Sheet title={dest.name} titleText="plan details" leading={<FlagChip name={dest.name} />}>
      <div className={styles.planRow}>
        <Img src="/icons/esim-card.svg" width={60} height={40} />
        <span className={styles.planRowInfo}>
          <strong>
            {plan.title}
            {plan.unit ?? ""}
          </strong>
          <span>4G / 5G</span>
        </span>
        <span className={styles.planRowPrice}>{money(plan.price)}</span>
      </div>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.infoText}>
            <strong>Plan</strong>
            <span>{plan.allowance}</span>
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoText}>
            <strong>Validity</strong>
            <span>{plan.validity}</span>
          </span>
        </div>
      </div>
      {rows.map((r) => {
        const content = (
          <>
            <span className={styles.infoText}>
              <strong>{r.title}</strong>
              <span>{r.body}</span>
            </span>
            {r.icon === "arrow" ? <Img src="/icons/arrow-up-right.svg" size={24} /> : null}
            {r.icon === "question" ? <QuestionCircle /> : null}
            {r.icon === "chat" ? <ChatSupport /> : null}
          </>
        );
        return r.icon ? (
          <button key={r.title} type="button" className={styles.infoItem}>
            {content}
          </button>
        ) : (
          <div key={r.title} className={styles.infoItem}>
            {content}
          </div>
        );
      })}
    </Sheet>
  );
}

/* ---------- Terms & Conditions (112:16301) ---------- */

const TERMS = [
  "Eligibility",
  "The eSIM service is available only for devices that are unlocked and compatible with eSIM technology.",
  "Customers are responsible for ensuring that their device supports eSIM before purchase.",
  "Activation & Usage",
  "The eSIM can only be activated once and is non-transferable.",
  "Service validity begins at the time of activation or within the validity period stated at purchase, whichever comes first.",
  "Data plans are subject to local network coverage and availability.",
  "Limitations",
  "Voice calls, SMS, and tethering may not be supported unless explicitly stated.",
  "Network speed and quality may vary depending on local operators, coverage, and network congestion.",
  "Certain countries or regions may restrict eSIM usage due to local policies.",
  "Refund & Cancellation",
  "Once the eSIM QR code is delivered or activated, it cannot be refunded, exchanged, or transferred.",
  "Refund requests are only accepted if the eSIM cannot be activated due to technical issues not caused by the customer.",
  "Customer Responsibility",
  "Customers must ensure sufficient data balance before traveling.",
  "Misuse of the eSIM (e.g., reselling, fraudulent use) will result in immediate termination without refund.",
  "Liability",
  "The provider is not responsible for service interruptions caused by third-party operators, roaming restrictions, or unforeseen technical issues.",
  "The provider shall not be liable for indirect losses such as missed communications, business losses, or personal inconvenience.",
  "Privacy & Data",
  "Customer data will be handled in accordance with applicable privacy laws and regulations.",
  "Network usage may be subject to monitoring by local carriers as required by law.",
  "Governing Law",
  "These Terms & Conditions are governed by the laws of the country where the service provider is registered.",
  "Any disputes shall be resolved in accordance with the local jurisdiction of the provider.",
].join("\n\n");

export function TermsSheet() {
  const { state } = useApp();
  const money = useMoney();
  const plan = PLANS.find((p) => p.id === (state.overlay?.planId ?? state.planId)) ?? PLANS[1];
  const dest = findDestination(state.destination);
  return (
    <Sheet title={dest.name} titleText="terms and conditions" leading={<FlagChip name={dest.name} />}>
      <div className={styles.planRow}>
        <Img src="/icons/esim-card.svg" width={60} height={40} />
        <span className={styles.planRowInfo}>
          <strong>
            {plan.title}
            {plan.unit ?? ""}
          </strong>
          <span>4G / 5G</span>
        </span>
        <span className={styles.planRowPrice}>{money(plan.price)}</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.infoText}>
          <strong>Terms &amp; Condition</strong>
          <span className={styles.terms}>{TERMS}</span>
        </span>
      </div>
    </Sheet>
  );
}

/* ---------- Add coupon (111:4561 / 97:11811 / 111:7624) ---------- */

export function CouponSheet() {
  const { state, actions } = useApp();
  const money = useMoney();
  const [wallet, setWallet] = useState<Coupon[]>(() => {
    const extra = SAMPLE_COUPONS.filter((s) => !state.coupons.some((c) => c.code === s.code));
    return state.coupons.length ? [...state.coupons, ...extra] : [];
  });
  const [selected, setSelected] = useState<string[]>(state.coupons.map((c) => c.code));
  const [code, setCode] = useState("");
  const total = wallet.filter((c) => selected.includes(c.code)).reduce((n, c) => n + c.amount, 0);
  const adding = code.trim().length > 0 || wallet.length === 0;

  const add = () => {
    const typed = code.trim();
    const next =
      typed && !wallet.some((c) => c.code.toLowerCase() === typed.toLowerCase())
        ? { code: typed, amount: 5, valid: "valid on 2028/10/10" }
        : SAMPLE_COUPONS.find((s) => !wallet.some((c) => c.code === s.code));
    if (!next) return;
    setWallet([...wallet, next]);
    setSelected([...selected, next.code]);
    setCode("");
  };

  return (
    <Sheet
      title="Add coupon"
      titleText="add coupon"
      footer={
        <>
          <div className={ui.amount}>
            <span className={ui.amountLabel}>Total coupon</span>
            <span className={ui.amountValue}>{money(total)}</span>
          </div>
          <button
            type="button"
            className={cx(ui.btn, ui.btnPrimary, styles.amountSmall)}
            onClick={() => {
              if (adding) add();
              else {
                actions.setCoupons(wallet.filter((c) => selected.includes(c.code)));
                actions.closeOverlay();
              }
            }}
          >
            {adding ? "Add" : "Continue"}
          </button>
        </>
      }
    >
      <div className={styles.group56}>
        <div className={styles.illustration} aria-hidden="true">
          <span className={styles.illustrationCircle}>
            <Img src="/icons/coupon-large.svg" size={109} />
          </span>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="coupon-input">
            Enter coupon
          </label>
          <div className={styles.pillInput}>
            <input
              id="coupon-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter coupon"
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === "Enter") add();
              }}
            />
          </div>
          <p className={styles.hint}>Tip: any code works in this prototype.</p>
        </div>
      </div>
      {wallet.length ? (
        <div className={styles.options} role="group" aria-label="Your coupons">
          {wallet.map((c) => {
            const on = selected.includes(c.code);
            return (
              <button
                key={c.code}
                type="button"
                aria-pressed={on}
                className={cx(styles.option, on && styles.optionSelected)}
                onClick={() => setSelected(on ? selected.filter((x) => x !== c.code) : [...selected, c.code])}
              >
                <span className={styles.optionText}>
                  <span className={styles.optionTitle}>{money(c.amount, { tight: true })}</span>
                  <span className={styles.optionMeta}>
                    {c.code} - {c.valid}
                  </span>
                </span>
                {on ? (
                  <span className={styles.check}>
                    <Img src="/icons/check-circle-blue.svg" size={22} />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </Sheet>
  );
}

/* ---------- Choose payment method (99:12585) ---------- */

export function PaymentSheet() {
  const { state, actions } = useApp();
  const [picked, setPicked] = useState<PaymentId>(state.payment ?? "paypal");
  const options: { id: PaymentId; meta?: string }[] = [
    { id: "paypal" },
    { id: "gpay" },
    { id: "card", meta: "VISA, Mastercard, Amex" },
  ];
  return (
    <Sheet
      title="Choose payment method"
      titleText="payment method"
      footer={
        <button
          type="button"
          className={cx(ui.btn, ui.btnPrimary, ui.btnBlock)}
          onClick={() => {
            actions.setPayment(picked);
            actions.closeOverlay();
          }}
        >
          Continue
        </button>
      }
    >
      <div className={styles.group56}>
        <div className={styles.illustration} aria-hidden="true">
          <span className={styles.illustrationCircle}>
            <Img src="/icons/payment-large.svg" size={109} />
          </span>
        </div>
        <div className={styles.options} role="radiogroup" aria-label="Payment methods" style={{ gap: 16 }}>
          {options.map((o) => {
            const selected = picked === o.id;
            return (
              <div key={o.id} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={cx(styles.option, selected && styles.optionSelected)}
                  onClick={() => setPicked(o.id)}
                >
                  <span className={styles.optionText}>
                    <span className={styles.optionTitle}>{PAYMENT_LABEL[o.id]}</span>
                    {o.meta ? <span className={styles.optionMeta}>{o.meta}</span> : null}
                  </span>
                  {selected ? (
                    <span className={styles.check}>
                      <Img src="/icons/check-circle-blue.svg" size={22} />
                    </span>
                  ) : null}
                </button>
                {o.id === "card" && selected ? <HostedCardFields /> : null}
              </div>
            );
          })}
        </div>
      </div>
    </Sheet>
  );
}

function HostedCardFields() {
  return (
    <div className={styles.hosted} aria-label="Secure card form placeholder">
      <div className={styles.hostedHead}>
        <span>Secure card form</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="#4D4A57" strokeWidth="1.4" />
          <path d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7" stroke="#4D4A57" strokeWidth="1.4" />
        </svg>
      </div>
      <div className={styles.hostedField} aria-hidden="true">
        Card number
      </div>
      <div className={styles.hostedRow} aria-hidden="true">
        <div className={styles.hostedField}>MM / YY</div>
        <div className={styles.hostedField}>CVC</div>
      </div>
      <p className={styles.hostedNote}>
        Card details are handled by the payment provider. This prototype never collects, stores or shows card numbers
        or the CVC.
      </p>
    </div>
  );
}

/* ---------- Purchase successful (112:16566) ---------- */

export function SuccessDialog() {
  const { state, actions } = useApp();
  const money = useMoney();
  const paid = cartTotals(state).total;
  return (
    <Sheet
      variant="dialog"
      hideTitle
      title="Purchase successful"
      titleText="purchase confirmation"
      onClose={() => actions.closeSuccess()}
      footer={
        <div className={cx(styles.footerCol)} style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
          <button
            type="button"
            className={cx(ui.btn, ui.btnPrimary, ui.btnBlock)}
            onClick={() => actions.closeSuccess(() => actions.tab("myEsim"))}
          >
            View my eSIM
          </button>
          <button
            type="button"
            className={cx(ui.btn, ui.btnLight, ui.btnBlock)}
            onClick={() => actions.closeSuccess(() => actions.navigate("guide"))}
          >
            How to activate
          </button>
        </div>
      }
    >
      <div className={styles.successBody}>
        <p className={styles.successTitle}>
          <span aria-hidden="true">🎉 </span>Purchase Successful!
        </p>
        <p className={styles.successSub}>Nice! Let’s activate~</p>
        <p className={styles.successPaid}>
          Paid {money(paid)} · charged in {state.currency}
        </p>
        <div className={styles.successRich}>
          <p>Next Steps:</p>
          <ol>
            <li>
              Check your email or “My eSIM” on APP. We’ve sent you the eSIM QR code and installation instructions.
            </li>
            <li>Activate your eSIM. Scan the QR code on your compatible device.</li>
            <li>Start using data. Once activated, your data plan is live and ready to go.</li>
          </ol>
          <p>Important Notes:</p>
          <ul>
            <li>This eSIM can only be activated once and cannot be transferred.</li>
            <li>Please ensure you have a stable internet connection when activating.</li>
            <li>
              For any issues, contact our support team: <a href="mailto:support@example.com">support@example.com</a>.
            </li>
          </ul>
        </div>
      </div>
    </Sheet>
  );
}

/* ---------- Resend eSIM email (security addition) ---------- */

export function ResendEmailDialog() {
  const { state, actions } = useApp();
  const email = maskEmail(state.user?.email ?? "klesim.traveller@example.com");
  return (
    <Sheet
      variant="dialog"
      title="Resend eSIM email"
      titleText="resend email"
      footer={
        <>
          <button type="button" className={cx(ui.btn, ui.btnLight)} style={{ flex: "1 1 0" }} onClick={() => actions.closeOverlay()}>
            Cancel
          </button>
          <button
            type="button"
            className={cx(ui.btn, ui.btnPrimary)}
            style={{ flex: "1 1 0" }}
            onClick={() => actions.closeOverlay(() => actions.toast("info", "Email sent", `Sent to ${email}`))}
          >
            Send
          </button>
        </>
      }
    >
      <p style={{ fontSize: 16, lineHeight: 1.4 }}>
        We’ll resend the QR code and installation steps to the email on this order:
      </p>
      <p style={{ fontWeight: 700, fontSize: 20 }}>{email}</p>
      <p className={styles.hint}>
        For your security we only send it to the order email. To use a different address, contact support.
      </p>
    </Sheet>
  );
}

/* ---------- Currency (no Figma frame: built from the payment sheet pattern) ---------- */

export function CurrencySheet() {
  const { state, actions } = useApp();
  return (
    <Sheet
      title="Choose currency"
      titleText="currency picker"
      footer={
        <button type="button" className={cx(ui.btn, ui.btnPrimary, ui.btnBlock)} onClick={() => actions.closeOverlay()}>
          Continue
        </button>
      }
    >
      <div className={styles.options} role="radiogroup" aria-label="Currencies">
        {CURRENCIES.map((c) => {
          const selected = state.currency === c.code;
          return (
            <button
              key={c.code}
              type="button"
              role="radio"
              aria-checked={selected}
              className={cx(styles.option, selected && styles.optionSelected)}
              onClick={() => actions.setCurrency(c.code)}
            >
              <span className={styles.currencySymbol} aria-hidden="true">
                {c.symbol}
              </span>
              <span className={styles.optionText}>
                <span className={styles.optionTitle}>{c.code}</span>
                <span className={styles.optionMeta}>{c.name}</span>
              </span>
              {selected ? (
                <span className={styles.check}>
                  <Img src="/icons/check-circle-blue.svg" size={22} />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <p className={styles.hint}>Prices update everywhere. Exchange rates in this prototype are fixed sample values.</p>
    </Sheet>
  );
}

/* ---------- host ---------- */

export function OverlayHost() {
  const { state } = useApp();
  const o = state.overlay;
  if (!o) return null;
  switch (o.id) {
    case "destination":
      return <DestinationSheet />;
    case "details":
      return <DetailsSheet />;
    case "terms":
      return <TermsSheet />;
    case "coupon":
      return <CouponSheet />;
    case "payment":
      return <PaymentSheet />;
    case "success":
      return <SuccessDialog />;
    case "resendEmail":
      return <ResendEmailDialog />;
    case "currency":
      return <CurrencySheet />;
    default:
      return null;
  }
}
