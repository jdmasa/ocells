export interface Profile {
  id: string;
  name: string;
  created_at: string;
}

export interface ObservationSession {
  id: string;
  profile_id: string;
  start_time: string;
  end_time: string | null;
  location_lat: number;
  location_lng: number;
  created_at: string;
  updated_at: string;
}

export interface Observation {
  id: string;
  session_id: string;
  bird_species: string;
  count: number;
  is_custom: boolean;
  created_at: string;
}

export interface BirdSpecies {
  id: string;
  name_ca: string;
  name_es: string;
  scientific_name: string;
  image_url?: string;
}

export interface SessionWithObservations extends ObservationSession {
  observations: Observation[];
}
