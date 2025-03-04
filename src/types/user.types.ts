import { Pagination } from "./pagination.types";

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  bio: string | null;
  phone: string | null;
  otp: string | null;
  createdDate: string;
  updatedDate: string;
  role: "USER" | "ADMIN" | "MODERATOR"; // Nếu có nhiều role, có thể mở rộng
  locked: boolean;
}

export interface UserListResponse {
  status: string;
  message: string;
  data: User[];
  pagination: Pagination;
}
