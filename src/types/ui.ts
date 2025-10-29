export type ServiceCategory = "bike" | "lift" | "tuition" | "notes" | "room";
export type ServiceType = "offer" | "request";

export interface Service {
  id: number;
  title: string;
  description: string;
  category: ServiceCategory;
  type: ServiceType;
  user?: { name: string; contact: string };
  location?: { address: string };
  created_at?: string;
  updated_at?: string;
}
export interface User {
  id: number;
  name: string;
  contact: string;
  created_at?: string;
  updated_at?: string;
}
export interface Location {
  id: number;
  address: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
}