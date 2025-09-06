"use client"

import { useEffect, useState } from "react"

interface AnnouncementProps {
  message: string
  priority?: "polite" | "assertive"
}

export function AccessibilityAnnouncer({ message, priority = "polite" }: AnnouncementProps) {
  const [announcement, setAnnouncement] = useState("")

  useEffect(() => {
    if (message) {
      setAnnouncement(message)
      // Clear after announcement to allow re-announcements
      const timer = setTimeout(() => setAnnouncement(""), 1000)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <div role="status" aria-live={priority} aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  )
}
