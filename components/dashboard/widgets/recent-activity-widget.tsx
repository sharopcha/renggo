"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CreditCard, Car, FileCheck, AlertTriangle, UserCheck, Wrench } from "lucide-react"

const activities = [
  {
    id: 1,
    time: "2 min ago",
    event: "New booking confirmed",
    detail: "BMW X3 (789 GHI) - Maria K.",
    type: "booking",
    icon: Calendar,
    status: "success",
  },
  {
    id: 2,
    time: "15 min ago",
    event: "Payout sent",
    detail: "€1,240 to Baltic Fleet OÜ",
    type: "payment",
    icon: CreditCard,
    status: "success",
  },
  {
    id: 3,
    time: "1 hour ago",
    event: "Vehicle returned",
    detail: "Toyota Corolla (123 ABC)",
    type: "rental",
    icon: Car,
    status: "completed",
  },
  {
    id: 4,
    time: "2 hours ago",
    event: "Document verified",
    detail: "Insurance renewal for VW Golf",
    type: "document",
    icon: FileCheck,
    status: "success",
  },
  {
    id: 5,
    time: "3 hours ago",
    event: "Claim opened",
    detail: "Minor damage report - Ford Focus",
    type: "claim",
    icon: AlertTriangle,
    status: "warning",
  },
  {
    id: 6,
    time: "4 hours ago",
    event: "Customer verified",
    detail: "New customer Janis B. completed verification",
    type: "customer",
    icon: UserCheck,
    status: "success",
  },
  {
    id: 7,
    time: "5 hours ago",
    event: "Maintenance scheduled",
    detail: "Oil change for Nissan Qashqai (654 MNO)",
    type: "maintenance",
    icon: Wrench,
    status: "info",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "success":
      return "bg-success"
    case "warning":
      return "bg-warning"
    case "completed":
      return "bg-primary"
    case "info":
      return "bg-chart-2"
    default:
      return "bg-muted"
  }
}

export function RecentActivityWidget() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest events in your fleet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${getStatusColor(activity.status)}`}
              >
                <activity.icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.event}</p>
                <p className="text-xs text-muted-foreground">{activity.detail}</p>
              </div>
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
