import Link from "next/link"
import { getMessage } from "@/lib/messages"

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">{getMessage("copyright")}</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {getMessage("privacyLink")}
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {getMessage("termsLink")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
