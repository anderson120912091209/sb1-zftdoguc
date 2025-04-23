export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          display_name: string
          email: string
          avatar_url: string | null
          bio: string | null
          background_text: string | null
          skill_level: Database['public']['Enums']['skill_levels']
          goal: Database['public']['Enums']['user_goals']
          is_public: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          display_name: string
          email: string
          avatar_url?: string | null
          bio?: string | null
          background_text?: string | null
          skill_level: Database['public']['Enums']['skill_levels']
          goal: Database['public']['Enums']['user_goals']
          is_public?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          display_name?: string
          email?: string
          avatar_url?: string | null
          bio?: string | null
          background_text?: string | null
          skill_level?: Database['public']['Enums']['skill_levels']
          goal?: Database['public']['Enums']['user_goals']
          is_public?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles_skills: {
        Row: {
          id: string
          profile_id: string
          skill_id: string
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          skill_id: string
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          skill_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_skills_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          }
        ]
      }
      skills: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      skill_levels: "beginner" | "intermediate" | "advanced"
      user_goals: "learn" | "teach" | "collaborate"
    }
  }
} 