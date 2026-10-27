export type Place = { name: string; image: string; imageStyle?: "wide" | "tall" };

export const PLACE_ROWS: Place[][] = [
  [
    { name: "Australia", image: "/img/place-australia.webp", imageStyle: "wide" },
    { name: "Colombia", image: "/img/place-colombia.webp", imageStyle: "tall" },
    { name: "Indonesia", image: "/img/place-indonesia.webp" },
  ],
  [
    { name: "Indonesia", image: "/img/place-indonesia.webp" },
    { name: "Canada", image: "/img/place-canada.webp" },
    { name: "France", image: "/img/place-france.webp" },
  ],
];

export type Destination = {
  id: string;
  name: string;
  network: string;
  /** lowest plan price in EUR (converted for display) */
  from?: number;
  /** extra coverage note shown after the price, e.g. "35 countries/regions" */
  coverage?: string;
  regions: string;
  kind: "country" | "region";
};

export const DESTINATIONS: Destination[] = [
  { id: "europe", name: "Europe", network: "4G / 5G", from: 5, coverage: "35 countries/regions", regions: "35 countries/regions", kind: "region" },
  { id: "france", name: "France", network: "4G / 5G", from: 5, regions: "1 country", kind: "country" },
  { id: "global", name: "Global", network: "4G / 5G", from: 5, coverage: "35 countries/regions", regions: "112 countries/regions", kind: "region" },
  { id: "indonesia", name: "Indonesia", network: "4G / 5G", regions: "1 country", kind: "country" },
  { id: "england", name: "England", network: "4G / 5G", regions: "1 country", kind: "country" },
  { id: "united-states", name: "United States", network: "4G / 5G", regions: "1 country", kind: "country" },
  { id: "colombia", name: "Colombia", network: "4G / 5G", regions: "1 country", kind: "country" },
  { id: "australia", name: "Australia", network: "4G / 5G", regions: "1 country", kind: "country" },
  { id: "canada", name: "Canada", network: "4G / 5G", regions: "1 country", kind: "country" },
];

/** "4G / 5G · From €5.00 · 35 countries/regions" with the price in the selected currency. */
export function destinationMeta(d: Destination, money: (eur: number, opts?: MoneyOptions) => string) {
  return [d.network, d.from !== undefined ? `From ${money(d.from, { tight: true })}` : null, d.coverage]
    .filter(Boolean)
    .join(" · ");
}

export const SHEET_DESTINATIONS = ["europe", "france", "global", "indonesia", "england", "united-states", "colombia"];

export function findDestination(nameOrId: string): Destination {
  const key = nameOrId.toLowerCase();
  return (
    DESTINATIONS.find((d) => d.id === key || d.name.toLowerCase() === key) ?? {
      id: key,
      name: nameOrId,
      network: "4G / 5G",
      regions: "1 country",
      kind: "country",
    }
  );
}

export type Plan = {
  id: string;
  title: string;
  unit?: string;
  duration: string;
  price: number;
  was?: number;
  kind: "daily" | "total";
  bestseller?: boolean;
  coupon?: boolean;
  allowance: string;
  validity: string;
};

export const PLANS: Plan[] = [
  {
    id: "no-limit",
    title: "No limit",
    unit: "/day",
    duration: "1, 3, 5, 7, 14, 30 day(s)",
    price: 10,
    was: 20,
    kind: "daily",
    coupon: true,
    allowance: "No limit / day",
    validity: "1 – 30 days",
  },
  {
    id: "10gb",
    title: "10GB",
    duration: "30 day(s)",
    price: 20,
    was: 40,
    kind: "total",
    bestseller: true,
    coupon: true,
    allowance: "10GB",
    validity: "30 days",
  },
  { id: "5gb", title: "5GB", duration: "30 day(s)", price: 15, kind: "total", allowance: "5GB", validity: "30 days" },
  { id: "50gb", title: "50GB", duration: "30 day(s)", price: 40, was: 80, kind: "total", allowance: "50GB", validity: "30 days" },
];

export const DAY_OPTIONS = [
  { days: 1, label: "1 Day", price: 10 },
  { days: 3, label: "3 Days", price: 20 },
  { days: 5, label: "5 Days", price: 30 },
  { days: 10, label: "10 Days", price: 40 },
  { days: 14, label: "14 Days", price: 50 },
  { days: 30, label: "30 Days", price: 60 },
];

export const FAQS = [
  {
    q: "When does my eSIM plan start?",
    a: "Your plan starts the first time the eSIM connects to a supported network at your destination.",
  },
  {
    q: "When should I buy or activate my eSIM?",
    a: "Buy and install it a few days before you travel, while you still have Wi-Fi. Turn it on when you land.",
  },
  {
    q: "How long is my eSIM valid after I start using data?",
    a: "Validity counts from the first connection and lasts for the number of days in your plan.",
  },
  {
    q: "Can I cancel my eSIM order?",
    a: "Orders can be refunded before the eSIM is installed. Once installed, the plan is considered used.",
  },
  {
    q: "Can I top up my plan?",
    a: "Yes. Rechargeable plans can be topped up from My eSIM at any time before they expire.",
  },
];

export const GUIDE_LINKS = [
  "IOS system",
  "Android system",
  "IOS install video",
  "Android install video",
  "Capable phone list",
];

export const GUIDE_STEPS = [
  {
    title: "Activate eSIM Anytime Before Travel",
    body: "Don’t worry, data will only start being used once you arrive at your destination.",
  },
  {
    title: "Before departure",
    body: "Turn OFF roaming on your original number to avoid additional charges while using our service.",
  },
  {
    title: "After arrival",
    body: "Go to your device settings, switch to eSIM, and enable data roaming.",
  },
  {
    title: "Check your remaining data and validity anytime.",
    body: "If the eSIM expires and is not removed, no extra charges will apply.",
  },
];

export const WHY_US = [
  {
    title: "Easy to Use & Active later",
    body: "Set up and manage your eSIM in just a few taps with the KLeSIM app",
    icon: "/img/why-easy.webp",
  },
  {
    title: "Great Value",
    body: "Get affordable plans that keep your travels worry-free",
    icon: "/img/why-value.webp",
  },
  {
    title: "24/7 Customer Support",
    body: "Round-the-clock, multilingual support to keep you connected anytime, anywhere",
    icon: "/img/why-support.webp",
  },
];

/* ---------- currencies ---------- */

export type CurrencyCode = "EUR" | "USD" | "GBP" | "JPY" | "TWD" | "AUD";

export type Currency = { code: CurrencyCode; symbol: string; name: string; rate: number };

/**
 * SAMPLE VALUES ONLY: fixed conversion rates from EUR used by this prototype.
 * They are not live exchange rates and must not be used for real pricing.
 * Prices in the data above are stored in EUR and converted for display.
 */
export const CURRENCIES: Currency[] = [
  { code: "EUR", symbol: "€", name: "Euro", rate: 1 },
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1.08 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.85 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 162 },
  { code: "TWD", symbol: "NT$", name: "New Taiwan Dollar", rate: 35 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.65 },
];

export function currencyOf(code: CurrencyCode): Currency {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

export type MoneyOptions = { tight?: boolean };

const formatters = new Map<CurrencyCode, Intl.NumberFormat>();

function formatterFor(code: CurrencyCode) {
  let f = formatters.get(code);
  if (!f) {
    const digits = code === "JPY" ? 0 : 2;
    f = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      currencyDisplay: "symbol",
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
    formatters.set(code, f);
  }
  return f;
}

/**
 * The one money formatter: converts an EUR amount with the sample rate and formats it with
 * Intl.NumberFormat (JPY has no decimals). Conversion runs in integer minor units so half-cent
 * values round the same way everywhere. Output follows the design: symbol, space, amount ("€ 20.00").
 */
export function formatMoney(eur: number, code: CurrencyCode = "EUR", opts: MoneyOptions = {}) {
  const digits = code === "JPY" ? 0 : 2;
  const rate4 = Math.round(currencyOf(code).rate * 10000);
  const minor = Math.round((Math.round(eur * 100) * rate4) / 10 ** (6 - digits));
  const parts = formatterFor(code).formatToParts(minor / 10 ** digits);
  const sign = parts.filter((p) => p.type === "minusSign").map((p) => p.value).join("");
  const symbol = parts.filter((p) => p.type === "currency").map((p) => p.value).join("");
  const amount = parts
    .filter((p) => p.type === "integer" || p.type === "group" || p.type === "decimal" || p.type === "fraction")
    .map((p) => p.value)
    .join("");
  const gap = opts.tight ? "" : "\u00a0"; // no-break space between symbol and amount
  return `${sign}${symbol}${gap}${amount}`;
}
