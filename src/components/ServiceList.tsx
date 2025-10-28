import { useState } from 'react';
import { useServiceStore } from '../store/serviceStore';
import ServiceCard from './ServiceCard';
import ServiceForm from './ServiceForm';
import { Service } from '../types/service';
import { motion } from 'framer-motion';
import { Inbox, Sparkles } from 'lucide-react';

interface ServiceListProps {
  type: 'all' | 'my';
}

export default function ServiceList({ type }: ServiceListProps) {
  const { services, myServices, loading, deleteService } = useServiceStore();
  const [editingService, setEditingService] = useState<Service | null>(null);

  const displayServices = type === 'all' ? services : myServices;

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await deleteService(id);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
  };

  if (editingService) {
    return (
      <div className="p-4">
        <ServiceForm 
          service={editingService}
          onSuccess={() => setEditingService(null)}
          onCancel={() => setEditingService(null)}
        />
      </div>
    );
  }

  if (loading && displayServices.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading services...</p>
        </motion.div>
      </div>
    );
  }

  if (displayServices.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-12 text-center"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
          {type === 'my' ? (
            <Inbox size={40} className="text-indigo-600" />
          ) : (
            <Sparkles size={40} className="text-indigo-600" />
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {type === 'my' ? 'No services yet' : 'No services available'}
        </h3>
        <p className="text-sm text-gray-500 max-w-xs">
          {type === 'my' 
  ? "You haven't posted any services yet. Tap the + button to add a new service."
  : "No services are available at the moment. Please check back later."}

        </p>
      </motion.div>
    );
  }

  return (
    <div className="p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-1"
      >
        {displayServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ServiceCard
              service={service}
              showActions={type === 'my'}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
