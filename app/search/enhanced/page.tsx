"use client"

import { useState } from "react"
import { EnhancedSearch } from "@/components/search/enhanced-search"
import { CarGrid } from "@/components/search/car-grid"

export default function EnhancedSearchPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleResults = (newResults: any[]) => {
    setResults(newResults)
    setHasSearched(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Car Search</h1>
          <p className="text-gray-600">
            Describe what you're looking for in natural language and let our AI find the perfect cars for you
          </p>
        </div>

        <div className="mb-8">
          <EnhancedSearch onResults={handleResults} loading={loading} setLoading={setLoading} />
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-500">Searching for the perfect cars...</div>
          </div>
        )}

        {hasSearched && !loading && (
          <div>
            <div className="mb-4">
              <p className="text-gray-600">
                {results.length > 0
                  ? `Found ${results.length} cars matching your search`
                  : "No cars found matching your criteria. Try adjusting your search or filters."}
              </p>
            </div>
            <CarGrid cars={results} />
          </div>
        )}

        {!hasSearched && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your AI Search</h3>
            <p className="text-gray-600">
              Use natural language to describe the car you're looking for and let our AI do the rest
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
