export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: { extensions?: Json; operationName?: string; query?: string; variables?: Json };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      accounts: {
        Row: {
          archived: boolean;
          currency: string;
          id: string;
          name: string;
          opening_at: string;
          opening_balance: number;
          sort: number;
          type: Database["public"]["Enums"]["account_type"];
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          archived?: boolean;
          currency?: string;
          id?: string;
          name: string;
          opening_at?: string;
          opening_balance?: number;
          sort?: number;
          type: Database["public"]["Enums"]["account_type"];
          user_id?: string;
        };
        Update: {
          archived?: boolean;
          currency?: string;
          id?: string;
          name?: string;
          opening_at?: string;
          opening_balance?: number;
          sort?: number;
          type?: Database["public"]["Enums"]["account_type"];
          user_id?: string;
        };
        Relationships: [];
      };
      budgets: {
        Row: {
          amount: number;
          category_id: string;
          id: string;
          month: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          amount: number;
          category_id: string;
          id?: string;
          month: string;
          user_id?: string;
        };
        Update: {
          amount?: number;
          category_id?: string;
          id?: string;
          month?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "budgets_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          color_token: Database["public"]["Enums"]["color_token"];
          id: string;
          kind: Database["public"]["Enums"]["category_kind"];
          name: string;
          sort: number;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          color_token?: Database["public"]["Enums"]["color_token"];
          id?: string;
          kind: Database["public"]["Enums"]["category_kind"];
          name: string;
          sort?: number;
          user_id?: string;
        };
        Update: {
          color_token?: Database["public"]["Enums"]["color_token"];
          id?: string;
          kind?: Database["public"]["Enums"]["category_kind"];
          name?: string;
          sort?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      expected: {
        Row: {
          account_id: string | null;
          active: boolean;
          amount: number;
          category_id: string | null;
          due_at: string;
          id: string;
          name: string;
          plan_item_id: string | null;
          repeat: Database["public"]["Enums"]["repeat_kind"];
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          account_id?: string | null;
          active?: boolean;
          amount: number;
          category_id?: string | null;
          due_at: string;
          id?: string;
          name: string;
          plan_item_id?: string | null;
          repeat?: Database["public"]["Enums"]["repeat_kind"];
          user_id?: string;
        };
        Update: {
          account_id?: string | null;
          active?: boolean;
          amount?: number;
          category_id?: string | null;
          due_at?: string;
          id?: string;
          name?: string;
          plan_item_id?: string | null;
          repeat?: Database["public"]["Enums"]["repeat_kind"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "expected_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "account_balances";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expected_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expected_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expected_plan_item_id_fkey";
            columns: ["plan_item_id"];
            isOneToOne: false;
            referencedRelation: "plan_items";
            referencedColumns: ["id"];
          },
        ];
      };
      plan_items: {
        Row: {
          id: string;
          name: string;
          note: string;
          plan_id: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          id?: string;
          name: string;
          note?: string;
          plan_id: string;
          user_id?: string;
        };
        Update: {
          id?: string;
          name?: string;
          note?: string;
          plan_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "plan_items_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          },
        ];
      };
      plans: {
        Row: {
          id: string;
          name: string;
          sort: number;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          id?: string;
          name: string;
          sort?: number;
          user_id?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sort?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          account_id: string;
          amount: number;
          category_id: string | null;
          created_at: string;
          id: string;
          memo: string;
          occurred_at: string;
          payee: string;
          source: Database["public"]["Enums"]["transaction_source"];
          transfer_group: string | null;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          account_id: string;
          amount: number;
          category_id?: string | null;
          created_at?: string;
          id?: string;
          memo?: string;
          occurred_at: string;
          payee?: string;
          source?: Database["public"]["Enums"]["transaction_source"];
          transfer_group?: string | null;
          user_id?: string;
        };
        Update: {
          account_id?: string;
          amount?: number;
          category_id?: string | null;
          created_at?: string;
          id?: string;
          memo?: string;
          occurred_at?: string;
          payee?: string;
          source?: Database["public"]["Enums"]["transaction_source"];
          transfer_group?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "account_balances";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      account_balances: {
        Row: {
          archived: boolean;
          balance: number | null;
          currency: string;
          id: string;
          name: string;
          sort: number;
          type: Database["public"]["Enums"]["account_type"];
          user_id: string;
        };
        ComputedFields: never;
        Relationships: [];
      };
      monthly_spend: {
        Row: {
          category_id: string | null;
          month: string | null;
          spend: number | null;
          user_id: string;
        };
        ComputedFields: never;
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      runway_days: {
        Row: {
          cash: number | null;
          daily_outflow: number | null;
          days: number | null;
          days_of_data: number | null;
          user_id: string;
        };
        ComputedFields: never;
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      account_type: "checking" | "savings" | "credit" | "cash" | "other";
      category_kind: "spend" | "income";
      color_token: "acc" | "ok" | "warn" | "bad";
      repeat_kind: "none" | "monthly" | "yearly";
      transaction_source: "manual" | "import";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      account_type: ["checking", "savings", "credit", "cash", "other"],
      category_kind: ["spend", "income"],
      color_token: ["acc", "ok", "warn", "bad"],
      repeat_kind: ["none", "monthly", "yearly"],
      transaction_source: ["manual", "import"],
    },
  },
} as const;
