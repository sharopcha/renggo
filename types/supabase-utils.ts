import { Database } from "@/lib/supabase/database.types";

export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];

// Temporary types until database types are regenerated
export type Rental = {
  id: string;
  organization_id: string;
  vehicle_id: string;
  customer_id: string;
  start_date: string;
  end_date: string;
  status: "upcoming" | "active" | "completed" | "cancelled";
  pickup_location: string;
  return_location: string;
  pickup_city: string | null;
  return_city: string | null;
  price_eur: number;
  deposit_eur: number | null;
  insurance_eur: number | null;
  extras_eur: number | null;
  total_price_eur: number | null;
  odometer_start: number | null;
  odometer_end: number | null;
  notes: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: string;
  organization_id: string;
  rental_id: string | null;
  customer_id: string | null;
  type: "charge" | "refund" | "payout" | "fee";
  amount_eur: number;
  status: "pending" | "succeeded" | "failed" | "cancelled";
  method: "card" | "bank_transfer" | "cash" | "platform_fee" | "other";
  method_details: string | null;
  transaction_id: string | null;
  processor: string | null;
  processor_fee_eur: number | null;
  platform_fee_eur: number | null;
  net_amount_eur: number | null;
  currency: string | null;
  description: string | null;
  metadata: any;
  failed_reason: string | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Payout = {
  id: string;
  organization_id: string;
  amount_eur: number;
  status: "pending" | "succeeded" | "failed" | "cancelled";
  method: "card" | "bank_transfer" | "cash" | "platform_fee" | "other";
  bank_account: string | null;
  transaction_id: string | null;
  period_start: string;
  period_end: string;
  scheduled_date: string | null;
  processed_date: string | null;
  notes: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
};
