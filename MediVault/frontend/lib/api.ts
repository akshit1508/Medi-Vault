import {
  Product,
  Customer,
  Supplier,
  CheckoutRequest,
  BillResponse,
  AlertSummary,
  SalesReportItem,
  AuthResponse,
} from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

function getAuthHeader(): Record<string, string> {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("medivault_token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorData.error || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // Auth
  login: (data: { username: string; password: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: {
    username: string;
    password: string;
    role?: string;
    email?: string;
    phone?: string;
    specialCharacter?: string;
  }) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  forgotPassword: (data: { email: string; phone: string; specialCharacter: string }) =>
    request<{ username: string; message: string; success: boolean }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Products
  getProducts: (params?: { search?: string; drugType?: string; batchNumber?: string; prefix?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.drugType) searchParams.append("drugType", params.drugType);
    if (params?.batchNumber) searchParams.append("batchNumber", params.batchNumber);
    if (params?.prefix) searchParams.append("prefix", params.prefix);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return request<Product[]>(`/products${query}`);
  },

  createProduct: (product: Product) =>
    request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),

  deleteProduct: (id: number) =>
    request<void>(`/products/${id}`, {
      method: "DELETE",
    }),

  // Alerts
  getAlertSummary: () => request<AlertSummary>("/alerts/summary"),

  // Billing
  checkout: (data: CheckoutRequest) =>
    request<BillResponse>("/bills/checkout", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAllBills: () => request<BillResponse[]>("/bills"),

  getBillById: (id: number) => request<BillResponse>(`/bills/${id}`),

  getSalesReport: (reportType: "day" | "month" | "year", fromDate?: string, toDate?: string) => {
    const params = new URLSearchParams({ reportType });
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);
    return request<SalesReportItem[]>(`/bills/reports/sales?${params.toString()}`);
  },

  // Customers
  getCustomers: () => request<Customer[]>("/customers"),
  createCustomer: (customer: Customer) =>
    request<Customer>("/customers", {
      method: "POST",
      body: JSON.stringify(customer),
    }),
  deleteCustomer: (id: number) =>
    request<void>(`/customers/${id}`, {
      method: "DELETE",
    }),

  // Suppliers
  getSuppliers: () => request<Supplier[]>("/suppliers"),
  createSupplier: (supplier: Supplier) =>
    request<Supplier>("/suppliers", {
      method: "POST",
      body: JSON.stringify(supplier),
    }),
  deleteSupplier: (id: number) =>
    request<void>(`/suppliers/${id}`, {
      method: "DELETE",
    }),
};
