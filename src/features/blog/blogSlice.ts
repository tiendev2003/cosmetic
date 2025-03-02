import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { Blog } from "../../types/blog.types";
import { Pagination } from "../../types/pagination.types";

interface BlogState {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: BlogState = {
  blogs: [],
  loading: false,
  error: null,
  pagination: null,
};

export const fetchBlogs = createAsyncThunk(
  "blog/fetchBlogs",
  async ({ page = 1, search = "" }: { page?: number; search?: string }) => {
    const response = await api.get(`/api/blogs?page=${page}&search=${search}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data as { data: Blog[], pagination: Pagination };
  }
);

export const addBlog = createAsyncThunk(
  "blog/addBlog",
  async (newBlog: Blog) => {
    const response = await api.post("/api/blogs", newBlog);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Blog;
  }
);

export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async (updatedBlog: Blog) => {
    const response = await api.put(`/api/blogs/${updatedBlog.id}`, updatedBlog);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Blog;
  }
);

export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (blogId: number) => {
    const response = await api.delete(`/api/blogs/${blogId}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return blogId;
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBlogs.fulfilled,
        (state, action: PayloadAction<{ data: Blog[], pagination: Pagination }>) => {
          state.loading = false;
          state.blogs = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch blogs";
      })
      .addCase(addBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addBlog.fulfilled,
        (state, action: PayloadAction<Blog>) => {
          state.loading = false;
          state.blogs.push(action.payload);
        }
      )
      .addCase(addBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add blog";
      })
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateBlog.fulfilled,
        (state, action: PayloadAction<Blog>) => {
          state.loading = false;
          const index = state.blogs.findIndex(
            (blog) => blog.id === action.payload.id
          );
          if (index !== -1) {
            state.blogs[index] = action.payload;
          }
        }
      )
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update blog";
      })
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteBlog.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.blogs = state.blogs.filter(
            (blog) => blog.id !== action.payload
          );
        }
      )
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete blog";
      });
  },
});

export default blogSlice.reducer;
