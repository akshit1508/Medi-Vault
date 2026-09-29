export interface Product {
  id?: number;
  name: string;
  batchNumber?: string;
  category?: string;
  drugType?: string;
  price: number;
  expiryDate: string;
  description?: string;
  alertThreshold: number;
  quantity: number;
  expiryAlert?: boolean;
  expiryAlertDate?: string;
  quantityAlertTriggered?: boolean;
}

export interface Customer {
  id?: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt?: string;
}

export interface Supplier {
  id?: number;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt?: string;
}

export interface BillItemRequest {
  productName: string;
  quantity: number;
  price: number;
}

export interface CheckoutRequest {
  firmName: string;
  items: BillItemRequest[];
  total?: number;
}

export interface BillItemResponse {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface BillResponse {
  id: number;
  firmName: string;
  totalAmount: number;
  billDate: string;
  items: BillItemResponse[];
}

export interface AlertSummary {
  expiringProducts: Product[];
  lowStockProducts: Product[];
  expiringCount: number;
  lowStockCount: number;
}

export interface SalesReportItem {
  label: string;
  totalSales: number;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  message: string;
}
