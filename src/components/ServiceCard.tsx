import { Service } from "../types/ui";
import { Edit, Trash2 } from "lucide-react";

interface Props{
  service: Service;
  showActions?: boolean;
  onEdit?: ()=>void;
  onDelete?: ()=>void;
}

export default function ServiceCard({service,showActions,onEdit,onDelete}:Props){
  return (
    <div className="p-4 bg-white rounded-xl shadow flex justify-between items-center">
      <div>
        <h3 className="font-bold text-lg">{service.title}</h3>
        <p className="text-sm text-gray-500">{service.description}</p>
        <p className="text-xs text-gray-400">{service.user?.name} • {service.location?.address}</p>
      </div>
      {showActions && (
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-blue-500 hover:text-blue-700"><Edit size={20}/></button>
          <button onClick={onDelete} className="text-red-500 hover:text-red-700"><Trash2 size={20}/></button>
        </div>
      )}
    </div>
  )
}
