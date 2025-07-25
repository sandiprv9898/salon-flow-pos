import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Package, AlertTriangle, TrendingDown, Plus, 
  Minus, Search, Filter, RefreshCw, ShoppingCart
} from "lucide-react";
import { mockProducts, type Product } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface InventoryManagementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InventoryManagement = ({ open, onOpenChange }: InventoryManagementProps) => {
  const { toast } = useToast();
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLowStock, setFilterLowStock] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterLowStock || product.isLowStock;
    return matchesSearch && matchesFilter;
  });

  const updateStock = (productId: string, change: number) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { 
            ...product, 
            stock: Math.max(0, product.stock + change),
            isLowStock: (product.stock + change) <= product.reorderPoint
          }
        : product
    ));
    toast({ 
      title: change > 0 ? "Stock added" : "Stock reduced",
      description: `Stock updated by ${Math.abs(change)} units`
    });
  };

  const reorderProduct = (product: Product) => {
    const reorderAmount = product.reorderPoint * 3; // Order 3x reorder point
    updateStock(product.id, reorderAmount);
    toast({
      title: "Reorder placed",
      description: `Ordered ${reorderAmount} units of ${product.name}`
    });
  };

  const lowStockCount = products.filter(p => p.isLowStock).length;
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);
  const profitMargin = products.reduce((sum, p) => sum + ((p.price - p.cost) * p.stock), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Inventory Management
          </DialogTitle>
        </DialogHeader>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">Total Products</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
              <p className="text-xs text-muted-foreground">Low Stock Alerts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">₹{totalValue.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">Inventory Value</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">₹{profitMargin.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">Potential Profit</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={filterLowStock ? "default" : "outline"}
            onClick={() => setFilterLowStock(!filterLowStock)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Low Stock Only
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className={product.isLowStock ? "border-red-200 bg-red-50/50" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <p className="text-xs text-muted-foreground">{product.supplier}</p>
                  </div>
                  {product.isLowStock && (
                    <Badge variant="destructive" className="ml-2">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Low Stock
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stock Info */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Stock:</span>
                    <span className={product.isLowStock ? "text-red-600 font-semibold" : ""}>
                      {product.stock} units
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Reorder Point:</span>
                    <span>{product.reorderPoint} units</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Selling Price:</span>
                    <span>₹{product.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cost Price:</span>
                    <span>₹{product.cost}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Profit Margin:</span>
                    <span className="text-green-600">
                      ₹{product.price - product.cost} ({(((product.price - product.cost) / product.price) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Expiry Date */}
                {product.expiryDate && (
                  <div className="text-xs text-muted-foreground">
                    Expires: {new Date(product.expiryDate).toLocaleDateString()}
                  </div>
                )}

                {/* Stock Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStock(product.id, -1)}
                      disabled={product.stock === 0}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-medium">{product.stock}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStock(product.id, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  {product.isLowStock && (
                    <Button
                      size="sm"
                      onClick={() => reorderProduct(product)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Reorder
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bulk Actions */}
        <div className="flex justify-center gap-4 mt-6 pt-6 border-t">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Inventory
          </Button>
          <Button variant="outline">
            <TrendingDown className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryManagement;