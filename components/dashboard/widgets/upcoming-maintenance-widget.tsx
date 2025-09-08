"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wrench, Calendar, AlertTriangle } from "lucide-react"

const maintenanceTasks = [
  {
    id: 1,
    vehicle: "123 ABC",
    model: "Toyota Corolla",
    task: "Oil change",
    due: "500 km",
    dueType: "mileage",
    severity: "Medium",
    priority: 2,
  },
  {
    id: 2,
    vehicle: "456 DEF",
    model: "VW Golf",
    task: "Tire rotation",
    due: "3 days",
    dueType: "time",
    severity: "Low",
    priority: 1,
  },
  {
    id: 3,
    vehicle: "789 GHI",
    model: "BMW X3",
    task: "Annual inspection",
    due: "1 week",
    dueType: "time",
    severity: "High",
    priority: 3,
  },
  {
    id: 4,
    vehicle: "321 JKL",
    model: "Ford Focus",
    task: "Brake service",
    due: "2 weeks",
    dueType: "time",
    severity: "Medium",
    priority: 2,
  },
]

const getSeverityVariant = (severity: string) => {
  switch (severity) {
    case "High":
      return "destructive"
    case "Medium":
      return "default"
    case "Low":
      return "secondary"
    default:
      return "secondary"
  }
}

const getPriorityIcon = (priority: number) => {
  if (priority >= 3) return AlertTriangle
  return Wrench
}

export function UpcomingMaintenanceWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Upcoming Maintenance</span>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
        </CardTitle>
        <CardDescription>Tasks due soon</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {maintenanceTasks.map((maintenance) => {
            const IconComponent = getPriorityIcon(maintenance.priority)
            return (
              <div key={maintenance.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{maintenance.vehicle}</p>
                    <p className="text-xs text-muted-foreground">{maintenance.model}</p>
                    <p className="text-xs text-muted-foreground">{maintenance.task}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant={getSeverityVariant(maintenance.severity)} className="text-xs">
                    {maintenance.due}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{maintenance.severity}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
