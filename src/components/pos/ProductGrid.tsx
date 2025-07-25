import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, AlertCircle } from "lucide-react";
import { type Product } from "@/data/mockData";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      "Hair Care": "bg-blue-100 text-blue-800",
      "Skin Care": "bg-green-100 text-green-800",
      "Beauty": "bg-pink-100 text-pink-800",
      "Tools": "bg-purple-100 text-purple-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: "Out of Stock", color: "destructive" };
    if (stock <= 10) return { status: "Low Stock", color: "warning" };
    return { status: "In Stock", color: "success" };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => {
        const stockInfo = getStockStatus(product.stock);
        
        return (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-base mb-1">{product.name}</CardTitle>
                  <Badge className={`text-xs ${getCategoryColor(product.category)}`}>
                    {product.category}
                  </Badge>
                </div>
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {product.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              )}

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">₹{product.price}</p>
                  <div className="flex items-center gap-1">
                    <Badge 
                      variant={stockInfo.color as any}
                      className="text-xs"
                    >
                      {stockInfo.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      ({product.stock} left)
                    </span>
                  </div>
                </div>
              </div>

              {product.barcode && (
                <p className="text-xs text-muted-foreground">
                  Code: {product.barcode}
                </p>
              )}

              <Button
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
                className="w-full"
                variant={product.stock === 0 ? "outline" : "default"}
              >
                {product.stock === 0 ? (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Out of Stock
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProductGrid;