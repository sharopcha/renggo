import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Suspense } from "react";
import "./globals.css";
import Loader from "@/components/layout/loader";
import { NextIntlClientProvider } from "next-intl";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  title: "Renggo - Coming Soon | Back Office, Simplified",
  description:
    "Join the waitlist for Renggo - the comprehensive back office solution that simplifies fleet management, analytics, and operations. Get early access to clear fleet analytics, simple payouts & pricing, and smooth maintenance & claims.",
  generator: "v0.app",
  applicationName: "Renggo",
  referrer: "origin-when-cross-origin",
  keywords: [
    "fleet management",
    "back office",
    "analytics",
    "payouts",
    "maintenance",
    "claims",
    "business software",
  ],
  authors: [{ name: "Renggo Team" }],
  creator: "Renggo",
  publisher: "Renggo",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://renggo.com"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Renggo - Coming Soon | Back Office, Simplified",
    description:
      "Join the waitlist for Renggo - the comprehensive back office solution that simplifies fleet management, analytics, and operations.",
    siteName: "Renggo",
    images: [
      {
        url: "/renggo-g-letter.png",
        width: 1992,
        height: 2641,
        alt: "Renggo - Back Office, Simplified",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Renggo - Coming Soon | Back Office, Simplified",
    description:
      "Join the waitlist for Renggo - the comprehensive back office solution that simplifies fleet management, analytics, and operations.",
    images: ["/renggo-g-letter.png"],
    creator: "@renggo",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <head>
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>
      </head>
      <body>
        <Suspense fallback={<Loader />}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider>
              <NuqsAdapter>
                {children}
                <Toaster richColors closeButton position="top-center" />
              </NuqsAdapter>
            </NextIntlClientProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
