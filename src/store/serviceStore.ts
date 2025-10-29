import create from "zustand";
import { Service } from "../types/ui";

interface ServiceStore {
  services: Service[];
  loading: boolean;
  createService: (service: Omit<Service,"id"|"created_at"|"updated_at">)=>Promise<Service>;
  updateService: (service: Service)=>Promise<Service>;
  deleteService: (id:number)=>Promise<void>;
}

const LOCAL_STORAGE_KEY = "services";

const loadServices = (): Service[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveServices = (services: Service[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(services));
};

export const useServiceStore = create<ServiceStore>((set,get)=>({
  services: loadServices(),
  loading: false,

  createService: async (service)=>{
    const newService: Service = {
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...service
    };
    const updated = [...get().services,newService];
    saveServices(updated);
    set({services:updated});
    return newService;
  },

  updateService: async (service)=>{
    const updated = get().services.map(s=>s.id===service.id ? {...service,updated_at:new Date().toISOString()} : s);
    saveServices(updated);
    set({services:updated});
    return updated.find(s=>s.id===service.id);
  },

  deleteService: async (id)=>{
    const updated = get().services.filter(s=>s.id!==id);
    saveServices(updated);
    set({services:updated});
  }
}));
