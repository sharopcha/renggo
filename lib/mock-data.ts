// Mock data for Renggo fleet management prototype

export interface Vehicle {
  id: string
  plate: string
  vin: string
  make: string
  model: string
  year: number
  class: "Economy" | "Compact" | "SUV" | "Van"
  status: "Available" | "On Trip" | "Maintenance" | "Inactive"
  photoUrl: string
  odometerKm: number
  location: "Tallinn" | "Riga" | "Vilnius"
  utilizationPct: number
  baseDailyRateEur: number
  lifetimeRevenue: number
  totalTrips: number
  rating: number
  documents: {
    type: string
    status: "Valid" | "Expiring" | "Expired"
    expiry: string
  }[]
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  verified: boolean
  lifetimeSpendEur: number
  trips: number
  cancellations: number
  status: "Active" | "Banned" | "Suspended"
  country: string
  avatar: string
}

export interface Rental {
  id: string
  vehicleId: string
  customerId: string
  start: string
  end: string
  status: "Upcoming" | "Active" | "Completed" | "Cancelled"
  pickupCity: string
  returnCity: string
  priceEur: number
  pickupLocation: string
  returnLocation: string
}

export interface Payment {
  id: string
  rentalId: string
  type: "Charge" | "Refund" | "Fee" | "Payout"
  amountEur: number
  status: "Succeeded" | "Failed" | "Pending"
  method: string
  createdAt: string
}

// Mock data
export const mockVehicles: Vehicle[] = [
  {
    id: "veh_001",
    plate: "123 ABC",
    vin: "WVWZZZ1JZXW000001",
    make: "Toyota",
    model: "Corolla",
    year: 2021,
    class: "Compact",
    status: "Available",
    photoUrl: "/toyota-corolla-silver.jpg",
    odometerKm: 48500,
    location: "Tallinn",
    utilizationPct: 68,
    baseDailyRateEur: 35,
    lifetimeRevenue: 8420,
    totalTrips: 127,
    rating: 4.8,
    documents: [
      { type: "Registration", status: "Valid", expiry: "2026-03-01" },
      { type: "Insurance", status: "Expiring", expiry: "2025-12-15" },
    ],
  },
  {
    id: "veh_002",
    plate: "456 DEF",
    vin: "WVWZZZ1JZXW000002",
    make: "Volkswagen",
    model: "Golf",
    year: 2022,
    class: "Compact",
    status: "On Trip",
    photoUrl: "/volkswagen-golf-blue.jpg",
    odometerKm: 32100,
    location: "Riga",
    utilizationPct: 72,
    baseDailyRateEur: 38,
    lifetimeRevenue: 9650,
    totalTrips: 98,
    rating: 4.9,
    documents: [
      { type: "Registration", status: "Valid", expiry: "2027-01-15" },
      { type: "Insurance", status: "Valid", expiry: "2026-08-20" },
    ],
  },
  {
    id: "veh_003",
    plate: "789 GHI",
    vin: "WVWZZZ1JZXW000003",
    make: "BMW",
    model: "X3",
    year: 2023,
    class: "SUV",
    status: "Available",
    photoUrl: "/bmw-x3-black-suv.jpg",
    odometerKm: 15200,
    location: "Vilnius",
    utilizationPct: 85,
    baseDailyRateEur: 65,
    lifetimeRevenue: 12340,
    totalTrips: 67,
    rating: 4.7,
    documents: [
      { type: "Registration", status: "Valid", expiry: "2028-05-10" },
      { type: "Insurance", status: "Valid", expiry: "2026-11-30" },
    ],
  },
  {
    id: "veh_004",
    plate: "321 JKL",
    vin: "WVWZZZ1JZXW000004",
    make: "Ford",
    model: "Focus",
    year: 2020,
    class: "Compact",
    status: "Maintenance",
    photoUrl: "/ford-focus-car.jpg",
    odometerKm: 67800,
    location: "Tallinn",
    utilizationPct: 58,
    baseDailyRateEur: 32,
    lifetimeRevenue: 6780,
    totalTrips: 156,
    rating: 4.5,
    documents: [
      { type: "Registration", status: "Valid", expiry: "2025-11-20" },
      { type: "Insurance", status: "Valid", expiry: "2025-09-15" },
    ],
  },
  {
    id: "veh_005",
    plate: "654 MNO",
    vin: "WVWZZZ1JZXW000005",
    make: "Nissan",
    model: "Qashqai",
    year: 2022,
    class: "SUV",
    status: "Available",
    photoUrl: "/nissan-qashqai-suv.jpg",
    odometerKm: 28900,
    location: "Riga",
    utilizationPct: 63,
    baseDailyRateEur: 55,
    lifetimeRevenue: 7890,
    totalTrips: 89,
    rating: 4.6,
    documents: [
      { type: "Registration", status: "Valid", expiry: "2027-03-10" },
      { type: "Insurance", status: "Expiring", expiry: "2025-12-01" },
    ],
  },
  {
    id: "veh_006",
    plate: "987 PQR",
    vin: "WVWZZZ1JZXW000006",
    make: "Mercedes",
    model: "Sprinter",
    year: 2021,
    class: "Van",
    status: "Available",
    photoUrl: "/white-mercedes-sprinter-van.jpg",
    odometerKm: 45600,
    location: "Vilnius",
    utilizationPct: 78,
    baseDailyRateEur: 85,
    lifetimeRevenue: 15600,
    totalTrips: 134,
    rating: 4.8,
    documents: [
      { type: "Registration", status: "Valid", expiry: "2026-07-15" },
      { type: "Insurance", status: "Valid", expiry: "2026-04-20" },
    ],
  },
  {
    id: "veh_007",
    plate: "111 STU",
    vin: "WVWZZZ1JZXW000007",
    make: "Skoda",
    model: "Octavia",
    year: 2023,
    class: "Compact",
    status: "Inactive",
    photoUrl: "/silver-skoda-octavia-sedan.jpg",
    odometerKm: 12400,
    location: "Tallinn",
    utilizationPct: 0,
    baseDailyRateEur: 40,
    lifetimeRevenue: 2340,
    totalTrips: 23,
    rating: 4.9,
    documents: [
      { type: "Registration", status: "Valid", expiry: "2028-01-10" },
      { type: "Insurance", status: "Expired", expiry: "2024-12-31" },
    ],
  },
  {
    id: "veh_008",
    plate: "222 VWX",
    vin: "WVWZZZ1JZXW000008",
    make: "Hyundai",
    model: "Tucson",
    year: 2022,
    class: "SUV",
    status: "Available",
    photoUrl: "/red-hyundai-tucson.png",
    odometerKm: 34200,
    location: "Riga",
    utilizationPct: 71,
    baseDailyRateEur: 58,
    lifetimeRevenue: 9870,
    totalTrips: 112,
    rating: 4.7,
    documents: [
      { type: "Registration", status: "Valid", expiry: "2027-05-20" },
      { type: "Insurance", status: "Valid", expiry: "2026-02-28" },
    ],
  },
]

export const mockCustomers: Customer[] = [
  {
    id: "cus_001",
    name: "Maria Kask",
    email: "maria@example.com",
    phone: "+372 5555 5555",
    verified: true,
    lifetimeSpendEur: 1240.5,
    trips: 9,
    cancellations: 0,
    status: "Active",
    country: "Estonia",
    avatar: "/diverse-woman-avatar.png",
  },
  {
    id: "cus_002",
    name: "Janis Berzins",
    email: "janis@example.com",
    phone: "+371 2222 2222",
    verified: true,
    lifetimeSpendEur: 890.25,
    trips: 6,
    cancellations: 1,
    status: "Active",
    country: "Latvia",
    avatar: "/man-avatar.png",
  },
  {
    id: "cus_003",
    name: "Andrius Petraitis",
    email: "andrius@example.com",
    phone: "+370 6666 6666",
    verified: false,
    lifetimeSpendEur: 245.0,
    trips: 2,
    cancellations: 0,
    status: "Active",
    country: "Lithuania",
    avatar: "/placeholder.svg?key=avatar3",
  },
  {
    id: "cus_004",
    name: "Elena Volkov",
    email: "elena@example.com",
    phone: "+372 7777 7777",
    verified: true,
    lifetimeSpendEur: 2150.75,
    trips: 15,
    cancellations: 2,
    status: "Active",
    country: "Estonia",
    avatar: "/placeholder.svg?key=avatar4",
  },
  {
    id: "cus_005",
    name: "Kristaps Ozols",
    email: "kristaps@example.com",
    phone: "+371 8888 8888",
    verified: true,
    lifetimeSpendEur: 0,
    trips: 0,
    cancellations: 3,
    status: "Banned",
    country: "Latvia",
    avatar: "/placeholder.svg?key=avatar5",
  },
  {
    id: "cus_006",
    name: "Ruta Kazlauskas",
    email: "ruta@example.com",
    phone: "+370 9999 9999",
    verified: false,
    lifetimeSpendEur: 125.0,
    trips: 1,
    cancellations: 0,
    status: "Suspended",
    country: "Lithuania",
    avatar: "/placeholder.svg?key=avatar6",
  },
]

export const mockRentals: Rental[] = [
  {
    id: "ren_001",
    vehicleId: "veh_001",
    customerId: "cus_001",
    start: "2025-01-15T10:00:00Z",
    end: "2025-01-18T10:00:00Z",
    status: "Completed",
    pickupCity: "Tallinn",
    returnCity: "Tallinn",
    priceEur: 145.0,
    pickupLocation: "Tallinn Airport",
    returnLocation: "Tallinn City Center",
  },
  {
    id: "ren_002",
    vehicleId: "veh_002",
    customerId: "cus_002",
    start: "2025-01-20T14:00:00Z",
    end: "2025-01-22T14:00:00Z",
    status: "Active",
    pickupCity: "Riga",
    returnCity: "Riga",
    priceEur: 98.5,
    pickupLocation: "Riga Central Station",
    returnLocation: "Riga Central Station",
  },
  {
    id: "ren_003",
    vehicleId: "veh_003",
    customerId: "cus_001",
    start: "2025-01-25T09:00:00Z",
    end: "2025-01-28T18:00:00Z",
    status: "Upcoming",
    pickupCity: "Vilnius",
    returnCity: "Vilnius",
    priceEur: 195.0,
    pickupLocation: "Vilnius Airport",
    returnLocation: "Vilnius Airport",
  },
  {
    id: "ren_004",
    vehicleId: "veh_005",
    customerId: "cus_002",
    start: "2025-01-10T12:00:00Z",
    end: "2025-01-12T12:00:00Z",
    status: "Cancelled",
    pickupCity: "Riga",
    returnCity: "Riga",
    priceEur: 110.0,
    pickupLocation: "Riga Downtown",
    returnLocation: "Riga Downtown",
  },
  {
    id: "ren_005",
    vehicleId: "veh_006",
    customerId: "cus_001",
    start: "2025-01-08T08:00:00Z",
    end: "2025-01-11T20:00:00Z",
    status: "Completed",
    pickupCity: "Vilnius",
    returnCity: "Vilnius",
    priceEur: 255.0,
    pickupLocation: "Vilnius Central",
    returnLocation: "Vilnius Central",
  },
  {
    id: "ren_006",
    vehicleId: "veh_008",
    customerId: "cus_002",
    start: "2025-01-30T15:00:00Z",
    end: "2025-02-02T15:00:00Z",
    status: "Upcoming",
    pickupCity: "Riga",
    returnCity: "Riga",
    priceEur: 174.0,
    pickupLocation: "Riga Airport",
    returnLocation: "Riga Airport",
  },
]

export const mockPayments: Payment[] = [
  {
    id: "pay_001",
    rentalId: "ren_001",
    type: "Charge",
    amountEur: 145.0,
    status: "Succeeded",
    method: "Card •••• 4242",
    createdAt: "2025-01-15T10:01:00Z",
  },
  {
    id: "pay_002",
    rentalId: "ren_002",
    type: "Charge",
    amountEur: 98.5,
    status: "Succeeded",
    method: "Card •••• 1234",
    createdAt: "2025-01-20T14:01:00Z",
  },
  {
    id: "pay_003",
    rentalId: "ren_003",
    type: "Charge",
    amountEur: 195.0,
    status: "Pending",
    method: "Card •••• 5678",
    createdAt: "2025-01-25T09:01:00Z",
  },
  {
    id: "pay_004",
    rentalId: "ren_004",
    type: "Refund",
    amountEur: 110.0,
    status: "Succeeded",
    method: "Card •••• 5678",
    createdAt: "2025-01-11T15:30:00Z",
  },
  {
    id: "pay_005",
    rentalId: "ren_005",
    type: "Charge",
    amountEur: 255.0,
    status: "Succeeded",
    method: "Card •••• 9012",
    createdAt: "2025-01-08T08:01:00Z",
  },
  {
    id: "pay_006",
    rentalId: "ren_006",
    type: "Charge",
    amountEur: 174.0,
    status: "Failed",
    method: "Card •••• 3456",
    createdAt: "2025-01-30T15:01:00Z",
  },
  {
    id: "pay_007",
    rentalId: "",
    type: "Payout",
    amountEur: 1250.0,
    status: "Succeeded",
    method: "Bank Transfer",
    createdAt: "2025-01-31T12:00:00Z",
  },
  {
    id: "pay_008",
    rentalId: "",
    type: "Fee",
    amountEur: 25.0,
    status: "Succeeded",
    method: "Platform Fee",
    createdAt: "2025-01-31T12:01:00Z",
  },
]

// KPI calculations
export const calculateKPIs = () => {
  const activeRentals = mockRentals.filter((r) => r.status === "Active").length
  const totalVehicles = mockVehicles.length
  const availableVehicles = mockVehicles.filter((v) => v.status === "Available").length
  const utilizationRate = Math.round(((totalVehicles - availableVehicles) / totalVehicles) * 100)

  const totalRevenue = mockPayments
    .filter((p) => p.status === "Succeeded" && p.type === "Charge")
    .reduce((sum, p) => sum + p.amountEur, 0)

  const completedRentals = mockRentals.filter((r) => r.status === "Completed")
  const avgDailyRate =
    completedRentals.length > 0
      ? Math.round(completedRentals.reduce((sum, r) => sum + r.priceEur, 0) / completedRentals.length)
      : 0

  const cancelledRentals = mockRentals.filter((r) => r.status === "Cancelled").length
  const cancellationRate = mockRentals.length > 0 ? ((cancelledRentals / mockRentals.length) * 100).toFixed(1) : "0.0"

  return {
    activeRentals,
    utilizationRate,
    grossBookings: totalRevenue,
    netEarnings: Math.round(totalRevenue * 0.85), // Assuming 15% platform fee
    avgDailyRate,
    cancellationRate: Number.parseFloat(cancellationRate),
  }
}
