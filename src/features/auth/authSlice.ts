import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "../../api/api";
import { AuthState, LoginCredentials, LoginResponse, RegisterCredentials, UserInfo } from "../../types/index";

// Khởi tạo userToken từ localStorage
const userToken = localStorage.getItem("userToken") || null;

// Async thunk cho login
export const userLogin = createAsyncThunk<LoginResponse, LoginCredentials, { rejectValue: string }>(
  "auth/login",
  async ({ email, password }: LoginCredentials, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await api.post<LoginResponse>(
        `/api/user/login`,
        { email, password },
        config
      );

      localStorage.setItem("userToken", data.userToken);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || axiosError.message || "An error occurred"
      );
    }
  }
);

// Async thunk cho register
export const registerUser = createAsyncThunk<void, RegisterCredentials, { rejectValue: string }>(
  "auth/register",
  async ({ username, email, password }: RegisterCredentials, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      await api.post(
        `/api/user/register`,
        { username, email, password },
        config
      );
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || axiosError.message || "An error occurred"
      );
    }
  }
);

// Khởi tạo state
const initialState: AuthState = {
  loading: false,
  userInfo: null,
  userToken,
  error: null,
  success: false,
};

// Tạo slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("userToken");
      state.loading = false;
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
      state.success = false;
    },
    setCredentials: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.userInfo = action.payload.userInfo;
        state.userToken = action.payload.userToken;
        state.success = true;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;