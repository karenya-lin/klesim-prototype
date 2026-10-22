"use client";

import { AuthFlow } from "../auth/AuthFlow";
import { PAYMENT_LABEL, useApp } from "../store";
import { BrandWordmark } from "../ui/Brand";
import { BottomNav, CartButton, CurrencyButton, Hero, cx, ui } from "../ui/parts";
import cart from "./cart.module.css";
import styles from "./esim.module.css";

export function ProfileScreen() {
  const { state, actions } = useApp();
  const user = state.user;
  return (
    <div className={ui.screen}>
      <Hero src="/img/hero-wing.webp" height="calc(var(--sb-h) + 114px)" shade="down" />
      <header className={styles.header}>
        <div className={ui.headerRow}>
          <BrandWordmark />
          <div className={ui.headerGroup}>
            <CartButton soft badge={false} />
            <CurrencyButton soft />
          </div>
        </div>
        <h1 className={styles.title}>Profile</h1>
      </header>
      <div className={ui.scroll}>
        <div className={cart.panelInner}>
          {user ? (
            <>
              <section className={styles.profileCard} aria-label="Account">
                <div className={styles.profileHead}>
                  <strong>Hi, {user.name}</strong>
                  <span>eSIM will be sent to {user.email}.</span>
                </div>
              </section>
              <nav className={styles.menu} aria-label="Account">
                <button type="button" className={styles.menuItem} onClick={() => actions.tab("myEsim")}>
                  <span>My eSIM</span>
                  <span>{state.purchased ? "4" : "3"}</span>
                </button>
                <button type="button" className={styles.menuItem} onClick={() => actions.navigate("cart")}>
                  <span>Cart</span>
                  <span>{state.cart.length}</span>
                </button>
                <button type="button" className={styles.menuItem}>
                  <span>Payment method</span>
                  <span>{state.payment ? PAYMENT_LABEL[state.payment] : "Not set"}</span>
                </button>
                <button type="button" className={styles.menuItem}>
                  <span>Language</span>
                  <span>English</span>
                </button>
                <button type="button" className={styles.menuItem} onClick={() => actions.navigate("guide")}>
                  <span>User guide</span>
                  <span />
                </button>
              </nav>
              <button type="button" className={cx(ui.btn, ui.btnLight, ui.btnBlock)} onClick={actions.signOut}>
                Sign out
              </button>
            </>
          ) : (
            <section className={cx(cart.card, cart.cardOpen)} aria-labelledby="signin-h">
              <div className={cart.cardHead}>
                <span className={cart.cardHeadText}>
                  <h2 id="signin-h" className={cart.cardTitle}>
                    Sign in or create an account
                  </h2>
                  <span className={cart.cardSub}>Keep your eSIMs, orders and receipts in one place.</span>
                </span>
              </div>
              <AuthFlow />
            </section>
          )}
        </div>
      </div>
      <BottomNav active="profile" />
    </div>
  );
}
