import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { BlogCategory } from "../../types/blogCategory.types";
import { Pagination } from "../../types/pagination.types";

interface BlogCategoryState {
  categories: BlogCategory[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: BlogCategoryState = {
  categories: [],
  loading: false,
  error: null,
  pagination: null,
};

export const fetchBlogCategories = createAsyncThunk(
  "blogCategory/fetchBlogCategories",
  async ({ page = 1, search = "" }: { page?: number; search?: string }) => {
    const response = await api.get(`/api/blogCategories?page=${page}&search=${search}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data as { data: BlogCategory[], pagination: Pagination };
  }
);

export const addBlogCategory = createAsyncThunk(
  "blogCategory/addBlogCategory",
  async (newCategory: BlogCategory) => {
    const response = await api.post("/api/blogCategories", newCategory);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as BlogCategory;
  }
);

export const updateBlogCategory = createAsyncThunk(
  "blogCategory/updateBlogCategory",
  async (updatedCategory: BlogCategory) => {
    const response = await api.put(`/api/blogCategories/${updatedCategory.id}`, updatedCategory);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as BlogCategory;
  }
);

export const deleteBlogCategory = createAsyncThunk(
  "blogCategory/deleteBlogCategory",
  async (categoryId: number) => {
    const response = await api.delete(`/api/blogCategories/${categoryId}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return categoryId;
  }
);

const blogCategorySlice = createSlice({
  name: "blogCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBlogCategories.fulfilled,
        (state, action: PayloadAction<{ data: BlogCategory[], pagination: Pagination }>) => {
          state.loading = false;
          state.categories = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchBlogCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch blog categories";
      })
      .addCase(addBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addBlogCategory.fulfilled,
        (state, action: PayloadAction<BlogCategory>) => {
          state.loading = false;
          state.categories.push(action.payload);
        }
      )
      .addCase(addBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add blog category";
      })
      .addCase(updateBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateBlogCategory.fulfilled,
        (state, action: PayloadAction<BlogCategory>) => {
          state.loading = false;
          const index = state.categories.findIndex(
            (category) => category.id === action.payload.id
          );
          if (index !== -1) {
            state.categories[index] = action.payload;
          }
        }
      )
      .addCase(updateBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update blog category";
      })
      .addCase(deleteBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteBlogCategory.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.categories = state.categories.filter(
            (category) => category.id !== action.payload
          );
        }
      )
      .addCase(deleteBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete blog category";
      });
  },
});

export default blogCategorySlice.reducer;
