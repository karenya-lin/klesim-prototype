# KLeSIM — travel eSIM app prototype

An interactive web prototype of a travel eSIM mobile app: browse destinations, compare plans, check out and
install the eSIM. It is a concept recreation of a mobile design by **Karenya Lin**, rebuilt in React so the flow can
be tried in a browser, linked from a portfolio article and screen-recorded.

> **Concept only.** "KLeSIM" is a placeholder brand. Every name, price, plan, coupon, order reference, ICCID and
> address is sample data. No payment, account or eSIM is real, and nothing you type leaves your browser.

## What you can try

| Area | Screens |
| --- | --- |
| Discover | Home (promo, popular places, popular offer, why choose us, user guide links, FAQ), destination search |
| Plans | Plan list (daily / total, bestsellers), choose destination sheet, plan details sheet, choose days, T&C sheet, add-to-cart toast |
| Cart & checkout | Cart, coupon sheet, payment method sheet (PayPal, Google Pay, card via a hosted-field placeholder), totals breakdown, checkout with contact, login code, billing address and validation errors, purchase success |
| After purchase | My eSIM list, eSIM detail with download / manual activation, resend email |
| Account | Profile with sign in, sign up (live password rules), one-time code and forgot password |

On a desktop browser the app sits in a phone frame (390 × 844). On a phone it fills the screen.

### Prototype rules

- Any coupon code is accepted.
- The login code accepts any 6 digits; `000000` shows the wrong-code state.
- Password sign-in succeeds with any valid email and a password of 8+ characters; anything else shows the
  generic error, and repeated failures show a short wait.
- Card details are never collected: the card form is a visual placeholder for a provider-hosted field.
- The € button in the header switches the currency (EUR, USD, GBP, JPY, TWD, AUD). Prices are stored in EUR
  and converted with fixed sample rates (`src/proto/data.ts`), not live exchange rates.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, static page) · React 19 · TypeScript
- CSS Modules with design tokens taken from the Figma file; Ubuntu via `next/font`
- No UI kit, no backend, no API calls, no environment variables

## Run locally

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Other scripts:

```bash
pnpm build && pnpm start   # production build
pnpm lint                  # ESLint
pnpm typecheck             # tsc --noEmit
```

## Project layout

```
src/app/                 page shell, fonts, global tokens
src/components/stage/    desktop phone frame + caption
src/proto/               the app: store (navigation, cart, auth state), screens, sheets, UI parts
public/img, public/icons optimised WebP photos and SVG icons exported from the design
```

## Credits

Design: Karenya Lin. Photos in the design come from Unsplash. Brand, logo and data in this repository are
placeholders.
