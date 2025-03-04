import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { Discount, DiscountListResponse } from "../../types/discount.types";
import { Pagination } from "../../types/pagination.types";

interface DiscountState {
  discounts: Discount[];
  discount: Discount | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: DiscountState = {
  discounts: [],
  discount: null,
  loading: false,
  error: null,
  pagination: null,
};

export const fetchDiscounts = createAsyncThunk(
  "discount/fetchDiscounts",
  async ({
    page = 1,
    search = "",
    size = 10,
  }: {
    page?: number;
    search?: string;
    size?: number;
  }) => {
    const response = await api.get(
      `/api/discounts?page=${page - 1}&search=${search}&size=${size}`
    );
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data as DiscountListResponse;
  }
);

export const addDiscount = createAsyncThunk(
  "discount/addDiscount",
  async (newDiscount: Discount) => {
    const response = await api.post("/api/discounts", newDiscount);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Discount;
  }
);

export const updateDiscount = createAsyncThunk(
  "discount/updateDiscount",
  async (updatedDiscount: Discount) => {
    const response = await api.put(
      `/api/discounts/${updatedDiscount.id}`,
      updatedDiscount
    );
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Discount;
  }
);

export const deleteDiscount = createAsyncThunk(
  "discount/deleteDiscount",
  async (discountId: number) => {
    const response = await api.delete(`/api/discounts/${discountId}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return discountId;
  }
);

export const fetchDiscountById = createAsyncThunk(
  "discount/fetchDiscountById",
  async (discountId: number) => {
    const response = await api.get(`/api/discounts/${discountId}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Discount;
  }
);
export const applyDiscount = createAsyncThunk(
  "discount/applyDiscount",
  async (code: string) => {
    console.log(code);
    const response = await api.post("/api/discounts/apply", { code });
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as number;
  }
);

const discountSlice = createSlice({
  name: "discount",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDiscounts.fulfilled,
        (state, action: PayloadAction<DiscountListResponse>) => {
          state.loading = false;
          state.discounts = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch discounts";
      })
      .addCase(addDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addDiscount.fulfilled,
        (state, action: PayloadAction<Discount>) => {
          state.loading = false;
          state.discounts.push(action.payload);
        }
      )
      .addCase(addDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add discount";
      })
      .addCase(updateDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateDiscount.fulfilled,
        (state, action: PayloadAction<Discount>) => {
          state.loading = false;
          const index = state.discounts.findIndex(
            (discount) => discount.id === action.payload.id
          );
          if (index !== -1) {
            state.discounts[index] = action.payload;
          }
        }
      )
      .addCase(updateDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update discount";
      })
      .addCase(deleteDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteDiscount.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.discounts = state.discounts.filter(
            (discount) => discount.id !== action.payload
          );
        }
      )
      .addCase(deleteDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete discount";
      })
      .addCase(fetchDiscountById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDiscountById.fulfilled,
        (state, action: PayloadAction<Discount>) => {
          state.loading = false;
          state.discount = action.payload;
        }
      )
      .addCase(fetchDiscountById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch discount";
      });
  },
});

export default discountSlice.reducer;
