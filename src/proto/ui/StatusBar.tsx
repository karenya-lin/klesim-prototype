"use client";

import { useApp } from "../store";
import { Img } from "./Img";
import styles from "./ui.module.css";

export function StatusBar() {
  const { state } = useApp();
  const dark = state.overlay?.id === "success" && !state.overlay.closing;
  return (
    <div className={`${styles.statusBar} ${dark ? styles.statusDim : ""}`} aria-hidden="true">
      <span className={styles.statusTime}>9:41</span>
      <span className={styles.statusIsland} />
      <span className={styles.statusLevels}>
        <Img src="/icons/status-cellular.svg" width={19} height={12} eager />
        <Img src="/icons/status-wifi.svg" width={17} height={12} eager />
        <Img src="/icons/status-battery.svg" width={27} height={13} eager />
      </span>
    </div>
  );
}
