import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { Address } from "../../types/address.types";

interface AddressState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  loading: false,
  error: null,
};

export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async () => {
    const response = await api.get("/api/addresses");
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Address[];
  }
);

export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (newAddress: Address) => {
    const response = await api.post("/api/addresses", newAddress);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Address;
  }
);

export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async (updatedAddress: Address) => {
    const response = await api.put(`/api/addresses/${updatedAddress.id}`, updatedAddress);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Address;
  }
);

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (addressId: number) => {
    const response = await api.delete(`/api/addresses/${addressId}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return addressId;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAddresses.fulfilled,
        (state, action: PayloadAction<Address[]>) => {
          state.loading = false;
          state.addresses = action.payload;
        }
      )
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch addresses";
      })
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addAddress.fulfilled,
        (state, action: PayloadAction<Address>) => {
          state.loading = false;
          state.addresses.push(action.payload);
        }
      )
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add address";
      })
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateAddress.fulfilled,
        (state, action: PayloadAction<Address>) => {
          state.loading = false;
          const index = state.addresses.findIndex(
            (address) => address.id === action.payload.id
          );
          if (index !== -1) {
            state.addresses[index] = action.payload;
          }
        }
      )
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update address";
      })
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteAddress.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.addresses = state.addresses.filter(
            (address) => address.id !== action.payload
          );
        }
      )
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete address";
      });
  },
});

export default addressSlice.reducer;
