import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/hero-section";
import { FeaturedCars } from "@/components/featured-cars";
import { HowItWorks } from "@/components/how-it-works";
import { SearchBar } from "@/components/search-bar";

export default async function HomePage() {
  const supabase = await createClient();

  // Get featured cars (limit to 6 for homepage)
  const { data: featuredCars } = await supabase
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
    .limit(6);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <SearchBar />
      {/* <FeaturedCars cars={(featuredCars as any) || []} /> */}
      <HowItWorks />
    </div>
  );
}
