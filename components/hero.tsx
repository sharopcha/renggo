import Link from "next/link"
import { WaitlistForm } from "@/components/waitlist-form"
import { getMessage } from "@/lib/messages"

export function Hero() {
  return (
    <section className="w-full py-20 md:py-32" aria-labelledby="hero-heading">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 just">
            <img src='/logo.png' className="h-[60px]"></img>
            <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold text-balance">
              {getMessage("headline")}
            </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground text-balance">{getMessage("subheadline")}</p>
          </div>

          <div className="max-w-md mx-auto" aria-label="Join waitlist">
            <WaitlistForm />
          </div>

          <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground" aria-label="Legal pages">
            <Link href="/privacy" className="hover:text-foreground transition-colors underline underline-offset-4">
              {getMessage("privacyLink")}
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors underline underline-offset-4">
              {getMessage("termsLink")}
            </Link>
          </nav>
        </div>
      </div>
    </section>
  )
}
