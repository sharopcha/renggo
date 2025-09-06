import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ValueProps } from "@/components/value-props"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"
import { PrelaunchBadge } from "@/components/prelaunch-badge"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main id="main-content">
        <Hero />
        <ValueProps />
        <FAQ />
      </main>
      <Footer />
      <PrelaunchBadge />
    </div>
  )
}
