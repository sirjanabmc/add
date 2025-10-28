// src/store/serviceStore.ts
import create from 'zustand';
import { Service, ServiceCategory, ServiceType } from '../types/service';

interface ServiceStore {
  services: Service[];
  myServices: Service[];
  loading: boolean;

  fetchServices: (category?: ServiceCategory, type?: ServiceType, search?: string) => Promise<void>;
  fetchMyServices: () => Promise<void>;
  createService: (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
}

export const useServiceStore = create<ServiceStore>((set, get) => ({
  services: [],
  myServices: [],
  loading: false,

  fetchServices: async (category, type, search) => {
    set({ loading: true });
    try {
      const data: Service[] = []; // TODO: Replace with API call
      const filtered = data.filter(s => {
        if (category && s.category !== category) return false;
        if (type && s.type !== type) return false;
        if (search && !s.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      });
      set({ services: filtered });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  fetchMyServices: async () => {
    set({ loading: true });
    try {
      const all: Service[] = get().services; // Replace with API call for user-specific
      const my: Service[] = all.filter(s => s.user?.name === 'currentUser'); // TODO: Replace with actual current user
      set({ myServices: my });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  createService: async (service) => {
    set({ loading: true });
    try {
      const newService: Service = {
        id: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...service,
      };
      set({
        services: [...get().services, newService],
        myServices: [...get().myServices, newService],
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateService: async (service) => {
    set({ loading: true });
    try {
      set({
        services: get().services.map(s => (s.id === service.id ? { ...service, updated_at: new Date().toISOString() } : s)),
        myServices: get().myServices.map(s => (s.id === service.id ? { ...service, updated_at: new Date().toISOString() } : s)),
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteService: async (id) => {
    set({ loading: true });
    try {
      set({
        services: get().services.filter(s => s.id !== id),
        myServices: get().myServices.filter(s => s.id !== id),
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
}));
