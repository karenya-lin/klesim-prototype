"use client";

import { useEffect } from "react";
import { AuthFlow, authTitle, useAuthSteps } from "../auth/AuthFlow";
import auth from "../auth/auth.module.css";
import { useApp } from "../store";
import { XMark } from "../ui/icons";
import { BackButton, Hero, TopBar, cx, ui, useCollapse } from "../ui/parts";
import cart from "./cart.module.css";
import styles from "./esim.module.css";

/**
 * Sign in / create account as a focused full-screen task opened from Profile: no bottom nav,
 * back steps through the flow, X or Escape returns to Profile, success returns signed in.
 */
export function AuthScreen() {
  const { state, actions } = useApp();
  const nav = useAuthSteps();
  const title = authTitle(nav.step);
  const isTop = state.stack[state.stack.length - 1]?.id === "auth";
  const overlayOpen = !!state.overlay;
  const { screenRef, scrollRef, headerRef } = useCollapse();

  useEffect(() => {
    if (!isTop || overlayOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      actions.back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isTop, overlayOpen, actions]);

  return (
    <div className={ui.screen} ref={screenRef}>
      <TopBar
        leading={<BackButton onClick={nav.depth > 1 ? nav.back : actions.back} />}
        title={title}
        actions={
          <button type="button" className={ui.roundBtn} aria-label="Close" onClick={actions.back}>
            <XMark size={14} />
          </button>
        }
      />
      <div className={ui.scroll} ref={scrollRef}>
        <Hero src="/img/hero-wing.webp" height="calc(var(--sb-h) + 114px)" shade="down" />
        <header className={cx(styles.header, ui.collapseFade)} ref={headerRef}>
          <div className={ui.headerRowSpace} />
          <h1 className={styles.title} aria-live="polite">
            {title}
          </h1>
        </header>
        <div className={cart.panelInner}>
          <section className={cx(cart.card, cart.cardOpen, auth.screenCard)} aria-label={title}>
            <AuthFlow nav={nav} variant="screen" onDone={actions.back} />
          </section>
        </div>
      </div>
    </div>
  );
}
