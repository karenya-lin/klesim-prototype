"use client";

import { useState } from "react";
import { useApp } from "../store";
import { Img } from "../ui/Img";
import {
  BackButton,
  BottomNav,
  CartButton,
  CurrencyButton,
  Hero,
  ShareButton,
  TopBar,
  cx,
  ui,
  useCollapse,
} from "../ui/parts";
import { EsimCard, SAMPLE_ESIMS } from "./MyEsim";
import plans from "./plans.module.css";
import styles from "./esim.module.css";

/* Placeholder values only: not a real SM-DP+ server or activation code. */
const SMDP_ADDRESS = "smdp.example.com";
const ACTIVATION_CODE = "LPA:1$smdp.example.com$DEMO-0000-KLESIM";

function CopyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function EsimDetailScreen() {
  const { actions } = useApp();
  const [showCode, setShowCode] = useState(false);
  const { screenRef, scrollRef, headerRef } = useCollapse();

  const copyCode = async () => {
    try {
      await navigator.clipboard?.writeText(ACTIVATION_CODE);
    } catch {
      // clipboard may be unavailable (permissions); the toast still confirms the action in the prototype
    }
    actions.toast("copied", "Copied", "Activation code copied to clipboard");
  };

  return (
    <div className={ui.screen} ref={screenRef}>
      <TopBar
        leading={<BackButton />}
        title="eSIM"
        actions={
          <>
            <ShareButton />
            <CartButton />
            <CurrencyButton />
          </>
        }
      />
      <div className={ui.scroll} ref={scrollRef}>
        <Hero src="/img/hero-wing.webp" height="calc(var(--sb-h) + 114px)" shade="down" />
        <header className={cx(styles.header, ui.collapseFade)} style={{ gap: 15 }} ref={headerRef}>
          <div className={ui.headerRowSpace} />
          <div className={styles.titleRow}>
            <h1 className={styles.title}>eSIM</h1>
            <span className={plans.compat} style={{ width: "auto" }}>
              <span className={plans.compatInfo}>
                <Img src="/icons/check-circle-green.svg" size={22} style={{ margin: 1 }} eager />
                Compatible with this device
              </span>
            </span>
          </div>
        </header>
        <div className={styles.detail}>
          <EsimCard data={SAMPLE_ESIMS[1]} flat />
          <div className={styles.twoBtns}>
            <button
              type="button"
              className={styles.softBtn}
              onClick={() => actions.openOverlay("resendEmail")}
              aria-haspopup="dialog"
            >
              Resend email
            </button>
            <button
              type="button"
              className={styles.softBtn}
              onClick={() => actions.openOverlay("details", "10gb")}
              aria-haspopup="dialog"
            >
              Details
            </button>
          </div>
          <h2 className={styles.h20}>Activate method</h2>
          <button
            type="button"
            className={cx(ui.btn, ui.btnPrimary, ui.btnBlock)}
            onClick={() => actions.toast("info", "Opening installer", "Follow the steps on your device")}
          >
            Download eSIM directly
          </button>
          <div className={styles.orRow} aria-hidden="true">
            <span />
            OR
            <span />
          </div>
          <p className={styles.manualTitle}>Activate manually by SMDP and activation code</p>
          <div className={styles.tiles}>
            <button
              type="button"
              className={styles.tile}
              onClick={() => actions.toast("info", "Opening eSIM settings", "Add the plan with the SM-DP+ address")}
            >
              <span className={styles.tileText}>
                <strong>SMDP</strong>
                <span>Click to open</span>
              </span>
              <Img src="/icons/arrow-up-right-dark.svg" size={24} />
            </button>
            <button type="button" className={styles.tile} onClick={copyCode}>
              <span className={styles.tileText}>
                <strong>Code</strong>
                <span>Click to copy</span>
              </span>
              <CopyIcon />
            </button>
          </div>
          <div className={styles.kv}>
            <div className={styles.kvItem}>
              <span className={styles.kvLabel}>SM-DP+ address</span>
              <span className={styles.kvValue}>{SMDP_ADDRESS}</span>
            </div>
            <div className={styles.kvItem}>
              <span className={styles.kvLabel} id="code-label">
                Activation code
              </span>
              <span className={styles.kvValue}>
                <span className={styles.mono} aria-labelledby="code-label" style={{ flex: "1 1 0" }}>
                  {showCode ? ACTIVATION_CODE : "•••• •••• •••• ••••"}
                </span>
                <button
                  type="button"
                  className={styles.textBtn}
                  aria-pressed={showCode}
                  onClick={() => setShowCode((s) => !s)}
                >
                  {showCode ? "Hide" : "Show"}
                </button>
              </span>
            </div>
            <div className={styles.kvItem}>
              <span className={styles.kvLabel}>ICCID</span>
              <span className={styles.kvValue}>867416464606644646868846</span>
            </div>
            <div className={styles.kvItem}>
              <span className={styles.kvLabel}>APN</span>
              <span className={styles.kvValue}>APN.net</span>
            </div>
          </div>
        </div>
      </div>
      <BottomNav active="myEsim" />
    </div>
  );
}
