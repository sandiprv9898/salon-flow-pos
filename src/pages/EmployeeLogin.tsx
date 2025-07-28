import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { mockEmployees, type Employee } from "@/data/mockData";
import { 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Coffee,
  ArrowLeft,
  Calculator
} from "lucide-react";

const EmployeeLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [registerStatus, setRegisterStatus] = useState<'closed' | 'open'>('closed');
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  useEffect(() => {
    const status = localStorage.getItem("registerStatus");
    if (status) {
      setRegisterStatus(status as 'closed' | 'open');
    }
  }, []);

  const handleEmployeeLogin = (employee: Employee) => {
    if (registerStatus === 'closed') {
      toast({
        title: "Register Closed",
        description: "Please contact admin to open the register",
        variant: "destructive",
      });
      return;
    }

    // Store employee data
    localStorage.setItem("salonUser", JSON.stringify({
      ...employee,
      role: employee.role
    }));
    
    toast({
      title: "Login Successful",
      description: `Welcome ${employee.name}!`,
    });
    
    navigate("/pos");
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
      case 'clocked-out': return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate("/admin")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Employee Access</h1>
                <p className="text-sm text-muted-foreground">Select your profile to access POS</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                <Badge variant={registerStatus === 'open' ? 'default' : 'secondary'}>
                  Register {registerStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {registerStatus === 'closed' && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <div>
                  <h3 className="font-medium text-orange-900">Register is Closed</h3>
                  <p className="text-sm text-orange-700">Contact your admin to open the register before accessing POS</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <Card 
              key={employee.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                registerStatus === 'closed' ? 'opacity-50' : 'hover:scale-105'
              }`}
              onClick={() => handleEmployeeLogin(employee)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center text-white font-medium">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{employee.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{employee.role}</p>
                    </div>
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
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>
                    {employee.clockedIn 
                      ? `Clocked in at ${employee.clockInTime}` 
                      : 'Not clocked in'
                    }
                  </span>
                </div>

                {employee.status === 'break' && employee.breakStartTime && (
                  <div className="flex items-center gap-2 text-sm text-yellow-600">
                    <Coffee className="w-4 h-4" />
                    <span>On break since {employee.breakStartTime}</span>
                  </div>
                )}

                {/* Today's Performance */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Today's Earnings</p>
                    <p className="font-medium">₹{employee.todayEarnings}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Hours Worked</p>
                    <p className="font-medium">{employee.hoursWorked}h</p>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  variant={registerStatus === 'open' ? 'salon' : 'secondary'}
                  disabled={registerStatus === 'closed'}
                >
                  {registerStatus === 'open' ? 'Access POS' : 'Register Closed'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {employees.filter(e => e.status === 'available').length}
              </div>
              <p className="text-xs text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-red-600">
                {employees.filter(e => e.status === 'busy').length}
              </div>
              <p className="text-xs text-muted-foreground">Busy</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {employees.filter(e => e.status === 'break').length}
              </div>
              <p className="text-xs text-muted-foreground">On Break</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">
                {employees.filter(e => e.clockedIn).length}
              </div>
              <p className="text-xs text-muted-foreground">Clocked In</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;