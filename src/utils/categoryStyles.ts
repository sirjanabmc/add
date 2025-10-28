import { ServiceCategory, ServiceType } from "../types/service";

export const categoryGradients: Record<ServiceCategory, string> = {
  bike: "from-green-400 via-emerald-500 to-teal-600",
  lift: "from-sky-400 via-blue-500 to-indigo-600",
  tuition: "from-purple-400 via-violet-500 to-indigo-600",
  notes: "from-amber-400 via-orange-500 to-red-500",
  room: "from-pink-400 via-rose-500 to-fuchsia-600",
};

export const categoryShadows: Record<ServiceCategory, string> = {
  bike: "shadow-green-400/50",
  lift: "shadow-blue-400/50",
  tuition: "shadow-purple-400/50",
  notes: "shadow-amber-400/50",
  room: "shadow-rose-400/50",
};

export const typeGradients: Record<ServiceType, string> = {
  offer: "from-emerald-400 via-teal-500 to-green-600",
  request: "from-orange-400 via-rose-500 to-pink-600",
};

export const typeShadows: Record<ServiceType, string> = {
  offer: "shadow-green-400/50",
  request: "shadow-pink-400/50",
};
