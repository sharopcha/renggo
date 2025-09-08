"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveLine } from "@nivo/line"

const bookingsData = [
  { week: "Week 1", bookings: 45, revenue: 2100 },
  { week: "Week 2", bookings: 52, revenue: 2450 },
  { week: "Week 3", bookings: 38, revenue: 1890 },
  { week: "Week 4", bookings: 61, revenue: 2980 },
  { week: "Week 5", bookings: 55, revenue: 2650 },
  { week: "Week 6", bookings: 67, revenue: 3200 },
  { week: "Week 7", bookings: 48, revenue: 2300 },
  { week: "Week 8", bookings: 72, revenue: 3450 },
  { week: "Week 9", bookings: 58, revenue: 2780 },
  { week: "Week 10", bookings: 63, revenue: 3020 },
  { week: "Week 11", bookings: 69, revenue: 3300 },
  { week: "Week 12", bookings: 74, revenue: 3560 },
]

const nivoData = [
  {
    id: "bookings",
    data: bookingsData.map((item) => ({
      x: item.week,
      y: item.bookings,
    })),
  },
]

export function BookingsChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Bookings Over Time</CardTitle>
        <CardDescription>Rental bookings for the last 12 weeks</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: 300 }}>
          {/* <ResponsiveLine
            data={nivoData}
            margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: "auto", max: "auto", stacked: false, reverse: false }}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: "Week",
              legendOffset: 50,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Bookings",
              legendOffset: -45,
              legendPosition: "middle",
            }}
            colors={["#06B6D4"]}
            pointSize={6}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            enableArea={true}
            areaOpacity={0.1}
            useMesh={true}
            theme={{
              background: "transparent",
              text: {
                fill: "hsl(var(--foreground))",
                fontSize: 12,
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
                    fontSize: 11,
                  },
                },
              },
              grid: {
                line: {
                  stroke: "hsl(var(--border))",
                  strokeWidth: 1,
                  strokeDasharray: "3 3",
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
          /> */}
        </div>
      </CardContent>
    </Card>
  )
}
