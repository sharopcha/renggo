import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { createClient } from "@/lib/supabase/server";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { revalidatePath } from "next/cache";

export const metadata: Metadata = {
  metadataBase: new URL("https://renggo.com"), // <-- your prod URL
  title: {
    default: "RengGo — Peer-to-Peer Car Rentals in Tallinn",
    template: "%s | RengGo",
  },
  description:
    "Rent cars from locals in Tallinn. Book by the hour or day, insurance included, instant pickup. RengGo makes car sharing simple.",
  keywords: [
    "car rental",
    "peer to peer",
    "car sharing",
    "Tallinn",
    "EVIA",
    "rent a car",
    "electric cars",
  ],
  openGraph: {
    type: "website",
    url: "/",
    siteName: "EVIA",
    title: "EVIA — Peer-to-Peer Car Rentals in Tallinn",
    description: "Book local cars with insurance included and instant pickup.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "RengGo — Peer-to-Peer Car Rentals in Tallinn",
    description: "Book local cars with insurance included and instant pickup.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation user={user} />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
