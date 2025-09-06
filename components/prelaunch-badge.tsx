import { getMessage } from "@/lib/messages"

export function PrelaunchBadge() {
  const isPrelaunch = process.env.PUBLIC_PRELAUNCH === "true"

  if (!isPrelaunch) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg">
        {getMessage("prelaunchBadge")}
      </div>
    </div>
  )
}
