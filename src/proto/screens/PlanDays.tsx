"use client";

import { DAY_OPTIONS } from "../data";
import { useApp, useMoney } from "../store";
import { Img } from "../ui/Img";
import { cx, ui } from "../ui/parts";
import { PlanBottomBar, PlanHeader } from "./PlanParts";
import styles from "./plans.module.css";

export function PlanDaysScreen() {
  const { state, actions } = useApp();
  const money = useMoney();
  return (
    <div className={ui.screen}>
      <PlanHeader />
      <div className={cx(ui.scroll, styles.panel)}>
        <div className={styles.panelInner}>
          <div className={styles.dayPlan}>
            <div className={styles.dayHead}>
              <Img src="/icons/esim-card.svg" width={60} height={40} />
              <div className={styles.dayHeadInfo}>
                <span className={styles.dayTitle}>
                  <strong>No limit</strong>
                  <span style={{ fontSize: 12 }}>/day</span>
                </span>
                <span style={{ fontSize: 12 }}>4G / 5G</span>
              </div>
              <button
                type="button"
                className={styles.dayHeadLink}
                onClick={() => actions.openOverlay("details", "no-limit")}
                aria-haspopup="dialog"
              >
                Details
              </button>
              <span className={styles.vSep} aria-hidden="true" />
              <button
                type="button"
                className={styles.dayHeadLink}
                onClick={() => actions.openOverlay("terms", "no-limit")}
                aria-haspopup="dialog"
                aria-label="Terms and conditions"
              >
                T&amp;C
              </button>
            </div>
            <div className={styles.dayOptions} role="radiogroup" aria-label="Number of days">
              {DAY_OPTIONS.map((d) => {
                const selected = state.days === d.days;
                return (
                  <button
                    key={d.days}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={cx(styles.dayOption, selected && styles.dayOptionSelected)}
                    onClick={() => actions.setDays(d.days)}
                  >
                    <span className={styles.dayLabel}>{d.label}</span>
                    <span className={styles.dayPrice}>{money(d.price)}</span>
                    {selected ? (
                      <span className={styles.dayCheck}>
                        <Img src="/icons/check-circle-blue.svg" size={22} />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
          <div className={cx(ui.card, styles.faqNote)}>
            <p className={styles.faqNoteTitle}>Can I activate the plan later?</p>
            <p className={styles.faqNoteBody}>
              All plans have a 30-day activation period. If you purchase a plan today but do not activate it before
              October 4, the plan will be automatically activated on that date.
            </p>
          </div>
        </div>
      </div>
      <PlanBottomBar onCheckout={() => actions.navigate("cart")} />
    </div>
  );
}
