"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { updateUserPreferences } from "@/lib/ai-recommendations"
import { useRouter } from "next/navigation"

const CAR_TYPES = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Nissan",
  "Hyundai",
  "Kia",
  "Mazda",
  "Subaru",
  "Lexus",
  "Acura",
  "Infiniti",
]

const FEATURES = [
  "bluetooth",
  "gps",
  "backup_camera",
  "heated_seats",
  "air_conditioning",
  "sunroof",
  "leather_seats",
  "usb_charging",
  "aux_input",
  "cd_player",
  "cruise_control",
  "keyless_entry",
  "automatic_transmission",
]

interface PreferencesSetupProps {
  userId: string
  currentPreferences: any
  onSave: () => void
}

export function PreferencesSetup({ userId, currentPreferences, onSave }: PreferencesSetupProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState({
    preferred_car_types: currentPreferences?.preferred_car_types || [],
    preferred_features: currentPreferences?.preferred_features || [],
    budget_range_min: currentPreferences?.budget_range_min || "",
    budget_range_max: currentPreferences?.budget_range_max || "",
    preferred_locations: currentPreferences?.preferred_locations || [],
  })

  const handleCarTypeChange = (carType: string, checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      preferred_car_types: checked
        ? [...prev.preferred_car_types, carType]
        : prev.preferred_car_types.filter((t) => t !== carType),
    }))
  }

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      preferred_features: checked
        ? [...prev.preferred_features, feature]
        : prev.preferred_features.filter((f) => f !== feature),
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const result = await updateUserPreferences(userId, {
        preferred_car_types: preferences.preferred_car_types,
        preferred_features: preferences.preferred_features,
        budget_range_min: preferences.budget_range_min ? Number.parseFloat(preferences.budget_range_min) : undefined,
        budget_range_max: preferences.budget_range_max ? Number.parseFloat(preferences.budget_range_max) : undefined,
        preferred_locations: preferences.preferred_locations,
      })

      if (result.success) {
        router.refresh()
        onSave()
      } else {
        alert(result.error || "Failed to save preferences")
      }
    } catch (error) {
      console.error("Error saving preferences:", error)
      alert("An error occurred while saving preferences")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Budget Range */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Budget Range (per day)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum ($)</label>
            <Input
              type="number"
              placeholder="25"
              value={preferences.budget_range_min}
              onChange={(e) => setPreferences((prev) => ({ ...prev, budget_range_min: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum ($)</label>
            <Input
              type="number"
              placeholder="150"
              value={preferences.budget_range_max}
              onChange={(e) => setPreferences((prev) => ({ ...prev, budget_range_max: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Preferred Car Makes */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Preferred Car Makes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CAR_TYPES.map((carType) => (
            <div key={carType} className="flex items-center space-x-2">
              <Checkbox
                id={`car-${carType}`}
                checked={preferences.preferred_car_types.includes(carType)}
                onCheckedChange={(checked) => handleCarTypeChange(carType, checked as boolean)}
              />
              <label htmlFor={`car-${carType}`} className="text-sm">
                {carType}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Preferred Features */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Preferred Features</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {FEATURES.map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <Checkbox
                id={`feature-${feature}`}
                checked={preferences.preferred_features.includes(feature)}
                onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
              />
              <label htmlFor={`feature-${feature}`} className="text-sm capitalize">
                {feature.replace("_", " ")}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  )
}
