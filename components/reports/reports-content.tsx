"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Download, TrendingUp, BarChart3, PieChart, LineChart } from "lucide-react"
import { ResponsiveBar } from "@nivo/bar"
import { ResponsiveLine } from "@nivo/line"
import { ResponsivePie } from "@nivo/pie"
import { mockRentals, mockVehicles } from "@/lib/mock-data"

const processRentalsByMonth = () => {
  const monthlyData: { [key: string]: { bookings: number; revenue: number } } = {}

  mockRentals.forEach((rental) => {
    const date = new Date(rental.start)
    const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { bookings: 0, revenue: 0 }
    }

    monthlyData[monthKey].bookings += 1
    if (rental.status === "Completed") {
      monthlyData[monthKey].revenue += rental.priceEur
    }
  })

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    bookings: data.bookings,
    revenue: data.revenue,
  }))
}

const processRevenueByVehicle = () => {
  const vehicleRevenue: { [key: string]: number } = {}

  mockRentals.forEach((rental) => {
    const vehicle = mockVehicles.find((v) => v.id === rental.vehicleId)
    if (vehicle && rental.status === "Completed") {
      const key = `${vehicle.make} ${vehicle.model}`
      vehicleRevenue[key] = (vehicleRevenue[key] || 0) + rental.priceEur
    }
  })

  return Object.entries(vehicleRevenue)
    .map(([vehicle, revenue]) => ({ vehicle, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
}

const processUtilizationByClass = () => {
  const classData: { [key: string]: { total: number; utilized: number } } = {}

  mockVehicles.forEach((vehicle) => {
    if (!classData[vehicle.class]) {
      classData[vehicle.class] = { total: 0, utilized: 0 }
    }
    classData[vehicle.class].total += 1
    if (vehicle.status === "On Trip") {
      classData[vehicle.class].utilized += 1
    }
  })

  return Object.entries(classData).map(([name, data]) => ({
    name,
    value: Math.round((data.utilized / data.total) * 100),
    color: name === "Economy" ? "#0891b2" : name === "Compact" ? "#06b6d4" : name === "SUV" ? "#67e8f9" : "#a7f3d0",
  }))
}

const processCancellationsByReason = () => {
  const reasons = [
    { reason: "Customer Request", count: 2 },
    { reason: "Vehicle Unavailable", count: 1 },
    { reason: "Payment Failed", count: 1 },
    { reason: "Weather Conditions", count: 0 },
  ]
  return reasons
}

const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [headers.join(","), ...data.map((row) => headers.map((header) => row[header]).join(","))].join(
    "\n",
  )

  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

export function ReportsContent() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [builderMetric, setBuilderMetric] = useState("bookings")
  const [builderDimension, setBuilderDimension] = useState("month")
  const [builderDateRange, setBuilderDateRange] = useState("last-6-months")
  const [builderChartType, setBuilderChartType] = useState("bar")

  const rentalsByMonth = processRentalsByMonth()
  const revenueByVehicle = processRevenueByVehicle()
  const utilizationByClass = processUtilizationByClass()
  const cancellationsByReason = processCancellationsByReason()

  const generateBuilderData = () => {
    if (builderMetric === "bookings" && builderDimension === "month") {
      return rentalsByMonth.map((d) => ({ period: d.month, value: d.bookings }))
    } else if (builderMetric === "revenue" && builderDimension === "month") {
      return rentalsByMonth.map((d) => ({ period: d.month, value: d.revenue }))
    } else if (builderMetric === "utilization" && builderDimension === "class") {
      return utilizationByClass.map((d) => ({ period: d.name, value: d.value }))
    }
    return rentalsByMonth.map((d) => ({ period: d.month, value: d.bookings }))
  }

  const builderData = generateBuilderData()

  const renderChart = (data: any[], type: string, dataKey: string) => {
    const nivoTheme = {
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
    }

    if (type === "bar") {
      return (
        <div style={{ height: 300 }}>
          <ResponsiveBar
            data={data}
            keys={[dataKey]}
            indexBy={Object.keys(data[0])[0]}
            margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={["#06B6D4"]}
            borderColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: Object.keys(data[0])[0],
              legendPosition: "middle",
              legendOffset: 50,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: dataKey,
              legendPosition: "middle",
              legendOffset: -60,
              format: (value) => (dataKey.includes("revenue") ? `€${value}` : value),
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            theme={nivoTheme}
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
                <strong>{id}</strong>: {dataKey.includes("revenue") ? `€${value}` : value}
              </div>
            )}
          />
        </div>
      )
    } else if (type === "line") {
      const lineData = [
        {
          id: dataKey,
          data: data.map((item) => ({
            x: item[Object.keys(item)[0]],
            y: item[dataKey],
          })),
        },
      ]

      return (
        <div style={{ height: 300 }}>
          <ResponsiveLine
            data={lineData}
            margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: "auto", max: "auto", stacked: false, reverse: false }}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: Object.keys(data[0])[0],
              legendOffset: 50,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: dataKey,
              legendOffset: -60,
              legendPosition: "middle",
              format: (value) => (dataKey.includes("revenue") ? `€${value}` : value),
            }}
            colors={["#06B6D4"]}
            pointSize={6}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            useMesh={true}
            theme={nivoTheme}
          />
        </div>
      )
    } else if (type === "donut") {
      const pieData = data.map((item) => ({
        id: item.name || item[Object.keys(item)[0]],
        label: item.name || item[Object.keys(item)[0]],
        value: item[dataKey],
        color: item.color || "#06B6D4",
      }))

      return (
        <div style={{ height: 300 }}>
          <ResponsivePie
            data={pieData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={["#06B6D4", "#0EA5E9", "#10B981", "#6366F1", "#F59E0B"]}
            borderWidth={1}
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.2]],
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="hsl(var(--foreground))"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: "color",
              modifiers: [["darker", 2]],
            }}
            theme={nivoTheme}
          />
        </div>
      )
    }
  }

  const renderTable = (data: any[]) => {
    if (data.length === 0) return null

    const headers = Object.keys(data[0])

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              {headers.map((header) => (
                <th key={header} className="border border-gray-200 px-4 py-2 text-left font-medium">
                  {header.charAt(0).toUpperCase() + header.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {headers.map((header) => (
                  <td key={header} className="border border-gray-200 px-4 py-2">
                    {typeof row[header] === "number" && header.includes("revenue")
                      ? `€${row[header].toLocaleString()}`
                      : row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into your fleet performance</p>
        </div>
      </div>

      <Tabs defaultValue="library" className="space-y-6">
        <TabsList>
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="builder">Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedReport("rentals-by-month")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rentals by Month</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rentalsByMonth.length}</div>
                <p className="text-xs text-muted-foreground">Monthly booking trends</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedReport("revenue-by-vehicle")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue by Vehicle</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{revenueByVehicle.length}</div>
                <p className="text-xs text-muted-foreground">Top performing vehicles</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedReport("utilization-by-class")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilization by Class</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{utilizationByClass.length}</div>
                <p className="text-xs text-muted-foreground">Vehicle class performance</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedReport("cancellations-by-reason")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cancellations by Reason</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cancellationsByReason.reduce((sum, r) => sum + r.count, 0)}</div>
                <p className="text-xs text-muted-foreground">Cancellation analysis</p>
              </CardContent>
            </Card>
          </div>

          {selectedReport && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {selectedReport === "rentals-by-month" && "Rentals by Month"}
                    {selectedReport === "revenue-by-vehicle" && "Revenue by Vehicle"}
                    {selectedReport === "utilization-by-class" && "Utilization by Class"}
                    {selectedReport === "cancellations-by-reason" && "Cancellations by Reason"}
                  </CardTitle>
                  <CardDescription>Detailed view with chart and data table</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    const data =
                      selectedReport === "rentals-by-month"
                        ? rentalsByMonth
                        : selectedReport === "revenue-by-vehicle"
                          ? revenueByVehicle
                          : selectedReport === "utilization-by-class"
                            ? utilizationByClass
                            : cancellationsByReason
                    exportToCSV(data, selectedReport)
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  {selectedReport === "rentals-by-month" && renderChart(rentalsByMonth, "bar", "bookings")}
                  {selectedReport === "revenue-by-vehicle" && renderChart(revenueByVehicle, "bar", "revenue")}
                  {selectedReport === "utilization-by-class" && renderChart(utilizationByClass, "donut", "value")}
                  {selectedReport === "cancellations-by-reason" && renderChart(cancellationsByReason, "bar", "count")}
                </div>
                <div>
                  {selectedReport === "rentals-by-month" && renderTable(rentalsByMonth)}
                  {selectedReport === "revenue-by-vehicle" && renderTable(revenueByVehicle)}
                  {selectedReport === "utilization-by-class" && renderTable(utilizationByClass)}
                  {selectedReport === "cancellations-by-reason" && renderTable(cancellationsByReason)}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>Create custom reports by selecting metrics, dimensions, and date ranges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="metric">Metric</Label>
                  <Select value={builderMetric} onValueChange={setBuilderMetric}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bookings">Bookings</SelectItem>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="utilization">Utilization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dimension">Dimension</Label>
                  <Select value={builderDimension} onValueChange={setBuilderDimension}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="vehicle">Vehicle</SelectItem>
                      <SelectItem value="class">Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select value={builderDateRange} onValueChange={setBuilderDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-30-days">Last 30 days</SelectItem>
                      <SelectItem value="last-3-months">Last 3 months</SelectItem>
                      <SelectItem value="last-6-months">Last 6 months</SelectItem>
                      <SelectItem value="last-year">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chart-type">Chart Type</Label>
                  <Select value={builderChartType} onValueChange={setBuilderChartType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line">Line</SelectItem>
                      <SelectItem value="bar">Bar</SelectItem>
                      <SelectItem value="donut">Donut</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Custom Report Results</CardTitle>
                <CardDescription>
                  {builderMetric.charAt(0).toUpperCase() + builderMetric.slice(1)} by {builderDimension} -{" "}
                  {builderDateRange}
                </CardDescription>
              </div>
              <Button onClick={() => exportToCSV(builderData, "custom-report")}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>{renderChart(builderData, builderChartType, "value")}</div>
              <div>{renderTable(builderData)}</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
