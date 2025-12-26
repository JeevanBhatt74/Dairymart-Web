import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// 1. Configure the Poppins font
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DairyMart - Fresh Dairy Products",
  description: "Order fresh milk and dairy products online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 2. Apply the font variable and your theme colors to the body */}
      <body
        className={`${poppins.variable} font-sans antialiased bg-[var(--dm-bg-light)] text-[var(--dm-text-main)]`}
      >
        {children}
      </body>
    </html>
  );
}