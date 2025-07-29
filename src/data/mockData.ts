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
  cost: number;
  supplier: string;
  reorderPoint: number;
  isLowStock: boolean;
  expiryDate?: string;
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
  status: 'available' | 'busy' | 'break' | 'clocked-out';
  clockedIn?: boolean;
  clockInTime?: string;
  breakStartTime?: string;
  hoursWorked: number;
  todayEarnings: number;
  weeklyEarnings: number;
  specialties: string[];
  experienceYears: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  type: 'regular' | 'vip' | 'new' | 'member';
  lastVisit?: string;
  totalSpent: number;
  preferences?: string[];
  birthday?: string;
  allergies?: string[];
  notes?: string;
  photos?: string[];
  membershipType?: 'basic' | 'premium' | 'platinum';
  membershipExpiry?: string;
  loyaltyPoints: number;
  giftCardBalance: number;
}

export interface CartItem {
  id: string;
  name: string;
  type: 'product' | 'service' | 'package' | 'giftcard';
  price: number;
  quantity: number;
  discount?: number;
  discountType?: 'fixed' | 'percentage';
  employeeId?: string;
  employeeName?: string;
  duration?: number;
  tip?: number;
  packageContents?: string[];
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
    barcode: "8901234567890",
    cost: 180,
    supplier: "Beauty Supply Co",
    reorderPoint: 20,
    isLowStock: false,
    expiryDate: "2025-12-31"
  },
  {
    id: "p2",
    name: "Hair Conditioner",
    category: "Hair Care",
    price: 349,
    stock: 32,
    description: "Deep conditioning treatment",
    barcode: "8901234567891",
    cost: 210,
    supplier: "Beauty Supply Co",
    reorderPoint: 15,
    isLowStock: false,
    expiryDate: "2025-10-30"
  },
  {
    id: "p3",
    name: "Hair Serum",
    category: "Hair Care",
    price: 599,
    stock: 8,
    description: "Anti-frizz hair serum",
    barcode: "8901234567892",
    cost: 380,
    supplier: "Premium Hair Products",
    reorderPoint: 10,
    isLowStock: true,
    expiryDate: "2025-08-15"
  },
  {
    id: "p4",
    name: "Face Cream",
    category: "Skin Care",
    price: 899,
    stock: 25,
    description: "Anti-aging face cream",
    barcode: "8901234567893",
    cost: 520,
    supplier: "Skincare Solutions",
    reorderPoint: 12,
    isLowStock: false,
    expiryDate: "2025-11-20"
  },
  {
    id: "p5",
    name: "Face Mask",
    category: "Skin Care",
    price: 199,
    stock: 60,
    description: "Hydrating face mask",
    barcode: "8901234567894",
    cost: 95,
    supplier: "Skincare Solutions",
    reorderPoint: 25,
    isLowStock: false,
    expiryDate: "2025-09-10"
  },
  {
    id: "p6",
    name: "Hair Oil",
    category: "Hair Care",
    price: 249,
    stock: 5,
    description: "Nourishing hair oil",
    barcode: "8901234567895",
    cost: 140,
    supplier: "Natural Care Ltd",
    reorderPoint: 15,
    isLowStock: true,
    expiryDate: "2026-01-15"
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
    status: 'available',
    clockedIn: true,
    clockInTime: "09:00",
    hoursWorked: 6.5,
    todayEarnings: 2400,
    weeklyEarnings: 12000,
    specialties: ["Hair", "Beauty"],
    experienceYears: 8
  },
  {
    id: "e2",
    name: "Mike Chen",
    role: "Hair Colorist",
    phone: "+91 98765 43211",
    email: "mike@salon.com",
    commission: 30,
    status: 'busy',
    clockedIn: true,
    clockInTime: "08:30",
    hoursWorked: 7,
    todayEarnings: 3200,
    weeklyEarnings: 15800,
    specialties: ["Hair"],
    experienceYears: 12
  },
  {
    id: "e3",
    name: "Priya Sharma",
    role: "Beautician",
    phone: "+91 98765 43212",
    email: "priya@salon.com",
    commission: 22,
    status: 'available',
    clockedIn: true,
    clockInTime: "09:15",
    hoursWorked: 6,
    todayEarnings: 1800,
    weeklyEarnings: 9600,
    specialties: ["Skin", "Beauty", "Massage"],
    experienceYears: 5
  },
  {
    id: "e4",
    name: "David Wilson",
    role: "Junior Stylist",
    phone: "+91 98765 43213",
    email: "david@salon.com",
    commission: 18,
    status: 'break',
    clockedIn: true,
    clockInTime: "10:00",
    breakStartTime: "14:30",
    hoursWorked: 4.5,
    todayEarnings: 1200,
    weeklyEarnings: 7200,
    specialties: ["Hair"],
    experienceYears: 2
  }
];

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: "c1",
    name: "Emma Watson",
    phone: "+91 90123 45678",
    email: "emma@email.com",
    type: "member",
    lastVisit: "2024-01-20",
    totalSpent: 15600,
    preferences: ["Hair Coloring", "Facial"],
    birthday: "1990-04-15",
    allergies: ["Sulfates"],
    notes: "Prefers organic products, sensitive skin",
    membershipType: "platinum",
    membershipExpiry: "2024-12-31",
    loyaltyPoints: 1560,
    giftCardBalance: 500
  },
  {
    id: "c2",
    name: "John Smith",
    phone: "+91 90123 45679",
    email: "john@email.com",
    type: "regular",
    lastVisit: "2024-01-18",
    totalSpent: 4200,
    preferences: ["Haircut"],
    birthday: "1985-08-22",
    allergies: [],
    notes: "Comes every 3 weeks",
    loyaltyPoints: 420,
    giftCardBalance: 0
  },
  {
    id: "c3",
    name: "Lisa Chen",
    phone: "+91 90123 45680",
    type: "new",
    totalSpent: 0,
    preferences: [],
    allergies: [],
    loyaltyPoints: 0,
    giftCardBalance: 0
  },
  {
    id: "c4",
    name: "Raj Patel",
    phone: "+91 90123 45681",
    email: "raj@email.com",
    type: "member",
    lastVisit: "2024-01-15",
    totalSpent: 8900,
    preferences: ["Hair Wash", "Haircut"],
    birthday: "1992-12-10",
    allergies: ["Parabens"],
    notes: "Works nearby, prefers evening appointments",
    membershipType: "basic",
    membershipExpiry: "2024-06-30",
    loyaltyPoints: 890,
    giftCardBalance: 200
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

// Service Packages
export const servicePackages = [
  {
    id: "pkg1",
    name: "Bridal Package",
    services: ["s1", "s3", "s5", "s7"],
    originalPrice: 4796,
    packagePrice: 3999,
    duration: 240,
    description: "Complete bridal makeover package"
  },
  {
    id: "pkg2",
    name: "Monthly Maintenance",
    services: ["s1", "s2", "s4"],
    originalPrice: 1897,
    packagePrice: 1599,
    duration: 135,
    description: "Monthly hair care package"
  },
  {
    id: "pkg3",
    name: "Spa Day",
    services: ["s5", "s7", "s8"],
    originalPrice: 2697,
    packagePrice: 2199,
    duration: 180,
    description: "Relaxing spa experience"
  }
];

// Waitlist entries
export const waitlistEntries = [
  {
    id: "w1",
    customerName: "Sarah Miller",
    phone: "+91 98765 00001",
    preferredService: "Hair Coloring",
    preferredEmployee: "Mike Chen",
    preferredDate: "2024-01-25",
    timeFrame: "morning",
    priority: "high"
  },
  {
    id: "w2",
    customerName: "Alex Johnson",
    phone: "+91 98765 00002",
    preferredService: "Haircut",
    preferredEmployee: "any",
    preferredDate: "2024-01-24",
    timeFrame: "afternoon",
    priority: "normal"
  }
];

// Mock Appointments for today
export const mockTodayAppointments = [
  {
    id: "apt1",
    customerId: "c1",
    serviceIds: ["s3"],
    employeeId: "e2",
    date: "2024-01-25",
    time: "10:00",
    duration: 120,
    status: 'scheduled' as const,
    notes: "First time coloring, allergic to sulfates"
  },
  {
    id: "apt2",
    customerId: "c2", 
    serviceIds: ["s1"],
    employeeId: "e1",
    date: "2024-01-25",
    time: "11:30",
    duration: 45,
    status: 'in-progress' as const,
    notes: "Regular customer"
  },
  {
    id: "apt3",
    customerId: "c3",
    serviceIds: ["s5"],
    employeeId: "e3",
    date: "2024-01-25", 
    time: "14:00",
    duration: 75,
    status: 'scheduled' as const,
    notes: "New customer, first facial"
  },
  {
    id: "apt4",
    customerId: "c4",
    serviceIds: ["s7"],
    employeeId: "e3",
    date: "2024-01-25",
    time: "15:30", 
    duration: 45,
    status: 'scheduled' as const,
    notes: "Regular manicure appointment"
  },
  {
    id: "apt5",
    customerId: "c1",
    serviceIds: ["s8"],
    employeeId: "e4",
    date: "2024-01-25",
    time: "16:30",
    duration: 60,
    status: 'scheduled' as const,
    notes: "VIP customer pedicure"
  }
];

// Mock Payment Methods
export const paymentMethods = [
  { id: "cash", name: "Cash", icon: "💵" },
  { id: "card", name: "Card", icon: "💳" },
  { id: "upi", name: "UPI", icon: "📱" },
  { id: "wallet", name: "Wallet", icon: "💰" },
  { id: "giftcard", name: "Gift Card", icon: "🎁" },
  { id: "loyalty", name: "Loyalty Points", icon: "⭐" }
];