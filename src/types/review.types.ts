import { Pagination } from "./pagination.types";

// Model cho Review (giả định cấu trúc cơ bản)
export interface Review {
  id: number; // Long trong Java ánh xạ thành number trong TypeScript
  review: string; // Nội dung đánh giá
  star: number; // double trong Java ánh xạ thành number trong TypeScript
  user: {
    id: number;
    username: string; // Giả định thông tin cơ bản của user
  }; // Quan hệ ManyToOne với User
  createdDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  updatedDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
}
 

export interface ReviewListResponse {
  status: string;
  message: string;
  data: Review[];
  pagination: Pagination;
}
