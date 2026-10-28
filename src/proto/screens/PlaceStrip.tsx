"use client";

import { useEffect, useRef, useState } from "react";
import { countryCode, flagEmoji, type Place } from "../data";
import { Img } from "../ui/Img";
import { cx } from "../ui/parts";
import styles from "./home.module.css";

/**
 * Two-row strip of destination chips that scrolls sideways as one piece: native touch scrolling,
 * mouse drag with a short glide, shift + wheel / trackpad, snap to chip edges, and a fade on the
 * trailing edge that goes away at the end. Chips stay focusable buttons; focus scrolls them into view.
 */
export function PlaceStrip({ places, label, onPick }: { places: Place[]; label: string; onPick: (name: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atEnd, setAtEnd] = useState(false);
  const suppressClick = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const sync = () => setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [places]);

  // mouse drag (touch and pen keep the browser's own momentum scrolling)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let startX = 0;
    let startLeft = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    let dragging = false;
    let pointer = -1;
    let glide = 0;

    const stopGlide = () => {
      cancelAnimationFrame(glide);
      glide = 0;
    };
    const settle = () => el.classList.remove(styles.stripDragging);
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      suppressClick.current = false;
      stopGlide();
      pointer = e.pointerId;
      startX = lastX = e.clientX;
      startLeft = el.scrollLeft;
      lastT = e.timeStamp;
      velocity = 0;
      dragging = false;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pointer) return;
      const dx = e.clientX - startX;
      if (!dragging && Math.abs(dx) > 4) {
        dragging = true;
        el.setPointerCapture(pointer);
        el.classList.add(styles.stripDragging);
      }
      if (!dragging) return;
      el.scrollLeft = startLeft - dx;
      const dt = Math.max(1, e.timeStamp - lastT);
      velocity = (lastX - e.clientX) / dt;
      lastX = e.clientX;
      lastT = e.timeStamp;
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== pointer) return;
      pointer = -1;
      if (!dragging) return;
      dragging = false;
      suppressClick.current = true;
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 0);
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      if (reduce.matches || Math.abs(velocity) < 0.05) {
        settle();
        return;
      }
      let v = velocity * 16;
      const step = () => {
        el.scrollLeft += v;
        v *= 0.92;
        if (Math.abs(v) > 0.5) glide = requestAnimationFrame(step);
        else {
          glide = 0;
          settle();
        }
      };
      glide = requestAnimationFrame(step);
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      stopGlide();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div className={cx(styles.strip, atEnd && styles.stripAtEnd)}>
      <div
        ref={scrollRef}
        className={styles.stripScroll}
        role="group"
        aria-label={label}
        onClickCapture={(e) => {
          // a drag that ends on a chip is not a tap
          if (!suppressClick.current) return;
          suppressClick.current = false;
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className={styles.stripGrid}>
          {places.map((p) => {
            const symbol = p.symbol ?? flagEmoji(countryCode(p.name));
            return (
              <button type="button" key={p.name} className={styles.chip} onClick={() => onPick(p.name)}>
                <span
                  className={cx(
                    styles.chipImg,
                    p.imageStyle === "wide" && styles.chipImgWide,
                    p.imageStyle === "tall" && styles.chipImgTall,
                    !p.image && styles.chipImgSymbol,
                  )}
                >
                  {p.image ? <Img src={p.image} alt="" eager /> : <span aria-hidden="true">{symbol}</span>}
                </span>
                {p.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
