import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, Clock, User, UserCheck, 
  Plus, CheckCircle, XCircle, AlertCircle
} from "lucide-react";
import { type Customer, type Service, type Employee, type Appointment } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface AppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customers: Customer[];
  services: Service[];
  employees: Employee[];
}

const AppointmentModal = ({
  open,
  onOpenChange,
  customers,
  services,
  employees
}: AppointmentModalProps) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newAppointment, setNewAppointment] = useState({
    customerId: "",
    serviceIds: [] as string[],
    employeeId: "",
    time: "",
    notes: ""
  });

  // Mock existing appointments
  const [appointments] = useState<Appointment[]>([
    {
      id: "apt1",
      customerId: "c1",
      serviceIds: ["s1", "s3"],
      employeeId: "e1",
      date: new Date().toISOString().split('T')[0],
      time: "10:00",
      duration: 165,
      status: "scheduled",
      notes: "First time coloring"
    },
    {
      id: "apt2",
      customerId: "c2",
      serviceIds: ["s1"],
      employeeId: "e2",
      date: new Date().toISOString().split('T')[0],
      time: "14:30",
      duration: 45,
      status: "in-progress"
    }
  ]);

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30"
  ];

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || "Unknown";
  };

  const getEmployeeName = (employeeId: string) => {
    return employees.find(e => e.id === employeeId)?.name || "Unknown";
  };

  const getServiceNames = (serviceIds: string[]) => {
    return serviceIds.map(id => 
      services.find(s => s.id === id)?.name || "Unknown"
    ).join(", ");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-3 h-3" />;
      case 'in-progress': return <AlertCircle className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'cancelled': return <XCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const calculateDuration = (serviceIds: string[]) => {
    return serviceIds.reduce((total, id) => {
      const service = services.find(s => s.id === id);
      return total + (service?.duration || 0);
    }, 0);
  };

  const createAppointment = () => {
    if (!newAppointment.customerId || !newAppointment.employeeId || !newAppointment.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const appointment: Appointment = {
      id: `apt${Date.now()}`,
      customerId: newAppointment.customerId,
      serviceIds: newAppointment.serviceIds,
      employeeId: newAppointment.employeeId,
      date: selectedDate.toISOString().split('T')[0],
      time: newAppointment.time,
      duration: calculateDuration(newAppointment.serviceIds),
      status: "scheduled",
      notes: newAppointment.notes
    };

    // In a real app, this would save to backend
    toast({
      title: "Appointment Scheduled",
      description: `Appointment created for ${getCustomerName(newAppointment.customerId)}`,
    });

    // Reset form
    setNewAppointment({
      customerId: "",
      serviceIds: [],
      employeeId: "",
      time: "",
      notes: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Appointments
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="schedule">Schedule New</TabsTrigger>
          </TabsList>

          {/* Calendar View */}
          <TabsContent value="calendar" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calendar */}
              <div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </div>

              {/* Appointments for Selected Date */}
              <div>
                <h3 className="font-medium mb-4">
                  Appointments for {selectedDate.toLocaleDateString()}
                </h3>
                <div className="space-y-3 max-h-96 overflow-auto">
                  {getAppointmentsForDate(selectedDate).map((apt) => (
                    <div key={apt.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{getCustomerName(apt.customerId)}</p>
                          <p className="text-sm text-muted-foreground">
                            {apt.time} • {apt.duration} min
                          </p>
                        </div>
                        <Badge className={getStatusColor(apt.status)}>
                          {getStatusIcon(apt.status)}
                          <span className="ml-1">{apt.status}</span>
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <p><strong>Services:</strong> {getServiceNames(apt.serviceIds)}</p>
                        <p><strong>Stylist:</strong> {getEmployeeName(apt.employeeId)}</p>
                        {apt.notes && <p><strong>Notes:</strong> {apt.notes}</p>}
                      </div>
                    </div>
                  ))}
                  {getAppointmentsForDate(selectedDate).length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No appointments scheduled for this date
                    </p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Schedule New */}
          <TabsContent value="schedule" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Customer *</Label>
                  <Select 
                    value={newAppointment.customerId} 
                    onValueChange={(value) => setNewAppointment(prev => ({...prev, customerId: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          <div className="flex items-center gap-2">
                            <span>{customer.name}</span>
                            <Badge variant={customer.type === 'vip' ? 'default' : 'secondary'}>
                              {customer.type}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Services *</Label>
                  <div className="space-y-2 max-h-32 overflow-auto border rounded p-2">
                    {services.map((service) => (
                      <label key={service.id} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={newAppointment.serviceIds.includes(service.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAppointment(prev => ({
                                ...prev,
                                serviceIds: [...prev.serviceIds, service.id]
                              }));
                            } else {
                              setNewAppointment(prev => ({
                                ...prev,
                                serviceIds: prev.serviceIds.filter(id => id !== service.id)
                              }));
                            }
                          }}
                        />
                        <span>{service.name} ({service.duration}min)</span>
                      </label>
                    ))}
                  </div>
                  {newAppointment.serviceIds.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Total duration: {calculateDuration(newAppointment.serviceIds)} minutes
                    </p>
                  )}
                </div>

                <div>
                  <Label>Employee/Stylist *</Label>
                  <Select 
                    value={newAppointment.employeeId} 
                    onValueChange={(value) => setNewAppointment(prev => ({...prev, employeeId: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          <div className="flex items-center gap-2">
                            <span>{employee.name}</span>
                            <Badge variant={employee.status === 'available' ? 'success' : 'secondary'}>
                              {employee.status}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Date</Label>
                  <div className="border rounded p-2">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label>Time Slot *</Label>
                  <Select 
                    value={newAppointment.time} 
                    onValueChange={(value) => setNewAppointment(prev => ({...prev, time: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Special instructions or notes..."
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment(prev => ({...prev, notes: e.target.value}))}
                  />
                </div>

                <Button
                  onClick={createAppointment}
                  className="w-full"
                  variant="salon"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;