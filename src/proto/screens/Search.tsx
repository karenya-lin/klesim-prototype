"use client";

import { useMemo, useState } from "react";
import { DESTINATIONS, PLACE_ROWS } from "../data";
import { useApp, useMoney } from "../store";
import { Img } from "../ui/Img";
import { BackButton, BottomNav, CartButton, CurrencyButton, Hero, cx, ui } from "../ui/parts";
import home from "./home.module.css";
import styles from "./search.module.css";

const DEFAULT_RESULTS = ["canada", "colombia"];

export function SearchScreen() {
  const { actions } = useApp();
  const money = useMoney();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DESTINATIONS.filter((d) => DEFAULT_RESULTS.includes(d.id));
    return DESTINATIONS.filter((d) => d.name.toLowerCase().includes(q));
  }, [query]);

  const open = (name: string) => {
    actions.setDestination(name);
    actions.navigate("plans");
  };

  return (
    <div className={ui.screen}>
      <div className={ui.scroll}>
        <Hero src="/img/hero-wing.webp" height="calc(var(--sb-h) + 165px)" shade="down" rounded />
        <div className={home.page}>
          <h1 className="sr-only">Find destination</h1>
          <div className={home.topRow}>
            <BackButton ghost />
            <div className={ui.headerGroup}>
              <CartButton soft badge={false} />
              <CurrencyButton soft />
            </div>
          </div>

          <section className={cx(home.promo, styles.promo)} aria-label="Search destinations">
            <div className={home.promoHead}>
              <span>eSIM starting from {money(5.59, { tight: true })}!</span>
            </div>
            <form
              className={home.promoBar}
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                if (results[0]) open(results[0].name);
              }}
            >
              <label className={styles.inputPill}>
                <span className="sr-only">Find destination</span>
                <input
                  className={styles.input}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find destination"
                  autoComplete="off"
                  enterKeyHint="search"
                  autoFocus
                />
                <button type="submit" className={styles.submit} aria-label="Search">
                  <Img src="/icons/search-dark.svg" size={24} />
                </button>
              </label>
            </form>
            <span className={home.esim3d} aria-hidden="true">
              <Img src="/img/esim-3d.webp" eager />
            </span>
          </section>

          <section className={styles.results} aria-labelledby="current-h">
            <h2 id="current-h" className={cx(ui.h20, styles.padX)}>
              Current view
            </h2>
            <div className={home.places} style={{ marginTop: 0 }}>
              <div className={home.placesInner}>
                <div className={home.chipRows}>
                  {PLACE_ROWS.map((row, r) => (
                    <div className={home.chipRow} key={r}>
                      {row.map((p, i) => (
                        <button type="button" key={`${p.name}-${i}`} className={home.chip} onClick={() => open(p.name)}>
                          <span
                            className={cx(
                              home.chipImg,
                              p.imageStyle === "wide" && home.chipImgWide,
                              p.imageStyle === "tall" && home.chipImgTall,
                            )}
                          >
                            <Img src={p.image} eager />
                          </span>
                          {p.name}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <ul className={cx(styles.cards, styles.padX)} aria-live="polite">
              {results.length === 0 ? (
                <li className={styles.empty}>No destinations match “{query}”.</li>
              ) : (
                results.map((d) => (
                  <li key={d.id}>
                    <button type="button" className={styles.countryCard} onClick={() => open(d.name)}>
                      <Img src="/icons/esim-card.svg" width={60} height={40} />
                      <span className={styles.countryText}>
                        <span className={styles.countryName}>{d.name}</span>
                        <span className={styles.countryMeta}>4G / 5G</span>
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </div>
      <BottomNav active="home" />
    </div>
  );
}
