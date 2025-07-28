import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Calculator, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock,
  LogOut,
  Settings,
  BarChart3
} from "lucide-react";

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [registerStatus, setRegisterStatus] = useState<'closed' | 'open'>('closed');
  const [registerBalance, setRegisterBalance] = useState(5000);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("salonUser");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.role !== "Manager") {
        navigate("/employee-login");
      }
    } else {
      navigate("/login");
    }

    // Check register status from localStorage
    const status = localStorage.getItem("registerStatus");
    if (status) {
      setRegisterStatus(status as 'closed' | 'open');
    }
  }, [navigate]);

  const handleOpenRegister = () => {
    setRegisterStatus('open');
    localStorage.setItem("registerStatus", "open");
    localStorage.setItem("registerOpenTime", new Date().toISOString());
    toast({
      title: "Register Opened",
      description: "Employees can now access the POS system",
    });
  };

  const handleCloseRegister = () => {
    setRegisterStatus('closed');
    localStorage.setItem("registerStatus", "closed");
    localStorage.setItem("registerCloseTime", new Date().toISOString());
    toast({
      title: "Register Closed",
      description: "POS access has been disabled for employees",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("salonUser");
    localStorage.removeItem("registerStatus");
    navigate("/login");
  };

  const handleViewEmployees = () => {
    navigate("/employee-login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome, {user.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={registerStatus === 'open' ? 'default' : 'secondary'}>
                Register {registerStatus}
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Register Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Register Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Register Status</h3>
                    <p className="text-sm text-muted-foreground">
                      {registerStatus === 'open' 
                        ? 'Employees can access POS system' 
                        : 'POS access disabled for employees'
                      }
                    </p>
                  </div>
                  <Badge 
                    variant={registerStatus === 'open' ? 'default' : 'secondary'}
                    className="text-sm"
                  >
                    {registerStatus.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Starting Cash</h3>
                    <p className="text-2xl font-bold">₹{registerBalance.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-muted-foreground" />
                </div>

                <div className="flex gap-3">
                  {registerStatus === 'closed' ? (
                    <Button 
                      onClick={handleOpenRegister}
                      className="flex-1"
                      variant="salon"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Open Register
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleCloseRegister}
                      variant="destructive"
                      className="flex-1"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Close Register
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={handleViewEmployees}
                    className="flex-1"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View Employees
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Today's Summary */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Today's Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">₹25,400</div>
                    <p className="text-sm text-muted-foreground">Total Sales</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">47</div>
                    <p className="text-sm text-muted-foreground">Transactions</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">₹1,840</div>
                    <p className="text-sm text-muted-foreground">Commissions</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">32</div>
                    <p className="text-sm text-muted-foreground">Customers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/pos")}
                  disabled={registerStatus === 'closed'}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Open POS
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Staff
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Manager
                </Button>
              </CardContent>
            </Card>

            {/* Register Hours */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Register Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {registerStatus === 'open' ? (
                    <>
                      <div className="flex justify-between">
                        <span>Opened:</span>
                        <span>{new Date().toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="text-green-600">Active</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      Register is currently closed
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;