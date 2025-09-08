"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

const topVehicles = [
  {
    id: "veh_001",
    plate: "123 ABC",
    model: "Toyota Corolla",
    revenue: 1240,
    utilization: 85,
    image: "/toyota-corolla-silver.jpg",
    class: "Compact",
  },
  {
    id: "veh_002",
    plate: "456 DEF",
    model: "VW Golf",
    revenue: 1180,
    utilization: 78,
    image: "/volkswagen-golf-blue.jpg",
    class: "Compact",
  },
  {
    id: "veh_003",
    plate: "789 GHI",
    model: "BMW X3",
    revenue: 980,
    utilization: 92,
    image: "/bmw-x3-black-suv.jpg",
    class: "SUV",
  },
  {
    id: "veh_004",
    plate: "321 JKL",
    model: "Ford Focus",
    revenue: 850,
    utilization: 65,
    image: "/ford-focus-car.jpg",
    class: "Compact",
  },
  {
    id: "veh_005",
    plate: "654 MNO",
    model: "Nissan Qashqai",
    revenue: 720,
    utilization: 58,
    image: "/nissan-qashqai-suv.jpg",
    class: "SUV",
  },
]

export function TopVehiclesWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Vehicles</CardTitle>
        <CardDescription>By revenue this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topVehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex items-center space-x-3">
              <div className="relative h-10 w-16 rounded-md overflow-hidden bg-muted">
                <Image src={vehicle.image || "/placeholder.svg"} alt={vehicle.model} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{vehicle.plate}</p>
                    <p className="text-xs text-muted-foreground">{vehicle.model}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">€{vehicle.revenue}</p>
                    <Badge variant="secondary" className="text-xs">
                      {vehicle.class}
                    </Badge>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Utilization</span>
                    <span>{vehicle.utilization}%</span>
                  </div>
                  <Progress value={vehicle.utilization} className="h-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
