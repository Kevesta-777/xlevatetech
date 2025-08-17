export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_log_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_security_events: {
        Row: {
          admin_user_id: string | null
          created_at: string
          description: string
          event_type: string
          id: string
          ip_address: unknown | null
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          user_agent: string | null
        }
        Insert: {
          admin_user_id?: string | null
          created_at?: string
          description: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          user_agent?: string | null
        }
        Update: {
          admin_user_id?: string | null
          created_at?: string
          description?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_security_events_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_security_events_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_sessions: {
        Row: {
          admin_user_id: string
          created_at: string
          expires_at: string
          id: string
          ip_address: unknown | null
          last_activity: string
          session_token: string
          user_agent: string | null
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          last_activity?: string
          session_token: string
          user_agent?: string | null
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          last_activity?: string
          session_token?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          failed_login_attempts: number
          id: string
          ip_whitelist: string[] | null
          is_active: boolean
          last_login: string | null
          locked_until: string | null
          metadata: Json | null
          mfa_enabled: boolean
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          failed_login_attempts?: number
          id?: string
          ip_whitelist?: string[] | null
          is_active?: boolean
          last_login?: string | null
          locked_until?: string | null
          metadata?: Json | null
          mfa_enabled?: boolean
          role: string
        }
        Update: {
          created_at?: string
          email?: string
          failed_login_attempts?: number
          id?: string
          ip_whitelist?: string[] | null
          is_active?: boolean
          last_login?: string | null
          locked_until?: string | null
          metadata?: Json | null
          mfa_enabled?: boolean
          role?: string
        }
        Relationships: []
      }
      automation_workflows: {
        Row: {
          configuration: Json | null
          created_at: string
          description: string | null
          error_count: number | null
          frequency_hours: number
          id: string
          last_run: string | null
          name: string
          next_run: string | null
          status: string
          success_count: number | null
          updated_at: string
          workflow_type: string
        }
        Insert: {
          configuration?: Json | null
          created_at?: string
          description?: string | null
          error_count?: number | null
          frequency_hours?: number
          id?: string
          last_run?: string | null
          name: string
          next_run?: string | null
          status?: string
          success_count?: number | null
          updated_at?: string
          workflow_type: string
        }
        Update: {
          configuration?: Json | null
          created_at?: string
          description?: string | null
          error_count?: number | null
          frequency_hours?: number
          id?: string
          last_run?: string | null
          name?: string
          next_run?: string | null
          status?: string
          success_count?: number | null
          updated_at?: string
          workflow_type?: string
        }
        Relationships: []
      }
      blog_performance_metrics: {
        Row: {
          date_bucket: string
          id: string
          metadata: Json | null
          metric_name: string
          metric_type: string
          recorded_at: string
          value: number
        }
        Insert: {
          date_bucket?: string
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_type: string
          recorded_at?: string
          value: number
        }
        Update: {
          date_bucket?: string
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_type?: string
          recorded_at?: string
          value?: number
        }
        Relationships: []
      }
      chat_cache: {
        Row: {
          hit_count: number | null
          last_updated: string
          question_hash: string
          response: string
        }
        Insert: {
          hit_count?: number | null
          last_updated?: string
          question_hash: string
          response: string
        }
        Update: {
          hit_count?: number | null
          last_updated?: string
          question_hash?: string
          response?: string
        }
        Relationships: []
      }
      chat_logs: {
        Row: {
          consent_given: boolean | null
          created_at: string | null
          id: string
          industry: string | null
          name: string | null
          needs: string | null
          session_id: string
          transcript: Json | null
          updated_at: string | null
        }
        Insert: {
          consent_given?: boolean | null
          created_at?: string | null
          id?: string
          industry?: string | null
          name?: string | null
          needs?: string | null
          session_id: string
          transcript?: Json | null
          updated_at?: string | null
        }
        Update: {
          consent_given?: boolean | null
          created_at?: string | null
          id?: string
          industry?: string | null
          name?: string | null
          needs?: string | null
          session_id?: string
          transcript?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      conversation_analytics: {
        Row: {
          created_at: string | null
          escalated: boolean | null
          escalation_reason: string | null
          id: string
          question_type: string
          response_time_ms: number | null
          session_id: string
          tokens_used: number | null
          user_satisfaction: number | null
        }
        Insert: {
          created_at?: string | null
          escalated?: boolean | null
          escalation_reason?: string | null
          id?: string
          question_type: string
          response_time_ms?: number | null
          session_id: string
          tokens_used?: number | null
          user_satisfaction?: number | null
        }
        Update: {
          created_at?: string | null
          escalated?: boolean | null
          escalation_reason?: string | null
          id?: string
          question_type?: string
          response_time_ms?: number | null
          session_id?: string
          tokens_used?: number | null
          user_satisfaction?: number | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          session_id: string
          topic: string | null
          topic_tags: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          session_id?: string
          topic?: string | null
          topic_tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          session_id?: string
          topic?: string | null
          topic_tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      escalation_logs: {
        Row: {
          escalation_reason: string
          id: string
          question: string
          session_id: string
          status: string | null
          timestamp: string
          user_message: string
        }
        Insert: {
          escalation_reason: string
          id?: string
          question: string
          session_id: string
          status?: string | null
          timestamp?: string
          user_message: string
        }
        Update: {
          escalation_reason?: string
          id?: string
          question?: string
          session_id?: string
          status?: string | null
          timestamp?: string
          user_message?: string
        }
        Relationships: []
      }
      knowledge_base: {
        Row: {
          answer: string
          category: string
          created_at: string
          id: string
          question: string
        }
        Insert: {
          answer: string
          category: string
          created_at?: string
          id?: string
          question: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          question?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          extracted_entities: Json | null
          id: string
          message_type: string | null
          role: string
          session_id: string
          timestamp: string
        }
        Insert: {
          content: string
          extracted_entities?: Json | null
          id?: string
          message_type?: string | null
          role: string
          session_id: string
          timestamp?: string
        }
        Update: {
          content?: string
          extracted_entities?: Json | null
          id?: string
          message_type?: string | null
          role?: string
          session_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["session_id"]
          },
        ]
      }
      newsletter: {
        Row: {
          created_at: string
          email: string
          id: string
          industry: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          industry: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          industry?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author: string
          category: string
          created_at: string
          excerpt: string
          id: string
          is_featured: boolean
          published_date: string
          slug: string
          source_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          category: string
          created_at?: string
          excerpt: string
          id?: string
          is_featured?: boolean
          published_date?: string
          slug: string
          source_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          created_at?: string
          excerpt?: string
          id?: string
          is_featured?: boolean
          published_date?: string
          slug?: string
          source_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          created_at: string
          description: string
          download_count: number
          id: string
          pdf_url: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          download_count?: number
          id?: string
          pdf_url: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          download_count?: number
          id?: string
          pdf_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      rss_content_cache: {
        Row: {
          cached_at: string
          category: string | null
          description: string | null
          expires_at: string
          feed_id: string | null
          id: string
          is_featured: boolean | null
          link: string | null
          pub_date: string | null
          title: string
        }
        Insert: {
          cached_at?: string
          category?: string | null
          description?: string | null
          expires_at?: string
          feed_id?: string | null
          id?: string
          is_featured?: boolean | null
          link?: string | null
          pub_date?: string | null
          title: string
        }
        Update: {
          cached_at?: string
          category?: string | null
          description?: string | null
          expires_at?: string
          feed_id?: string | null
          id?: string
          is_featured?: boolean | null
          link?: string | null
          pub_date?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "rss_content_cache_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "rss_feeds"
            referencedColumns: ["id"]
          },
        ]
      }
      rss_feed_health: {
        Row: {
          error_message: string | null
          feed_id: string | null
          id: string
          last_checked: string
          response_time_ms: number | null
          status: string
          total_items: number | null
          uptime_percentage: number | null
          valid_items: number | null
        }
        Insert: {
          error_message?: string | null
          feed_id?: string | null
          id?: string
          last_checked?: string
          response_time_ms?: number | null
          status: string
          total_items?: number | null
          uptime_percentage?: number | null
          valid_items?: number | null
        }
        Update: {
          error_message?: string | null
          feed_id?: string | null
          id?: string
          last_checked?: string
          response_time_ms?: number | null
          status?: string
          total_items?: number | null
          uptime_percentage?: number | null
          valid_items?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rss_feed_health_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "rss_feeds"
            referencedColumns: ["id"]
          },
        ]
      }
      rss_feeds: {
        Row: {
          category: string
          created_at: string
          credibility_score: number | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
          url: string
        }
        Insert: {
          category: string
          created_at?: string
          credibility_score?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          credibility_score?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      user_engagement_analytics: {
        Row: {
          action_type: string
          created_at: string
          duration_seconds: number | null
          element_id: string | null
          id: string
          metadata: Json | null
          page_path: string
          session_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          duration_seconds?: number | null
          element_id?: string | null
          id?: string
          metadata?: Json | null
          page_path: string
          session_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          duration_seconds?: number | null
          element_id?: string | null
          id?: string
          metadata?: Json | null
          page_path?: string
          session_id?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          created_at: string
          first_name: string | null
          last_name: string | null
          email: string | null
          phone: string | null
          company_name: string | null
          industry_sector: string | null
          location: string | null
          company_size: string | null
          website_url: string | null
          role_title: string | null
          social_links: string | null
          pain_points: string | null
          budget_timeline: string | null
          notes: string | null
          score: number | null
          stage: 'captured' | 'qualified' | 'disqualified' | 'contacted' | 'meeting_booked'
          source: 'form' | 'chatbot' | 'linkedin' | 'email'
          campaign_id: string | null
          last_contacted_at: string | null
          calendly_link: string | null
          opt_out: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          company_name?: string | null
          industry_sector?: string | null
          location?: string | null
          company_size?: string | null
          website_url?: string | null
          role_title?: string | null
          social_links?: string | null
          pain_points?: string | null
          budget_timeline?: string | null
          notes?: string | null
          score?: number | null
          stage?: 'captured' | 'qualified' | 'disqualified' | 'contacted' | 'meeting_booked'
          source: 'form' | 'chatbot' | 'linkedin' | 'email'
          campaign_id?: string | null
          last_contacted_at?: string | null
          calendly_link?: string | null
          opt_out?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          company_name?: string | null
          industry_sector?: string | null
          location?: string | null
          company_size?: string | null
          website_url?: string | null
          role_title?: string | null
          social_links?: string | null
          pain_points?: string | null
          budget_timeline?: string | null
          notes?: string | null
          score?: number | null
          stage?: 'captured' | 'qualified' | 'disqualified' | 'contacted' | 'meeting_booked'
          source?: 'form' | 'chatbot' | 'linkedin' | 'email'
          campaign_id?: string | null
          last_contacted_at?: string | null
          calendly_link?: string | null
          opt_out?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_admin_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_admin_user: {
        Args: { user_email: string }
        Returns: {
          id: string
          email: string
          role: string
          last_login: string
          mfa_enabled: boolean
        }[]
      }
      get_current_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          role: string
          is_active: boolean
        }[]
      }
      is_current_user_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_admin_action: {
        Args: {
          p_action: string
          p_resource_type?: string
          p_resource_id?: string
          p_details?: Json
        }
        Returns: undefined
      }
      test_connection: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      lead_stage: 'captured' | 'qualified' | 'disqualified' | 'contacted' | 'meeting_booked'
      lead_source: 'form' | 'chatbot' | 'linkedin' | 'email'
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
  public: {
    Enums: {
      lead_stage: {
        captured: 'captured',
        qualified: 'qualified',
        disqualified: 'disqualified',
        contacted: 'contacted',
        meeting_booked: 'meeting_booked'
      },
      lead_source: {
        form: 'form',
        chatbot: 'chatbot',
        linkedin: 'linkedin',
        email: 'email'
      }
    },
  },
} as const
