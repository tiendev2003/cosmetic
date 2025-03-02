import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { Product } from "../../types/product.types";
import { Pagination } from "../../types/pagination.types";

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  pagination: null,
};

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ page = 1, search = "" }: { page?: number; search?: string }) => {
    const response = await api.get(`/api/products?page=${page}&search=${search}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data as { data: Product[], pagination: Pagination };
  }
);

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (newProduct: Product) => {
    const response = await api.post("/api/products", newProduct);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Product;
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (updatedProduct: Product) => {
    const response = await api.put(`/api/products/${updatedProduct.id}`, updatedProduct);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Product;
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId: number) => {
    const response = await api.delete(`/api/products/${productId}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return productId;
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<{ data: Product[], pagination: Pagination }>) => {
          state.loading = false;
          state.products = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.products.push(action.payload);
        }
      )
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add product";
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          const index = state.products.findIndex(
            (product) => product.id === action.payload.id
          );
          if (index !== -1) {
            state.products[index] = action.payload;
          }
        }
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update product";
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.products = state.products.filter(
            (product) => product.id !== action.payload
          );
        }
      )
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete product";
      });
  },
});

export default productSlice.reducer;
