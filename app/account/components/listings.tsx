"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { StatusBadge } from "./status-badge";
import { useAuth } from "@/context/auth-context";

type CarCard = {
  id: string;
  name: string;
  image: string;
  price: string;
  rating: number;   // if you don't track ratings yet, default to 5.0 or 0
  trips: number;    // if you don't track trips yet, default to 0
  status: string;   // falls back to "active" if not present
};

const USE_PRIVATE_BUCKET = false; // set true if your Storage bucket is private

export const Listings = () => {
  const [myListings, setMyListings] = React.useState<CarCard[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const { userProfile } = useAuth()

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) who is logged in?
        if (!userProfile) throw new Error("Not authenticated.");

        // 2) fetch cars owned by the user, include photos (primary first)
        const { data, error } = await supabase
          .from("cars")
          .select(`
            id,
            make,
            model,
            year,
            daily_rate,
            status,
            car_photos (
              photo_url,
              is_primary,
              display_order
            )
          `)
          .eq("host_id", userProfile.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // 3) map to UI shape
        const rows = (data ?? []) as Array<{
          id: string;
          make: string;
          model: string;
          year: number;
          daily_rate: number;
          status: string | null;
          car_photos?: Array<{
            photo_url: string;
            is_primary: boolean;
            display_order: number;
          }>;
        }>;

        // pick best photo (primary → lowest display_order → first)
        const pickPhoto = async (photos: CarCard[]["length"] extends never ? never : any, fallback = "/placeholder.svg"): Promise<string> => {
          if (!photos || photos.length === 0) return fallback;
          // Prefer primary, else smallest display_order, else first
          const sorted = [...photos].sort((a, b) => {
            const aScore = (a.is_primary ? -1 : 0) + (a.display_order ?? 0);
            const bScore = (b.is_primary ? -1 : 0) + (b.display_order ?? 0);
            return aScore - bScore;
          });
          const chosen = sorted[0];

          if (!USE_PRIVATE_BUCKET) {
            // public bucket: stored URL is ready to use
            return chosen.photo_url || fallback;
          }

          // private bucket: chosen.photo_url should be a *path* like "userId/carId/file.jpg"
          // If you stored full URLs instead of paths, switch your DB to store the path only.
          // Example below assumes you stored the *path* in photo_url.
          const { data: signed, error: signedErr } = await supabase.storage
            .from("car-photos")
            .createSignedUrl(chosen.photo_url, 60 * 60);
          if (signedErr || !signed?.signedUrl) return fallback;
          return signed.signedUrl;
        };

        // create signed URLs in parallel if private
        const mapped = await Promise.all(
          rows.map(async (c) => {
            const imageUrl = await pickPhoto(c.car_photos);
            return {
              id: c.id,
              name: `${c.year} ${c.make} ${c.model}`,
              image: imageUrl,
              price: `$${Number(c.daily_rate).toFixed(0)}/day`,
              rating: 5.0, // TODO: replace with your ratings calc
              trips: 0,     // TODO: replace with your trips count
              status: (c.status || "active").toLowerCase(),
            } as CarCard;
          })
        );

        if (isMounted) setMyListings(mapped);
      } catch (err) {
        console.error("[Listings] fetch error:", err);
        if (isMounted) setError(err instanceof Error ? err.message : "Failed to load cars.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">My Cars</h2>
            <p className="text-muted-foreground">Manage your vehicle listings</p>
          </div>
          <Button onClick={() => router.push("/listing-car")}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Car
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Loading your cars…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">My Cars</h2>
            <p className="text-muted-foreground">Manage your vehicle listings</p>
          </div>
          <Button onClick={() => router.push("/listing-car")}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Car
          </Button>
        </div>
        <p className="text-sm text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Cars</h2>
          <p className="text-muted-foreground">Manage your vehicle listings</p>
        </div>
        <Button onClick={() => router.push("/listing-car")}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Car
        </Button>
      </div>

      {myListings.length === 0 ? (
        <p className="text-sm text-muted-foreground">You haven’t listed any cars yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((car) => (
            <Card key={car.id} className="pt-0">
              <CardContent className="p-0">
                <img
                  src={car.image || "/placeholder.svg"}
                  alt={car.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{car.name}</h3>
                    <StatusBadge status={car.status} />
                  </div>
                  <p className="text-2xl font-bold text-primary mb-2">
                    {car.price}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{car.rating.toFixed(1)}</span>
                    </div>
                    <span>{car.trips} trips</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => router.push(`/listing-car/${car.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => router.push(`/cars/${car.id}`)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
