"use client";

import { useEffect, type ReactNode } from "react";
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
};

const DURATION = 320;

function Navigator() {
  const { state, actions } = useApp();
  const { stack, leaving, transition, navId } = state;
  const topRoute = stack[stack.length - 1];

  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => actions.transitionEnd(navId), DURATION);
    return () => window.clearTimeout(t);
  }, [leaving, navId, actions]);

  const leavingInStack = leaving ? stack.some((r) => r.key === leaving.key) : false;
  const enterCls = leaving ? styles[`enter_${transition}`] : "";
  const exitCls = leaving ? styles[`exit_${transition}`] : "";

  return (
    <div className={styles.viewport}>
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
