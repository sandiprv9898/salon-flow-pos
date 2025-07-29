import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, Plus, Minus, Trash2, Percent, 
  Tag, User, CreditCard 
} from "lucide-react";
import { type CartItem, type Customer } from "@/data/mockData";

interface CartComponentProps {
  cart: CartItem[];
  customer: Customer | null;
  onUpdateItem: (id: string, updates: Partial<CartItem>) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  total: number;
  offers: any[];
}

const CartComponent = ({
  cart,
  customer,
  onUpdateItem,
  onRemoveItem,
  onClearCart,
  onCheckout,
  total,
  offers
}: CartComponentProps) => {
  const updateQuantity = (id: string, change: number) => {
    const item = cart.find(i => i.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      onUpdateItem(id, { quantity: newQuantity });
    }
  };

  const applyDiscount = (id: string, discount: number, type: 'fixed' | 'percentage') => {
    onUpdateItem(id, { discount, discountType: type });
  };

  const itemSubtotal = (item: CartItem) => {
    const baseTotal = item.price * item.quantity;
    const discount = item.discount || 0;
    const discountAmount = item.discountType === 'percentage' 
      ? (baseTotal * discount) / 100 
      : discount;
    return baseTotal - discountAmount;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Cart ({cart.length})
        </CardTitle>
        {customer && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{customer.name}</span>
            <Badge variant={customer.type === 'vip' ? 'default' : 'secondary'}>
              {customer.type}
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-auto space-y-4">
        {cart.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                    {item.employeeName && (
                      <p className="text-xs text-primary font-medium">
                        Assigned to: {item.employeeName}
                      </p>
                    )}
                    {item.duration && (
                      <p className="text-xs text-muted-foreground">
                        Duration: {item.duration} min
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₹{itemSubtotal(item)}</p>
                    <p className="text-xs text-muted-foreground">
                      ₹{item.price} each
                    </p>
                  </div>
                </div>

                {/* Quick Discount Buttons */}
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-6"
                    onClick={() => applyDiscount(item.id, 10, 'percentage')}
                  >
                    10%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-6"
                    onClick={() => applyDiscount(item.id, 50, 'fixed')}
                  >
                    ₹50
                  </Button>
                  {item.discount && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-6"
                      onClick={() => onUpdateItem(item.id, { discount: 0 })}
                    >
                      Clear
                    </Button>
                  )}
                </div>

                {item.discount && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Tag className="w-3 h-3" />
                    Discount: {item.discountType === 'percentage' ? `${item.discount}%` : `₹${item.discount}`}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </CardContent>

      {cart.length > 0 && (
        <div className="p-6 pt-0 space-y-4">
          <Separator />
          
          {/* Total */}
          <div className="space-y-2">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              className="w-full" 
              variant="salon" 
              size="lg"
              onClick={onCheckout}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Checkout
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={onClearCart}
            >
              Clear Cart
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CartComponent;