export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  event_type: string;
  start_time: string;
  end_time: string;
  location_type: 'physical' | 'virtual' | 'hybrid';
  physical_address?: string;
  zoom_link?: string;
  max_attendees?: number;
  cover_image?: string;
  created_by: {
    id: string;
    name: string;
  };
  forum?: {
    id: string;
    name: string;
  } | null;
  rsvps: Array<{
    user_id: string;
    status: 'going' | 'interested' | 'not_going';
  }>;
  rsvp_counts: {
    going: number;
    interested: number;
    not_going: number;
  };
  created_at: string;
  updated_at: string;
}

export interface EventFilters {
  search?: string;
  event_type?: string;
  location_type?: string;
  page?: number;
  per_page?: number;
}export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  event_type: string;
  start_time: string;
  end_time: string;
  location_type: 'physical' | 'virtual' | 'hybrid';
  physical_address?: string;
  zoom_link?: string;
  max_attendees?: number;
  cover_image?: string;
  created_by: {
    id: string;
    name: string;
  };
  forum?: {
    id: string;
    name: string;
  } | null;
  rsvps: Array<{
    user_id: string;
    status: 'going' | 'interested' | 'not_going';
  }>;
  rsvp_counts: {
    going: number;
    interested: number;
    not_going: number;
  };
  created_at: string;
  updated_at: string;
}

export interface EventFilters {
  search?: string;
  event_type?: string;
  location_type?: string;
  page?: number;
  per_page?: number;
}