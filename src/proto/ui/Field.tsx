"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Img } from "./Img";
import { cx } from "./parts";
import styles from "./field.module.css";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  label: string;
  value: string;
  onChange: (v: string) => void;
  helper?: ReactNode;
  error?: ReactNode;
  valid?: boolean;
  trailing?: ReactNode;
  leading?: ReactNode;
};

/** Outlined text field with a floating label (Material-style, as in the Figma checkout frames). */
export function Field({ label, value, onChange, helper, error, valid, trailing, leading, className, ...rest }: Props) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const floating = focused || value.length > 0;
  const describedBy = error || helper ? `${id}-help` : undefined;
  return (
    <div className={cx(styles.field, className)}>
      <div
        className={cx(
          styles.root,
          focused && styles.focused,
          error ? styles.invalid : null,
          rest.disabled && styles.disabled,
        )}
      >
        {leading}
        <label htmlFor={id} className={cx(styles.label, floating && styles.labelFloat)}>
          {label}
        </label>
        <input
          id={id}
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {valid && !focused && !error ? <Img src="/icons/check-solid-green.svg" size={22} /> : null}
        {trailing}
      </div>
      {error || helper ? (
        <p id={`${id}-help`} className={cx(styles.helper, error ? styles.helperError : null)} role={error ? "alert" : undefined}>
          {error ?? helper}
        </p>
      ) : null}
    </div>
  );
}

export function PasswordField(props: Omit<Props, "type" | "trailing">) {
  const [show, setShow] = useState(false);
  return (
    <Field
      {...props}
      type={show ? "text" : "password"}
      trailing={
        <button
          type="button"
          className={styles.eye}
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
        >
          <Img src="/icons/eye.svg" size={24} style={{ opacity: show ? 1 : 0.7 }} />
          {show ? null : <span className={styles.eyeSlash} aria-hidden="true" />}
        </button>
      }
    />
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: ReactNode;
}) {
  const id = useId();
  return (
    <div className={styles.field}>
      <div className={cx(styles.root, styles.selectRoot, error ? styles.invalid : null)}>
        <Img src="/icons/country-adornment.svg" size={24} style={{ opacity: 0.8 }} />
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <select
          id={id}
          className={cx(styles.input, styles.select, !value && styles.selectEmpty)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
        >
          <option value="">{label}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <Img src="/icons/select-caret.svg" size={24} className={styles.selectCaret} />
      </div>
      {error ? (
        <p className={cx(styles.helper, styles.helperError)} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
