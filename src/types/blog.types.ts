import { UserInfo } from "./auth.types";
import { BlogCategory } from "./blogCategory.types";
import { Pagination } from "./pagination.types";

// Model cho Tag (giả định cấu trúc cơ bản)
export interface Tag {
  id: number;
  name: string;
}

// Model cho Blog
export interface Blog {
  id: number; // Long trong Java ánh xạ thành number trong TypeScript
  title: string;
  content: string;
  image: string;
  status: string;
  createdDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  updatedDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  category: BlogCategory; // Quan hệ ManyToOne với BlogCategory
  author: UserInfo; // Quan hệ ManyToOne với User (UserInfo đã định nghĩa trước đó)
  tags: Tag[]; // Quan hệ ManyToMany với Tag, ánh xạ thành mảng
}

export interface BlogListResponse {
  status: string;
  message: string;
  data: Blog[];
  pagination: Pagination;
}

// Type cho chi tiết blog (response từ API)
export type BlogDetailsResponse = Blog;
