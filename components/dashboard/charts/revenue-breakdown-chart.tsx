"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveBar } from "@nivo/bar"

const revenueData = [
  { month: "Jan", baseFare: 8500, fees: 1200, extras: 800, discounts: -400 },
  { month: "Feb", baseFare: 9200, fees: 1350, extras: 950, discounts: -500 },
  { month: "Mar", baseFare: 10100, fees: 1480, extras: 1100, discounts: -600 },
  { month: "Apr", baseFare: 9800, fees: 1420, extras: 1050, discounts: -550 },
  { month: "May", baseFare: 11200, fees: 1650, extras: 1250, discounts: -700 },
  { month: "Jun", baseFare: 10800, fees: 1580, extras: 1180, discounts: -650 },
]

export function RevenueBreakdownChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Revenue Breakdown</CardTitle>
        <CardDescription>Monthly revenue components</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: 300 }}>
          <ResponsiveBar
            data={revenueData}
            keys={["baseFare", "fees", "extras", "discounts"]}
            indexBy="month"
            margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={["#06B6D4", "#0EA5E9", "#10B981", "#EF4444"]}
            borderColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Month",
              legendPosition: "middle",
              legendOffset: 40,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Revenue (EUR)",
              legendPosition: "middle",
              legendOffset: -60,
              format: (value) => `€${value}`,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom",
                direction: "row",
                justify: false,
                translateX: 0,
                translateY: 50,
                itemsSpacing: 2,
                itemWidth: 80,
                itemHeight: 20,
                itemDirection: "left-to-right",
                itemOpacity: 0.85,
                symbolSize: 12,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
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
              legends: {
                text: {
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 11,
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
            tooltip={({ id, value, color }) => (
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
                <strong>{id}</strong>: €{value}
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
