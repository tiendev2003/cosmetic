export interface Address {
  id: number; // Long trong Java ánh xạ thành number trong TypeScript
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  isDefault: boolean;
  createdDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  updatedDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
}

// Type cho danh sách địa chỉ (response từ API)
export type AddressListResponse = Address[];
