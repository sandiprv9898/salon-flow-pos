import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, Calendar, Users, Package, 
  DollarSign, Clock, Award, Target,
  Download, Printer, RefreshCw
} from "lucide-react";

interface ReportsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionData: {
    startTime: string;
    totalSales: number;
    transactionCount: number;
    cashAmount: number;
  };
}

const ReportsModal = ({ open, onOpenChange, sessionData }: ReportsModalProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  // Mock data for reports
  const mockDailyStats = {
    revenue: 15750,
    transactions: 23,
    customers: 18,
    avgTicket: 684,
    topServices: [
      { name: "Hair Coloring", sales: 4, revenue: 9996 },
      { name: "Haircut & Styling", sales: 8, revenue: 6392 },
      { name: "Facial Treatment", sales: 3, revenue: 3897 }
    ],
    topProducts: [
      { name: "Hair Serum", sales: 12, revenue: 7188 },
      { name: "Face Cream", sales: 8, revenue: 7192 },
      { name: "Professional Shampoo", sales: 15, revenue: 4485 }
    ],
    employeePerformance: [
      { name: "Sarah Johnson", services: 8, revenue: 6750, commission: 1687.5 },
      { name: "Mike Chen", services: 6, revenue: 5240, commission: 1572 },
      { name: "Priya Sharma", services: 5, revenue: 3760, commission: 827.2 }
    ],
    paymentMethods: [
      { method: "Card", count: 12, amount: 8460 },
      { method: "UPI", count: 8, amount: 5290 },
      { method: "Cash", count: 3, amount: 2000 }
    ]
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;
  const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Reports & Analytics
            </DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="employees">Staff</TabsTrigger>
            <TabsTrigger value="session">Session</TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Today's Revenue</p>
                      <p className="text-2xl font-bold">{formatCurrency(mockDailyStats.revenue)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="mt-2 text-xs text-green-600">
                    +12% from yesterday
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Transactions</p>
                      <p className="text-2xl font-bold">{mockDailyStats.transactions}</p>
                    </div>
                    <RefreshCw className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="mt-2 text-xs text-blue-600">
                    +5 from yesterday
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Customers</p>
                      <p className="text-2xl font-bold">{mockDailyStats.customers}</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="mt-2 text-xs text-purple-600">
                    3 new customers
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Ticket</p>
                      <p className="text-2xl font-bold">{formatCurrency(mockDailyStats.avgTicket)}</p>
                    </div>
                    <Target className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="mt-2 text-xs text-orange-600">
                    +8% from last week
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Services Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockDailyStats.topServices.map((service, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">{service.sales} bookings</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(service.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Products Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockDailyStats.topProducts.map((product, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.sales} sold</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(product.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sales Report */}
          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockDailyStats.paymentMethods.map((payment, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{payment.method}</span>
                          <Badge variant="outline">{payment.count} txns</Badge>
                        </div>
                        <span className="font-semibold">{formatCurrency(payment.amount)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sales Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">
                        {formatCurrency(mockDailyStats.revenue)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Sales Today</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold">68%</p>
                        <p className="text-xs text-muted-foreground">Services</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">32%</p>
                        <p className="text-xs text-muted-foreground">Products</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Employee Performance */}
          <TabsContent value="employees" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Performance Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDailyStats.employeePerformance.map((employee, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{employee.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {employee.services} services completed
                          </p>
                        </div>
                        <Badge variant="outline">
                          <Award className="w-3 h-3 mr-1" />
                          Top Performer
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Revenue Generated</p>
                          <p className="font-semibold text-lg">{formatCurrency(employee.revenue)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Commission Earned</p>
                          <p className="font-semibold text-lg text-green-600">
                            {formatCurrency(employee.commission)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Session Report */}
          <TabsContent value="session" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Session</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Session Started:</span>
                    <span className="font-medium">{formatTime(sessionData.startTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">
                      {Math.floor((Date.now() - new Date(sessionData.startTime).getTime()) / (1000 * 60))} minutes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Sales:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(sessionData.totalSales)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transactions:</span>
                    <span className="font-medium">{sessionData.transactionCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cash in Register:</span>
                    <span className="font-medium">{formatCurrency(sessionData.cashAmount)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Register Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatCurrency(sessionData.cashAmount)}</p>
                    <p className="text-sm text-muted-foreground">Current Cash Balance</p>
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Cash In
                    </Button>
                    <Button variant="outline" className="w-full">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Cash Out
                    </Button>
                    <Button variant="destructive" className="w-full">
                      <Clock className="w-4 h-4 mr-2" />
                      Close Register
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ReportsModal;