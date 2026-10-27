"use client";

import { PLANS, type Plan } from "../data";
import { useApp, useMoney } from "../store";
import { Img } from "../ui/Img";
import { Radio, cx, ui } from "../ui/parts";
import { CouponRibbon, PlanBottomBar, PlanHeader } from "./PlanParts";
import styles from "./plans.module.css";

function PlanCard({ plan }: { plan: Plan }) {
  const { state, actions } = useApp();
  const money = useMoney();
  const selected = state.planId === plan.id;
  const select = () => actions.selectPlan(plan.id);
  return (
    <div
      className={cx(styles.planCard, selected && styles.planCardSelected)}
      onClick={select}
      data-plan={plan.id}
    >
      {plan.coupon ? <CouponRibbon /> : null}
      <div className={styles.planTop}>
        <div className={cx(styles.planInfo, plan.coupon && styles.planInfoIndented)}>
          <span className={styles.planTitle}>
            <span className={styles.planTitleBig}>{plan.title}</span>
            {plan.unit ? <span className={styles.planUnit}>{plan.unit}</span> : null}
          </span>
          <span className={styles.planDuration}>
            <Img src="/icons/clock-dark.svg" size={12} />
            {plan.duration}
          </span>
        </div>
        <button
          type="button"
          role="radio"
          aria-checked={selected}
          aria-label={`${plan.title}${plan.unit ?? ""}, ${plan.duration}, from ${money(plan.price)}`}
          className={styles.radioBtn}
          onClick={(e) => {
            e.stopPropagation();
            select();
          }}
        >
          <Radio checked={selected} />
        </button>
      </div>
      <div className={styles.planBottom}>
        <div>
          <button
            type="button"
            className={cx(ui.btn, ui.btnOutline, styles.detailsBtn)}
            onClick={(e) => {
              e.stopPropagation();
              actions.openOverlay("details", plan.id);
            }}
            aria-haspopup="dialog"
          >
            Details
          </button>
        </div>
        <div className={styles.priceCol}>
          <span className={styles.startFrom}>start from</span>
          <span className={styles.priceBig}>{money(plan.price)}</span>
          {plan.was ? (
            <span className={styles.was}>
              <span className="sr-only">was </span>
              {money(plan.was)}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function PlansScreen() {
  const { state, actions } = useApp();
  const daily = PLANS.filter((p) => p.kind === "daily");
  const total = PLANS.filter((p) => p.kind === "total");
  const selected = PLANS.find((p) => p.id === state.planId);

  return (
    <div className={ui.screen}>
      <PlanHeader />
      <div className={ui.scroll}>
        <div className={styles.list} role="radiogroup" aria-label="Choose a plan">
          <section className={styles.group} aria-labelledby="daily-h">
            <div className={styles.groupHead}>
              <h2 id="daily-h" className={ui.h20}>
                Daily limitation
              </h2>
              <span className={ui.tag}>4G / 5G</span>
            </div>
            {daily.map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </section>
          <section className={styles.group} aria-labelledby="total-h">
            <div className={styles.groupHead}>
              <h2 id="total-h" className={ui.h20}>
                Total
              </h2>
              <span className={ui.tag}>Rechargeable</span>
              <span className={ui.tag}>4G / 5G</span>
            </div>
            {total.map((p) =>
              p.bestseller ? (
                <div className={styles.bestsellers} key={p.id}>
                  <span className={styles.bestsellersHead}>Bestsellers</span>
                  <PlanCard plan={p} />
                </div>
              ) : (
                <PlanCard key={p.id} plan={p} />
              ),
            )}
          </section>
        </div>
      </div>
      {selected?.kind === "daily" ? (
        <div className={ui.barStack}>
          <div className={ui.bar}>
            <button
              type="button"
              className={cx(ui.btn, ui.btnPrimary, ui.btnBlock)}
              onClick={() => actions.navigate("planDays")}
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <PlanBottomBar onCheckout={() => actions.navigate("cart")} />
      )}
    </div>
  );
}
