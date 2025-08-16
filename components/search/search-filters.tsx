"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

interface SearchFiltersProps {
  makes: string[]
  searchParams: any
}

export function SearchFilters({ makes, searchParams }: SearchFiltersProps) {
  const router = useRouter()
  const currentSearchParams = useSearchParams()

  const [filters, setFilters] = useState({
    minPrice: searchParams.minPrice || "",
    maxPrice: searchParams.maxPrice || "",
    make: searchParams.make || "any",
    transmission: searchParams.transmission || "any",
    fuelType: searchParams.fuelType || "any",
  })

  const applyFilters = () => {
    const params = new URLSearchParams(currentSearchParams.toString())

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "any") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams(currentSearchParams.toString())

    // Keep location and dates, clear other filters
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("make")
    params.delete("transmission")
    params.delete("fuelType")

    setFilters({
      minPrice: "",
      maxPrice: "",
      make: "any",
      transmission: "any",
      fuelType: "any",
    })

    router.push(`/search?${params.toString()}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Price Range (per day)</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Min"
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
            />
            <Input
              placeholder="Max"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
            />
          </div>
        </div>

        {/* Make */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Make</h3>
          <Select value={filters.make} onValueChange={(value) => setFilters((prev) => ({ ...prev, make: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Any make" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any make</SelectItem>
              {makes.map((make) => (
                <SelectItem key={make} value={make}>
                  {make}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transmission */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Transmission</h3>
          <Select
            value={filters.transmission}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, transmission: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any transmission</SelectItem>
              <SelectItem value="automatic">Automatic</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fuel Type */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Fuel Type</h3>
          <Select
            value={filters.fuelType}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, fuelType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any fuel type</SelectItem>
              <SelectItem value="gasoline">Gasoline</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
