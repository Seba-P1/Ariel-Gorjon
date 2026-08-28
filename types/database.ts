export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'superadmin' | 'client' | 'moderator';
export type EventStatus = 'draft' | 'active' | 'archived';
export type EventType =
  | 'boda'
  | 'cumple15'
  | 'cumpleanos'
  | 'bautismo'
  | 'comunion'
  | 'corporativo'
  | 'otro';
export type PhotoStatus = 'pending' | 'approved' | 'rejected';
export type RsvpStatus = 'pending' | 'confirmed' | 'declined';
export type TemplateFamily =
  | 'elegante-clasica'
  | 'moderna-minimal'
  | 'floral-romantica'
  | 'glamour-dorada'
  | 'neon-fiesta'
  | 'rustica-boho';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: UserRole;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          full_name: string;
          email: string | null;
          phone: string | null;
          notes: string | null;
          profile_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email?: string | null;
          phone?: string | null;
          notes?: string | null;
          profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string | null;
          phone?: string | null;
          notes?: string | null;
          profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      templates: {
        Row: {
          id: string;
          slug: string;
          name: string;
          family: TemplateFamily;
          variant: string;
          description: string | null;
          preview_url: string | null;
          default_theme: Json;
          default_sections: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          family: TemplateFamily;
          variant: string;
          description?: string | null;
          preview_url?: string | null;
          default_theme?: Json;
          default_sections?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          family?: TemplateFamily;
          variant?: string;
          description?: string | null;
          preview_url?: string | null;
          default_theme?: Json;
          default_sections?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          client_id: string | null;
          slug: string;
          title: string;
          event_type: EventType;
          event_date: string | null;
          location_name: string | null;
          location_address: string | null;
          location_lat: number | null;
          location_lng: number | null;
          cover_image_url: string | null;
          status: EventStatus;
          template_id: string | null;
          theme_config: Json;
          sections_config: Json;
          music_url: string | null;
          hashtag: string | null;
          instagram_handle: string | null;
          album_enabled: boolean;
          album_manual_approval: boolean;
          album_slide_duration_ms: number;
          album_transition: string;
          album_show_captions: boolean;
          album_watermark_url: string | null;
          album_retention_days: number;
          screen_token: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id?: string | null;
          slug?: string;
          title: string;
          event_type?: EventType;
          event_date?: string | null;
          location_name?: string | null;
          location_address?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          cover_image_url?: string | null;
          status?: EventStatus;
          template_id?: string | null;
          theme_config?: Json;
          sections_config?: Json;
          music_url?: string | null;
          hashtag?: string | null;
          instagram_handle?: string | null;
          album_enabled?: boolean;
          album_manual_approval?: boolean;
          album_slide_duration_ms?: number;
          album_transition?: string;
          album_show_captions?: boolean;
          album_watermark_url?: string | null;
          album_retention_days?: number;
          screen_token?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string | null;
          slug?: string;
          title?: string;
          event_type?: EventType;
          event_date?: string | null;
          location_name?: string | null;
          location_address?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          cover_image_url?: string | null;
          status?: EventStatus;
          template_id?: string | null;
          theme_config?: Json;
          sections_config?: Json;
          music_url?: string | null;
          hashtag?: string | null;
          instagram_handle?: string | null;
          album_enabled?: boolean;
          album_manual_approval?: boolean;
          album_slide_duration_ms?: number;
          album_transition?: string;
          album_show_captions?: boolean;
          album_watermark_url?: string | null;
          album_retention_days?: number;
          screen_token?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      guests: {
        Row: {
          id: string;
          event_id: string;
          full_name: string;
          slots: number;
          personal_slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          full_name: string;
          slots?: number;
          personal_slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          full_name?: string;
          slots?: number;
          personal_slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      rsvps: {
        Row: {
          id: string;
          event_id: string;
          guest_id: string | null;
          full_name: string;
          email: string | null;
          phone: string | null;
          attendees_count: number;
          status: RsvpStatus;
          dietary_notes: string | null;
          song_request: string | null;
          message: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          guest_id?: string | null;
          full_name: string;
          email?: string | null;
          phone?: string | null;
          attendees_count?: number;
          status?: RsvpStatus;
          dietary_notes?: string | null;
          song_request?: string | null;
          message?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          guest_id?: string | null;
          full_name?: string;
          email?: string | null;
          phone?: string | null;
          attendees_count?: number;
          status?: RsvpStatus;
          dietary_notes?: string | null;
          song_request?: string | null;
          message?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      photos: {
        Row: {
          id: string;
          event_id: string;
          storage_path: string;
          thumbnail_path: string | null;
          display_path: string | null;
          original_filename: string | null;
          mime_type: string | null;
          size_bytes: number | null;
          width: number | null;
          height: number | null;
          caption: string | null;
          uploader_name: string | null;
          status: PhotoStatus;
          moderated_by: string | null;
          moderated_at: string | null;
          reject_reason: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          storage_path: string;
          thumbnail_path?: string | null;
          display_path?: string | null;
          original_filename?: string | null;
          mime_type?: string | null;
          size_bytes?: number | null;
          width?: number | null;
          height?: number | null;
          caption?: string | null;
          uploader_name?: string | null;
          status?: PhotoStatus;
          moderated_by?: string | null;
          moderated_at?: string | null;
          reject_reason?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          storage_path?: string;
          thumbnail_path?: string | null;
          display_path?: string | null;
          original_filename?: string | null;
          mime_type?: string | null;
          size_bytes?: number | null;
          width?: number | null;
          height?: number | null;
          caption?: string | null;
          uploader_name?: string | null;
          status?: PhotoStatus;
          moderated_by?: string | null;
          moderated_at?: string | null;
          reject_reason?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      song_requests: {
        Row: {
          id: string;
          event_id: string;
          requester: string | null;
          song_title: string;
          artist: string | null;
          spotify_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          requester?: string | null;
          song_title: string;
          artist?: string | null;
          spotify_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          requester?: string | null;
          song_title?: string;
          artist?: string | null;
          spotify_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      rate_limits: {
        Row: {
          id: number;
          key: string;
          window_start: string;
          count: number;
        };
        Insert: {
          id?: number;
          key: string;
          window_start?: string;
          count?: number;
        };
        Update: {
          id?: number;
          key?: string;
          window_start?: string;
          count?: number;
        };
        Relationships: [];
      };
      audit_log: {
        Row: {
          id: number;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          actor_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          actor_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      portfolio_items: {
        Row: {
          id: string;
          title: string;
          category: string | null;
          media_type: 'image' | 'video' | null;
          media_url: string;
          thumbnail_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category?: string | null;
          media_type?: 'image' | 'video' | null;
          media_url: string;
          thumbnail_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string | null;
          media_type?: 'image' | 'video' | null;
          media_url?: string;
          thumbnail_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      contact_requests: {
        Row: {
          id: string;
          full_name: string;
          email: string | null;
          phone: string | null;
          event_type: string | null;
          event_date: string | null;
          message: string | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email?: string | null;
          phone?: string | null;
          event_type?: string | null;
          event_date?: string | null;
          message?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string | null;
          phone?: string | null;
          event_type?: string | null;
          event_date?: string | null;
          message?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_superadmin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_staff: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      check_rate_limit: {
        Args: {
          p_key: string;
          p_max: number;
          p_window_seconds: number;
        };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      event_status: EventStatus;
      event_type: EventType;
      photo_status: PhotoStatus;
      rsvp_status: RsvpStatus;
      template_family: TemplateFamily;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
