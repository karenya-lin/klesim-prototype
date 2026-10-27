"use client";

import { useEffect, useRef, useState, type Ref } from "react";
import { nameFromEmail, useApp } from "../store";
import { Field, PasswordField } from "../ui/Field";
import { Img } from "../ui/Img";
import { Mail } from "../ui/icons";
import { cx, ui } from "../ui/parts";
import styles from "./auth.module.css";

/*
 * Sample security values for the prototype (shown in the UI on purpose; they are not real policy).
 */
export const SIGN_IN_MAX_FAILURES = 5;
export const SIGN_IN_WAIT_SECONDS = 60;
export const CODE_ATTEMPTS = 5;
export const CODE_RESEND_SECONDS = 60;
export const CODE_EXPIRY_MINUTES = 10;

/** Account the prototype signs in with when Google or Facebook is picked. */
export const SSO_SAMPLE_EMAIL = "zylan.weather@example.com";

const GENERIC_SIGN_IN_ERROR = "Sign-in failed. Check your email and password.";
const GENERIC_RESET_MESSAGE = "If that email is registered, we will send you a reset link.";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function passwordRules(pw: string) {
  return [
    { label: "At least 8 characters", ok: pw.length >= 8 },
    { label: "At least 1 uppercase", ok: /[A-Z]/.test(pw) },
    { label: "No space", ok: pw.length > 0 && !/\s/.test(pw) },
  ];
}

export type Step =
  | { id: "start" }
  | { id: "password" }
  | { id: "register" }
  | { id: "forgot"; sent: boolean }
  | { id: "code"; purpose: "login" | "verify" | "device"; email: string };

/** Step history, so a screen header can step back through the flow. */
export function useAuthSteps(first: Step = { id: "start" }) {
  const [history, setHistory] = useState<Step[]>([first]);
  return {
    step: history[history.length - 1],
    depth: history.length,
    push: (s: Step) => setHistory((h) => [...h, s]),
    replace: (s: Step) => setHistory((h) => [...h.slice(0, -1), s]),
    back: () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h)),
  };
}

export type AuthSteps = ReturnType<typeof useAuthSteps>;

export function authTitle(step: Step) {
  switch (step.id) {
    case "register":
      return "Create account";
    case "forgot":
      return "Reset password";
    case "code":
      return step.purpose === "verify" ? "Verify your email" : "Enter code";
    default:
      return "Sign in";
  }
}

function useCountdown(initial: number) {
  const [left, setLeft] = useState(initial);
  useEffect(() => {
    if (left <= 0) return;
    const t = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [left]);
  return [left, setLeft] as const;
}

function Legal() {
  return (
    <p className={styles.legal}>
      By continuing, you agree to KLeSIM’s{" "}
      <a href="#terms" onClick={(e) => e.preventDefault()}>
        Terms of Service
      </a>{" "}
      and{" "}
      <a href="#privacy" onClick={(e) => e.preventDefault()}>
        Privacy Policy
      </a>
      .
    </p>
  );
}

/**
 * `inline` (checkout): SSO buttons on top, steps swap in place.
 * `screen` (Profile's full-screen flow): no SSO (the Profile entry already offers it), `nav` comes from the
 * screen so its back arrow can step back, and the first field takes focus on every step.
 */
export function AuthFlow({
  onDone,
  nav,
  variant = "inline",
}: {
  onDone?: () => void;
  nav?: AuthSteps;
  variant?: "inline" | "screen";
}) {
  const own = useAuthSteps();
  const { step, push, replace } = nav ?? own;
  const rootRef = useRef<HTMLDivElement>(null);
  const stepKey = step.id === "code" ? `code-${step.purpose}` : step.id;

  useEffect(() => {
    if (variant !== "screen") return;
    rootRef.current?.querySelector<HTMLElement>("input:not([disabled])")?.focus();
  }, [variant, stepKey]);

  return (
    <div ref={rootRef}>
      <StepForms step={step} push={push} replace={replace} onDone={onDone} sso={variant === "inline"} />
    </div>
  );
}

function StepForms({
  step,
  push,
  replace,
  onDone,
  sso: showSso,
}: Pick<AuthSteps, "step" | "push" | "replace"> & { onDone?: () => void; sso: boolean }) {
  const { actions } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [failures, setFailures] = useState(0);
  const [wait, setWait] = useCountdown(0);

  const emailValid = EMAIL_RE.test(email.trim());

  const finish = (mail: string) => {
    actions.signIn({ email: mail, name: nameFromEmail(mail) });
    onDone?.();
  };

  const sso = () => finish(SSO_SAMPLE_EMAIL);

  const go = (s: Step) => {
    setFormError(null);
    setEmailError(null);
    push(s);
  };

  if (step.id === "code") {
    return (
      <CodeStep
        key={`${step.purpose}-${step.email}`}
        email={step.email}
        purpose={step.purpose}
        onBack={() => go({ id: "start" })}
        onVerified={() => finish(step.email)}
      />
    );
  }

  if (step.id === "forgot") {
    return (
      <form
        className={styles.stack}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!emailValid) {
            setEmailError("Enter a valid email address.");
            return;
          }
          setEmailError(null);
          replace({ id: "forgot", sent: true });
        }}
      >
        <p className={styles.lead}>Enter your email and we’ll help you reset your password.</p>
        <Field
          label="Email address"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          error={emailError}
        />
        {step.sent ? (
          <p className={styles.notice} role="status">
            {GENERIC_RESET_MESSAGE}
          </p>
        ) : null}
        <button type="submit" className={cx(ui.btn, ui.btnPrimary, ui.btnBlock)}>
          {step.sent ? "Send again" : "Send reset link"}
        </button>
        <p className={styles.legal}>
          <button type="button" className={styles.inlineLink} onClick={() => go({ id: "password" })}>
            Back to sign in
          </button>
        </p>
      </form>
    );
  }

  if (step.id === "password") {
    const locked = wait > 0;
    return (
      <form
        className={styles.stack}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (locked) return;
          // Prototype rule: any valid email with a password of 8+ characters signs in.
          if (emailValid && password.length >= 8) {
            setFailures(0);
            setFormError(null);
            push({ id: "code", purpose: "device", email: email.trim() });
            return;
          }
          const n = failures + 1;
          setFailures(n);
          if (n >= SIGN_IN_MAX_FAILURES) {
            setFailures(0);
            setWait(SIGN_IN_WAIT_SECONDS);
          }
          setFormError(GENERIC_SIGN_IN_ERROR);
        }}
      >
        <Field label="Email address" type="email" autoComplete="email" value={email} onChange={setEmail} />
        <PasswordField label="Password" autoComplete="current-password" value={password} onChange={setPassword} />
        <div className={styles.rowBetween}>
          <button type="button" className={styles.inlineLink} onClick={() => go({ id: "forgot", sent: false })}>
            Forgot password?
          </button>
        </div>
        {formError ? (
          <p className={styles.errorBox} role="alert">
            {formError}
            {locked ? ` Please wait ${wait} s before trying again.` : null}
          </p>
        ) : null}
        <button type="submit" className={cx(ui.btn, ui.btnPrimary, ui.btnBlock)} disabled={locked}>
          {locked ? `Try again in ${wait} s` : "Sign in"}
        </button>
        <Legal />
        <p className={styles.legal}>
          New to KLeSIM?{" "}
          <button type="button" className={styles.inlineLink} onClick={() => go({ id: "register" })}>
            Create account
          </button>
        </p>
      </form>
    );
  }

  if (step.id === "register") {
    const rules = passwordRules(password);
    const ready = emailValid && rules.every((r) => r.ok);
    return (
      <form
        className={styles.stack}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!emailValid) {
            setEmailError("Enter a valid email address.");
            return;
          }
          if (!ready) return;
          push({ id: "code", purpose: "verify", email: email.trim() });
        }}
      >
        {showSso ? <SsoButtons onPick={sso} /> : null}
        <Field
          label="Email address"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(v) => {
            setEmail(v);
            setEmailError(null);
          }}
          valid={emailValid}
          error={emailError}
          helper="Your eSIM will be sent to you by email."
        />
        <PasswordField
          label="Password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          aria-describedby="pwd-rules"
        />
        <p className={styles.legal}>Please note that the password must respect the following security rules:</p>
        <ul id="pwd-rules" className={styles.rules} aria-live="polite">
          {rules.map((r) => (
            <li key={r.label} className={cx(styles.rule, r.ok && styles.ruleOk)}>
              {r.ok ? (
                <Img src="/icons/check-small-green.svg" size={16} />
              ) : (
                <span className={styles.ruleDot} aria-hidden="true" />
              )}
              <span>
                {r.label}
                <span className="sr-only">{r.ok ? " (met)" : " (not met)"}</span>
              </span>
            </li>
          ))}
        </ul>
        <button type="submit" className={cx(ui.btn, ui.btnPrimary, ui.btnBlock)} disabled={!ready}>
          Continue
        </button>
        <Legal />
        <p className={styles.legal}>
          Already have an account?{" "}
          <button type="button" className={styles.inlineLink} onClick={() => go({ id: "password" })}>
            Login
          </button>
        </p>
      </form>
    );
  }

  // start: SSO + email (passwordless code), as in the Figma checkout frame
  return (
    <form
      className={styles.stack}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!emailValid) {
          setEmailError("Enter a valid email address.");
          return;
        }
        push({ id: "code", purpose: "login", email: email.trim() });
      }}
    >
      {showSso ? <SsoButtons onPick={sso} /> : null}
      <Field
        label="Email address"
        type="email"
        autoComplete="email"
        inputMode="email"
        value={email}
        onChange={(v) => {
          setEmail(v);
          setEmailError(null);
        }}
        error={emailError}
      />
      <button type="submit" className={cx(ui.btn, ui.btnPrimary, ui.btnBlock)}>
        Continue
      </button>
      <Legal />
      <p className={styles.legal}>
        <button type="button" className={styles.inlineLink} onClick={() => go({ id: "password" })}>
          Sign in with password
        </button>
        {"  ·  "}
        <button type="button" className={styles.inlineLink} onClick={() => go({ id: "register" })}>
          Create account
        </button>
      </p>
    </form>
  );
}

export function SsoButtons({ onPick }: { onPick: () => void }) {
  return (
    <>
      <button type="button" className={styles.sso} onClick={onPick}>
        <Img src="/icons/google-g.png" size={20} eager />
        Continue with Google
      </button>
      <button type="button" className={styles.sso} onClick={onPick}>
        <Img src="/icons/facebook-f.png" size={20} eager />
        Continue with Facebook
      </button>
      <div className={styles.or} aria-hidden="true">
        <span />
        Or
        <span />
      </div>
    </>
  );
}

/** Profile entry: SSO plus a way into the full-screen email flow. */
export function AuthEntry({ onEmail, emailRef }: { onEmail: () => void; emailRef?: Ref<HTMLButtonElement> }) {
  const { actions } = useApp();
  return (
    <div className={styles.stack}>
      <SsoButtons onPick={() => actions.signIn({ email: SSO_SAMPLE_EMAIL, name: nameFromEmail(SSO_SAMPLE_EMAIL) })} />
      <button ref={emailRef} type="button" className={styles.sso} onClick={onEmail}>
        <Mail size={20} />
        Continue with email
      </button>
      <Legal />
    </div>
  );
}

function CodeStep({
  email,
  purpose,
  onBack,
  onVerified,
}: {
  email: string;
  purpose: "login" | "verify" | "device";
  onBack: () => void;
  onVerified: () => void;
}) {
  const [code, setCode] = useState("");
  const [attempts, setAttempts] = useState(CODE_ATTEMPTS);
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useCountdown(CODE_RESEND_SECONDS);
  const exhausted = attempts <= 0;

  const intro =
    purpose === "verify"
      ? "Verify your email. We sent a 6-digit code to "
      : purpose === "device"
        ? "New device sign-in. We sent a 6-digit code to "
        : "We sent a temporary login code to ";

  return (
    <form
      className={styles.stack}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (exhausted) return;
        // Prototype rule: any 6 digits work except 000000, which simulates a wrong code.
        if (/^\d{6}$/.test(code) && code !== "000000") {
          onVerified();
          return;
        }
        const left = attempts - 1;
        setAttempts(left);
        setCode("");
        setError(left > 0 ? `That code didn’t work. Attempts left: ${left}.` : "Too many attempts. Request a new code.");
      }}
    >
      <p className={styles.legal}>
        {intro}
        <strong>{email}</strong>.{" "}
        <button type="button" className={styles.inlineLink} onClick={onBack}>
          Not you?
        </button>
      </p>
      <Field
        label="Enter login code"
        value={code}
        onChange={(v) => {
          setCode(v.replace(/\D/g, "").slice(0, 6));
          setError(null);
        }}
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={6}
        disabled={exhausted}
        error={error}
        helper={`Attempts left: ${attempts} · Codes expire after ${CODE_EXPIRY_MINUTES} minutes.`}
      />
      <button
        type="submit"
        className={cx(ui.btn, ui.btnPrimary, ui.btnBlock)}
        disabled={exhausted || code.length !== 6}
      >
        Continue
      </button>
      <button
        type="button"
        className={cx(ui.btn, ui.btnLight, ui.btnBlock, styles.resend)}
        disabled={resendIn > 0}
        onClick={() => {
          setResendIn(CODE_RESEND_SECONDS);
          setAttempts(CODE_ATTEMPTS);
          setError(null);
          setCode("");
        }}
      >
        {resendIn > 0 ? `Resend code in ${resendIn} sec` : "Resend code"}
      </button>
      <p className={styles.hintSmall}>Prototype: any 6 digits work; 000000 shows the error state.</p>
      <Legal />
    </form>
  );
}
