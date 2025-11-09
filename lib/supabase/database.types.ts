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
  pgbouncer: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth: {
        Args: { p_usename: string }
        Returns: {
          password: string
          username: string
        }[]
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
            foreignKeyName: "customers_organization_id_fkey",
            columns: ["organization_id"],
            referencedRelation: "organizations",
            referencedColumns: ["id"],
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
            foreignKeyName: "maintenance_task_notes_created_by_fkey",
            columns: ["created_by"],
            referencedRelation: "user_profiles",
            referencedColumns: ["id"],
          },
          {
            foreignKeyName: "maintenance_task_notes_task_id_fkey",
            columns: ["task_id"],
            referencedRelation: "maintenance_tasks",
            referencedColumns: ["id"],
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
            foreignKeyName: "maintenance_tasks_organization_id_fkey",
            columns: ["organization_id"],
            referencedRelation: "organizations",
            referencedColumns: ["id"],
          },
          {
            foreignKeyName: "maintenance_tasks_vehicle_id_fkey",
            columns: ["vehicle_id"],
            referencedRelation: "vehicles",
            referencedColumns: ["id"],
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
          organization_id?: string | null
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
            foreignKeyName: "payments_customer_id_fkey",
            columns: ["customer_id"],
            referencedRelation: "customers",
            referencedColumns: ["id"],
          },
          {
            foreignKeyName: "payments_organization_id_fkey",
            columns: ["organization_id"],
            referencedRelation: "organizations",
            referencedColumns: ["id"],
          },
          {
            foreignKeyName: "payments_rental_id_fkey",
            columns: ["rental_id"],
            referencedRelation: "rentals",
            referencedColumns: ["id"],
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
            foreignKeyName: "payouts_organization_id_fkey",
            columns: ["organization_id"],
            referencedRelation: "organizations",
            referencedColumns: ["id"],
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
            foreignKeyName: "rentals_customer_id_fkey",
            columns: ["customer_id"],
            referencedRelation: "customers",
            referencedColumns: ["id"],
          },
          {
            foreignKeyName: "rentals_organization_id_fkey",
            columns: ["organization_id"],
            referencedRelation: "organizations",
            referencedColumns: ["id"],
          },
          {
            foreignKeyName: "rentals_vehicle_id_fkey",
            columns: ["vehicle_id"],
            referencedRelation: "vehicles",
            referencedColumns: ["id"],
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
            foreignKeyName: "user_profiles_organization_id_fkey",
            columns: ["organization_id"],
            referencedRelation: "organizations",
            referencedColumns: ["id"],
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
            foreignKeyName: "vehicles_organization_id_fkey",
            columns: ["organization_id"],
            referencedRelation: "organizations",
            referencedColumns: ["id"],
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          format: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          format?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          format?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      iceberg_namespaces: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_namespaces_bucket_id_fkey",
            columns: ["bucket_id"],
            referencedRelation: "buckets_analytics",
            referencedColumns: ["id"],
          },
        ]
      }
      iceberg_tables: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          location: string
          name: string
          namespace_id: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id?: string
          location: string
          name: string
          namespace_id: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          location?: string
          name?: string
          namespace_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_tables_bucket_id_fkey",
            columns: ["bucket_id"],
            referencedRelation: "buckets_analytics",
            referencedColumns: ["id"],
          },
          {
            foreignKeyName: "iceberg_tables_namespace_id_fkey",
            columns: ["namespace_id"],
            referencedRelation: "iceberg_namespaces",
            referencedColumns: ["id"],
          },
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          level: number | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey",
            columns: ["bucket_id"],
            referencedRelation: "buckets",
            referencedColumns: ["id"],
          },
        ]
      }
      prefixes: {
        Row: {
          bucket_id: string
          created_at: string | null
          level: number
          name: string
          updated_at: string | null
        }
        Insert: {
          bucket_id: string
          created_at?: string | null
          level?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string
          created_at?: string | null
          level?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prefixes_bucketId_fkey",
            columns: ["bucket_id"],
            referencedRelation: "buckets",
            referencedColumns: ["id"],
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey",
            columns: ["bucket_id"],
            referencedRelation: "buckets",
            referencedColumns: ["id"],
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey",
            columns: ["bucket_id"],
            referencedRelation: "buckets",
            referencedColumns: ["id"],
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey",
            columns: ["upload_id"],
            referencedRelation: "s3_multipart_uploads",
            referencedColumns: ["id"],
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_prefixes: {
        Args: { _bucket_id: string; _name: string }
        Returns: undefined
      }
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      delete_leaf_prefixes: {
        Args: { bucket_ids: string[]; names: string[] }
        Returns: undefined
      }
      delete_prefix: {
        Args: { _bucket_id: string; _name: string }
        Returns: boolean
      }
      extension: { Args: { name: string }; Returns: string }
      filename: { Args: { name: string }; Returns: string }
      foldername: { Args: { name: string }; Returns: string[] }
      get_level: { Args: { name: string }; Returns: number }
      get_prefix: { Args: { name: string }; Returns: string }
      get_prefixes: { Args: { name: string }; Returns: string[] }
      get_size_by_bucket: {
        Args: never
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          start_after?: string
        }
        Returns: {
          id: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      lock_top_prefixes: {
        Args: { bucket_ids: string[]; names: string[] }
        Returns: undefined
      }
      operation: { Args: never; Returns: string }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_legacy_v1: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v1_optimised: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          sort_column?: string
          sort_column_after?: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS"
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
  pgbouncer: {
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
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS"],
    },
  },
} as const

