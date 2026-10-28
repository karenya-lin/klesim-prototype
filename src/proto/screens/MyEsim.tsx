"use client";

import { useState } from "react";
import { useApp } from "../store";
import { BrandWordmark } from "../ui/Brand";
import { Img } from "../ui/Img";
import { BottomNav, CartButton, CurrencyButton, Hero, TopBar, cx, ui, useCollapse } from "../ui/parts";
import home from "./home.module.css";
import styles from "./esim.module.css";

export type EsimCardData = {
  id: string;
  status: "Active" | "Inactive" | "New";
  title: string;
  ref: string;
  date: string;
  left: string;
  total: string;
  usedPct?: number;
};

export const SAMPLE_ESIMS: EsimCardData[] = [
  {
    id: "esim-a",
    status: "Active",
    title: "eSim France Format : eSim - Package:100GB - 13 days",
    ref: "Ref.: I35153WFWFWJDOIJFPOE",
    date: "2026/10/22",
    left: "8.5GB",
    total: "/100GB",
    usedPct: 25,
  },
  {
    id: "esim-b",
    status: "Inactive",
    title: "eSim France Format : eSim - Package:100GB - 13 days",
    ref: "Ref.: IWF31313JDOIJFPOE",
    date: "2028/10/30",
    left: "100GB",
    total: "/100GB",
  },
  {
    id: "esim-c",
    status: "Inactive",
    title: "eSim France Format : eSim - Package:100GB - 13 days",
    ref: "Ref.: IWF31313JDOIJFPOE",
    date: "2028/10/30",
    left: "100GB",
    total: "/100GB",
  },
];

export function EsimCard({ data, flat, onOpen }: { data: EsimCardData; flat?: boolean; onOpen?: () => void }) {
  const content = (
    <>
      <span className={styles.cardBody}>
        <span className={styles.cardGroup}>
          <span className={styles.cardRow}>
            <span className={styles.flagBadge} aria-hidden="true">
              <Img src="/icons/flag-france-small.svg" size={21.6} />
            </span>
            <span
              className={cx(
                styles.status,
                data.status === "Active" && styles.statusActive,
                data.status === "New" && styles.statusNew,
              )}
            >
              {data.status === "New" ? "Ready to install" : data.status}
            </span>
          </span>
          <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className={styles.cardTitle}>{data.title}</span>
            <span className={styles.ref}>{data.ref}</span>
          </span>
        </span>
        <span className={styles.cardBottom}>
          <span className={styles.date}>
            <Img src="/icons/clock-gray.svg" size={12} />
            {data.date}
          </span>
          <span className={styles.data}>
            <span className={styles.dataBig}>{data.left}</span>
            <span className={styles.dataUnit}>{data.total}</span>
          </span>
        </span>
      </span>
      {data.usedPct !== undefined ? (
        <span
          className={styles.progress}
          role="progressbar"
          aria-label="Data used"
          aria-valuenow={data.usedPct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span className={styles.progressFill} style={{ width: `${data.usedPct}%`, display: "block" }} />
        </span>
      ) : null}
    </>
  );
  return onOpen ? (
    <button type="button" className={cx(styles.card, flat && styles.cardFlat)} onClick={onOpen}>
      {content}
    </button>
  ) : (
    <div className={cx(styles.card, flat && styles.cardFlat)}>{content}</div>
  );
}

export function MyEsimScreen() {
  const { state, actions } = useApp();
  const [tab, setTab] = useState<"country" | "regional">("country");
  const { screenRef, scrollRef, headerRef } = useCollapse();
  const cards: EsimCardData[] = state.purchased
    ? [
        {
          id: "esim-new",
          status: "New",
          title: "eSim Global Format : eSim - Package:10GB - 30 days",
          ref: "Ref.: KL2610220001DEMO",
          date: "2026/11/21",
          left: "10GB",
          total: "/10GB",
        },
        ...SAMPLE_ESIMS,
      ]
    : SAMPLE_ESIMS;
  const shown = tab === "country" ? cards : cards.slice(0, 1);

  return (
    <div className={ui.screen} ref={screenRef}>
      <TopBar
        leading={<BrandWordmark />}
        title="My eSIM"
        actions={
          <>
            <CartButton soft badge={false} />
            <CurrencyButton soft />
          </>
        }
      />
      <div className={ui.scroll} ref={scrollRef}>
        <Hero src="/img/hero-wing.webp" height="calc(var(--sb-h) + 114px)" shade="down" />
        <header className={cx(styles.header, ui.collapseFade)} ref={headerRef}>
          <div className={ui.headerRowSpace} />
          <h1 className={styles.title}>My eSIM</h1>
        </header>
        <div className={styles.listWrap}>
          <div className={styles.tabsRow} style={{ width: "100%" }}>
            <div className={home.tabs} role="tablist" aria-label="eSIM type">
              <button
                type="button"
                role="tab"
                aria-selected={tab === "country"}
                className={cx(home.tab, tab === "country" && home.tabActive)}
                onClick={() => setTab("country")}
              >
                Country
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "regional"}
                className={cx(home.tab, tab === "regional" && home.tabActive)}
                onClick={() => setTab("regional")}
              >
                Regional Package
              </button>
            </div>
            <button
              type="button"
              className={home.storeBtn}
              aria-label="Buy another eSIM"
              onClick={() => actions.navigate("plans")}
            >
              <Img src="/icons/storefront.svg" size={24} />
            </button>
            <button
              type="button"
              className={home.storeBtn}
              aria-label="Search destinations"
              onClick={() => actions.navigate("search", "fade")}
            >
              <Img src="/icons/search-dark.svg" size={24} />
            </button>
          </div>
          <ul className={styles.list}>
            {shown.map((c) => (
              <li key={c.id}>
                <EsimCard data={c} onOpen={() => actions.navigate("esimDetail")} />
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={cx(ui.btn, ui.btnDark, styles.fab)}
            aria-label="Back to top"
            onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Img src="/icons/arrow-down-white.svg" size={24} style={{ transform: "rotate(180deg)" }} />
          </button>
        </div>
      </div>
      <BottomNav active="myEsim" />
    </div>
  );
}
