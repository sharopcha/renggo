"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Shield,
  Phone,
  Mail,
  CreditCard,
  Car,
  Star,
  Calendar,
  Edit,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase/client";
import { format, isSameYear, Locale } from "date-fns";
import { useRouter } from "next/navigation";
import { Listings } from "./components/listings";

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [memberSince, setMemberSince] = useState("");
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });
  const { userProfile, setUserProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setUserInfo({
      name: userProfile?.full_name || "",
      email: userProfile?.email || "",
      phone: userProfile?.phone || "",
      location: userProfile?.location || "",
    });
    
    if(userProfile?.created_at) {
      setMemberSince(formatMemberSince(new Date(userProfile.created_at)));
    }

  }, [userProfile]);

  const verificationStatus = {
    identity: true,
    phone: true,
    email: true,
    payment: true,
    drivingLicense: false,
  };

  const userStats = {
    totalRentals: 47,
    rating: 4.8,
    responseRate: 98
  };

  const recentRentals = [
    {
      id: 1,
      car: "2023 Tesla Model 3",
      dates: "Dec 15-17, 2024",
      status: "completed",
      rating: 5,
      earnings: "$240",
    },
    {
      id: 2,
      car: "2022 BMW X5",
      dates: "Dec 10-12, 2024",
      status: "completed",
      rating: 4,
      earnings: "$320",
    },
    {
      id: 3,
      car: "2023 Tesla Model 3",
      dates: "Dec 20-22, 2024",
      status: "upcoming",
      rating: null,
      earnings: "$280",
    },
  ];


  const handleSave = async () => {
    setIsEditing(true);

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        location: userInfo.location,
      })
      .eq("id", userProfile?.id!)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    setUserProfile(data);
    setIsEditing(false);
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      case "upcoming":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Upcoming
          </Badge>
        );
      case "active":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Active
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatMemberSince = (date: Date, locale?: Locale): string => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error("Invalid Date");
    }
    return isSameYear(date, new Date())
      ? format(date, "LLLL", { locale }) // full month name
      : format(date, "yyyy", { locale }); // 4-digit year
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <Card className="px-6">
            <CardContent>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userProfile?.profile_image_url!} />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">
                      {userProfile?.full_name}
                    </h1>
                    <div className="flex gap-1">
                      {verificationStatus.identity && (
                        <Badge
                          variant="default"
                          className="bg-accent text-accent-foreground"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{userStats.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>{userStats.totalRentals} trips</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Member since {memberSince}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="listings">My Cars</TabsTrigger>
            <TabsTrigger value="history">Trip History</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal details and contact information
                      </CardDescription>
                    </div>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={() =>
                        isEditing ? handleSave() : setIsEditing(true)
                      }
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={userInfo.name}
                          onChange={(e) =>
                            setUserInfo({ ...userInfo, name: e.target.value })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userInfo.email}
                          onChange={(e) =>
                            setUserInfo({ ...userInfo, email: e.target.value })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={userInfo.phone}
                          onChange={(e) =>
                            setUserInfo({ ...userInfo, phone: e.target.value })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={userInfo.location}
                          onChange={(e) =>
                            setUserInfo({
                              ...userInfo,
                              location: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stats Card */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Your Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{userStats.rating}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Trips</span>
                      <span className="font-medium">
                        {userStats.totalRentals}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Response Rate
                      </span>
                      <span className="font-medium">
                        {userStats.responseRate}%
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Member Since
                      </span>
                      <span className="font-medium">
                        {userProfile?.created_at ? format(userProfile?.created_at, 'MMMM yyyy') : 'N/A'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>Account Verification</CardTitle>
                <CardDescription>
                  Complete your verification to build trust with other users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Identity Verification</p>
                        <p className="text-sm text-muted-foreground">
                          Government ID verified
                        </p>
                      </div>
                    </div>
                    {getStatusIcon(verificationStatus.identity)}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Phone Number</p>
                        <p className="text-sm text-muted-foreground">
                          SMS verified
                        </p>
                      </div>
                    </div>
                    {getStatusIcon(verificationStatus.phone)}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Address</p>
                        <p className="text-sm text-muted-foreground">
                          Email confirmed
                        </p>
                      </div>
                    </div>
                    {getStatusIcon(verificationStatus.email)}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Payment Method</p>
                        <p className="text-sm text-muted-foreground">
                          Card on file
                        </p>
                      </div>
                    </div>
                    {getStatusIcon(verificationStatus.payment)}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Car className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Driving License</p>
                        <p className="text-sm text-muted-foreground">
                          Upload required
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(verificationStatus.drivingLicense)}
                      {!verificationStatus.drivingLicense && (
                        <Button size="sm" variant="outline">
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Cars Tab */}
          <TabsContent value="listings">
            <Listings />
          </TabsContent>

          {/* Trip History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Trip History</CardTitle>
                <CardDescription>
                  View your recent rental activity and earnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRentals.map((rental) => (
                    <div
                      key={rental.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                          <Car className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{rental.car}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{rental.dates}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {rental.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{rental.rating}</span>
                          </div>
                        )}
                        <div className="text-right">
                          <p className="font-medium text-green-600">
                            {rental.earnings}
                          </p>
                          {getStatusBadge(rental.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ProfilePage;
