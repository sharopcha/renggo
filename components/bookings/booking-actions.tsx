"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Check, X } from "lucide-react"
import { useState } from "react"
import { updateBookingStatus } from "@/lib/booking-actions"
import { useRouter } from "next/navigation"

interface BookingActionsProps {
  booking: any
  isHost: boolean
}

export function BookingActions({ booking, isHost }: BookingActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [hostNotes, setHostNotes] = useState("")
  const [showDialog, setShowDialog] = useState(false)
  const [actionType, setActionType] = useState<"accept" | "decline" | null>(null)

  const handleStatusUpdate = async (status: string, notes?: string) => {
    setLoading(true)

    try {
      const result = await updateBookingStatus(booking.id, status, notes)

      if (result.success) {
        router.refresh()
        setShowDialog(false)
        setHostNotes("")
        setActionType(null)
      } else {
        alert(result.error || "Failed to update booking")
      }
    } catch (error) {
      console.error("Status update error:", error)
      alert("An error occurred while updating the booking")
    } finally {
      setLoading(false)
    }
  }

  const openDialog = (type: "accept" | "decline") => {
    setActionType(type)
    setShowDialog(true)
  }

  // Show different actions based on booking status and user role
  if (booking.status === "pending" && isHost) {
    return (
      <div className="flex gap-2">
        <Button onClick={() => openDialog("accept")} size="sm" className="bg-green-600 hover:bg-green-700">
          <Check className="h-4 w-4 mr-1" />
          Accept
        </Button>
        <Button onClick={() => openDialog("decline")} variant="outline" size="sm" className="bg-transparent">
          <X className="h-4 w-4 mr-1" />
          Decline
        </Button>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === "accept" ? "Accept Booking Request" : "Decline Booking Request"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "accept"
                  ? "Confirm that you want to accept this booking request."
                  : "Please provide a reason for declining this booking request."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {actionType === "accept" ? "Welcome message (optional)" : "Reason for declining"}
                </label>
                <Textarea
                  value={hostNotes}
                  onChange={(e) => setHostNotes(e.target.value)}
                  placeholder={
                    actionType === "accept"
                      ? "Welcome! Looking forward to hosting you..."
                      : "Please explain why you're declining this request..."
                  }
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDialog(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(actionType === "accept" ? "confirmed" : "cancelled", hostNotes)}
                  disabled={loading}
                  className={
                    actionType === "accept" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                  }
                >
                  {loading ? "Updating..." : actionType === "accept" ? "Accept Booking" : "Decline Booking"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  if (booking.status === "confirmed") {
    return (
      <Button
        onClick={() => handleStatusUpdate("active")}
        disabled={loading}
        size="sm"
        className="bg-blue-600 hover:bg-blue-700"
      >
        {loading ? "Updating..." : "Start Trip"}
      </Button>
    )
  }

  if (booking.status === "active") {
    return (
      <Button
        onClick={() => handleStatusUpdate("completed")}
        disabled={loading}
        size="sm"
        className="bg-gray-600 hover:bg-gray-700"
      >
        {loading ? "Updating..." : "Complete Trip"}
      </Button>
    )
  }

  return null
}
