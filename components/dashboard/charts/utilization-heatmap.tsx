"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock utilization data (0-100% for each hour of each day)
const generateUtilizationData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return days.map((day) => ({
    id: day,
    data: hours.map((hour) => ({
      x: hour.toString(),
      y: Math.floor(Math.random() * 100),
    })),
  }))
}

const utilizationData = generateUtilizationData()

export function UtilizationHeatmap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Utilization Heatmap</CardTitle>
        <CardDescription>Hourly utilization by day of week</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: 300 }}>
        </div>
      </CardContent>
    </Card>
  )
}
