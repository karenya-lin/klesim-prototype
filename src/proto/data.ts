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
  kind: "country" | "region";
};

export const DESTINATIONS: Destination[] = [
  { id: "europe", name: "Europe", network: "4G / 5G", from: 5, kind: "region" },
  { id: "france", name: "France", network: "4G / 5G", from: 5, kind: "country" },
  { id: "global", name: "Global", network: "4G / 5G", from: 5, kind: "region" },
  { id: "indonesia", name: "Indonesia", network: "4G / 5G", kind: "country" },
  { id: "england", name: "England", network: "4G / 5G", kind: "country" },
  { id: "united-states", name: "United States", network: "4G / 5G", kind: "country" },
  { id: "colombia", name: "Colombia", network: "4G / 5G", kind: "country" },
  { id: "australia", name: "Australia", network: "4G / 5G", kind: "country" },
  { id: "canada", name: "Canada", network: "4G / 5G", kind: "country" },
];

/** "4G / 5G · From €5.00 · 35 countries/regions" with the price in the selected currency. */
export function destinationMeta(d: Destination, money: (eur: number, opts?: MoneyOptions) => string) {
  return [
    d.network,
    d.from !== undefined ? `From ${money(d.from, { tight: true })}` : null,
    d.kind === "region" ? coverageLabel(coverageFor(d)) : null,
  ]
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
      kind: AREAS.some((a) => a.toLowerCase() === key) ? "region" : "country",
    }
  );
}

/* ---------- coverage (sample data: real country names, invented speeds and partner networks) ---------- */

export const AREAS = ["Europe", "Asia", "Americas", "Middle East", "Africa", "Oceania"] as const;
export type Area = (typeof AREAS)[number];
export type CoverageCountry = { name: string; code: string; area: Area };

const WORLD_BY_AREA: Record<Area, [string, string][]> = {
  Europe: [
    ["Albania", "AL"],
    ["Austria", "AT"],
    ["Belgium", "BE"],
    ["Bosnia and Herzegovina", "BA"],
    ["Bulgaria", "BG"],
    ["Croatia", "HR"],
    ["Cyprus", "CY"],
    ["Czechia", "CZ"],
    ["Denmark", "DK"],
    ["Estonia", "EE"],
    ["Finland", "FI"],
    ["France", "FR"],
    ["Germany", "DE"],
    ["Greece", "GR"],
    ["Hungary", "HU"],
    ["Iceland", "IS"],
    ["Ireland", "IE"],
    ["Italy", "IT"],
    ["Latvia", "LV"],
    ["Liechtenstein", "LI"],
    ["Lithuania", "LT"],
    ["Luxembourg", "LU"],
    ["Malta", "MT"],
    ["Moldova", "MD"],
    ["Monaco", "MC"],
    ["Montenegro", "ME"],
    ["Netherlands", "NL"],
    ["North Macedonia", "MK"],
    ["Norway", "NO"],
    ["Poland", "PL"],
    ["Portugal", "PT"],
    ["Romania", "RO"],
    ["Serbia", "RS"],
    ["Slovakia", "SK"],
    ["Slovenia", "SI"],
    ["Spain", "ES"],
    ["Sweden", "SE"],
    ["Switzerland", "CH"],
    ["Ukraine", "UA"],
    ["United Kingdom", "GB"],
  ],
  Asia: [
    ["Bangladesh", "BD"],
    ["Brunei", "BN"],
    ["Cambodia", "KH"],
    ["China mainland", "CN"],
    ["Hong Kong", "HK"],
    ["India", "IN"],
    ["Indonesia", "ID"],
    ["Japan", "JP"],
    ["Kazakhstan", "KZ"],
    ["Kyrgyzstan", "KG"],
    ["Laos", "LA"],
    ["Macau", "MO"],
    ["Malaysia", "MY"],
    ["Maldives", "MV"],
    ["Mongolia", "MN"],
    ["Nepal", "NP"],
    ["Pakistan", "PK"],
    ["Philippines", "PH"],
    ["Singapore", "SG"],
    ["South Korea", "KR"],
    ["Sri Lanka", "LK"],
    ["Taiwan", "TW"],
    ["Thailand", "TH"],
    ["Uzbekistan", "UZ"],
    ["Vietnam", "VN"],
  ],
  Americas: [
    ["Argentina", "AR"],
    ["Bolivia", "BO"],
    ["Brazil", "BR"],
    ["Canada", "CA"],
    ["Chile", "CL"],
    ["Colombia", "CO"],
    ["Costa Rica", "CR"],
    ["Dominican Republic", "DO"],
    ["Ecuador", "EC"],
    ["El Salvador", "SV"],
    ["Guatemala", "GT"],
    ["Honduras", "HN"],
    ["Jamaica", "JM"],
    ["Mexico", "MX"],
    ["Panama", "PA"],
    ["Paraguay", "PY"],
    ["Peru", "PE"],
    ["Puerto Rico", "PR"],
    ["United States", "US"],
    ["Uruguay", "UY"],
  ],
  "Middle East": [
    ["Bahrain", "BH"],
    ["Israel", "IL"],
    ["Jordan", "JO"],
    ["Kuwait", "KW"],
    ["Oman", "OM"],
    ["Qatar", "QA"],
    ["Saudi Arabia", "SA"],
    ["Türkiye", "TR"],
    ["United Arab Emirates", "AE"],
  ],
  Africa: [
    ["Egypt", "EG"],
    ["Ghana", "GH"],
    ["Kenya", "KE"],
    ["Madagascar", "MG"],
    ["Morocco", "MA"],
    ["Nigeria", "NG"],
    ["Rwanda", "RW"],
    ["Senegal", "SN"],
    ["South Africa", "ZA"],
    ["Tanzania", "TZ"],
    ["Tunisia", "TN"],
    ["Uganda", "UG"],
  ],
  Oceania: [
    ["Australia", "AU"],
    ["Fiji", "FJ"],
    ["Guam", "GU"],
    ["New Zealand", "NZ"],
    ["Papua New Guinea", "PG"],
    ["Samoa", "WS"],
  ],
};

const WORLD: CoverageCountry[] = AREAS.flatMap((area) =>
  WORLD_BY_AREA[area].map(([name, code]) => ({ name, code, area })),
);

/** the Europe plan leaves out five networks of the full Europe list */
const EUROPE_PLAN_EXCLUDES = ["Albania", "Bosnia and Herzegovina", "Moldova", "Montenegro", "North Macedonia"];

const SINGLE_EXTRA: Record<string, CoverageCountry> = {
  england: { name: "England", code: "GB-ENG", area: "Europe" },
};

/** Countries / regions a destination's plans work in, grouped by area and alphabetical within each. */
export function coverageFor(d: Destination): CoverageCountry[] {
  const id = d.id.toLowerCase();
  if (id === "global") return WORLD;
  if (id === "europe") return WORLD.filter((c) => c.area === "Europe" && !EUROPE_PLAN_EXCLUDES.includes(c.name));
  const area = AREAS.find((a) => a.toLowerCase() === id);
  if (area) return WORLD.filter((c) => c.area === area);
  const one = SINGLE_EXTRA[id] ?? WORLD.find((c) => c.name.toLowerCase() === d.name.toLowerCase());
  return [one ?? { name: d.name, code: "", area: "Europe" }];
}

export function coverageLabel(list: CoverageCountry[]) {
  return list.length === 1 ? "1 country" : `${list.length} countries/regions`;
}

/** Flag emoji for an ISO 3166 code (regional indicators), or the England subdivision flag. */
export function flagEmoji(code: string) {
  if (code === "GB-ENG") return "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}";
  if (!/^[A-Z]{2}$/.test(code)) return "";
  return String.fromCodePoint(...[...code].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));
}

/** Sample network notes per area for the "Available Region list" sheet (not real measurements). */
export const AREA_NOTES: Record<Area, { network: string; speed: string; partners: number }> = {
  Europe: { network: "4G / 5G", speed: "Up to 150 Mbps", partners: 3 },
  Asia: { network: "4G / 5G", speed: "Up to 120 Mbps", partners: 2 },
  Americas: { network: "4G / 5G", speed: "Up to 100 Mbps", partners: 2 },
  "Middle East": { network: "4G", speed: "Up to 60 Mbps", partners: 2 },
  Africa: { network: "4G", speed: "Up to 40 Mbps", partners: 1 },
  Oceania: { network: "4G / 5G", speed: "Up to 100 Mbps", partners: 2 },
};

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
