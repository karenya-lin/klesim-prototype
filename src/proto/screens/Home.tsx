"use client";

import { useRef, useState } from "react";
import { PLACE_ROWS, WHY_US } from "../data";
import { useApp, useMoney } from "../store";
import { BrandWordmark } from "../ui/Brand";
import { Img } from "../ui/Img";
import { CartAdd } from "../ui/icons";
import {
  BottomNav,
  CartButton,
  CurrencyButton,
  FaqSection,
  GuideLinksSection,
  Hero,
  cx,
  ui,
} from "../ui/parts";
import styles from "./home.module.css";

export function HomeScreen() {
  const { actions } = useApp();
  const money = useMoney();
  const [tab, setTab] = useState<"country" | "regional">("country");
  const scrollRef = useRef<HTMLDivElement>(null);

  const openPlans = (destination: string) => {
    actions.setDestination(destination);
    actions.navigate("plans");
  };

  return (
    <div className={ui.screen}>
      <div className={ui.scroll} ref={scrollRef}>
        <Hero src="/img/hero-wing.webp" height="calc(var(--sb-h) + 165px)" shade="down" rounded />
        <div className={styles.page}>
          <h1 className="sr-only">KLeSIM home</h1>
          <div className={styles.topRow}>
            <BrandWordmark />
            <div className={ui.headerGroup}>
              <CartButton soft badge={false} />
              <CurrencyButton soft />
            </div>
          </div>

          <section className={styles.promo} aria-label="Limited time sale">
            <div className={styles.promoHead}>
              <span>KLeSIM limited time sale</span>
              <span className={styles.decoSlot} aria-hidden="true">
                <span className={styles.esim3dInline}>
                  <Img src="/img/esim-3d.webp" eager />
                </span>
              </span>
              <button type="button" className={styles.promoOffers} onClick={() => openPlans("Global")}>
                Great Offers
                <Img src="/icons/arrow-up-right-white.svg" size={24} />
              </button>
            </div>
            <div className={styles.promoBar}>
              <button type="button" className={styles.circleBtn} aria-label="Help">
                <Img src="/icons/question.svg" width={20} height={22} />
              </button>
              <button type="button" className={styles.circleBtn} aria-label="Scan a QR code">
                <Img src="/icons/scan.svg" size={24} />
              </button>
              <button type="button" className={styles.findPill} onClick={() => actions.navigate("search", "fade")}>
                <span>Find destination</span>
                <Img src="/icons/search-blue.svg" size={24} />
              </button>
            </div>
          </section>

          <div className={styles.places}>
            <div className={styles.placesInner}>
              <div className={styles.tabs} role="tablist" aria-label="Destination type">
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "country"}
                  className={cx(styles.tab, tab === "country" && styles.tabActive)}
                  onClick={() => setTab("country")}
                >
                  Country
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "regional"}
                  className={cx(styles.tab, tab === "regional" && styles.tabActive)}
                  onClick={() => setTab("regional")}
                >
                  Regional Package
                </button>
                <button
                  type="button"
                  className={styles.storeBtn}
                  aria-label="Browse all plans"
                  onClick={() => actions.navigate("plans", "fade")}
                >
                  <Img src="/icons/storefront.svg" size={24} />
                </button>
              </div>
              <div className={styles.chipRows}>
                {(tab === "country"
                  ? PLACE_ROWS
                  : [
                      [PLACE_ROWS[0][2], PLACE_ROWS[1][2]],
                      [PLACE_ROWS[0][0], PLACE_ROWS[0][1]],
                    ]
                ).map((row, r) => (
                  <div className={styles.chipRow} key={r}>
                    {row.map((p, i) => {
                      const label = tab === "country" ? p.name : ["Asia", "Europe", "Oceania", "Americas"][r * 2 + i];
                      return (
                        <button
                          type="button"
                          key={`${label}-${i}`}
                          className={styles.chip}
                          onClick={() => openPlans(label)}
                        >
                          <span
                            className={cx(
                              styles.chipImg,
                              p.imageStyle === "wide" && styles.chipImgWide,
                              p.imageStyle === "tall" && styles.chipImgTall,
                            )}
                          >
                            <Img src={p.image} alt="" eager />
                          </span>
                          {label}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.main}>
            <section className={styles.offerSection} aria-labelledby="offer-h">
              <div className={ui.sectionHead}>
                <h2 id="offer-h" className={ui.h20}>
                  Popular offer
                </h2>
                <button type="button" className={ui.linkSf} onClick={() => openPlans("Global")}>
                  See more
                </button>
              </div>
              <button type="button" className={styles.offerCard} onClick={() => openPlans("France")}>
                <span className={styles.offerInfo}>
                  <Img src="/icons/esim-card.svg" width={60} height={40} />
                  <span className={styles.offerTitle}>eSim France Format : eSim - Package:100GB</span>
                </span>
                <Img src="/img/medal.webp" width={64} height={67} className={styles.medal} />
                <span className={styles.taxNote}>Amount (Tax excluded)</span>
                <span className={styles.priceRow}>
                  <span className={styles.duration}>
                    <Img src="/icons/clock-gray.svg" size={12} />
                    12 days
                  </span>
                  <span className={styles.price}>
                    <span className={styles.priceBig}>{money(50)}</span>
                    <span className={styles.priceUnit}>/100GB</span>
                  </span>
                </span>
              </button>
            </section>

            <section className={ui.section} aria-labelledby="why-h">
              <div className={ui.sectionHead}>
                <h2 id="why-h" className={ui.h20}>
                  Why choose us
                </h2>
                <button
                  type="button"
                  className={styles.buyBtn}
                  aria-label="Let’s buy"
                  title="Let’s buy"
                  onClick={() => openPlans("Global")}
                >
                  <CartAdd />
                </button>
              </div>
              <div className={cx(ui.card, styles.whyCard)}>
                {WHY_US.map((w, i) => (
                  <div key={w.title} style={{ display: "contents" }}>
                    <div className={styles.whyRow}>
                      <Img src={w.icon} size={40} />
                      <div className={styles.whyText}>
                        <p className={styles.whyTitle}>{w.title}</p>
                        <p className={styles.whyBody}>{w.body}</p>
                      </div>
                    </div>
                    {i < WHY_US.length - 1 ? <span className={styles.whyDivider} aria-hidden="true" /> : null}
                  </div>
                ))}
              </div>
            </section>

            <GuideLinksSection />
            <FaqSection />

            <button
              type="button"
              className={cx(ui.btn, ui.btnDark, styles.toTop)}
              aria-label="Back to top"
              onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <Img src="/icons/arrow-down-white.svg" size={24} style={{ transform: "rotate(180deg)" }} />
            </button>
          </div>
        </div>
      </div>
      <BottomNav active="home" />
    </div>
  );
}
