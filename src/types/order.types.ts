import { Address } from "./address.types";
import { Pagination } from "./pagination.types";
import { Product } from "./product.types";
import { User } from "./user.types";

// Enum cho OrderStatus (giả định các giá trị dựa trên backend)
export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  DELIVERED = "DELIVERED",
  SHIPPED = "SHIPPED",
  CANCELLED = "CANCELLED",
}

// Model cho OrderItem
export interface OrderItem {
  id: number; // Long trong Java ánh xạ thành number trong TypeScript
  product: Product; // Quan hệ ManyToOne với Product
  quantity: number;
  unitPrice: number; // BigDecimal ánh xạ thành number trong TypeScript
}

// Model cho Order
export interface Order {
  id: number; // Long trong Java ánh xạ thành number trong TypeScript
  orderId: string; // UUID dưới dạng string
  user: User;
  shippingAddress: Address; // Quan hệ OneToOne với Address
  paymentMethod: string;
  status: OrderStatus; // Enum ánh xạ từ OrderStatus
  totalAmount: number; // BigDecimal ánh xạ thành number trong TypeScript
  discountAmount: number; // BigDecimal ánh xạ thành number trong TypeScript
  finalAmount: number; // BigDecimal ánh xạ thành number trong TypeScript
  orderDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  orderItems: OrderItem[]; // Quan hệ OneToMany với OrderItem
}

export interface OrderListResponse {
  status: string;
  message: string;
  data: Order[];
  pagination: Pagination;
}

export interface OrderRequest {
  username: string;
  paymentMethod: string;
  orderItems: OrderItemRequest[];
  discountAmount: number;
  finalAmount: number;
  totalAmount: number;
  address: number;
}
export interface OrderItemRequest {
  productId: number;
  quantity: number;
  price: number;
}

// Type cho chi tiết đơn hàng
export type OrderDetailsResponse = Order;

// Mock data (replace with actual API data)
export const mockOrders: Order[] = [
  {
    id: 1,
    orderId: "123e4567-e89b-12d3-a456-426614174000",
    user: {
      id: 1,
      username: "user1",
      avatar: "https://randomuser.me/api/portraits",
      bio: "",
      email: "",
      locked: false,
      otp: "",
      phone: "",
      role: "USER",
      createdDate: "2025-03-01T12:00:00",
      updatedDate: "2025-03-01T12:00:00",
    },
    shippingAddress: {
      id: 1,
      streetAddress: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      email: "",
      firstName: "",
      default: false,
      lastName: "",
      phone: "",
      createdDate: "2025-03-01T12:00:00",
      updatedDate: "2025-03-01T12:00:00",
    },
    paymentMethod: "Credit Card",
    status: OrderStatus.PENDING,
    totalAmount: 100.0,
    discountAmount: 10.0,
    finalAmount: 90.0,
    orderDate: "2025-03-01T12:00:00",
    orderItems: [
      {
        id: 1,
        product: {
          id: 1,
          name: "Product 1",
          description: "Product 1 description",
          price: 50.0,
          salePrice: 40.0,
          stock: 100,
          productImages: [],
          brand: {
            id: 1,
            name: "Brand 1",
            description: "Brand 1 description",
            image: "",
            status: "ACTIVE",
            createdDate: "2025-03-01T12:00:00",
            updatedDate: "2025-03-01T12:00:00",
          },
          ingredients: "",
          sale: true,
          productUsage: "",
          reviews: [],
          status: "ACTIVE",
          category: {
            id: 1,
            name: "Category 1",
            description: "Category 1 description",
            image: "",
            status: "ACTIVE",
            createdDate: "2025-03-01T12:00:00",
            updatedDate: "2025-03-01T12:00:00",
          },
          createdDate: "2025-03-01T12:00:00",
          updatedDate: "2025-03-01T12:00:00",
        },
        quantity: 2,
        unitPrice: 50.0,
      },
    ],
  },
  // ...more mock orders
];
