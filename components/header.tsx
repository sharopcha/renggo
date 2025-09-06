import Link from "next/link"
import { getMessage } from "@/lib/messages"

export function Header() {
  return (
    <header className="w-full border-b border-border/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 h-[30px]">
            <img src='/logo.png' className="h-full"></img>
          </Link>
        </div>
      </div>
    </header>
  )
}
