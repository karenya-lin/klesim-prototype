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
  meta: string;
  regions: string;
  kind: "country" | "region";
};

export const DESTINATIONS: Destination[] = [
  { id: "europe", name: "Europe", meta: "4G / 5G · From €5.00 · 35 countries/regions", regions: "35 countries/regions", kind: "region" },
  { id: "france", name: "France", meta: "4G / 5G · From €5.00", regions: "1 country", kind: "country" },
  { id: "global", name: "Global", meta: "4G / 5G · From €5.00 · 35 countries/regions", regions: "112 countries/regions", kind: "region" },
  { id: "indonesia", name: "Indonesia", meta: "4G / 5G", regions: "1 country", kind: "country" },
  { id: "england", name: "England", meta: "4G / 5G", regions: "1 country", kind: "country" },
  { id: "united-states", name: "United States", meta: "4G / 5G", regions: "1 country", kind: "country" },
  { id: "colombia", name: "Colombia", meta: "4G / 5G", regions: "1 country", kind: "country" },
  { id: "australia", name: "Australia", meta: "4G / 5G", regions: "1 country", kind: "country" },
  { id: "canada", name: "Canada", meta: "4G / 5G", regions: "1 country", kind: "country" },
];

export const SHEET_DESTINATIONS = ["europe", "france", "global", "indonesia", "england", "united-states", "colombia"];

export function findDestination(nameOrId: string): Destination {
  const key = nameOrId.toLowerCase();
  return (
    DESTINATIONS.find((d) => d.id === key || d.name.toLowerCase() === key) ?? {
      id: key,
      name: nameOrId,
      meta: "4G / 5G",
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

export function euro(value: number) {
  return `€ ${value.toFixed(2)}`;
}
