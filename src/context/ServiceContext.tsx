
import { createContext, useReducer, useContext, PropsWithChildren, useCallback } from 'react';
import type { FC } from 'react';
import { Service, ServiceSearchParams } from '../types/service';
import { ServiceApi, ApiResponse } from '../api/ServiceApi';
import { ServiceOperationError } from '../types/errors';
import { useRetry } from '../hooks/useRetry';

// 🧠 State definition
interface ServiceState {
  services: Service[];
  loading: boolean;
  error: ServiceOperationError | null;
  filters: ServiceSearchParams;
  pendingOperations: number;
}

// ⚡ Reducer actions
type ServiceAction =
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: ServiceOperationError | null }
  | { type: 'ADD_SERVICE'; payload: Service }
  | { type: 'UPDATE_SERVICE'; payload: Service }
  | { type: 'DELETE_SERVICE'; payload: number }
  | { type: 'SET_FILTERS'; payload: ServiceSearchParams }
  | { type: 'INCREMENT_PENDING' }
  | { type: 'DECREMENT_PENDING' };

// 🌐 Context type
interface ServiceContextType extends ServiceState {
  fetchServices: (params?: ServiceSearchParams) => Promise<void>;
  addService: (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => Promise<ApiResponse<Service>>;
  updateService: (id: number, service: Partial<Service>) => Promise<ApiResponse<Service>>;
  deleteService: (id: number) => Promise<ApiResponse<void>>;
  setFilters: (filters: ServiceSearchParams) => void;
  refreshServices: () => Promise<void>;
}

// 🧱 Initial state
const initialState: ServiceState = {
  services: [],
  loading: false,
  error: null,
  filters: {},
  pendingOperations: 0,
};

// 🔁 Reducer
function serviceReducer(state: ServiceState, action: ServiceAction): ServiceState {
  switch (action.type) {
    case 'SET_SERVICES':
      return { ...state, services: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_SERVICE':
      return { ...state, services: [action.payload, ...state.services] };
    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map(s => (s.id === action.payload.id ? action.payload : s)),
      };
    case 'DELETE_SERVICE':
      return { ...state, services: state.services.filter(s => s.id !== action.payload) };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'INCREMENT_PENDING':
      return { ...state, pendingOperations: state.pendingOperations + 1 };
    case 'DECREMENT_PENDING':
      return { ...state, pendingOperations: Math.max(0, state.pendingOperations - 1) };
    default:
      return state;
  }
}

// 🧩 Context
const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

// 🪄 Hook
export const useServices = (): ServiceContextType => {
  const context = useContext(ServiceContext);
  if (!context) throw new Error('useServices must be used within a ServiceProvider');
  return context;
};

// 🏗️ Provider
export const ServiceProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(serviceReducer, initialState);
  const retryOperation = useRetry();

  // ⚠️ Error handler
  const handleServiceError = useCallback((error: unknown, message: string) => {
    let serviceError: ServiceOperationError;
    if (error instanceof ServiceOperationError) serviceError = error;
    else if (error instanceof Error) serviceError = new ServiceOperationError(error.message, 'UNKNOWN_ERROR');
    else serviceError = new ServiceOperationError(message, 'OPERATION_ERROR');

    dispatch({ type: 'SET_ERROR', payload: serviceError });
    return serviceError;
  }, []);

  // 📦 Fetch services
  const fetchServices = useCallback(
    async (params: ServiceSearchParams = {}) => {
      dispatch({ type: 'INCREMENT_PENDING' });
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const response = await retryOperation(() => ServiceApi.getAllServices());
        if (response.error) throw new ServiceOperationError(response.error.message, response.error.code);

        dispatch({ type: 'SET_SERVICES', payload: response.data || [] });
      } catch (err) {
        handleServiceError(err, 'Failed to fetch services');
      } finally {
        dispatch({ type: 'DECREMENT_PENDING' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [handleServiceError, retryOperation]
  );

  // ➕ Add service
  const addService = useCallback(
    async (newService: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
      dispatch({ type: 'INCREMENT_PENDING' });
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const response = await retryOperation(() => ServiceApi.createService(newService));
        if (response.error) throw new ServiceOperationError(response.error.message, response.error.code);
        if (!response.data) throw new ServiceOperationError('No service returned', 'NO_DATA');
        dispatch({ type: 'ADD_SERVICE', payload: response.data });
        return response;
        
      } catch (err) {
        throw handleServiceError(err, 'Failed to add service');
      } finally {
        dispatch({ type: 'DECREMENT_PENDING' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [handleServiceError, retryOperation]
  );

  // ✏️ Update service
  const updateService = useCallback(
    async (id: number, serviceUpdate: Partial<Service>) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const existing = state.services.find(s => s.id === id);
        if (!existing) throw new ServiceOperationError('Service not found', 'NOT_FOUND');

        const response = await ServiceApi.updateService(id, serviceUpdate);
        if (response.error) throw new ServiceOperationError(response.error.message, response.error.code);
        if (!response.data) throw new ServiceOperationError('No updated service returned', 'NO_DATA');

        dispatch({ type: 'UPDATE_SERVICE', payload: response.data });
        return response;
      } catch (err) {
        throw handleServiceError(err, 'Failed to update service');
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [handleServiceError, state.services]
  );

  // ❌ Delete service
  const deleteService = useCallback(
    async (id: number) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const existing = state.services.find(s => s.id === id);
        if (!existing) throw new ServiceOperationError('Service not found', 'NOT_FOUND');

        const response = await ServiceApi.deleteService(id);
        if (response.error) throw new ServiceOperationError(response.error.message, response.error.code);

        dispatch({ type: 'DELETE_SERVICE', payload: id });
        return response;
      } catch (err) {
        throw handleServiceError(err, 'Failed to delete service');
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [handleServiceError, state.services]
  );


  const setFilters = useCallback((filters: ServiceSearchParams) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  // 🔄 Refresh
  const refreshServices = useCallback(async () => {
    await fetchServices(state.filters);
  }, [fetchServices, state.filters]);

  return (
    <ServiceContext.Provider

      value={{
        ...state,
        fetchServices,
        addService,
        updateService,
        deleteService,
        setFilters,
        refreshServices,
      }}>
      {children}
    </ServiceContext.Provider>
  );
};

export default ServiceContext;
