import { ServiceCategory, ServiceType } from "../types/service";
import { motion } from "framer-motion";
import {
  categoryGradients,
  categoryShadows,
  typeGradients,
  typeShadows,
} from "../utils/categoryStyles";

interface CategoryFilterProps {
  selectedCategory?: ServiceCategory;
  selectedType?: ServiceType;
  onCategoryChange: (category: ServiceCategory | undefined) => void;
  onTypeChange: (type: ServiceType | undefined) => void;
}

// 🏷️ Updated categories — should match `ServiceCategory` in types/service.ts
const categories: { value: ServiceCategory; label: string; icon: string }[] = [
  { value: "bike", label: "bike", icon: "🚴" },
  { value: "lift", label: "lift", icon: "🚗" },
  { value: "tuition", label: "tuition", icon: "📚" },
  { value: "notes", label: "notes", icon: "📝" },
  { value: "room", label: "room", icon: "🏠" },
]
// ⚙️ Updated service types — should match `ServiceType` in types/service.ts
const types: { value: ServiceType; label: string; icon: string }[] = [
  { value: "offer", label: "Offering", icon: "✅" },
  { value: "request", label: "Requesting", icon: "🤝" },
];

export default function CategoryFilter({
  selectedCategory,
  selectedType,
  onCategoryChange,
  onTypeChange,
}: CategoryFilterProps) {
  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg px-4 py-5 md:px-6 md:py-6 transition-all duration-300">
      {/* Category Section */}
      <div className="mb-5">
        <h3 className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-widest">
          Category
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onCategoryChange(undefined)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold min-h-touch shadow-md transition-all duration-300 ${
              !selectedCategory
                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-400/40"
                : "bg-white/70 text-gray-700 hover:text-indigo-600 hover:shadow-lg border border-gray-200"
            }`}
          >
            🌈 All
          </motion.button>

          {categories.map((cat) => (
            <motion.button
              key={cat.value}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onCategoryChange(cat.value)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 min-h-touch transition-all duration-300 ${
                selectedCategory === cat.value
                  ? `bg-gradient-to-r ${categoryGradients[cat.value]} text-white shadow-lg ${categoryShadows[cat.value]}`
                  : "bg-white/70 text-gray-700 hover:text-indigo-600 hover:shadow-lg border border-gray-200"
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              {cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Type Section */}
      <div>
        <h3 className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-widest">
          Type
        </h3>
        <div className="grid grid-cols-2 sm:flex sm:gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => onTypeChange(undefined)}
            className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold min-h-touch transition-all duration-300 ${
              !selectedType
                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-400/40"
                : "bg-white/70 text-gray-700 hover:text-indigo-600 hover:shadow-lg border border-gray-200"
            }`}
          >
            ✨ All
          </motion.button>

          {types.map((type) => (
            <motion.button
              key={type.value}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => onTypeChange(type.value)}
              className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 min-h-touch transition-all duration-300 ${
                selectedType === type.value
                  ? `bg-gradient-to-r ${typeGradients[type.value]} text-white shadow-lg ${typeShadows[type.value]}`
                  : "bg-white/70 text-gray-700 hover:text-indigo-600 hover:shadow-lg border border-gray-200"
              }`}
            >
              <span className="text-base">{type.icon}</span>
              {type.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
