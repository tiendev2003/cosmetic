import { Brand } from './brand.types';
import { Category } from './category.types';
import { Pagination } from './pagination.types';
import { Review } from './review.types';

// Model cho ProductImage (giả định cấu trúc cơ bản)
export interface ProductImage {
    id: number; // Long trong Java ánh xạ thành number trong TypeScript
    image: string; // URL hoặc đường dẫn ảnh
    publicId: string; // ID công khai (giả định từ Cloudinary hoặc tương tự)
    status: string; // Trạng thái của ảnh
    createdDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
    updatedDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  }

// Model cho Product
export interface Product {
  id: number; // Long trong Java ánh xạ thành number trong TypeScript
  name: string;
  description: string;
  price: number; // BigDecimal ánh xạ thành number trong TypeScript
  salePrice: number | null; // Có thể null nếu không có giá giảm
  isSale: boolean;
  stock: number;
  ingredients: string;
  productUsage: string;
  productImages: ProductImage[]; // Quan hệ OneToMany với ProductImage
  category: Category; // Quan hệ ManyToOne với Category
  brand: Brand; // Quan hệ ManyToOne với Brand
  reviews: Review[]; // Quan hệ OneToMany với Review
  status: string;
  createdDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  updatedDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
}

 

export interface ProductListResponse {
  status: string;
  message: string;
  data: Product[];
  pagination: Pagination;
}

// Type cho chi tiết sản phẩm
export type ProductDetailsResponse = Product;

// Type cho danh sách đánh giá theo sản phẩm
