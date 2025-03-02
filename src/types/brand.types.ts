export interface Brand {
    id: number; // Long trong Java ánh xạ thành number trong TypeScript
    name: string;
    description: string;
    image: string;
    status: string; // Mặc định "0"
    createdDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
    updatedDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  }
  
  // Type cho danh sách thương hiệu (response từ API)
  export type BrandListResponse = Brand[];