import { useServiceStore } from "../store/serviceStore";
import ServiceCard from "./ServiceCard";
import ServiceForm from "./ServiceForm";
import { useState } from "react";
import { Service } from "../types/ui";

interface Props { type?: "all" | "my"; }

export default function ServiceList({type="all"}:Props){
  const { services, deleteService } = useServiceStore();
  const [editing, setEditing] = useState<Service|undefined>();
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (service: Service) => {
    setEditing(service);
    setShowForm(true);
  };

  const handleDelete = async (service: Service) => {
    if(confirm(`Are you sure you want to delete "${service.title}"?`)){
      await deleteService(service.id);
    }
  };

  return (
    <div className="space-y-4">
      {showForm && 
        <ServiceForm
          service={editing}
          onCancel={()=>setShowForm(false)}
          onSuccess={()=>setShowForm(false)}
        />
      }

      {services.map(service=>(
        <ServiceCard
          key={service.id}
          service={service}
          showActions={true}
          onEdit={()=>handleEdit(service)}
          onDelete={()=>handleDelete(service)}
        />
      ))}
    </div>
  )
}
