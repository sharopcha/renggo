"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { calculateKPIs } from "@/lib/mock-data"
import { Car, TrendingUp, Euro, Calendar, Percent, AlertTriangle, Filter, Download } from "lucide-react"
import { BookingsChart } from "./charts/bookings-chart"
import { RevenueBreakdownChart } from "./charts/revenue-breakdown-chart"
import { UtilizationHeatmap } from "./charts/utilization-heatmap"
import { TopVehiclesWidget } from "./widgets/top-vehicles-widget"
import { RecentActivityWidget } from "./widgets/recent-activity-widget"
import { UpcomingMaintenanceWidget } from "./widgets/upcoming-maintenance-widget"
import { useTranslations } from "next-intl"

export function DashboardContent() {
  const kpis = calculateKPIs();
  const t = useTranslations();

  const kpiCards = [
    {
      title: "Active Rentals",
      value: kpis.activeRentals.toString(),
      icon: Calendar,
      description: "Currently ongoing",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Utilization Rate",
      value: `${kpis.utilizationRate}%`,
      icon: Percent,
      description: "Fleet efficiency",
      trend: "+5%",
      trendUp: true,
    },
    {
      title: "Gross Bookings",
      value: `€${kpis.grossBookings.toLocaleString()}`,
      icon: Euro,
      description: "This month",
      trend: "+18%",
      trendUp: true,
    },
    {
      title: "Net Earnings",
      value: `€${kpis.netEarnings.toLocaleString()}`,
      icon: TrendingUp,
      description: "After fees",
      trend: "+15%",
      trendUp: true,
    },
    {
      title: "Avg Daily Rate",
      value: `€${kpis.avgDailyRate}`,
      icon: Car,
      description: "Per vehicle",
      trend: "+3%",
      trendUp: true,
    },
    {
      title: "Cancellation Rate",
      value: `${kpis.cancellationRate}%`,
      icon: AlertTriangle,
      description: "Last 30 days",
      trend: "-0.5%",
      trendUp: false,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('pageTitles.dashboard')}</h1>
          <p className="text-muted-foreground">Welcome back! Here`&apos;s what`&apos;s happening with your fleet.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Badge variant="outline" className="text-success border-success">
            <div className="h-2 w-2 rounded-full bg-success mr-2" />
            All systems operational
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.description}</p>
              <div className="flex items-center pt-1">
                <Badge
                  variant={kpi.trendUp ? "default" : "secondary"}
                  className={`text-xs ${kpi.trendUp ? "bg-success text-success-foreground" : ""}`}
                >
                  {kpi.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Widgets Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Bookings Over Time Chart */}
        <BookingsChart />

        {/* Top Vehicles Widget */}
        <TopVehiclesWidget />

        {/* Revenue Breakdown Chart */}
        <RevenueBreakdownChart />

        {/* Utilization Heatmap */}
        <UtilizationHeatmap />

        {/* Recent Activity Widget */}
        <RecentActivityWidget />

        {/* Upcoming Maintenance Widget */}
        <UpcomingMaintenanceWidget />
      </div>
    </div>
  )
}
