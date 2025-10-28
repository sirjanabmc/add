// src/components/ServiceCard.tsx
import { Service } from '../types/service';
import { Phone, MapPin, Clock, Sparkles, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  service: Service;
  onEdit?: (service: Service) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

const categoryIcons: Record<string, string> = {
  bike: '🚴',
  lift: '🚗',
  tuition: '📚',
  notes: '📝',
  room: '🏠',

};

const categoryGradients: Record<string, string> = {
  bike: 'from-green-400 to-emerald-600',
  lift: 'from-blue-400 to-indigo-600',
  tuition: 'from-purple-400 to-violet-600',
  notes: 'from-amber-400 to-orange-600',
  room: 'from-rose-400 to-pink-600',

};

const categoryColors: Record<string, string> = {
  bike: 'bg-green-100 text-green-800 border-green-200',
  lift: 'bg-blue-100 text-blue-800 border-blue-200',
  tuition: 'bg-purple-100 text-purple-800 border-purple-200',
  notes: 'bg-amber-100 text-amber-800 border-amber-200',
  room: 'bg-rose-100 text-rose-800 border-rose-200',

};

// 🕓 Format created_at time to readable "time ago"
function formatTimeAgo(isoString?: string): string {
  if (!isoString) return 'N/A';

  const timestamp = new Date(isoString).getTime();
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function ServiceCard({
  service,
  onEdit,
  onDelete,
  showActions = false,
}: ServiceCardProps) {
  const handleCall = () => {
    if (service.contact_number) {
      window.location.href = `tel:${service.contact_number}`;
    }
  };

  const handleCopy = () => {
    if (service.contact_number) {
      navigator.clipboard.writeText(service.contact_number);
      alert('📞 Contact number copied!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 21 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-4"
    >
      {/* Gradient bar */}
      <div className={`h-1.5 bg-gradient-to-r ${categoryGradients[service.category]}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            {/* Icon */}
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${categoryGradients[service.category]} flex items-center justify-center text-3xl shadow-md`}
            >
              {categoryIcons[service.category]}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1.5">
                {service.title}
              </h3>

              <div className="flex flex-wrap gap-1.5">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium border ${categoryColors[service.category]}`}
                >
                  {service.category}
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${
                    service.type === 'offer'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-orange-100 text-orange-800 border border-orange-200'
                  }`}
                >
                  {service.type === 'offer' ? (
                    <>
                      <Sparkles size={12} />
                      Available
                    </>
                  ) : (
                    <>Looking for</>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {service.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        )}

        {/* Details */}
        <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
          {service.contact_number ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCall}
                className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
              >
                <Phone size={14} />
                {service.contact_name || 'Contact'}
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
              >
                <Copy size={12} />
              </button>
            </div>
          ) : (
            <div className="text-xs text-gray-400 italic">No contact info</div>
          )}

          {service.location?.address && (
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>{service.location.address}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-500">
            <Clock size={14} />
            <span>{formatTimeAgo(service.created_at)}</span>
          </div>
        </div>

        {/* Edit/Delete Buttons */}
        {showActions && (
          <div className="flex gap-2 mt-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onEdit?.(service)}
              className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-300"
            >
              Edit
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onDelete?.(service.id)}
              className="flex-1 py-2 bg-rose-100 text-rose-700 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-300"
            >
              Delete
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
