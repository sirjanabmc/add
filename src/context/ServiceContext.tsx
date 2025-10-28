// import React, { createContext, useContext, useState, useCallback } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import { Service } from '../types/service';

interface ServiceContextType {
  services: Service[];
  loading: boolean;
  error: string | null;
  addService: (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateService: (id: number, service: Partial<Service>) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
  fetchServices: () => Promise<void>;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace this with your actual API call
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const addService = useCallback(async (
    newService: Omit<Service, 'id' | 'created_at' | 'updated_at'>
  ) => {
    setLoading(true);
    setError(null);
    try {
      // Replace this with your actual API call
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newService),
      });
      if (!response.ok) {
        throw new Error('Failed to add service');
      }
      const addedService = await response.json();
      setServices(prev => [...prev, addedService]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add service');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateService = useCallback(async (id: number, serviceUpdate: Partial<Service>) => {
    setLoading(true);
    setError(null);
    try {
      // Replace this with your actual API call
      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceUpdate),
      });
      if (!response.ok) {
        throw new Error('Failed to update service');
      }
      const updatedService = await response.json();
      setServices(prev =>
        prev.map(service => (service.id === id ? updatedService : service))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update service');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteService = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      // Replace this with your actual API call
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete service');
      }
      setServices(prev => prev.filter(service => service.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete service');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    services,
    loading,
    error,
    addService,
    updateService,
    deleteService,
    fetchServices,
  };

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};

export default ServiceContext;