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
      [_ in never]: never
    }
    Functions: {
      citext: {
        Args: { "": boolean } | { "": string } | { "": unknown }
        Returns: string
      }
      citext_hash: {
        Args: { "": string }
        Returns: number
      }
      citextin: {
        Args: { "": unknown }
        Returns: string
      }
      citextout: {
        Args: { "": string }
        Returns: unknown
      }
      citextrecv: {
        Args: { "": unknown }
        Returns: string
      }
      citextsend: {
        Args: { "": string }
        Returns: string
      }
      custom_access_token_hook: {
        Args: { event: Json }
        Returns: Json
      }
    }
    Enums: {
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

