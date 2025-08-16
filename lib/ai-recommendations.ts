"use server";

import { cookies } from "next/headers";
import { createClient } from "./supabase/server";

// Mock embedding function - in production, you'd use OpenAI or similar
function generateMockEmbedding(text: string): number[] {
  // Simple hash-based mock embedding for demonstration
  const hash = text.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  // Generate a 1536-dimensional vector (OpenAI embedding size)
  const embedding = [];
  for (let i = 0; i < 1536; i++) {
    embedding.push(Math.sin(hash + i) * 0.1);
  }
  return embedding;
}

export async function generateCarEmbeddings() {
  const cookieStore = cookies();
  const supabase = await createClient();

  try {
    // Get all cars without embeddings
    const { data: cars } = await supabase
      .from("cars")
      .select(
        "id, make, model, year, description, features, fuel_type, transmission"
      )
      .is("embedding_generated", null);

    if (!cars || cars.length === 0) {
      return { success: true, message: "No cars need embedding generation" };
    }

    for (const car of cars) {
      // Create text representation of car for embedding
      const carText = `${car.make} ${car.model} ${car.year} ${car.fuel_type} ${
        car.transmission
      } ${car.description || ""} ${(car.features || []).join(" ")}`;

      // Generate embedding (mock)
      const embedding = generateMockEmbedding(carText);

      // Store embedding
      await supabase.from("car_embeddings").upsert({
        car_id: car.id,
        embedding: embedding,
        metadata: {
          make: car.make,
          model: car.model,
          year: car.year,
          features: car.features,
          fuel_type: car.fuel_type,
          transmission: car.transmission,
        },
      });

      // Mark car as having embedding generated
      await supabase
        .from("cars")
        .update({ embedding_generated: true })
        .eq("id", car.id);
    }

    return {
      success: true,
      message: `Generated embeddings for ${cars.length} cars`,
    };
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return { success: false, error: "Failed to generate embeddings" };
  }
}

export async function getPersonalizedRecommendations(
  userId: string,
  limit = 6
) {
  const cookieStore = cookies();
  const supabase = await createClient();

  try {
    // Get user's booking history to understand preferences
    const { data: bookingHistory } = await supabase
      .from("bookings")
      .select(
        `
        cars(make, model, year, fuel_type, transmission, features, daily_rate)
      `
      )
      .eq("renter_id", userId)
      .eq("status", "completed");

    // Get user's explicit preferences
    const { data: userPrefs } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    // Build preference profile
    let preferredMakes: string[] = [];
    let preferredFeatures: string[] = [];
    let avgPriceRange = { min: 0, max: 1000 };

    if (bookingHistory && bookingHistory.length > 0) {
      const makes = bookingHistory.map((b) => b.cars.make).filter(Boolean);
      const features = bookingHistory.flatMap((b) => b.cars.features || []);
      const prices = bookingHistory
        .map((b) => b.cars.daily_rate)
        .filter(Boolean);

      preferredMakes = [...new Set(makes)];
      preferredFeatures = [...new Set(features)];

      if (prices.length > 0) {
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        avgPriceRange = {
          min: Math.max(0, avgPrice * 0.7),
          max: avgPrice * 1.3,
        };
      }
    }

    if (userPrefs) {
      preferredMakes = [
        ...new Set([
          ...preferredMakes,
          ...(userPrefs.preferred_car_types || []),
        ]),
      ];
      preferredFeatures = [
        ...new Set([
          ...preferredFeatures,
          ...(userPrefs.preferred_features || []),
        ]),
      ];

      if (userPrefs.budget_range_min && userPrefs.budget_range_max) {
        avgPriceRange = {
          min: userPrefs.budget_range_min,
          max: userPrefs.budget_range_max,
        };
      }
    }

    // Get available cars with scoring
    const query = supabase
      .from("cars")
      .select(
        `
        *,
        car_photos(photo_url, is_primary),
        profiles(full_name)
      `
      )
      .eq("is_active", true)
      .eq("status", "available")
      .gte("daily_rate", avgPriceRange.min)
      .lte("daily_rate", avgPriceRange.max);

    const { data: cars } = await query.limit(50); // Get more to score and filter

    if (!cars) {
      return { success: true, recommendations: [] };
    }

    // Score cars based on preferences
    const scoredCars = cars.map((car) => {
      let score = 0;

      // Make preference
      if (preferredMakes.includes(car.make)) {
        score += 3;
      }

      // Feature matching
      const carFeatures = car.features || [];
      const matchingFeatures = carFeatures.filter((f) =>
        preferredFeatures.includes(f)
      );
      score += matchingFeatures.length * 2;

      // Price preference (closer to average is better)
      const avgPreferredPrice = (avgPriceRange.min + avgPriceRange.max) / 2;
      const priceDiff = Math.abs(car.daily_rate - avgPreferredPrice);
      const maxPriceDiff = avgPriceRange.max - avgPriceRange.min;
      const priceScore =
        maxPriceDiff > 0 ? (1 - priceDiff / maxPriceDiff) * 2 : 2;
      score += priceScore;

      // Newer cars get slight boost
      const currentYear = new Date().getFullYear();
      const ageScore = Math.max(0, (car.year - (currentYear - 10)) / 10);
      score += ageScore;

      // Random factor for diversity
      score += Math.random() * 0.5;

      return { ...car, recommendationScore: score };
    });

    // Sort by score and return top recommendations
    const recommendations = scoredCars
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);

    return { success: true, recommendations };
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return { success: false, error: "Failed to get recommendations" };
  }
}

export async function updateUserPreferences(
  userId: string,
  preferences: {
    preferred_car_types?: string[];
    preferred_features?: string[];
    budget_range_min?: number;
    budget_range_max?: number;
    preferred_locations?: string[];
  }
) {
  const cookieStore = cookies();
  const supabase = await createClient();

  try {
    // Generate embedding for preferences
    const prefsText = [
      ...(preferences.preferred_car_types || []),
      ...(preferences.preferred_features || []),
      ...(preferences.preferred_locations || []),
    ].join(" ");

    const embedding = generateMockEmbedding(prefsText);

    const { error } = await supabase.from("user_preferences").upsert({
      user_id: userId,
      ...preferences,
      embedding: embedding,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error updating preferences:", error);
      return { success: false, error: "Failed to update preferences" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating preferences:", error);
    return { success: false, error: "Failed to update preferences" };
  }
}

export async function semanticSearch(
  query: string,
  filters: any = {},
  limit = 20
) {
  const cookieStore = cookies();
  const supabase = await createClient();

  try {
    // Generate embedding for search query
    const queryEmbedding = generateMockEmbedding(query);

    // Build base query
    let baseQuery = supabase
      .from("cars")
      .select(
        `
        *,
        car_photos(photo_url, is_primary),
        profiles(full_name)
      `
      )
      .eq("is_active", true)
      .eq("status", "available");

    // Apply filters
    if (filters.location) {
      baseQuery = baseQuery.ilike("location_address", `%${filters.location}%`);
    }
    if (filters.minPrice) {
      baseQuery = baseQuery.gte("daily_rate", filters.minPrice);
    }
    if (filters.maxPrice) {
      baseQuery = baseQuery.lte("daily_rate", filters.maxPrice);
    }
    if (filters.make) {
      baseQuery = baseQuery.eq("make", filters.make);
    }
    if (filters.transmission) {
      baseQuery = baseQuery.eq("transmission", filters.transmission);
    }
    if (filters.fuelType) {
      baseQuery = baseQuery.eq("fuel_type", filters.fuelType);
    }

    const { data: cars } = await baseQuery.limit(100); // Get more for semantic scoring

    if (!cars) {
      return { success: true, results: [] };
    }

    // Score cars based on semantic similarity and text matching
    const scoredCars = cars.map((car) => {
      let score = 0;

      // Text matching score
      const carText = `${car.make} ${car.model} ${car.year} ${
        car.description || ""
      } ${(car.features || []).join(" ")}`.toLowerCase();
      const queryLower = query.toLowerCase();

      // Exact matches
      if (carText.includes(queryLower)) {
        score += 5;
      }

      // Word matches
      const queryWords = queryLower.split(" ").filter((w) => w.length > 2);
      const matchingWords = queryWords.filter((word) => carText.includes(word));
      score += matchingWords.length * 2;

      // Make/model specific matches
      if (queryLower.includes(car.make.toLowerCase())) {
        score += 3;
      }
      if (queryLower.includes(car.model.toLowerCase())) {
        score += 3;
      }

      // Feature matches
      const features = car.features || [];
      const featureMatches = features.filter(
        (feature) =>
          queryLower.includes(feature.toLowerCase()) ||
          feature.toLowerCase().includes(queryLower)
      );
      score += featureMatches.length * 2;

      // Mock semantic similarity (in production, use actual vector similarity)
      const semanticScore = Math.random() * 2; // Placeholder
      score += semanticScore;

      return { ...car, searchScore: score };
    });

    // Sort by score and return results
    const results = scoredCars
      .filter((car) => car.searchScore > 0) // Only return cars with some relevance
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, limit);

    return { success: true, results };
  } catch (error) {
    console.error("Error in semantic search:", error);
    return { success: false, error: "Search failed" };
  }
}
