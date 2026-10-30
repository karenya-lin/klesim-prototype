"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { DAY_OPTIONS, PLANS, formatMoney, type CurrencyCode, type MoneyOptions } from "./data";

export type RouteId =
  | "home"
  | "search"
  | "plans"
  | "planDays"
  | "guide"
  | "cart"
  | "checkout"
  | "myEsim"
  | "esimDetail"
  | "profile"
  | "auth";

export type Route = { key: string; id: RouteId };
export type Transition = "push" | "pop" | "fade" | "none";
export type OverlayId =
  | "destination"
  | "details"
  | "terms"
  | "coupon"
  | "payment"
  | "success"
  | "resendEmail"
  | "currency"
  | "coverage"
  | "regionInfo";

export type CartItem = {
  key: string;
  title: string;
  flag?: string;
  detail: string;
  price: number;
  was?: number;
  qty: number;
  note?: string;
};

export type Coupon = { code: string; amount: number; valid: string };

export const SAMPLE_COUPONS: Coupon[] = [
  { code: "563453ef35133wef", amount: 5, valid: "valid on 2028/10/10" },
  { code: "ASWFW3ef35138fa", amount: 5, valid: "valid on 2028/10/10" },
];

export type PaymentId = "paypal" | "gpay" | "card";
export const PAYMENT_LABEL: Record<PaymentId, string> = {
  paypal: "PayPal",
  gpay: "Google Pay",
  card: "Credit Card",
};

export type ToastKind = "cart" | "copied" | "info";
type Toast = { id: number; kind: ToastKind; title: string; text?: string };

type Overlay = { id: OverlayId; closing: boolean; planId?: string };

export type User = { email: string; name: string };
export type Billing = { name: string; line: string };

export type State = {
  stack: Route[];
  transition: Transition;
  navId: number;
  leaving: Route | null;
  overlay: Overlay | null;
  toast: Toast | null;
  destination: string;
  planId: string;
  days: number;
  qty: number;
  cart: CartItem[];
  /** last line removed from the cart, kept until the traveller leaves the screen so it can be undone */
  removed: { item: CartItem; index: number } | null;
  coupons: Coupon[];
  payment: PaymentId | null;
  consent: boolean;
  user: User | null;
  billing: Billing | null;
  purchased: boolean;
  currency: CurrencyCode;
};

let keySeq = 0;
const nextKey = (id: string) => `${id}-${++keySeq}`;

export const SEED_CART: CartItem[] = [
  {
    key: "seed-japan",
    title: "Japan",
    flag: "/icons/flag-japan.svg",
    detail: "10 GB - 3 days",
    price: 20,
    was: 40,
    qty: 1,
    note: "According to local policies, it is not possible to purchase data plans in advance for some regions.",
  },
  {
    key: "seed-spain",
    title: "Spain",
    flag: "/icons/flag-spain.svg",
    detail: "Unlimited - 30 days",
    price: 30,
    was: 40,
    qty: 2,
  },
];

const initialState: State = {
  stack: [{ key: "home-0", id: "home" }],
  transition: "none",
  navId: 0,
  leaving: null,
  overlay: null,
  toast: null,
  destination: "Global",
  planId: "10gb",
  days: 1,
  qty: 1,
  cart: SEED_CART,
  removed: null,
  coupons: [],
  payment: null,
  consent: false,
  user: null,
  billing: null,
  purchased: false,
  currency: "EUR",
};

type Action =
  | { type: "navigate"; id: RouteId; transition: Transition }
  | { type: "back" }
  | { type: "tab"; id: RouteId }
  | { type: "transitionEnd"; navId: number }
  | { type: "openOverlay"; id: OverlayId; planId?: string }
  | { type: "overlayClosing" }
  | { type: "overlayClosed" }
  | { type: "toast"; kind: ToastKind; title: string; text?: string }
  | { type: "toastDone"; id: number }
  | { type: "setDestination"; name: string }
  | { type: "selectPlan"; planId: string }
  | { type: "setDays"; days: number }
  | { type: "setQty"; qty: number }
  | { type: "addToCart" }
  | { type: "setCartQty"; key: string; qty: number }
  | { type: "removeCartItem"; key: string }
  | { type: "undoRemove" }
  | { type: "setCoupons"; coupons: Coupon[] }
  | { type: "setPayment"; payment: PaymentId }
  | { type: "setConsent"; value: boolean }
  | { type: "signIn"; user: User }
  | { type: "signOut" }
  | { type: "setBilling"; billing: Billing | null }
  | { type: "setCurrency"; currency: CurrencyCode }
  | { type: "purchase" }
  | { type: "clearOrder" };

function top(stack: Route[]) {
  return stack[stack.length - 1];
}

export function selectionPrice(state: Pick<State, "planId" | "days">) {
  const plan = PLANS.find((p) => p.id === state.planId) ?? PLANS[1];
  if (plan.kind === "daily") {
    const opt = DAY_OPTIONS.find((d) => d.days === state.days) ?? DAY_OPTIONS[0];
    return opt.price;
  }
  return plan.price;
}

export const SERVICE_FEE = 5;
export const VAT = 0.5;

export function cartTotals(state: Pick<State, "cart" | "coupons">) {
  const count = state.cart.reduce((n, c) => n + c.qty, 0);
  const product = state.cart.reduce((n, c) => n + c.price * c.qty, 0);
  const coupon = state.coupons.reduce((n, c) => n + c.amount, 0);
  const fee = count ? SERVICE_FEE : 0;
  const vat = count ? VAT : 0;
  const total = Math.max(0, product - coupon + fee + vat);
  return { count, product, coupon, fee, vat, total };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "navigate": {
      const current = top(state.stack);
      if (current.id === action.id) return state;
      return {
        ...state,
        stack: [...state.stack, { key: nextKey(action.id), id: action.id }],
        transition: action.transition,
        navId: state.navId + 1,
        leaving: current,
        removed: null,
      };
    }
    case "back": {
      if (state.stack.length < 2) return state;
      return {
        ...state,
        stack: state.stack.slice(0, -1),
        transition: "pop",
        navId: state.navId + 1,
        leaving: top(state.stack),
        removed: null,
      };
    }
    case "tab": {
      const current = top(state.stack);
      if (state.stack.length === 1 && current.id === action.id) return state;
      return {
        ...state,
        stack: [{ key: nextKey(action.id), id: action.id }],
        transition: "fade",
        navId: state.navId + 1,
        leaving: current,
        removed: null,
      };
    }
    case "transitionEnd":
      if (action.navId !== state.navId) return state;
      return { ...state, leaving: null };
    case "openOverlay":
      return { ...state, overlay: { id: action.id, closing: false, planId: action.planId } };
    case "overlayClosing":
      return state.overlay ? { ...state, overlay: { ...state.overlay, closing: true } } : state;
    case "overlayClosed":
      return state.overlay?.closing ? { ...state, overlay: null } : state;
    case "clearOrder":
      return { ...state, cart: [], removed: null, coupons: [], consent: false };
    case "toast":
      return {
        ...state,
        toast: { id: (state.toast?.id ?? 0) + 1, kind: action.kind, title: action.title, text: action.text },
      };
    case "toastDone":
      return state.toast?.id === action.id ? { ...state, toast: null } : state;
    case "setDestination":
      return { ...state, destination: action.name };
    case "selectPlan":
      return { ...state, planId: action.planId };
    case "setDays":
      return { ...state, days: action.days };
    case "setQty":
      return { ...state, qty: Math.max(1, Math.min(9, action.qty)) };
    case "addToCart": {
      const plan = PLANS.find((p) => p.id === state.planId) ?? PLANS[1];
      const day = plan.kind === "daily" ? DAY_OPTIONS.find((d) => d.days === state.days) ?? DAY_OPTIONS[0] : null;
      const item: CartItem = {
        key: nextKey("cart"),
        title: state.destination,
        flag: state.destination.toLowerCase() === "france" ? "/icons/flag-france.svg" : undefined,
        detail: day ? `No limit - ${day.label}` : `${plan.title} - ${plan.validity}`,
        price: selectionPrice(state),
        was: day ? undefined : plan.was,
        qty: state.qty,
      };
      return { ...state, cart: [...state.cart, item], removed: null };
    }
    case "setCartQty":
      return {
        ...state,
        cart: state.cart.map((c) => (c.key === action.key ? { ...c, qty: Math.max(1, Math.min(9, action.qty)) } : c)),
      };
    case "removeCartItem": {
      const index = state.cart.findIndex((c) => c.key === action.key);
      if (index < 0) return state;
      return {
        ...state,
        cart: state.cart.filter((c) => c.key !== action.key),
        removed: { item: state.cart[index], index },
      };
    }
    case "undoRemove": {
      if (!state.removed) return state;
      const cart = [...state.cart];
      cart.splice(Math.min(state.removed.index, cart.length), 0, state.removed.item);
      return { ...state, cart, removed: null };
    }
    case "setCoupons":
      return { ...state, coupons: action.coupons };
    case "setPayment":
      return { ...state, payment: action.payment };
    case "setConsent":
      return { ...state, consent: action.value };
    case "signIn":
      return { ...state, user: action.user };
    case "signOut":
      return { ...state, user: null, billing: null };
    case "setBilling":
      return { ...state, billing: action.billing };
    case "setCurrency":
      return { ...state, currency: action.currency };
    case "purchase":
      return { ...state, purchased: true };
    default:
      return state;
  }
}

const OVERLAY_MS = 300;
const TOAST_MS = 2200;

function createActions(dispatch: (a: Action) => void) {
  const closeOverlay = (after?: () => void) => {
    dispatch({ type: "overlayClosing" });
    window.setTimeout(() => {
      dispatch({ type: "overlayClosed" });
      after?.();
    }, OVERLAY_MS);
  };
  // The order is cleared only after the confirmation has closed and any screen change has finished,
  // so the totals behind the dialog never flash to zero during the cross-fade.
  const closeSuccess = (after?: () => void) => {
    closeOverlay(() => {
      after?.();
      window.setTimeout(() => dispatch({ type: "clearOrder" }), 420);
    });
  };
  return {
    navigate: (id: RouteId, transition: Transition = "push") => dispatch({ type: "navigate", id, transition }),
    back: () => dispatch({ type: "back" }),
    tab: (id: RouteId) => dispatch({ type: "tab", id }),
    transitionEnd: (navId: number) => dispatch({ type: "transitionEnd", navId }),
    openOverlay: (id: OverlayId, planId?: string) => dispatch({ type: "openOverlay", id, planId }),
    closeOverlay,
    closeSuccess,
    toast: (kind: ToastKind, title: string, text?: string) => dispatch({ type: "toast", kind, title, text }),
    toastDone: (id: number) => dispatch({ type: "toastDone", id }),
    setDestination: (name: string) => dispatch({ type: "setDestination", name }),
    selectPlan: (planId: string) => dispatch({ type: "selectPlan", planId }),
    setDays: (days: number) => dispatch({ type: "setDays", days }),
    setQty: (qty: number) => dispatch({ type: "setQty", qty }),
    addToCart: () => dispatch({ type: "addToCart" }),
    setCartQty: (key: string, qty: number) => dispatch({ type: "setCartQty", key, qty }),
    removeCartItem: (key: string) => dispatch({ type: "removeCartItem", key }),
    undoRemove: () => dispatch({ type: "undoRemove" }),
    setCoupons: (coupons: Coupon[]) => dispatch({ type: "setCoupons", coupons }),
    setPayment: (payment: PaymentId) => dispatch({ type: "setPayment", payment }),
    setConsent: (value: boolean) => dispatch({ type: "setConsent", value }),
    signIn: (user: User) => dispatch({ type: "signIn", user }),
    signOut: () => dispatch({ type: "signOut" }),
    setBilling: (billing: Billing | null) => dispatch({ type: "setBilling", billing }),
    setCurrency: (currency: CurrencyCode) => dispatch({ type: "setCurrency", currency }),
    purchase: () => dispatch({ type: "purchase" }),
  };
}

export type Actions = ReturnType<typeof createActions>;

const Ctx = createContext<{ state: State; actions: Actions } | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const actions = useMemo(() => createActions(dispatch), []);
  const value = useMemo(() => ({ state, actions }), [state, actions]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside AppProvider");
  return v;
}

/** Formats an EUR amount in the currency the traveller picked (kept in the store across screens). */
export function useMoney() {
  const { state } = useApp();
  const code = state.currency;
  return useMemo(() => (eur: number, opts?: MoneyOptions) => formatMoney(eur, code, opts), [code]);
}

export function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain) return "•••";
  return `${local.slice(0, 1)}•••@${domain}`;
}

export function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "";
  const word = local.split(/[._\-+0-9]/).find(Boolean) ?? "traveller";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export const TOAST_DURATION = TOAST_MS;
export const OVERLAY_DURATION = OVERLAY_MS;
