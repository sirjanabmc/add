import { ServiceCategory, ServiceType } from "../types/service";
import { FaBicycle, FaCar, FaBook, FaStickyNote, FaHome, FaCheck, FaHandshake } from "react-icons/fa";
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

// 🏷️ Category definitions with React Icons
const categories: { value: ServiceCategory; label: string; icon: JSX.Element }[] = [
  { value: "bike", label: "Bike", icon: <FaBicycle /> },
  { value: "lift", label: "Lift", icon: <FaCar /> },
  { value: "tuition", label: "Tuition", icon: <FaBook /> },
  { value: "notes", label: "Notes", icon: <FaStickyNote /> },
  { value: "room", label: "Room", icon: <FaHome /> },
];

// ⚙️ Service types with React Icons
const types: { value: ServiceType; label: string; icon: JSX.Element }[] = [
  { value: "offer", label: "Offering", icon: <FaCheck /> },
  { value: "request", label: "Requesting", icon: <FaHandshake /> },
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
          {/* All Categories Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onCategoryChange(undefined)}
            className={`flex-shrink-0 min-w-[80px] px-5 py-2.5 rounded-xl text-sm font-semibold min-h-touch shadow-md transition-all duration-300 ${
              !selectedCategory
                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-400/40"
                : "bg-white/70 text-gray-700 hover:text-indigo-600 hover:shadow-lg border border-gray-200"
            }`}
          >
            All
          </motion.button>

          {categories.map((cat) => (
            <motion.button
              key={cat.value}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onCategoryChange(cat.value)}
              className={`flex-shrink-0 min-w-[80px] px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 min-h-touch transition-all duration-300 ${
                selectedCategory === cat.value
                  ? `bg-gradient-to-r ${categoryGradients[cat.value] || 'from-indigo-500 via-purple-500 to-pink-500'} text-white shadow-lg ${categoryShadows[cat.value] || 'shadow-purple-400/40'}`
                  : "bg-white/70 text-gray-700 hover:text-indigo-600 hover:shadow-lg border border-gray-200"
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Type Section */}
      <div>
        <h3 className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-widest">
          Type
        </h3>
        <div className="flex flex-wrap gap-3">
          {/* All Types Button */}
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
            All
          </motion.button>

          {types.map((type) => (
            <motion.button
              key={type.value}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => onTypeChange(type.value)}
              className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 min-h-touch transition-all duration-300 ${
                selectedType === type.value
                  ? `bg-gradient-to-r ${typeGradients[type.value] || 'from-indigo-500 via-purple-500 to-pink-500'} text-white shadow-lg ${typeShadows[type.value] || 'shadow-purple-400/40'}`
                  : "bg-white/70 text-gray-700 hover:text-indigo-600 hover:shadow-lg border border-gray-200"
              }`}
            >
              {type.icon}
              <span>{type.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
