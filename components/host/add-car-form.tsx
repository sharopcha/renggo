"use client";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Upload, X, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const CAR_FEATURES = [
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
];

const USE_PUBLIC_IMAGES = true;

export function AddCarForm() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    color: "",
    license_plate: "",
    transmission: "",
    fuel_type: "",
    seats: "5",
    doors: "4",
    description: "",
    daily_rate: "",
    location_address: "",
    mileage: "",
    house_rules: "",
    features: [] as string[],
  });

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      features: checked
        ? [...prev.features, feature]
        : prev.features.filter((f) => f !== feature),
    }));
  };

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    setUploadError(null);

    console.log("[v0] Processing", fileArray.length, "files");

    const validFiles = fileArray.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select only image files");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Images must be smaller than 5MB");
        return false;
      }
      return true;
    });

    const totalPhotos = photos.length + validFiles.length;
    if (totalPhotos > 10) {
      setUploadError("Maximum 10 photos allowed");
      const allowedCount = 10 - photos.length;
      setPhotos((prev) => [...prev, ...validFiles.slice(0, allowedCount)]);
    } else {
      setPhotos((prev) => [...prev, ...validFiles]);
    }

    console.log("[v0] Added", validFiles.length, "valid files");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    console.log("[v0] Files dropped");

    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleUploadAreaClick = () => {
    console.log("[v0] Upload area clicked");
    const fileInput = document.getElementById(
      "photo-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setUploadError(null);
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setUploadError(null);

  //   try {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();

  //     if (!user) throw new Error("Not authenticated");

  //     const { data: car, error: carError } = await supabase
  //       .from("cars")
  //       .insert({
  //         host_id: user.id,
  //         make: formData.make,
  //         model: formData.model,
  //         year: Number.parseInt(formData.year),
  //         color: formData.color,
  //         license_plate: formData.license_plate,
  //         transmission: formData.transmission,
  //         fuel_type: formData.fuel_type,
  //         seats: Number.parseInt(formData.seats),
  //         doors: Number.parseInt(formData.doors),
  //         description: formData.description,
  //         daily_rate: Number.parseFloat(formData.daily_rate),
  //         location_address: formData.location_address,
  //         mileage: formData.mileage ? Number.parseInt(formData.mileage) : null,
  //         house_rules: formData.house_rules,
  //         features: formData.features,
  //       })
  //       .select()
  //       .single();

  //     if (carError) {
  //       console.error("[v0] Car creation error:", carError);
  //       throw carError;
  //     }

  //     if (photos.length > 0) {
  //       for (let i = 0; i < photos.length; i++) {
  //         const photo = photos[i];
  //         const fileExt = photo.name.split(".").pop();
  //         const fileName = `${user.id}/${car.id}/${Date.now()}-${i}.${fileExt}`;

  //         console.log("[v0] Uploading photo", i + 1, ":", fileName);

  //         const { data: uploadData, error: uploadError } =
  //           await supabase.storage.from("car-photos").upload(fileName, photo, {
  //             cacheControl: "3600",
  //             upsert: false,
  //           });

  //         if (uploadError) {
  //           console.error("[v0] Photo upload error:", uploadError);
  //           setUploadError(
  //             `Failed to upload photo ${i + 1}: ${uploadError.message}`
  //           );
  //           continue;
  //         }

  //         const {
  //           data: { publicUrl },
  //         } = supabase.storage.from("car-photos").getPublicUrl(fileName);

  //         const { error: photoRecordError } = await supabase
  //           .from("car_photos")
  //           .insert({
  //             car_id: car.id,
  //             photo_url: publicUrl,
  //             is_primary: i === 0,
  //             display_order: i,
  //           });

  //         if (photoRecordError) {
  //           console.error("[v0] Photo record error:", photoRecordError);
  //         } else {
  //           console.log("[v0] Photo record saved successfully");
  //         }
  //       }
  //     }

  //     router.push("/account?success=car-added");
  //   } catch (error) {
  //     console.error("[v0] Error adding car:", error);
  //     setUploadError(
  //       error instanceof Error
  //         ? error.message
  //         : "Error adding car. Please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadError(null);

    let newCarId: string | null = null;
    let uploadedPaths: string[] = [];

    try {
      if(!userProfile?.id) return;

      // 1) Insert car
      const { data: car, error: carError } = await supabase
        .from("cars")
        .insert({
          host_id: userProfile.id,
          make: formData.make,
          model: formData.model,
          year: Number(formData.year),
          color: formData.color || null,
          license_plate: formData.license_plate || null,
          transmission: formData.transmission,
          fuel_type: formData.fuel_type,
          seats: Number(formData.seats),
          doors: Number(formData.doors),
          description: formData.description || null,
          daily_rate: Number(formData.daily_rate),
          location_address: formData.location_address,
          mileage: formData.mileage ? Number(formData.mileage) : null,
          house_rules: formData.house_rules || null,
          features: formData.features,
        })
        .select()
        .single();

      if (carError) throw carError;
      newCarId = car.id as string;

      // 2) Upload photos (if any) in parallel
      if (photos.length > 0) {
        const uploadJobs = photos.map((photo, i) => {
          const ext = photo.name.split(".").pop() || "jpg";
          const path = `${userProfile.id}/${newCarId}/${Date.now()}-${i}.${ext}`;
          return supabase.storage
            .from("car-photos")
            .upload(path, photo, { cacheControl: "3600", upsert: false })
            .then(({ data, error }) => {
              if (error) throw new Error(error.message);
              uploadedPaths.push(path);
              return { path, index: i };
            });
        });

        const results = await Promise.allSettled(uploadJobs);
        const successes = results
          .filter((r): r is PromiseFulfilledResult<{ path: string; index: number }> => r.status === "fulfilled")
          .map((r) => r.value);

        if (successes.length === 0) {
          throw new Error("Failed to upload all images");
        }

        // 3) Turn paths into URLs and create DB rows
        const photoRows = await Promise.all(
          successes.map(async ({ path, index }) => {
            const url = USE_PUBLIC_IMAGES
              ? supabase.storage.from("car-photos").getPublicUrl(path).data.publicUrl
              : (await supabase.storage.from("car-photos").createSignedUrl(path, 60 * 60)).data?.signedUrl;

            if (!url) throw new Error("Could not get image URL");
            return {
              car_id: newCarId!,
              photo_url: url,
              is_primary: index === 0,
              display_order: index,
            };
          })
        );

        const { error: photosInsertError } = await supabase
          .from("car_photos")
          .insert(photoRows);

        if (photosInsertError) throw photosInsertError;
      }

      // 4) Done → navigate
      router.push("/account?success=car-added");
      router.refresh?.(); // App Router: revalidate server data
    } catch (err) {
      console.error("[AddCar] error:", err);
      setUploadError(err instanceof Error ? err.message : "Error adding car");

      // Best-effort cleanup if something failed
      try {
        // delete uploaded storage files
        if (uploadedPaths.length > 0) {
          await supabase.storage.from("car-photos").remove(uploadedPaths);
        }
        // delete car row if we created one
        if (newCarId) {
          await supabase.from("cars").delete().eq("id", newCarId);
        }
      } catch (cleanupErr) {
        console.warn("Cleanup error:", cleanupErr);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Make *
              </label>
              <Input
                value={formData.make}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, make: e.target.value }))
                }
                placeholder="Toyota"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model *
              </label>
              <Input
                value={formData.model}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, model: e.target.value }))
                }
                placeholder="Camry"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year *
              </label>
              <Input
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, year: e.target.value }))
                }
                placeholder="2020"
                min="1990"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <Input
                value={formData.color}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, color: e.target.value }))
                }
                placeholder="White"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Plate
              </label>
              <Input
                value={formData.license_plate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    license_plate: e.target.value,
                  }))
                }
                placeholder="ABC123"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transmission *
              </label>
              <Select
                value={formData.transmission}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, transmission: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Type *
              </label>
              <Select
                value={formData.fuel_type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, fuel_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">Gasoline</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seats
              </label>
              <Select
                value={formData.seats}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, seats: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 4, 5, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} seats
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doors
              </label>
              <Select
                value={formData.doors}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, doors: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} doors
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mileage
              </label>
              <Input
                type="number"
                value={formData.mileage}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mileage: e.target.value }))
                }
                placeholder="50000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CAR_FEATURES.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={formData.features.includes(feature)}
                  onCheckedChange={(checked) =>
                    handleFeatureChange(feature, checked as boolean)
                  }
                />
                <label htmlFor={feature} className="text-sm capitalize">
                  {feature.replace("_", " ")}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photos (Max 10, 5MB each)
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
                isDragging
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUploadAreaClick}
            >
              <Upload
                className={`h-12 w-12 mx-auto mb-4 ${
                  isDragging ? "text-blue-500" : "text-gray-400"
                }`}
              />
              <p
                className={`mb-2 ${
                  isDragging ? "text-blue-600 font-medium" : "text-gray-600"
                }`}
              >
                {isDragging
                  ? "Drop files here"
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                PNG, JPG, GIF up to 5MB
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
                disabled={loading}
              />
              <div className="inline-block">
                <Button
                  type="button"
                  variant="outline"
                  className="pointer-events-none bg-transparent"
                  disabled={loading || photos.length >= 10}
                >
                  Choose Files
                </Button>
              </div>
            </div>

            {uploadError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700">{uploadError}</span>
              </div>
            )}
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(photo) || "/placeholder.svg"}
                    alt={`Car photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Location & Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Address *
            </label>
            <Input
              value={formData.location_address}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location_address: e.target.value,
                }))
              }
              placeholder="123 Main St, City, State 12345"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Rate ($) *
            </label>
            <Input
              type="number"
              step="0.01"
              value={formData.daily_rate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, daily_rate: e.target.value }))
              }
              placeholder="50.00"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Description & Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Description & House Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Tell renters about your car..."
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              House Rules
            </label>
            <Textarea
              value={formData.house_rules}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  house_rules: e.target.value,
                }))
              }
              placeholder="No smoking, return with same fuel level, etc."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Car...
            </>
          ) : (
            "List My Car"
          )}
        </Button>
      </div>
    </form>
  );
}
