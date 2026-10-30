"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { useApp } from "../store";
import { CloseButton, cx } from "../ui/parts";
import styles from "./sheets.module.css";

type Props = {
  title: ReactNode;
  titleText?: string;
  leading?: ReactNode;
  /** pinned under the title row, e.g. a search field */
  subhead?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  variant?: "sheet" | "dialog";
  hideTitle?: boolean;
  onClose?: () => void;
};

function focusables(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute("inert") && el.tabIndex >= 0);
}

export function Sheet({ title, titleText, leading, subhead, children, footer, variant = "sheet", hideTitle, onClose }: Props) {
  const { state, actions } = useApp();
  const closing = state.overlay?.closing ?? false;
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const close = onClose ?? (() => actions.closeOverlay());

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const previous = document.activeElement as HTMLElement | null;
    const first = focusables(panel)[0];
    (first ?? panel).focus({ preventScroll: true });
    return () => previous?.focus?.({ preventScroll: true });
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    const list = focusables(panelRef.current);
    if (!list.length) return;
    const firstEl = list[0];
    const lastEl = list[list.length - 1];
    if (e.shiftKey && document.activeElement === firstEl) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault();
      firstEl.focus();
    }
  };

  return (
    <div className={cx(styles.layer, closing && styles.layerClosing)} onKeyDown={onKeyDown}>
      <div className={styles.backdrop} onClick={close} aria-hidden="true" />
      <div
        ref={panelRef}
        className={cx(variant === "sheet" ? styles.sheet : styles.dialog)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className={styles.body}>
          <div className={cx(styles.headWrap, subhead ? styles.headWrapSub : null)}>
            <div className={cx(styles.head, hideTitle && styles.headEnd)}>
              {leading}
              <h2 id={titleId} className={cx(styles.title, hideTitle && "sr-only")}>
                {title}
              </h2>
              <CloseButton onClick={close} label={`Close ${titleText ?? "dialog"}`} />
            </div>
            {subhead}
          </div>
          {children}
        </div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  );
}
