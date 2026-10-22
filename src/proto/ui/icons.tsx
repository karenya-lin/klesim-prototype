/* Small glyphs that were SF Symbols or state-coloured icons in the Figma file. */

type P = { className?: string; size?: number };

export function ChevronLeft({ className }: P) {
  return (
    <svg className={className} width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
      <path d="M9.5 2.5 2.5 10l7 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function XMark({ className, size = 12 }: P) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

type NavP = P & { active?: boolean };

export function NavHome({ className, active }: NavP) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={
          active
            ? "M10 19V14H14V19C14 19.55 14.45 20 15 20H18C18.55 20 19 19.55 19 19V12H20.7C21.16 12 21.38 11.43 21.03 11.13L12.67 3.6C12.29 3.26 11.71 3.26 11.33 3.6L2.97 11.13C2.63 11.43 2.84 12 3.3 12H5V19C5 19.55 5.45 20 6 20H9C9.55 20 10 19.55 10 19Z"
            : "M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69ZM12 3L2 12H5V20H11V14H13V20H19V12H22L12 3Z"
        }
        fill="currentColor"
      />
    </svg>
  );
}

export function NavSim({ className, active }: NavP) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={
          active
            ? "M19.99 4C19.99 2.9 19.1 2 18 2H10.83C10.3 2 9.79 2.21 9.41 2.59L4.59 7.41C4.21 7.79 4 8.3 4 8.83V20C4 21.1 4.9 22 6 22H18.01C19.11 22 20 21.1 20 20L19.99 4ZM8 19C7.45 19 7 18.55 7 18C7 17.45 7.45 17 8 17C8.55 17 9 17.45 9 18C9 18.55 8.55 19 8 19ZM16 19C15.45 19 15 18.55 15 18C15 17.45 15.45 17 16 17C16.55 17 17 17.45 17 18C17 18.55 16.55 19 16 19ZM8 15C7.45 15 7 14.55 7 14V12C7 11.45 7.45 11 8 11C8.55 11 9 11.45 9 12V14C9 14.55 8.55 15 8 15ZM12 19C11.45 19 11 18.55 11 18V16C11 15.45 11.45 15 12 15C12.55 15 13 15.45 13 16V18C13 18.55 12.55 19 12 19ZM12 13C11.45 13 11 12.55 11 12C11 11.45 11.45 11 12 11C12.55 11 13 11.45 13 12C13 12.55 12.55 13 12 13ZM16 15C15.45 15 15 14.55 15 14V12C15 11.45 15.45 11 16 11C16.55 11 17 11.45 17 12V14C17 14.55 16.55 15 16 15Z"
            : "M18 2H10L4 8V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM18 4V20H6V8.83L10.83 4H18ZM7 17H9V19H7V17ZM15 17H17V19H15V17ZM7 11H9V15H7V11ZM11 15H13V19H11V15ZM11 11H13V13H11V11ZM15 11H17V15H15V11Z"
        }
        fill="currentColor"
      />
    </svg>
  );
}

export function NavAccount({ className }: NavP) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM7.35 18.5C8.66 17.56 10.26 17 12 17C13.74 17 15.34 17.56 16.65 18.5C15.34 19.44 13.74 20 12 20C10.26 20 8.66 19.44 7.35 18.5ZM18.14 17.12C16.3882 15.7462 14.2262 14.9996 12 14.9996C9.77376 14.9996 7.61182 15.7462 5.86 17.12C4.65715 15.6852 3.99856 13.8723 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 13.95 19.3 15.73 18.14 17.12Z"
        fill="currentColor"
      />
      <path
        d="M12 6C10.07 6 8.5 7.57 8.5 9.5C8.5 11.43 10.07 13 12 13C13.93 13 15.5 11.43 15.5 9.5C15.5 7.57 13.93 6 12 6ZM12 11C11.17 11 10.5 10.33 10.5 9.5C10.5 8.67 11.17 8 12 8C12.83 8 13.5 8.67 13.5 9.5C13.5 10.33 12.83 11 12 11Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Basket with a plus (solar cart-add style), used on the dark add-to-cart button and the toast. */
export function CartAdd({ className, size = 24 }: P) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.86 16.43c-.84-3.37-1.26-5.05-.38-6.18.89-1.13 2.62-1.13 6.1-1.13h4.84c3.48 0 5.21 0 6.1 1.13.88 1.13.46 2.81-.38 6.18-.54 2.14-.8 3.21-1.6 3.84-.8.62-1.9.62-4.11.62H9.57c-2.2 0-3.31 0-4.11-.62-.8-.63-1.06-1.7-1.6-3.84Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m19.5 9.5-.71-2.61c-.27-1-.4-1.5-.68-1.88a2.5 2.5 0 0 0-1.1-.84C16.58 4 16.07 4 15.05 4M4.5 9.5l.71-2.61c.27-1 .4-1.5.68-1.88a2.5 2.5 0 0 1 1.1-.84C7.42 4 7.93 4 8.95 4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M12 12.5v5M9.5 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Person with a chat bubble, used on the "Chat with us" button. */
export function ChatSupport({ className, size = 24 }: P) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8" cy="9" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.75 19.5c.6-2.9 2.6-4.5 5.25-4.5s4.65 1.6 5.25 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M14.5 4.25h5.25a1.5 1.5 0 0 1 1.5 1.5v3.5a1.5 1.5 0 0 1-1.5 1.5H17.5l-2.25 1.75v-1.75h-.75a1.5 1.5 0 0 1-1.5-1.5v-3.5a1.5 1.5 0 0 1 1.5-1.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M15.75 7.5h.01M17.13 7.5h.01M18.5 7.5h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function QuestionCircle({ className, size = 24 }: P) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#0C0624" strokeWidth="1.8" />
      <path
        d="M9.6 9.5a2.5 2.5 0 0 1 4.86.83c0 1.67-2.46 2.17-2.46 3.42"
        stroke="#0C0624"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.9" r="1.1" fill="#0C0624" />
    </svg>
  );
}

export function ChevronSmall({ className, up }: P & { up?: boolean }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      style={{ transform: up ? "rotate(180deg)" : undefined, transition: "transform 200ms ease" }}
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
