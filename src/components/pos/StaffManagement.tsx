import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Clock, Coffee, LogIn, LogOut, DollarSign, 
  TrendingUp, User, AlertCircle, CheckCircle 
} from "lucide-react";
import { mockEmployees, type Employee } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface StaffManagementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StaffManagement = ({ open, onOpenChange }: StaffManagementProps) => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState(mockEmployees);

  const handleClockIn = (employeeId: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId 
        ? { ...emp, clockedIn: true, clockInTime: new Date().toLocaleTimeString(), status: 'available' as const }
        : emp
    ));
    toast({ title: "Clocked in successfully" });
  };

  const handleClockOut = (employeeId: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId 
        ? { ...emp, clockedIn: false, status: 'clocked-out' as const }
        : emp
    ));
    toast({ title: "Clocked out successfully" });
  };

  const handleBreak = (employeeId: string, isBreak: boolean) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId 
        ? { 
            ...emp, 
            status: isBreak ? 'break' as const : 'available' as const,
            breakStartTime: isBreak ? new Date().toLocaleTimeString() : undefined
          }
        : emp
    ));
    toast({ title: isBreak ? "Break started" : "Break ended" });
  };

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'break': return 'bg-yellow-500';
      case 'clocked-out': return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Employee['status']) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'busy': return <AlertCircle className="w-4 h-4" />;
      case 'break': return <Coffee className="w-4 h-4" />;
      case 'clocked-out': return <LogOut className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Staff Management
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <Card key={employee.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{employee.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(employee.status)}`} />
                    {getStatusIcon(employee.status)}
                  </div>
                </div>
                <Badge variant="outline" className="w-fit capitalize">
                  {employee.status.replace('-', ' ')}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Clock Status */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>
                      {employee.clockedIn 
                        ? `In since ${employee.clockInTime}` 
                        : 'Not clocked in'
                      }
                    </span>
                  </div>
                  {employee.status === 'break' && employee.breakStartTime && (
                    <div className="flex items-center gap-2 text-sm text-yellow-600">
                      <Coffee className="w-4 h-4" />
                      <span>Break since {employee.breakStartTime}</span>
                    </div>
                  )}
                </div>

                {/* Earnings */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span>Today: ₹{employee.todayEarnings}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Week: ₹{employee.weeklyEarnings}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Hours worked: {employee.hoursWorked}h
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  {!employee.clockedIn ? (
                    <Button 
                      size="sm" 
                      onClick={() => handleClockIn(employee.id)}
                      className="w-full"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Clock In
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleClockOut(employee.id)}
                        className="flex-1"
                      >
                        <LogOut className="w-4 h-4 mr-1" />
                        Clock Out
                      </Button>
                      <Button 
                        size="sm" 
                        variant={employee.status === 'break' ? 'default' : 'outline'}
                        onClick={() => handleBreak(employee.id, employee.status !== 'break')}
                        className="flex-1"
                      >
                        <Coffee className="w-4 h-4 mr-1" />
                        {employee.status === 'break' ? 'End Break' : 'Break'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {employees.filter(e => e.status === 'available').length}
              </div>
              <p className="text-xs text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {employees.filter(e => e.status === 'busy').length}
              </div>
              <p className="text-xs text-muted-foreground">Busy</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">
                {employees.filter(e => e.status === 'break').length}
              </div>
              <p className="text-xs text-muted-foreground">On Break</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                ₹{employees.reduce((sum, e) => sum + e.todayEarnings, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total Earnings</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StaffManagement;