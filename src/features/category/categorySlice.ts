import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { Category, CategoryListResponse } from "../../types/category.types";
import { Pagination } from "../../types/pagination.types";

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
  pagination: null,
};

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async ({ page = 1, search = "" }: { page?: number; search?: string }) => {
    const response = await api.get(`/api/categories?page=${page}&search=${search}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data as CategoryListResponse;
  }
);

export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (newCategory: Category) => {
    const response = await api.post("/api/categories", newCategory);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Category;
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (updatedCategory: Category) => {
    const response = await api.put(`/api/categories/${updatedCategory.id}`, updatedCategory);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Category;
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId: number) => {
    const response = await api.delete(`/api/categories/${categoryId}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return categoryId;
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<CategoryListResponse>) => {
          state.loading = false;
          state.categories = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          state.categories.push(action.payload);
        }
      )
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add category";
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          const index = state.categories.findIndex(
            (category) => category.id === action.payload.id
          );
          if (index !== -1) {
            state.categories[index] = action.payload;
          }
        }
      )
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update category";
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteCategory.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.categories = state.categories.filter(
            (category) => category.id !== action.payload
          );
        }
      )
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete category";
      });
  },
});

export default categorySlice.reducer;
