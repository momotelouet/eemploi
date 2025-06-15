export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          applied_at: string
          candidate_id: string
          certificate_url: string | null
          cover_letter: string | null
          cover_letter_url: string | null
          cv_profile_id: string | null
          cv_url: string | null
          id: string
          job_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          applied_at?: string
          candidate_id: string
          certificate_url?: string | null
          cover_letter?: string | null
          cover_letter_url?: string | null
          cv_profile_id?: string | null
          cv_url?: string | null
          id?: string
          job_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          applied_at?: string
          candidate_id?: string
          certificate_url?: string | null
          cover_letter?: string | null
          cover_letter_url?: string | null
          cv_profile_id?: string | null
          cv_url?: string | null
          id?: string
          job_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_cv_profile_id_fkey"
            columns: ["cv_profile_id"]
            isOneToOne: false
            referencedRelation: "cv_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_questions: {
        Row: {
          category: string
          created_at: string
          id: string
          options: Json | null
          question_text: string
          question_type: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          options?: Json | null
          question_text: string
          question_type?: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          options?: Json | null
          question_text?: string
          question_type?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      assessment_responses: {
        Row: {
          assessment_id: string
          created_at: string
          id: string
          question_id: string
          response_value: Json
          score: number | null
        }
        Insert: {
          assessment_id: string
          created_at?: string
          id?: string
          question_id: string
          response_value: Json
          score?: number | null
        }
        Update: {
          assessment_id?: string
          created_at?: string
          id?: string
          question_id?: string
          response_value?: Json
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_responses_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "candidate_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "assessment_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_assessments: {
        Row: {
          assessment_type: string
          certificate_url: string | null
          completed_at: string | null
          created_at: string
          id: string
          personality_score: Json | null
          qualities_score: Json | null
          skills_score: Json | null
          started_at: string
          status: string
          total_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_type?: string
          certificate_url?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          personality_score?: Json | null
          qualities_score?: Json | null
          skills_score?: Json | null
          started_at?: string
          status?: string
          total_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_type?: string
          certificate_url?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          personality_score?: Json | null
          qualities_score?: Json | null
          skills_score?: Json | null
          started_at?: string
          status?: string
          total_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      candidate_profiles: {
        Row: {
          address: string | null
          bio: string | null
          certificate_url: string | null
          city: string | null
          country: string | null
          created_at: string
          cv_file_name: string | null
          cv_file_url: string | null
          education: string | null
          experience_years: number | null
          id: string
          languages: string[] | null
          linkedin_url: string | null
          phone: string | null
          portfolio_url: string | null
          professional_summary: string | null
          profile_picture_url: string | null
          skills: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          bio?: string | null
          certificate_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          cv_file_name?: string | null
          cv_file_url?: string | null
          education?: string | null
          experience_years?: number | null
          id?: string
          languages?: string[] | null
          linkedin_url?: string | null
          phone?: string | null
          portfolio_url?: string | null
          professional_summary?: string | null
          profile_picture_url?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          bio?: string | null
          certificate_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          cv_file_name?: string | null
          cv_file_url?: string | null
          education?: string | null
          experience_years?: number | null
          id?: string
          languages?: string[] | null
          linkedin_url?: string | null
          phone?: string | null
          portfolio_url?: string | null
          professional_summary?: string | null
          profile_picture_url?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          industry: string | null
          location: string | null
          logo_url: string | null
          name: string
          size: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name: string
          size?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name?: string
          size?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      cv_profiles: {
        Row: {
          created_at: string
          education: Json
          experience: Json
          id: string
          personal_info: Json
          skills: Json
          template_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          education?: Json
          experience?: Json
          id?: string
          personal_info?: Json
          skills?: Json
          template_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          education?: Json
          experience?: Json
          id?: string
          personal_info?: Json
          skills?: Json
          template_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_alerts: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          job_type: string | null
          keywords: string | null
          location: string | null
          salary_min: number | null
          title: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          job_type?: string | null
          keywords?: string | null
          location?: string | null
          salary_min?: number | null
          title: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          job_type?: string | null
          keywords?: string | null
          location?: string | null
          salary_min?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          company_id: string
          created_at: string
          description: string
          experience_level: string | null
          expires_at: string | null
          id: string
          job_type: string | null
          location: string | null
          paid: boolean
          posted_by: string
          price: number
          requirements: string | null
          salary_max: number | null
          salary_min: number | null
          status: string | null
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          company_id: string
          created_at?: string
          description: string
          experience_level?: string | null
          expires_at?: string | null
          id?: string
          job_type?: string | null
          location?: string | null
          paid?: boolean
          posted_by: string
          price?: number
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string | null
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string
          experience_level?: string | null
          expires_at?: string | null
          id?: string
          job_type?: string | null
          location?: string | null
          paid?: boolean
          posted_by?: string
          price?: number
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string | null
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          method: string | null
          recruiter_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          method?: string | null
          recruiter_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          method?: string | null
          recruiter_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
      }
      recruiter_profiles: {
        Row: {
          company_logo_url: string | null
          company_name: string | null
          company_website: string | null
          created_at: string
          id: string
          status: string
          unpaid_balance: number
          updated_at: string
          user_id: string
        }
        Insert: {
          company_logo_url?: string | null
          company_name?: string | null
          company_website?: string | null
          created_at?: string
          id?: string
          status?: string
          unpaid_balance?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          company_logo_url?: string | null
          company_name?: string | null
          company_website?: string | null
          created_at?: string
          id?: string
          status?: string
          unpaid_balance?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recruiter_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          created_at: string
          id: string
          points: number | null
          total_earned: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points?: number | null
          total_earned?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points?: number | null
          total_earned?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_points: {
        Args: { user_id: string; points_amount: number; reason?: string }
        Returns: undefined
      }
      handle_new_job_posting: {
        Args: { recruiter_user_id: string; job_price: number }
        Returns: undefined
      }
      increment_job_views: {
        Args: { job_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
