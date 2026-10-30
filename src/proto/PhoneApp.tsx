"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AppProvider, useApp, type RouteId } from "./store";
import { StatusBar } from "./ui/StatusBar";
import { OverlayHost } from "./sheets/Sheets";
import { Toast } from "./ui/Toast";
import { HomeScreen } from "./screens/Home";
import { SearchScreen } from "./screens/Search";
import { PlansScreen } from "./screens/Plans";
import { PlanDaysScreen } from "./screens/PlanDays";
import { GuideScreen } from "./screens/Guide";
import { CartScreen } from "./screens/Cart";
import { CheckoutScreen } from "./screens/Checkout";
import { MyEsimScreen } from "./screens/MyEsim";
import { EsimDetailScreen } from "./screens/EsimDetail";
import { ProfileScreen } from "./screens/Profile";
import { AuthScreen } from "./screens/AuthScreen";
import styles from "./app.module.css";

const SCREENS: Record<RouteId, () => ReactNode> = {
  home: () => <HomeScreen />,
  search: () => <SearchScreen />,
  plans: () => <PlansScreen />,
  planDays: () => <PlanDaysScreen />,
  guide: () => <GuideScreen />,
  cart: () => <CartScreen />,
  checkout: () => <CheckoutScreen />,
  myEsim: () => <MyEsimScreen />,
  esimDetail: () => <EsimDetailScreen />,
  profile: () => <ProfileScreen />,
  auth: () => <AuthScreen />,
};

const DURATION = 320;

function Navigator() {
  const { state, actions } = useApp();
  const { stack, leaving, transition, navId } = state;
  const topRoute = stack[stack.length - 1];
  const viewportRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef(new Map<string, HTMLElement>());
  const shownKey = useRef(topRoute.key);
  const baseTitle = useRef<string | null>(null);

  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => actions.transitionEnd(navId), DURATION);
    return () => window.clearTimeout(t);
  }, [leaving, navId, actions]);

  // Remember the last focused control of every screen, so going back can return to it.
  useEffect(() => {
    const root = viewportRef.current;
    if (!root) return;
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as HTMLElement;
      const key = el.closest<HTMLElement>("section[data-route]")?.dataset.route;
      if (key) lastFocus.current.set(key, el);
    };
    root.addEventListener("focusin", onFocusIn);
    return () => root.removeEventListener("focusin", onFocusIn);
  }, []);

  // A screen change makes the old screen inert, which drops focus to <body>. Move it into the new screen:
  // back to the control that was used last on a revealed screen, otherwise to the new screen's heading.
  useEffect(() => {
    if (shownKey.current === topRoute.key) return;
    shownKey.current = topRoute.key;
    const keys = new Set(stack.map((r) => r.key));
    for (const key of lastFocus.current.keys()) if (!keys.has(key)) lastFocus.current.delete(key);
    const screen = viewportRef.current?.querySelector<HTMLElement>(`section[data-route="${topRoute.key}"]`);
    const active = document.activeElement;
    if (!screen || screen.contains(active) || active?.closest('[role="dialog"]')) return;
    const saved = lastFocus.current.get(topRoute.key);
    if (saved && screen.contains(saved) && !saved.closest("[inert]")) {
      saved.focus({ preventScroll: true });
      return;
    }
    const heading = screen.querySelector<HTMLElement>("h1");
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }, [topRoute.key, stack]);

  // One document title per screen, taken from the screen's heading (home keeps the site title).
  useEffect(() => {
    baseTitle.current ??= document.title;
    const heading = viewportRef.current
      ?.querySelector(`section[data-route="${topRoute.key}"] h1`)
      ?.textContent?.trim();
    document.title = topRoute.id === "home" || !heading ? baseTitle.current : `${heading} · KLeSIM`;
  }, [topRoute.key, topRoute.id, state.destination]);

  const leavingInStack = leaving ? stack.some((r) => r.key === leaving.key) : false;
  const enterCls = leaving ? styles[`enter_${transition}`] : "";
  const exitCls = leaving ? styles[`exit_${transition}`] : "";

  return (
    <div className={styles.viewport} ref={viewportRef}>
      {stack.map((route) => {
        const isTop = route.key === topRoute.key;
        const isLeaving = leaving?.key === route.key;
        const visible = isTop || isLeaving;
        return (
          <section
            key={route.key}
            className={`${styles.layer} ${isTop ? enterCls : ""} ${isLeaving ? exitCls : ""} ${visible ? "" : styles.hidden}`}
            aria-hidden={!isTop}
            inert={!isTop}
            data-screen={route.id}
            data-route={route.key}
          >
            {SCREENS[route.id]()}
          </section>
        );
      })}
      {leaving && !leavingInStack ? (
        <section
          key={leaving.key}
          className={`${styles.layer} ${styles.onTop} ${exitCls}`}
          aria-hidden
          inert
          data-screen={leaving.id}
        >
          {SCREENS[leaving.id]()}
        </section>
      ) : null}
    </div>
  );
}

export function PhoneApp() {
  // iOS Safari only shows :active (the pressed state) once a touchstart listener exists on the page
  useEffect(() => {
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });
    return () => document.removeEventListener("touchstart", noop);
  }, []);

  return (
    <AppProvider>
      <div className={styles.app}>
        <Navigator />
        <StatusBar />
        <OverlayHost />
        <Toast />
      </div>
    </AppProvider>
  );
}
