import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Users, Plus, Search, Phone, Star } from "lucide-react";
import { type Customer } from "@/data/mockData";

interface CustomerSelectorProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
}

const CustomerSelector = ({ 
  customers, 
  selectedCustomer, 
  onSelectCustomer 
}: CustomerSelectorProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    type: "regular" as "regular" | "vip" | "new"
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleCreateCustomer = () => {
    if (newCustomer.name && newCustomer.phone) {
      const customer: Customer = {
        id: `c${Date.now()}`,
        name: newCustomer.name,
        phone: newCustomer.phone,
        email: newCustomer.email || undefined,
        type: newCustomer.type,
        totalSpent: 0,
        preferences: []
      };
      
      onSelectCustomer(customer);
      setNewCustomer({ name: "", phone: "", email: "", type: "regular" });
      setShowDialog(false);
    }
  };

  const getCustomerBadge = (customer: Customer) => {
    switch (customer.type) {
      case 'vip':
        return <Badge className="bg-yellow-100 text-yellow-800"><Star className="w-3 h-3 mr-1" />VIP</Badge>;
      case 'new':
        return <Badge variant="secondary">New</Badge>;
      default:
        return <Badge variant="outline">Regular</Badge>;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {selectedCustomer ? (
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
          <User className="w-4 h-4" />
          <div className="text-sm">
            <p className="font-medium">{selectedCustomer.name}</p>
            <p className="text-xs text-muted-foreground">{selectedCustomer.phone}</p>
          </div>
          {getCustomerBadge(selectedCustomer)}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectCustomer(null)}
          >
            ×
          </Button>
        </div>
      ) : (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Select Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Select or Add Customer</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Search Existing Customers */}
              <div>
                <Label className="text-sm font-medium">Search Customers</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Customer List */}
              {searchTerm && (
                <div className="max-h-40 overflow-auto space-y-2">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer"
                      onClick={() => {
                        onSelectCustomer(customer);
                        setShowDialog(false);
                        setSearchTerm("");
                      }}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </p>
                      </div>
                      {getCustomerBadge(customer)}
                    </div>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No customers found
                    </p>
                  )}
                </div>
              )}

              {/* Add New Customer */}
              <div className="border-t pt-4">
                <Label className="text-sm font-medium">Add New Customer</Label>
                <div className="space-y-3 mt-2">
                  <Input
                    placeholder="Full Name *"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  />
                  <Input
                    placeholder="Phone Number *"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  />
                  <Input
                    placeholder="Email (optional)"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  />
                  <Select 
                    value={newCustomer.type} 
                    onValueChange={(value: "regular" | "vip" | "new") => 
                      setNewCustomer({...newCustomer, type: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Customer</SelectItem>
                      <SelectItem value="regular">Regular Customer</SelectItem>
                      <SelectItem value="vip">VIP Customer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleCreateCustomer}
                    disabled={!newCustomer.name || !newCustomer.phone}
                    className="w-full"
                    variant="salon"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Customer
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CustomerSelector;