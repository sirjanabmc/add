import { useState } from 'react';
import { useServiceStore } from '../store/serviceStore';
import { Service, ServiceCategory, ServiceType } from '../types/ui';
import { X, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceFormProps {
  service?: Service;
  onSuccess: (updatedService?: Service) => void;
  onCancel?: () => void;
}

type ServiceFormData = {
  category: ServiceCategory;
  type: ServiceType;
  title: string;
  description: string;
  contact_name: string;
  contact_number: string;
  location: string;
};

const categories: { value: ServiceCategory; label: string; icon: string; gradient: string }[] = [
  { value: 'bike', label: 'Bike', icon: '🚴', gradient: 'from-green-400 to-emerald-600' },
  { value: 'lift', label: 'Lift/Ride', icon: '🚗', gradient: 'from-blue-400 to-indigo-600' },
  { value: 'tuition', label: 'Tuition', icon: '📚', gradient: 'from-purple-400 to-violet-600' },
  { value: 'notes', label: 'Notes', icon: '📝', gradient: 'from-amber-400 to-orange-600' },
  { value: 'room', label: 'Room', icon: '🏠', gradient: 'from-rose-400 to-pink-600' },
];

export default function ServiceForm({ service, onSuccess, onCancel }: ServiceFormProps) {
  const { createService, updateService } = useServiceStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ServiceFormData>({
    category: service?.category ?? 'bike',
    type: service?.type ?? 'offer',
    title: service?.title ?? '',
    description: service?.description ?? '',
    contact_name: service?.user?.name ?? '',
    contact_number: service?.user?.contact ?? '',
    location: service?.location?.address ?? '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: Partial<Service> = {
      category: formData.category,
      type: formData.type,
      title: formData.title,
      description: formData.description,
      user: { name: formData.contact_name, contact: formData.contact_number },
      location: { address: formData.location },
    };

    try {
      let result: Service | undefined;
      if (service) {
        result = { ...service, ...payload } as Service;
        await updateService(result);
      } else {
        result = await createService(payload as Omit<Service, 'id' | 'created_at' | 'updated_at'>);
      }
      onSuccess(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black mb-1">{service ? 'Edit Service' : 'New Service ✨'}</h2>
          <p className="text-purple-100 text-sm">Fill in the details below</p>
        </div>
        {onCancel && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onCancel}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
            aria-label="Close"
          >
            <X size={24} />
          </motion.button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormData({ ...formData, category: cat.value })}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  formData.category === cat.value
                    ? `bg-gradient-to-br ${cat.gradient} text-white shadow-lg border-2 border-transparent`
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span>{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
          <div className="flex gap-3">
            {['offer', 'request'].map((t) => (
              <motion.button
                key={t}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormData({ ...formData, type: t as ServiceType })}
                className={`flex-1 text-center py-3 rounded-xl font-semibold transition-all ${
                  formData.type === t
                    ? t === 'offer'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-rose-500 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none px-4 py-3 shadow-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none px-4 py-3 shadow-sm"
          />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Name *</label>
            <input
              type="text"
              required
              value={formData.contact_name}
              onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
              className="w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none px-4 py-3 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number *</label>
            <input
              type="text"
              required
              value={formData.contact_number}
              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
              className="w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none px-4 py-3 shadow-sm"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Location *</label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none px-4 py-3 shadow-sm"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Saving...' : <><CheckCircle2 size={20} /> Save Service</>}
        </button>
      </form>
    </motion.div>
  );
}
