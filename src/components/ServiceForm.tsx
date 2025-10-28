import { useState } from 'react';
import { useServiceStore } from '../store/serviceStore';
import { Service, ServiceCategory, ServiceType } from '../types/service';
import { X, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceFormProps {
  service?: Service;
  onSuccess: () => void;
  onCancel?: () => void;
}

const categories: {
  value: ServiceCategory;
  label: string;
  icon: string;
  gradient: string;
}[] = [
  { value: 'bike', label: 'Bike', icon: '🚴', gradient: 'from-green-400 to-emerald-600' },
  { value: 'lift', label: 'Lift/Ride', icon: '🚗', gradient: 'from-blue-400 to-indigo-600' },
  { value: 'tuition', label: 'Tuition', icon: '📚', gradient: 'from-purple-400 to-violet-600' },
  { value: 'notes', label: 'Notes', icon: '📝', gradient: 'from-amber-400 to-orange-600' },
  { value: 'room', label: 'Room', icon: '🏠', gradient: 'from-rose-400 to-pink-600' },
];

// ✅ Define a form data type (separated for clarity)
type ServiceFormData = {
  category: ServiceCategory;
  type: ServiceType;
  title: string;
  description: string;
  contact_name: string;
  contact_number: string;
  location: string;
};

export default function ServiceForm({ service, onSuccess, onCancel }: ServiceFormProps) {
  const { createService, updateService } = useServiceStore();
  const [loading, setLoading] = useState(false);

  // ✅ Explicit type for formData
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
    const payload = {
      category: formData.category,
      type: formData.type,
      title: formData.title,
      description: formData.description,
      user: {
        name: formData.contact_name,
        contact: formData.contact_number,
      },  
      location: {
        address: formData.location,
      },
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black mb-1">
              {service ? 'Edit Service' : 'New Service ✨'}
            </h2>
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
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-transparent to-white/30" />
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">Category *</label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormData({ ...formData, category: cat.value })}
                className={`min-h-touch px-4 py-4 rounded-2xl border-2 flex items-center gap-3 transition-all duration-300 ${
                  formData.category === cat.value
                    ? `border-transparent bg-gradient-to-br ${cat.gradient} text-white shadow-lg`
                    : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 text-gray-700 hover:border-gray-300 shadow-sm'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-bold">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">Type *</label>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setFormData({ ...formData, type: 'offer' })}
              className={`min-h-touch px-4 py-4 rounded-2xl border-2 font-bold transition-all duration-300 ${
                formData.type === 'offer'
                  ? 'border-transparent bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg'
                  : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 text-gray-700 hover:border-gray-300 shadow-sm'
              }`}
            >
              ✨ I have this
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setFormData({ ...formData, type: 'request' })}
              className={`min-h-touch px-4 py-4 rounded-2xl border-2 font-bold transition-all duration-300 ${
                formData.type === 'request'
                  ? 'border-transparent bg-gradient-to-br from-orange-400 to-rose-600 text-white shadow-lg'
                  : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 text-gray-700 hover:border-gray-300 shadow-sm'
              }`}
            >
              🔍 I need this
            </motion.button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">
            Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Bike for rent, Need calculus tutor"
            className="w-full min-h-touch px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gradient-to-br from-white to-gray-50 transition-all shadow-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add more details..."
            rows={3}
            className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gradient-to-br from-white to-gray-50 transition-all shadow-sm resize-none"
          />
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="contact_name" className="block text-sm font-bold text-gray-700 mb-2">
              Name
            </label>
            <input
              id="contact_name"
              type="text"
              value={formData.contact_name}
              onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
              placeholder="Your name"
              className="w-full min-h-touch px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gradient-to-br from-white to-gray-50 transition-all shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="contact_number" className="block text-sm font-bold text-gray-700 mb-2">
              Phone
            </label>
            <input
              id="contact_number"
              type="tel"
              value={formData.contact_number}
              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
              placeholder="9812345678"
              className="w-full min-h-touch px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gradient-to-br from-white to-gray-50 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-bold text-gray-700 mb-2">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., Kathmandu, Bhaktapur"
            className="w-full min-h-touch px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gradient-to-br from-white to-gray-50 transition-all shadow-sm"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-2">
          {onCancel && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="flex-1 min-h-touch px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all"
            >
              Cancel
            </motion.button>
          )}

          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="flex-1 min-h-touch px-6 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} />
                {service ? 'Update' : 'Post Service'}
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
