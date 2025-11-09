export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      claim_attachments: {
        Row: {
          claim_id: string
          content_type: string | null
          created_at: string | null
          filename: string | null
          id: string
          metadata: Json | null
          storage_path: string
        }
        Insert: {
          claim_id: string
          content_type?: string | null
          created_at?: string | null
          filename?: string | null
          id?: string
          metadata?: Json | null
          storage_path: string
        }
        Update: {
          claim_id?: string
          content_type?: string | null
          created_at?: string | null
          filename?: string | null
          id?: string
          metadata?: Json | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_attachments_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_history: {
        Row: {
          changed_by: string | null
          claim_id: string
          created_at: string | null
          id: string
          note: string | null
          status_from: string | null
          status_to: string | null
        }
        Insert: {
          changed_by?: string | null
          claim_id: string
          created_at?: string | null
          id?: string
          note?: string | null
          status_from?: string | null
          status_to?: string | null
        }
        Update: {
          changed_by?: string | null
          claim_id?: string
          created_at?: string | null
          id?: string
          note?: string | null
          status_from?: string | null
          status_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claim_history_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          assignee: string | null
          claim_number: string | null
          created_at: string | null
          customer_id: string | null
          deductible_eur: number | null
          description: string | null
          estimated_cost_eur: number | null
          id: string
          incident_date: string | null
          incident_type: string | null
          metadata: Json | null
          organization_id: string
          payout_amount_eur: number | null
          policy_id: string | null
          rental_id: string | null
          reported_at: string | null
          settlement_reference: string | null
          source: string | null
          status: string | null
          vehicle_id: string | null
        }
        Insert: {
          assignee?: string | null
          claim_number?: string | null
          created_at?: string | null
          customer_id?: string | null
          deductible_eur?: number | null
          description?: string | null
          estimated_cost_eur?: number | null
          id?: string
          incident_date?: string | null
          incident_type?: string | null
          metadata?: Json | null
          organization_id: string
          payout_amount_eur?: number | null
          policy_id?: string | null
          rental_id?: string | null
          reported_at?: string | null
          settlement_reference?: string | null
          source?: string | null
          status?: string | null
          vehicle_id?: string | null
        }
        Update: {
          assignee?: string | null
          claim_number?: string | null
          created_at?: string | null
          customer_id?: string | null
          deductible_eur?: number | null
          description?: string | null
          estimated_cost_eur?: number | null
          id?: string
          incident_date?: string | null
          incident_type?: string | null
          metadata?: Json | null
          organization_id?: string
          payout_amount_eur?: number | null
          policy_id?: string | null
          rental_id?: string | null
          reported_at?: string | null
          settlement_reference?: string | null
          source?: string | null
          status?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claims_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "insurance_policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicle_policy_gap"
            referencedColumns: ["vehicle_id"]
          },
          {
            foreignKeyName: "claims_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          avatar_url: string | null
          average_rating: number | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          drivers_license_expiry: string | null
          drivers_license_number: string | null
          drivers_license_verified: boolean | null
          email: string
          first_name: string
          id: string
          is_verified: boolean | null
          last_name: string
          lifetime_spend_eur: number | null
          metadata: Json | null
          notes: string | null
          organization_id: string
          phone: string | null
          postal_code: string | null
          status: string | null
          total_cancellations: number | null
          total_trips: number | null
          updated_at: string | null
          verification_date: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          average_rating?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          drivers_license_expiry?: string | null
          drivers_license_number?: string | null
          drivers_license_verified?: boolean | null
          email: string
          first_name: string
          id?: string
          is_verified?: boolean | null
          last_name: string
          lifetime_spend_eur?: number | null
          metadata?: Json | null
          notes?: string | null
          organization_id: string
          phone?: string | null
          postal_code?: string | null
          status?: string | null
          total_cancellations?: number | null
          total_trips?: number | null
          updated_at?: string | null
          verification_date?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          average_rating?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          drivers_license_expiry?: string | null
          drivers_license_number?: string | null
          drivers_license_verified?: boolean | null
          email?: string
          first_name?: string
          id?: string
          is_verified?: boolean | null
          last_name?: string
          lifetime_spend_eur?: number | null
          metadata?: Json | null
          notes?: string | null
          organization_id?: string
          phone?: string | null
          postal_code?: string | null
          status?: string | null
          total_cancellations?: number | null
          total_trips?: number | null
          updated_at?: string | null
          verification_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_policies: {
        Row: {
          active: boolean | null
          coverage: Json | null
          created_at: string | null
          end_date: string
          id: string
          insurer_id: string | null
          metadata: Json | null
          organization_id: string
          policy_number: string
          policy_type_key: string | null
          premium_eur: number | null
          start_date: string
          vehicle_id: string | null
        }
        Insert: {
          active?: boolean | null
          coverage?: Json | null
          created_at?: string | null
          end_date: string
          id?: string
          insurer_id?: string | null
          metadata?: Json | null
          organization_id: string
          policy_number: string
          policy_type_key?: string | null
          premium_eur?: number | null
          start_date: string
          vehicle_id?: string | null
        }
        Update: {
          active?: boolean | null
          coverage?: Json | null
          created_at?: string | null
          end_date?: string
          id?: string
          insurer_id?: string | null
          metadata?: Json | null
          organization_id?: string
          policy_number?: string
          policy_type_key?: string | null
          premium_eur?: number | null
          start_date?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_policies_insurer_id_fkey"
            columns: ["insurer_id"]
            isOneToOne: false
            referencedRelation: "insurers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_policies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_policies_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicle_policy_gap"
            referencedColumns: ["vehicle_id"]
          },
          {
            foreignKeyName: "insurance_policies_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      insurers: {
        Row: {
          contact: Json | null
          created_at: string | null
          id: string
          metadata: Json | null
          name: string
          organization_id: string
        }
        Insert: {
          contact?: Json | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name: string
          organization_id: string
        }
        Update: {
          contact?: Json | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_task_notes: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          task_id: string
          visibility: Database["public"]["Enums"]["note_visibility"]
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          task_id: string
          visibility?: Database["public"]["Enums"]["note_visibility"]
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          task_id?: string
          visibility?: Database["public"]["Enums"]["note_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_task_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_task_notes_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "maintenance_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_tasks: {
        Row: {
          assignee: string
          created_at: string
          description: string
          due_date: string
          due_km: number
          id: string
          organization_id: string | null
          severity: Database["public"]["Enums"]["maintenance_severity"]
          status: Database["public"]["Enums"]["maintenance_status"]
          task: string
          updated_at: string
          vehicle_id: string | null
          vehicle_label: string | null
        }
        Insert: {
          assignee: string
          created_at?: string
          description: string
          due_date: string
          due_km: number
          id?: string
          organization_id?: string | null
          severity?: Database["public"]["Enums"]["maintenance_severity"]
          status?: Database["public"]["Enums"]["maintenance_status"]
          task: string
          updated_at?: string
          vehicle_id?: string | null
          vehicle_label?: string | null
        }
        Update: {
          assignee?: string
          created_at?: string
          description?: string
          due_date?: string
          due_km?: number
          id?: string
          organization_id?: string | null
          severity?: Database["public"]["Enums"]["maintenance_severity"]
          status?: Database["public"]["Enums"]["maintenance_status"]
          task?: string
          updated_at?: string
          vehicle_id?: string | null
          vehicle_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_tasks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_tasks_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicle_policy_gap"
            referencedColumns: ["vehicle_id"]
          },
          {
            foreignKeyName: "maintenance_tasks_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          settings: Json | null
          tax_register_number: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          settings?: Json | null
          tax_register_number: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          settings?: Json | null
          tax_register_number?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_eur: number
          created_at: string | null
          currency: string | null
          customer_id: string | null
          description: string | null
          failed_reason: string | null
          id: string
          metadata: Json | null
          method: Database["public"]["Enums"]["payment_method"]
          method_details: string | null
          net_amount_eur: number | null
          organization_id: string
          platform_fee_eur: number | null
          processed_at: string | null
          processor: string | null
          processor_fee_eur: number | null
          rental_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
          type: Database["public"]["Enums"]["payment_type"]
          updated_at: string | null
        }
        Insert: {
          amount_eur: number
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          description?: string | null
          failed_reason?: string | null
          id?: string
          metadata?: Json | null
          method?: Database["public"]["Enums"]["payment_method"]
          method_details?: string | null
          net_amount_eur?: number | null
          organization_id: string
          platform_fee_eur?: number | null
          processed_at?: string | null
          processor?: string | null
          processor_fee_eur?: number | null
          rental_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          type: Database["public"]["Enums"]["payment_type"]
          updated_at?: string | null
        }
        Update: {
          amount_eur?: number
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          description?: string | null
          failed_reason?: string | null
          id?: string
          metadata?: Json | null
          method?: Database["public"]["Enums"]["payment_method"]
          method_details?: string | null
          net_amount_eur?: number | null
          organization_id?: string
          platform_fee_eur?: number | null
          processed_at?: string | null
          processor?: string | null
          processor_fee_eur?: number | null
          rental_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          type?: Database["public"]["Enums"]["payment_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          amount_eur: number
          bank_account: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          method: Database["public"]["Enums"]["payment_method"]
          notes: string | null
          organization_id: string
          period_end: string
          period_start: string
          processed_date: string | null
          scheduled_date: string | null
          status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount_eur: number
          bank_account?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          method?: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          organization_id: string
          period_end: string
          period_start: string
          processed_date?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_eur?: number
          bank_account?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          method?: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          organization_id?: string
          period_end?: string
          period_start?: string
          processed_date?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          organization_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          organization_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          organization_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "policy_types_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      rentals: {
        Row: {
          created_at: string | null
          customer_id: string
          deposit_eur: number | null
          end_date: string
          extras_eur: number | null
          id: string
          insurance_eur: number | null
          metadata: Json | null
          notes: string | null
          odometer_end: number | null
          odometer_start: number | null
          organization_id: string
          pickup_city: string | null
          pickup_location: string
          price_eur: number
          return_city: string | null
          return_location: string
          start_date: string
          status: Database["public"]["Enums"]["rental_status"]
          total_price_eur: number | null
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          deposit_eur?: number | null
          end_date: string
          extras_eur?: number | null
          id?: string
          insurance_eur?: number | null
          metadata?: Json | null
          notes?: string | null
          odometer_end?: number | null
          odometer_start?: number | null
          organization_id: string
          pickup_city?: string | null
          pickup_location: string
          price_eur: number
          return_city?: string | null
          return_location: string
          start_date: string
          status?: Database["public"]["Enums"]["rental_status"]
          total_price_eur?: number | null
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          deposit_eur?: number | null
          end_date?: string
          extras_eur?: number | null
          id?: string
          insurance_eur?: number | null
          metadata?: Json | null
          notes?: string | null
          odometer_end?: number | null
          odometer_start?: number | null
          organization_id?: string
          pickup_city?: string | null
          pickup_location?: string
          price_eur?: number
          return_city?: string | null
          return_location?: string
          start_date?: string
          status?: Database["public"]["Enums"]["rental_status"]
          total_price_eur?: number | null
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rentals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicle_policy_gap"
            referencedColumns: ["vehicle_id"]
          },
          {
            foreignKeyName: "rentals_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          last_login_at: string | null
          last_name: string | null
          locale: string | null
          metadata: Json
          onboarding_status: string | null
          organization_id: string | null
          phone: string | null
          preferences: Json
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
          user_id: string | null
          verification_status: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          locale?: string | null
          metadata?: Json
          onboarding_status?: string | null
          organization_id?: string | null
          phone?: string | null
          preferences?: Json
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
          user_id?: string | null
          verification_status?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          locale?: string | null
          metadata?: Json
          onboarding_status?: string | null
          organization_id?: string | null
          phone?: string | null
          preferences?: Json
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
          user_id?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          base_daily_rate_eur: number | null
          created_at: string | null
          id: string
          lifetime_revenue_eur: number | null
          location: string | null
          make: string
          model: string
          odometer_km: number | null
          organization_id: string
          photo_url: string | null
          plate: string
          rating: number | null
          total_trips: number | null
          updated_at: string | null
          utilization_pct: number | null
          vehicle_class: string
          vin: string | null
          year: number
        }
        Insert: {
          base_daily_rate_eur?: number | null
          created_at?: string | null
          id?: string
          lifetime_revenue_eur?: number | null
          location?: string | null
          make: string
          model: string
          odometer_km?: number | null
          organization_id: string
          photo_url?: string | null
          plate: string
          rating?: number | null
          total_trips?: number | null
          updated_at?: string | null
          utilization_pct?: number | null
          vehicle_class: string
          vin?: string | null
          year: number
        }
        Update: {
          base_daily_rate_eur?: number | null
          created_at?: string | null
          id?: string
          lifetime_revenue_eur?: number | null
          location?: string | null
          make?: string
          model?: string
          odometer_km?: number | null
          organization_id?: string
          photo_url?: string | null
          plate?: string
          rating?: number | null
          total_trips?: number | null
          updated_at?: string | null
          utilization_pct?: number | null
          vehicle_class?: string
          vin?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      claim_incident_types: {
        Row: {
          avg_estimated_cost_eur: number | null
          incident_type: string | null
          occurrences: number | null
        }
        Relationships: []
      }
      claim_stats_customer: {
        Row: {
          claim_count: number | null
          customer_id: string | null
          total_estimated_cost_eur: number | null
          total_payout_eur: number | null
        }
        Relationships: [
          {
            foreignKeyName: "claims_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_stats_vehicle: {
        Row: {
          claim_count: number | null
          first_incident: string | null
          last_incident: string | null
          total_estimated_cost_eur: number | null
          total_payout_eur: number | null
          vehicle_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claims_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicle_policy_gap"
            referencedColumns: ["vehicle_id"]
          },
          {
            foreignKeyName: "claims_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_policy_gap: {
        Row: {
          organization_id: string | null
          plate: string | null
          vehicle_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
    }
    Enums: {
      maintenance_severity: "Low" | "Medium" | "High"
      maintenance_status: "Open" | "In Progress" | "Done"
      note_visibility: "Internal" | "Public"
      payment_method:
        | "card"
        | "bank_transfer"
        | "cash"
        | "platform_fee"
        | "other"
      payment_status: "pending" | "succeeded" | "failed" | "cancelled"
      payment_type: "charge" | "refund" | "payout" | "fee"
      rental_status: "upcoming" | "active" | "completed" | "cancelled"
      user_role:
        | "owner"
        | "fleet_admin"
        | "driver"
        | "renter"
        | "staff"
        | "support"
        | "superadmin"
        | "member"
      vehicle_status: "available" | "on_trip" | "maintenance" | "inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      maintenance_severity: ["Low", "Medium", "High"],
      maintenance_status: ["Open", "In Progress", "Done"],
      note_visibility: ["Internal", "Public"],
      payment_method: [
        "card",
        "bank_transfer",
        "cash",
        "platform_fee",
        "other",
      ],
      payment_status: ["pending", "succeeded", "failed", "cancelled"],
      payment_type: ["charge", "refund", "payout", "fee"],
      rental_status: ["upcoming", "active", "completed", "cancelled"],
      user_role: [
        "owner",
        "fleet_admin",
        "driver",
        "renter",
        "staff",
        "support",
        "superadmin",
        "member",
      ],
      vehicle_status: ["available", "on_trip", "maintenance", "inactive"],
    },
  },
} as const

