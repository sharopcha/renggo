"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveHeatMap } from "@nivo/heatmap"

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
          {/* <ResponsiveHeatMap
            data={utilizationData}
            margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
            valueFormat=">-.0f"
            axisTop={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Hour",
              legendOffset: -40,
            }}
            axisRight={null}
            axisBottom={null}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Day",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            colors={{
              type: "quantize",
              scheme: "blues",
              minValue: 0,
              maxValue: 100,
              steps: 5,
            }}
            emptyColor="#555555"
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.6]],
            }}
            labelTextColor={{
              from: "color",
              modifiers: [["darker", 1.8]],
            }}
            theme={{
              background: "transparent",
              text: {
                fill: "hsl(var(--foreground))",
                fontSize: 11,
              },
              axis: {
                domain: {
                  line: {
                    stroke: "hsl(var(--border))",
                    strokeWidth: 1,
                  },
                },
                legend: {
                  text: {
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 12,
                  },
                },
                ticks: {
                  line: {
                    stroke: "hsl(var(--border))",
                    strokeWidth: 1,
                  },
                  text: {
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 10,
                  },
                },
              },
              tooltip: {
                container: {
                  background: "hsl(var(--card))",
                  color: "hsl(var(--card-foreground))",
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                },
              },
            }}
            tooltip={({ xKey, yKey, value }) => (
              <div
                style={{
                  background: "hsl(var(--card))",
                  color: "hsl(var(--card-foreground))",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  fontSize: "12px",
                }}
              >
                <strong>
                  {yKey} {xKey}:00
                </strong>
                <br />
                {value}% utilized
              </div>
            )}
          /> */}
        </div>
      </CardContent>
    </Card>
  )
}
