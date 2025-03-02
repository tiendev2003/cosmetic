import { Pagination } from "./pagination.types";

export interface User {
  id: number; // Long trong Java ánh xạ thành number trong TypeScript
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  createdDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  updatedDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
}

export interface UserListResponse {
  status: string;
  message: string;
  data: User[];
  pagination: Pagination;
}
