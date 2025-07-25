import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CreditCard, Smartphone, Wallet, DollarSign, 
  Receipt, Printer, Download, Check, User,
  Percent, Plus
} from "lucide-react";
import { type CartItem, type Customer } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  customer: Customer | null;
  total: number;
  paymentMethods: Array<{id: string; name: string; icon: string}>;
  onComplete: (data: any) => void;
}

const CheckoutModal = ({
  open,
  onOpenChange,
  cart,
  customer,
  total,
  paymentMethods,
  onComplete
}: CheckoutModalProps) => {
  const { toast } = useToast();
  const [paymentData, setPaymentData] = useState({
    method: "",
    amount: total,
    splitPayments: [] as Array<{method: string; amount: number}>,
    discount: 0,
    discountType: "percentage" as "percentage" | "fixed",
    tax: total * 0.18, // 18% GST
    notes: "",
    customerPaid: 0,
    change: 0
  });

  const finalTotal = total - (paymentData.discountType === "percentage" 
    ? (total * paymentData.discount) / 100 
    : paymentData.discount) + paymentData.tax;

  const handlePaymentAmountChange = (amount: number) => {
    setPaymentData(prev => ({
      ...prev,
      customerPaid: amount,
      change: Math.max(0, amount - finalTotal)
    }));
  };

  const addSplitPayment = () => {
    if (paymentData.method && paymentData.amount > 0) {
      setPaymentData(prev => ({
        ...prev,
        splitPayments: [...prev.splitPayments, { 
          method: prev.method, 
          amount: prev.amount 
        }],
        method: "",
        amount: 0
      }));
    }
  };

  const processPayment = () => {
    const transactionData = {
      id: `TXN${Date.now()}`,
      timestamp: new Date().toISOString(),
      customer,
      items: cart,
      subtotal: total,
      discount: paymentData.discount,
      discountType: paymentData.discountType,
      tax: paymentData.tax,
      total: finalTotal,
      payments: paymentData.splitPayments.length > 0 
        ? paymentData.splitPayments 
        : [{ method: paymentData.method, amount: finalTotal }],
      notes: paymentData.notes,
      change: paymentData.change
    };

    onComplete(transactionData);
    
    // Reset form
    setPaymentData({
      method: "",
      amount: total,
      splitPayments: [],
      discount: 0,
      discountType: "percentage",
      tax: total * 0.18,
      notes: "",
      customerPaid: 0,
      change: 0
    });
  };

  const getPaymentIcon = (methodId: string) => {
    const icons = {
      cash: <DollarSign className="w-4 h-4" />,
      card: <CreditCard className="w-4 h-4" />,
      upi: <Smartphone className="w-4 h-4" />,
      wallet: <Wallet className="w-4 h-4" />
    };
    return icons[methodId as keyof typeof icons] || <CreditCard className="w-4 h-4" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Checkout
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          {customer && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{customer.name}</span>
                <Badge variant={customer.type === 'vip' ? 'default' : 'secondary'}>
                  {customer.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{customer.phone}</p>
            </div>
          )}

          {/* Order Summary */}
          <div className="space-y-3">
            <h3 className="font-medium">Order Summary</h3>
            <div className="space-y-2 max-h-40 overflow-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Discount Section */}
          <div className="space-y-3">
            <Label>Apply Discount</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Discount amount"
                value={paymentData.discount}
                onChange={(e) => setPaymentData(prev => ({
                  ...prev,
                  discount: Number(e.target.value)
                }))}
              />
              <Select
                value={paymentData.discountType}
                onValueChange={(value: "percentage" | "fixed") =>
                  setPaymentData(prev => ({ ...prev, discountType: value }))
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">%</SelectItem>
                  <SelectItem value="fixed">₹</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            {paymentData.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-₹{(paymentData.discountType === "percentage" 
                  ? (total * paymentData.discount) / 100 
                  : paymentData.discount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax (18%):</span>
              <span>₹{paymentData.tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Split Payments Display */}
          {paymentData.splitPayments.length > 0 && (
            <div className="space-y-2">
              <Label>Split Payments</Label>
              {paymentData.splitPayments.map((payment, index) => (
                <div key={index} className="flex justify-between items-center bg-green-50 p-2 rounded">
                  <span>{payment.method}: ₹{payment.amount}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPaymentData(prev => ({
                      ...prev,
                      splitPayments: prev.splitPayments.filter((_, i) => i !== index)
                    }))}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <div className="text-sm text-muted-foreground">
                Remaining: ₹{(finalTotal - paymentData.splitPayments.reduce((sum, p) => sum + p.amount, 0)).toFixed(2)}
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => (
                <Button
                  key={method.id}
                  variant={paymentData.method === method.id ? "default" : "outline"}
                  onClick={() => setPaymentData(prev => ({ ...prev, method: method.id }))}
                  className="justify-start"
                >
                  {getPaymentIcon(method.id)}
                  <span className="ml-2">{method.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Payment Amount */}
          <div className="space-y-3">
            <Label>Amount Received</Label>
            <Input
              type="number"
              placeholder="Enter amount received"
              value={paymentData.customerPaid}
              onChange={(e) => handlePaymentAmountChange(Number(e.target.value))}
            />
            {paymentData.change > 0 && (
              <div className="text-sm font-medium text-green-600">
                Change to return: ₹{paymentData.change.toFixed(2)}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePaymentAmountChange(finalTotal)}
            >
              Exact Amount
            </Button>
          </div>

          {/* Add Split Payment */}
          {paymentData.splitPayments.length < 3 && (
            <Button
              variant="outline"
              onClick={addSplitPayment}
              disabled={!paymentData.method || paymentData.amount <= 0}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Split Payment
            </Button>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Add any notes for this transaction..."
              value={paymentData.notes}
              onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={processPayment}
              disabled={!paymentData.method || paymentData.customerPaid < finalTotal}
              className="flex-1"
              variant="salon"
            >
              <Check className="w-4 h-4 mr-2" />
              Complete Payment
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 text-sm">
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-1" />
              Print Receipt
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;