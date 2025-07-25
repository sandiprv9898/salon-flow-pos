import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, UserCheck, Scissors } from "lucide-react";
import { type Service, type Employee } from "@/data/mockData";

interface ServiceGridProps {
  services: Service[];
  employees: Employee[];
  onAddToCart: (service: Service) => void;
}

const ServiceGrid = ({ services, employees, onAddToCart }: ServiceGridProps) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      "Hair": "bg-purple-100 text-purple-800",
      "Skin": "bg-green-100 text-green-800",
      "Beauty": "bg-pink-100 text-pink-800",
      "Massage": "bg-blue-100 text-blue-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getAvailableEmployees = () => {
    return employees.filter(emp => emp.status === 'available').length;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {services.map((service) => (
        <Card key={service.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-base mb-1">{service.name}</CardTitle>
                <Badge className={`text-xs ${getCategoryColor(service.category)}`}>
                  {service.category}
                </Badge>
              </div>
              <Scissors className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {service.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {service.description}
              </p>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">₹{service.price}</span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {formatDuration(service.duration)}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <UserCheck className="w-4 h-4" />
                  <span>{getAvailableEmployees()} available</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {service.commission}% commission
                </Badge>
              </div>
            </div>

            <Button
              onClick={() => onAddToCart(service)}
              className="w-full"
              variant="default"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServiceGrid;