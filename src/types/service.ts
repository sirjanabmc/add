// 🧭 Main service status options (used for filtering and toggling)
export type ServiceStatus = 'active' | 'inactive' | 'pending' | 'completed';

// 🏷️ Service categories — you can modify or add more categories as needed
export type ServiceCategory =
  | 'bike'
  | 'lift'
  | 'tuition'
  | 'notes'
  | 'room';

// ⚙️ Type of service — whether the user is offering or requesting
export type ServiceType = 'offer' | 'request';

// 💰 Service pricing information
export interface ServicePrice {
  amount: number;
  currency: string;
  unit?: string; // e.g., 'hour', 'day', 'service'
}

// 📍 Location information
export interface ServiceLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
}

// 👤 Basic user info (used in service listings)
export interface ServiceUser {
  id: string;
  name: string;
  avatar_url?: string;
  contact?: string;
}

// 🧾 Main Service interface
export interface Service {
  id: number;
  title: string;
  description: string;
  category: ServiceCategory;
  type: ServiceType;
  status: ServiceStatus;
  price?: ServicePrice;
  location?: ServiceLocation;
  images?: string[];
  user?: ServiceUser;
  rating?: number;
  is_active?: boolean;

  // 🆕 Contact info
  contact_name?: string;
  contact_number?: string;

  created_at: string;
  updated_at: string;
}

// 🔍 Query parameters for searching/filtering services
export interface ServiceSearchParams {
  category?: ServiceCategory;
  type?: ServiceType;
  status?: ServiceStatus;
  city?: string;
  page?: number;
  limit?: number;
  keyword?: string;
}
