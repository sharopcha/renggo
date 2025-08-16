"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Sparkles, Filter } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { semanticSearch } from "@/lib/ai-recommendations"

interface EnhancedSearchProps {
  onResults: (results: any[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export function EnhancedSearch({ onResults, loading, setLoading }: EnhancedSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    make: "",
    transmission: "",
    fuelType: "",
  })

  const handleSemanticSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const result = await semanticSearch(query, filters, 20)
      if (result.success) {
        onResults(result.results || [])
      } else {
        console.error("Search failed:", result.error)
        onResults([])
      }
    } catch (error) {
      console.error("Search error:", error)
      onResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSemanticSearch()
    }
  }

  const clearFilters = () => {
    setFilters({
      location: "",
      minPrice: "",
      maxPrice: "",
      make: "",
      transmission: "",
      fuelType: "",
    })
  }

  const suggestedQueries = [
    "luxury cars with GPS",
    "fuel efficient hybrid",
    "spacious SUV for family",
    "convertible for weekend",
    "electric car downtown",
    "automatic transmission",
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
          AI-Powered Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Describe what you're looking for... (e.g., 'luxury car with GPS near downtown')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button
            onClick={handleSemanticSearch}
            disabled={loading || !query.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Searching..." : "Search"}
          </Button>
          <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className="bg-transparent">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Suggested Queries */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Try searching for:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((suggestion) => (
              <Badge
                key={suggestion}
                variant="secondary"
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => setQuery(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="border-t pt-4 space-y-4">
            <h4 className="font-medium text-gray-900">Advanced Filters</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <Input
                  placeholder="City or address"
                  value={filters.location}
                  onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                <Input
                  placeholder="Toyota, BMW, etc."
                  value={filters.make}
                  onChange={(e) => setFilters((prev) => ({ ...prev, make: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price ($)</label>
                <Input
                  type="number"
                  placeholder="25"
                  value={filters.minPrice}
                  onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price ($)</label>
                <Input
                  type="number"
                  placeholder="150"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={clearFilters} className="bg-transparent">
                Clear Filters
              </Button>
              <Button onClick={handleSemanticSearch} className="bg-blue-600 hover:bg-blue-700">
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
