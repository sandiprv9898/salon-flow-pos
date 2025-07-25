import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  LogOut, ShoppingCart, User, Calendar, Users, 
  Package, Receipt, Settings, Search, Plus, Minus,
  Trash2, Calculator, CreditCard, Smartphone,
  Wallet, DollarSign, Percent, Tag, Clock,
  CheckCircle, XCircle, UserCheck, TrendingUp
} from "lucide-react";
import { 
  mockProducts, mockServices, mockEmployees, mockCustomers, 
  paymentMethods, mockOffers, type CartItem, type Product, 
  type Service, type Customer, type Employee 
} from "@/data/mockData";
import CartComponent from "@/components/pos/CartComponent";
import ProductGrid from "@/components/pos/ProductGrid";
import ServiceGrid from "@/components/pos/ServiceGrid";
import CustomerSelector from "@/components/pos/CustomerSelector";
import CheckoutModal from "@/components/pos/CheckoutModal";
import AppointmentModal from "@/components/pos/AppointmentModal";
import ReportsModal from "@/components/pos/ReportsModal";

const POS = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [sessionData, setSessionData] = useState({
    startTime: new Date().toISOString(),
    totalSales: 0,
    transactionCount: 0,
    cashAmount: 1000 // Starting cash
  });

  useEffect(() => {
    const userData = localStorage.getItem("salonUser");
    if (!userData) {
      navigate("/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("salonUser");
    toast({ title: "Logged out successfully" });
    navigate("/login");
  };

  const addToCart = (item: Product | Service, type: 'product' | 'service') => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem && type === 'product') {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      const newItem: CartItem = {
        id: item.id,
        name: item.name,
        type,
        price: item.price,
        quantity: 1,
        duration: type === 'service' ? (item as Service).duration : undefined
      };
      setCart([...cart, newItem]);
    }
    
    toast({
      title: "Added to cart",
      description: `${item.name} added successfully`,
    });
  };

  const updateCartItem = (id: string, updates: Partial<CartItem>) => {
    setCart(cart.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
    toast({ title: "Item removed from cart" });
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    toast({ title: "Cart cleared" });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const discount = item.discount || 0;
      const discountAmount = item.discountType === 'percentage' 
        ? (itemTotal * discount) / 100 
        : discount;
      return total + (itemTotal - discountAmount);
    }, 0);
  };

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServices = mockServices.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Salon POS
            </h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {user.role}
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Session: {new Date(sessionData.startTime).toLocaleTimeString()}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowReports(true)}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Reports
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 h-[calc(100vh-80px)]">
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Search and Customer Selection */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products and services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <CustomerSelector
                customers={mockCustomers}
                selectedCustomer={selectedCustomer}
                onSelectCustomer={setSelectedCustomer}
              />
              <Button
                variant="outline"
                onClick={() => setShowAppointments(true)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Appointments
              </Button>
            </div>
          </div>

          {/* Product/Service Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Services
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <ProductGrid
                products={filteredProducts}
                onAddToCart={(product) => addToCart(product, 'product')}
              />
            </TabsContent>

            <TabsContent value="services">
              <ServiceGrid
                services={filteredServices}
                employees={mockEmployees}
                onAddToCart={(service) => addToCart(service, 'service')}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Cart Sidebar */}
        <div className="w-96 bg-white/50 backdrop-blur-sm border-l p-6 overflow-auto">
          <CartComponent
            cart={cart}
            customer={selectedCustomer}
            onUpdateItem={updateCartItem}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
            onCheckout={() => setShowCheckout(true)}
            total={calculateTotal()}
            offers={mockOffers}
          />
        </div>
      </div>

      {/* Modals */}
      <CheckoutModal
        open={showCheckout}
        onOpenChange={setShowCheckout}
        cart={cart}
        customer={selectedCustomer}
        total={calculateTotal()}
        paymentMethods={paymentMethods}
        onComplete={(transactionData) => {
          setSessionData(prev => ({
            ...prev,
            totalSales: prev.totalSales + transactionData.total,
            transactionCount: prev.transactionCount + 1
          }));
          clearCart();
          setShowCheckout(false);
          toast({
            title: "Transaction Completed",
            description: `₹${transactionData.total} payment successful`,
          });
        }}
      />

      <AppointmentModal
        open={showAppointments}
        onOpenChange={setShowAppointments}
        customers={mockCustomers}
        services={mockServices}
        employees={mockEmployees}
      />

      <ReportsModal
        open={showReports}
        onOpenChange={setShowReports}
        sessionData={sessionData}
      />
    </div>
  );
};

export default POS;