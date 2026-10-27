import type { Metadata, Viewport } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ubuntu",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KLeSIM · Travel eSIM app prototype",
  description:
    "Interactive prototype of a travel eSIM app: browse destinations, pick a plan, check out and install. Concept recreation of a design by Karenya Lin; brand and data are placeholders.",
  icons: { icon: "/icons/klesim-mark.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#17191e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={ubuntu.variable}>
      <body>{children}</body>
    </html>
  );
}
