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
          match_score: number | null
          post_id: string
          resume_url: string | null
          reviewed_at: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          answers?: Json | null
          applicant_id: string
          applied_at?: string
          applied_for_skill?: string | null
          cover_letter?: string | null
          id?: string
          match_score?: number | null
          post_id: string
          resume_url?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          answers?: Json | null
          applicant_id?: string
          applied_at?: string
          applied_for_skill?: string | null
          cover_letter?: string | null
          id?: string
          match_score?: number | null
          post_id?: string
          resume_url?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
          joined_at: string
          last_seen_at: string | null
          role: Database["public"]["Enums"]["chat_member_role"]
          user_id: string
        }
        Insert: {
          chatroom_id: string
          joined_at?: string
          last_seen_at?: string | null
          role?: Database["public"]["Enums"]["chat_member_role"]
          user_id: string
        }
        Update: {
          chatroom_id?: string
          joined_at?: string
          last_seen_at?: string | null
          role?: Database["public"]["Enums"]["chat_member_role"]
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
          {
            foreignKeyName: "chatroom_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          status: Database["public"]["Enums"]["chatroom_status"]
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          expires_at?: string | null
          id?: string
          last_activity?: string
          post_id: string
          status?: Database["public"]["Enums"]["chatroom_status"]
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          expires_at?: string | null
          id?: string
          last_activity?: string
          post_id?: string
          status?: Database["public"]["Enums"]["chatroom_status"]
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
      connection_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          receiver_id: string
          sender_id: string
          status: Database["public"]["Enums"]["connection_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          receiver_id: string
          sender_id: string
          status?: Database["public"]["Enums"]["connection_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          receiver_id?: string
          sender_id?: string
          status?: Database["public"]["Enums"]["connection_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connection_requests_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connection_requests_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          created_at: string
          id: string
          invitee_id: string
          inviter_id: string
          message: string | null
          post_id: string
          responded_at: string | null
          seen_at: string | null
          status: Database["public"]["Enums"]["invitation_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          invitee_id: string
          inviter_id: string
          message?: string | null
          post_id: string
          responded_at?: string | null
          seen_at?: string | null
          status?: Database["public"]["Enums"]["invitation_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          invitee_id?: string
          inviter_id?: string
          message?: string | null
          post_id?: string
          responded_at?: string | null
          seen_at?: string | null
          status?: Database["public"]["Enums"]["invitation_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_invitee_id_fkey"
            columns: ["invitee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
          type: Database["public"]["Enums"]["message_type"]
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
          type?: Database["public"]["Enums"]["message_type"]
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
          type?: Database["public"]["Enums"]["message_type"]
        }
        Relationships: [
          {
            foreignKeyName: "messages_chatroom_id_fkey"
            columns: ["chatroom_id"]
            isOneToOne: false
            referencedRelation: "chatrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
        Relationships: [
          {
            foreignKeyName: "notifications_related_post_id_fkey"
            columns: ["related_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          purpose: Database["public"]["Enums"]["post_purpose"]
          skill_requirements: Json | null
          status: Database["public"]["Enums"]["post_status"]
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
          purpose: Database["public"]["Enums"]["post_purpose"]
          skill_requirements?: Json | null
          status?: Database["public"]["Enums"]["post_status"]
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
          purpose?: Database["public"]["Enums"]["post_purpose"]
          skill_requirements?: Json | null
          status?: Database["public"]["Enums"]["post_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          gender: Database["public"]["Enums"]["gender_type"] | null
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
          role: Database["public"]["Enums"]["user_role"]
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
          gender?: Database["public"]["Enums"]["gender_type"] | null
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
          role: Database["public"]["Enums"]["user_role"]
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
          gender?: Database["public"]["Enums"]["gender_type"] | null
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
          role?: Database["public"]["Enums"]["user_role"]
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
      application_status:
        | "applied"
        | "shortlisted"
        | "accepted"
        | "rejected"
        | "withdrawn"
      chat_member_role: "owner" | "member"
      chatroom_status: "active" | "read_only" | "deleted"
      connection_status: "pending" | "accepted" | "ignored"
      gender_type: "Male" | "Female" | "Other" | "Prefer not to say"
      invitation_status: "pending" | "cancelled" | "accepted" | "declined"
      message_type: "text" | "file" | "system"
      post_purpose: "Research Work" | "Projects" | "Hackathons"
      post_status: "active" | "filled" | "closed" | "archived"
      user_role: "student" | "faculty"
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
      application_status: [
        "applied",
        "shortlisted",
        "accepted",
        "rejected",
        "withdrawn",
      ],
      chat_member_role: ["owner", "member"],
      chatroom_status: ["active", "read_only", "deleted"],
      connection_status: ["pending", "accepted", "ignored"],
      gender_type: ["Male", "Female", "Other", "Prefer not to say"],
      invitation_status: ["pending", "cancelled", "accepted", "declined"],
      message_type: ["text", "file", "system"],
      post_purpose: ["Research Work", "Projects", "Hackathons"],
      post_status: ["active", "filled", "closed", "archived"],
      user_role: ["student", "faculty"],
    },
  },
} as const
