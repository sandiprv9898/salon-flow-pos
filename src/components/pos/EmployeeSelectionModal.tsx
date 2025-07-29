import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCheck, Clock, Star, Award } from "lucide-react";
import { type Employee, type Service } from "@/data/mockData";

interface EmployeeSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  employees: Employee[];
  onSelectEmployee: (employee: Employee, service: Service) => void;
}

const EmployeeSelectionModal = ({ 
  open, 
  onOpenChange, 
  service, 
  employees, 
  onSelectEmployee 
}: EmployeeSelectionModalProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const availableEmployees = employees.filter(emp => 
    emp.status === 'available' && 
    service?.category && 
    emp.specialties.includes(service.category)
  );

  const handleSelectEmployee = () => {
    if (selectedEmployee && service) {
      onSelectEmployee(selectedEmployee, service);
      setSelectedEmployee(null);
      onOpenChange(false);
    }
  };

  const getEmployeeRating = (employee: Employee) => {
    // Mock rating calculation based on experience
    const baseRating = 4.0;
    const experienceBonus = Math.min(employee.experienceYears * 0.1, 1.0);
    return Math.min(baseRating + experienceBonus, 5.0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Select Employee for {service?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {service && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{service.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{service.price}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {service.duration}m
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              Available Specialists ({availableEmployees.length})
            </h4>
            
            {availableEmployees.length === 0 ? (
              <Card className="p-6 text-center text-muted-foreground">
                <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No specialists available for this service</p>
                <p className="text-sm">Please try again later or select a different service</p>
              </Card>
            ) : (
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {availableEmployees.map((employee) => (
                  <Card 
                    key={employee.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedEmployee?.id === employee.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={employee.avatar} />
                            <AvatarFallback>
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <h3 className="font-medium">{employee.name}</h3>
                            <p className="text-sm text-muted-foreground">{employee.role}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">
                                  {getEmployeeRating(employee).toFixed(1)}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {employee.experienceYears}y exp
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <Badge 
                            variant={employee.status === 'available' ? 'default' : 'secondary'}
                            className="mb-2"
                          >
                            {employee.status}
                          </Badge>
                          
                          <div className="text-xs text-muted-foreground">
                            <div className="flex items-center gap-1 justify-end">
                              <Award className="w-3 h-3" />
                              {employee.commission}% commission
                            </div>
                          </div>
                        </div>
                      </div>

                      {employee.specialties.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex flex-wrap gap-1">
                            {employee.specialties.slice(0, 3).map((specialty) => (
                              <Badge 
                                key={specialty} 
                                variant="outline" 
                                className="text-xs bg-background"
                              >
                                {specialty}
                              </Badge>
                            ))}
                            {employee.specialties.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{employee.specialties.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSelectEmployee}
              disabled={!selectedEmployee}
            >
              Assign {selectedEmployee?.name || 'Employee'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeSelectionModal;