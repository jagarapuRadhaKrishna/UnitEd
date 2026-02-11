export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          answers: Json | null
          applicant_id: string
          applied_at: string
          applied_for_skill: string | null
          cover_letter: string | null
          id: string
          is_recommended: boolean | null
          match_score: number | null
          post_id: string
          resume: string | null
          reviewed_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          answers?: Json | null
          applicant_id: string
          applied_at?: string
          applied_for_skill?: string | null
          cover_letter?: string | null
          id?: string
          is_recommended?: boolean | null
          match_score?: number | null
          post_id: string
          resume?: string | null
          reviewed_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          answers?: Json | null
          applicant_id?: string
          applied_at?: string
          applied_for_skill?: string | null
          cover_letter?: string | null
          id?: string
          is_recommended?: boolean | null
          match_score?: number | null
          post_id?: string
          resume?: string | null
          reviewed_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      chatroom_members: {
        Row: {
          chatroom_id: string
          id: string
          joined_at: string
          last_seen_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          chatroom_id: string
          id?: string
          joined_at?: string
          last_seen_at?: string | null
          role?: string
          user_id: string
        }
        Update: {
          chatroom_id?: string
          id?: string
          joined_at?: string
          last_seen_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatroom_members_chatroom_id_fkey"
            columns: ["chatroom_id"]
            isOneToOne: false
            referencedRelation: "chatrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chatrooms: {
        Row: {
          created_at: string
          deleted_at: string | null
          expires_at: string | null
          id: string
          last_activity: string
          post_id: string
          status: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          expires_at?: string | null
          id?: string
          last_activity?: string
          post_id: string
          status?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          expires_at?: string | null
          id?: string
          last_activity?: string
          post_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatrooms_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          parent_reply_id: string | null
          thread_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          parent_reply_id?: string | null
          thread_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          parent_reply_id?: string | null
          thread_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id: string
          category?: string
          content: string
          created_at?: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      invitations: {
        Row: {
          created_at: string
          id: string
          invitee_id: string
          inviter_id: string
          post_id: string
          responded_at: string | null
          seen_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          invitee_id: string
          inviter_id: string
          post_id: string
          responded_at?: string | null
          seen_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          invitee_id?: string
          inviter_id?: string
          post_id?: string
          responded_at?: string | null
          seen_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chatroom_id: string
          content: string
          created_at: string
          file_name: string | null
          file_url: string | null
          id: string
          read_by: string[] | null
          sender_id: string
          type: string
        }
        Insert: {
          chatroom_id: string
          content: string
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          read_by?: string[] | null
          sender_id: string
          type?: string
        }
        Update: {
          chatroom_id?: string
          content?: string
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          read_by?: string[] | null
          sender_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chatroom_id_fkey"
            columns: ["chatroom_id"]
            isOneToOne: false
            referencedRelation: "chatrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          related_chatroom_id: string | null
          related_post_id: string | null
          related_user_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          related_chatroom_id?: string | null
          related_post_id?: string | null
          related_user_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          related_chatroom_id?: string | null
          related_post_id?: string | null
          related_user_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string
          chat_grace_days: number | null
          chatroom_enabled: boolean
          chatroom_id: string | null
          created_at: string
          current_members: number
          deadline: string | null
          description: string
          expires_at: string | null
          id: string
          max_members: number | null
          purpose: string
          skill_requirements: Json
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          chat_grace_days?: number | null
          chatroom_enabled?: boolean
          chatroom_id?: string | null
          created_at?: string
          current_members?: number
          deadline?: string | null
          description: string
          expires_at?: string | null
          id?: string
          max_members?: number | null
          purpose: string
          skill_requirements?: Json
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          chat_grace_days?: number | null
          chatroom_enabled?: boolean
          chatroom_id?: string | null
          created_at?: string
          current_members?: number
          deadline?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          max_members?: number | null
          purpose?: string
          skill_requirements?: Json
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          achievements: Json | null
          bio: string | null
          cgpa: string | null
          contact_no: string | null
          cover_letter: string | null
          created_at: string
          date_of_joining: string | null
          department: string | null
          designation: string | null
          email: string | null
          employee_id: string | null
          experience: string | null
          first_name: string | null
          gender: string | null
          github: string | null
          id: string
          industry_experience: number | null
          last_name: string | null
          leetcode: string | null
          linkedin: string | null
          location: string | null
          middle_name: string | null
          portfolio: string | null
          profile_picture_url: string | null
          projects: Json | null
          qualification: string | null
          resume_url: string | null
          role: string
          roll_number: string | null
          skills: string[] | null
          specialization: string[] | null
          teaching_experience: number | null
          total_experience: number | null
          updated_at: string
          year_of_graduation: number | null
        }
        Insert: {
          achievements?: Json | null
          bio?: string | null
          cgpa?: string | null
          contact_no?: string | null
          cover_letter?: string | null
          created_at?: string
          date_of_joining?: string | null
          department?: string | null
          designation?: string | null
          email?: string | null
          employee_id?: string | null
          experience?: string | null
          first_name?: string | null
          gender?: string | null
          github?: string | null
          id: string
          industry_experience?: number | null
          last_name?: string | null
          leetcode?: string | null
          linkedin?: string | null
          location?: string | null
          middle_name?: string | null
          portfolio?: string | null
          profile_picture_url?: string | null
          projects?: Json | null
          qualification?: string | null
          resume_url?: string | null
          role?: string
          roll_number?: string | null
          skills?: string[] | null
          specialization?: string[] | null
          teaching_experience?: number | null
          total_experience?: number | null
          updated_at?: string
          year_of_graduation?: number | null
        }
        Update: {
          achievements?: Json | null
          bio?: string | null
          cgpa?: string | null
          contact_no?: string | null
          cover_letter?: string | null
          created_at?: string
          date_of_joining?: string | null
          department?: string | null
          designation?: string | null
          email?: string | null
          employee_id?: string | null
          experience?: string | null
          first_name?: string | null
          gender?: string | null
          github?: string | null
          id?: string
          industry_experience?: number | null
          last_name?: string | null
          leetcode?: string | null
          linkedin?: string | null
          location?: string | null
          middle_name?: string | null
          portfolio?: string | null
          profile_picture_url?: string | null
          projects?: Json | null
          qualification?: string | null
          resume_url?: string | null
          role?: string
          roll_number?: string | null
          skills?: string[] | null
          specialization?: string[] | null
          teaching_experience?: number | null
          total_experience?: number | null
          updated_at?: string
          year_of_graduation?: number | null
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
