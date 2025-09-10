'use client';
import { Hero } from "@/components/hero";
import { ValueProps } from "@/components/value-props";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="w-full border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 h-[30px]">
              <img src="/logo.png" alt="logo" className="h-full" />
            </Link>
          </div>
        </div>
      </header>
      <main id="main-content">
        <Hero />
        <ValueProps />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
