// Mock data for the Salon POS system

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  description?: string;
  barcode?: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number; // in minutes
  description?: string;
  commission: number; // percentage
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  commission: number;
  avatar?: string;
  status: 'available' | 'busy' | 'break';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  type: 'regular' | 'vip' | 'new';
  lastVisit?: string;
  totalSpent: number;
  preferences?: string[];
}

export interface CartItem {
  id: string;
  name: string;
  type: 'product' | 'service';
  price: number;
  quantity: number;
  discount?: number;
  discountType?: 'fixed' | 'percentage';
  employeeId?: string;
  duration?: number;
}

export interface Appointment {
  id: string;
  customerId: string;
  serviceIds: string[];
  employeeId: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
}

// Mock Products
export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Professional Shampoo",
    category: "Hair Care",
    price: 299,
    stock: 45,
    description: "Premium moisturizing shampoo for all hair types",
    barcode: "8901234567890"
  },
  {
    id: "p2",
    name: "Hair Conditioner",
    category: "Hair Care",
    price: 349,
    stock: 32,
    description: "Deep conditioning treatment",
    barcode: "8901234567891"
  },
  {
    id: "p3",
    name: "Hair Serum",
    category: "Hair Care",
    price: 599,
    stock: 18,
    description: "Anti-frizz hair serum",
    barcode: "8901234567892"
  },
  {
    id: "p4",
    name: "Face Cream",
    category: "Skin Care",
    price: 899,
    stock: 25,
    description: "Anti-aging face cream",
    barcode: "8901234567893"
  },
  {
    id: "p5",
    name: "Face Mask",
    category: "Skin Care",
    price: 199,
    stock: 60,
    description: "Hydrating face mask",
    barcode: "8901234567894"
  },
  {
    id: "p6",
    name: "Hair Oil",
    category: "Hair Care",
    price: 249,
    stock: 38,
    description: "Nourishing hair oil",
    barcode: "8901234567895"
  }
];

// Mock Services
export const mockServices: Service[] = [
  {
    id: "s1",
    name: "Haircut & Styling",
    category: "Hair",
    price: 799,
    duration: 45,
    description: "Professional haircut with styling",
    commission: 20
  },
  {
    id: "s2",
    name: "Hair Wash & Blow Dry",
    category: "Hair",
    price: 399,
    duration: 30,
    description: "Hair wash with professional blow dry",
    commission: 15
  },
  {
    id: "s3",
    name: "Hair Coloring",
    category: "Hair",
    price: 2499,
    duration: 120,
    description: "Complete hair coloring service",
    commission: 25
  },
  {
    id: "s4",
    name: "Deep Conditioning",
    category: "Hair",
    price: 699,
    duration: 60,
    description: "Intensive hair conditioning treatment",
    commission: 18
  },
  {
    id: "s5",
    name: "Facial Treatment",
    category: "Skin",
    price: 1299,
    duration: 75,
    description: "Complete facial with cleansing and moisturizing",
    commission: 22
  },
  {
    id: "s6",
    name: "Eyebrow Threading",
    category: "Beauty",
    price: 199,
    duration: 15,
    description: "Precision eyebrow shaping",
    commission: 30
  },
  {
    id: "s7",
    name: "Manicure",
    category: "Beauty",
    price: 599,
    duration: 45,
    description: "Complete nail care and polish",
    commission: 20
  },
  {
    id: "s8",
    name: "Pedicure",
    category: "Beauty",
    price: 799,
    duration: 60,
    description: "Foot care and nail polish",
    commission: 20
  }
];

// Mock Employees
export const mockEmployees: Employee[] = [
  {
    id: "e1",
    name: "Sarah Johnson",
    role: "Senior Stylist",
    phone: "+91 98765 43210",
    email: "sarah@salon.com",
    commission: 25,
    status: 'available'
  },
  {
    id: "e2",
    name: "Mike Chen",
    role: "Hair Colorist",
    phone: "+91 98765 43211",
    email: "mike@salon.com",
    commission: 30,
    status: 'busy'
  },
  {
    id: "e3",
    name: "Priya Sharma",
    role: "Beautician",
    phone: "+91 98765 43212",
    email: "priya@salon.com",
    commission: 22,
    status: 'available'
  },
  {
    id: "e4",
    name: "David Wilson",
    role: "Junior Stylist",
    phone: "+91 98765 43213",
    email: "david@salon.com",
    commission: 18,
    status: 'break'
  }
];

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: "c1",
    name: "Emma Watson",
    phone: "+91 90123 45678",
    email: "emma@email.com",
    type: "vip",
    lastVisit: "2024-01-20",
    totalSpent: 15600,
    preferences: ["Hair Coloring", "Facial"]
  },
  {
    id: "c2",
    name: "John Smith",
    phone: "+91 90123 45679",
    email: "john@email.com",
    type: "regular",
    lastVisit: "2024-01-18",
    totalSpent: 4200,
    preferences: ["Haircut"]
  },
  {
    id: "c3",
    name: "Lisa Chen",
    phone: "+91 90123 45680",
    type: "new",
    totalSpent: 0,
    preferences: []
  },
  {
    id: "c4",
    name: "Raj Patel",
    phone: "+91 90123 45681",
    email: "raj@email.com",
    type: "regular",
    lastVisit: "2024-01-15",
    totalSpent: 8900,
    preferences: ["Hair Wash", "Haircut"]
  }
];

// Mock Offers and Discounts
export const mockOffers = [
  {
    id: "o1",
    name: "Weekend Special",
    type: "percentage",
    value: 15,
    applicable: "services",
    active: true,
    validUntil: "2024-02-29"
  },
  {
    id: "o2",
    name: "Valentine's Day",
    type: "percentage",
    value: 20,
    applicable: "facial",
    active: true,
    validUntil: "2024-02-14"
  },
  {
    id: "o3",
    name: "Product Bundle",
    type: "fixed",
    value: 200,
    applicable: "products",
    active: true,
    validUntil: "2024-03-31"
  }
];

// Mock Payment Methods
export const paymentMethods = [
  { id: "cash", name: "Cash", icon: "💵" },
  { id: "card", name: "Card", icon: "💳" },
  { id: "upi", name: "UPI", icon: "📱" },
  { id: "wallet", name: "Wallet", icon: "💰" }
];