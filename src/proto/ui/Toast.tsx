"use client";

import { useEffect } from "react";
import { TOAST_DURATION, useApp } from "../store";
import { CartAdd } from "./icons";
import { cx } from "./parts";
import styles from "./ui.module.css";

function Check() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5 10 17l9-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Toast() {
  const { state, actions } = useApp();
  const toast = state.toast;

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => actions.toastDone(toast.id), TOAST_DURATION);
    return () => window.clearTimeout(t);
  }, [toast, actions]);

  return (
    <div className={styles.toastWrap} role="status" aria-live="polite">
      {toast ? (
        <div key={toast.id} className={cx(styles.toast, toast.kind === "cart" && styles.toastCollapsing)}>
          <div className={styles.toastText}>
            <span className={styles.toastTitle}>{toast.title}</span>
            {toast.text ? <span className={styles.toastSub}>{toast.text}</span> : null}
          </div>
          {toast.kind === "cart" ? <CartAdd /> : <Check />}
        </div>
      ) : null}
    </div>
  );
}
