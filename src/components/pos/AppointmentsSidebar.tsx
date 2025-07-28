import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  Timer,
  DollarSign,
  Coffee,
  Target,
  TrendingUp,
  Star,
  Activity
} from "lucide-react";

interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  employeeName: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  price: number;
}

interface AppointmentsSidebarProps {
  employeeId?: string;
  employeeName?: string;
}

// Mock appointments data
const mockAppointments: Appointment[] = [
  {
    id: "apt1",
    customerName: "Emma Watson",
    customerPhone: "+91 90123 45678",
    serviceName: "Hair Coloring",
    employeeName: "Mike Chen",
    date: "2024-01-25",
    time: "10:00",
    duration: 120,
    status: "scheduled",
    notes: "First time coloring, allergic to sulfates",
    price: 2499
  },
  {
    id: "apt2", 
    customerName: "John Smith",
    customerPhone: "+91 90123 45679",
    serviceName: "Haircut & Styling",
    employeeName: "Sarah Johnson",
    date: "2024-01-25",
    time: "11:30",
    duration: 45,
    status: "in-progress",
    price: 799
  },
  {
    id: "apt3",
    customerName: "Lisa Chen",
    customerPhone: "+91 90123 45680",
    serviceName: "Facial Treatment",
    employeeName: "Priya Sharma",
    date: "2024-01-25",
    time: "14:00",
    duration: 75,
    status: "scheduled",
    price: 1299
  },
  {
    id: "apt4",
    customerName: "Raj Patel",
    customerPhone: "+91 90123 45681",
    serviceName: "Manicure",
    employeeName: "Priya Sharma",
    date: "2024-01-25",
    time: "15:30",
    duration: 45,
    status: "scheduled",
    price: 599
  },
  {
    id: "apt5",
    customerName: "Anita Sharma",
    customerPhone: "+91 90123 45682",
    serviceName: "Pedicure",
    employeeName: "David Wilson",
    date: "2024-01-25",
    time: "16:30",
    duration: 60,
    status: "scheduled",
    price: 799
  }
];

const AppointmentsSidebar = ({ employeeId, employeeName }: AppointmentsSidebarProps) => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [todayStats, setTodayStats] = useState({
    total: 0,
    completed: 0,
    remaining: 0,
    revenue: 0
  });

  useEffect(() => {
    // Filter appointments for current employee or all if admin
    const filteredAppointments = employeeName 
      ? appointments.filter(apt => apt.employeeName === employeeName)
      : appointments;

    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = filteredAppointments.filter(apt => apt.date === today);
    
    setTodayStats({
      total: todayAppointments.length,
      completed: todayAppointments.filter(apt => apt.status === 'completed').length,
      remaining: todayAppointments.filter(apt => apt.status === 'scheduled').length,
      revenue: todayAppointments
        .filter(apt => apt.status === 'completed')
        .reduce((sum, apt) => sum + apt.price, 0)
    });
  }, [appointments, employeeName]);

  const handleStatusUpdate = (appointmentId: string, newStatus: Appointment['status']) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    ));
    
    const statusMessages = {
      'in-progress': 'Service started',
      'completed': 'Service completed',
      'cancelled': 'Appointment cancelled'
    };
    
    toast({
      title: "Status Updated",
      description: statusMessages[newStatus],
    });
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'in-progress': return 'bg-orange-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
    }
  };

  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-3 h-3" />;
      case 'in-progress': return <Activity className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'cancelled': return <AlertCircle className="w-3 h-3" />;
    }
  };

  // Filter for today's appointments
  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    const isToday = apt.date === today;
    return employeeName ? isToday && apt.employeeName === employeeName : isToday;
  });

  // Next 3 upcoming appointments
  const upcomingAppointments = todayAppointments
    .filter(apt => apt.status === 'scheduled')
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 3);

  return (
    <div className="w-80 bg-white/60 backdrop-blur-sm border-l border-border/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-white/80">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Today's Schedule</h2>
        </div>
        
        {employeeName && (
          <Badge variant="outline" className="mb-3">
            {employeeName}
          </Badge>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 bg-primary/5 rounded-lg">
            <div className="text-lg font-bold text-primary">{todayStats.remaining}</div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{todayStats.completed}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Next Appointments
              </h3>
              
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Coffee className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No upcoming appointments</p>
                  <p className="text-xs">Time for a break!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment) => (
                    <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(appointment.status)}`} />
                            <span className="font-medium text-sm">{appointment.time}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {appointment.duration}m
                          </Badge>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm font-medium">{appointment.customerName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{appointment.customerPhone}</span>
                          </div>
                          <div className="text-sm text-primary">{appointment.serviceName}</div>
                          {appointment.notes && (
                            <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                              {appointment.notes}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t">
                          <span className="text-sm font-medium">₹{appointment.price}</span>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(appointment.id, 'in-progress')}
                              className="h-7 px-2 text-xs"
                            >
                              Start
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                              className="h-7 px-2 text-xs"
                            >
                              Done
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* All Today's Appointments */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                All Today ({todayAppointments.length})
              </h3>
              
              <div className="space-y-2">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(appointment.status)}`} />
                      <div>
                        <div className="text-sm font-medium">{appointment.time}</div>
                        <div className="text-xs text-muted-foreground">{appointment.customerName}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">₹{appointment.price}</div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(appointment.status)}
                        <span className="text-xs capitalize">{appointment.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Today's Performance */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Today's Performance
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Revenue</span>
                  </div>
                  <span className="font-medium text-green-600">₹{todayStats.revenue}</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Completion Rate</span>
                  </div>
                  <span className="font-medium text-blue-600">
                    {todayStats.total > 0 ? Math.round((todayStats.completed / todayStats.total) * 100) : 0}%
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Services Done</span>
                  </div>
                  <span className="font-medium text-orange-600">{todayStats.completed}/{todayStats.total}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AppointmentsSidebar;