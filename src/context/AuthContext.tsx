import { createContext, ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import api from "../api/api";
import { clearCartNew } from "../features/cart/cartSlice";
import { AppDispatch } from "../store";
import { AuthResponse, LoginCredentials, PasswordData, User, UserResponse, } from "../types";

export interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
  userInformation: User | null;
  updateUserInformation: (updatedInfo: Partial<User>) => Promise<void>;
  changePassword: (passwordData: PasswordData) => Promise<any>;
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props type for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userInformation, setUserInformation] = useState<User | null>(null);
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get<UserResponse>("/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setUserInformation(response.data.data);
          setIsAuthenticated(true);
          setUserRole(response.data.data.role);
        })
        .catch((error) => {
          console.error("Get user info failed", error);
          toast.error("Get user info failed");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setLoading(true);
    try {
      const response = await api.post<AuthResponse>(
        "/api/user/login",
        credentials
      );
      if (response.data.data) {
        setIsAuthenticated(true);
        localStorage.setItem("token", response.data.data.token);
        setUserRole(response.data.data.user.role); // Fixed: Set role instead of token
        setUserInformation(response.data.data.user);

        localStorage.setItem("token", response.data.data.token); // Store token
        if (response.data.data.user.role === "ADMIN") {
          window.location.href = "/admin";
        }
        if (response.data.data.user.role === "USER") {
          window.location.href = "/";
        }

      } else {
        throw new Error("Login failed");
      }
    } catch (error: any) {
      console.error("Login failed", error);
      toast.error(error.response?.data?.error || "Login failed");

    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    console.log("logout");
    setIsAuthenticated(false);
    localStorage.removeItem("token"); // Remove token
    setUserRole(null);
    setUserInformation(null);
    dispatch(clearCartNew())
    toast.success("Đăng xuất thành công");
  };

  const updateUserInformation = async (updatedInfo: Partial<User>): Promise<void> => {
    try {
      const response = await api.put<User>(
        "/api/user/update",
        updatedInfo,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUserInformation(response.data);
    } catch (error: any) {
      console.error("Update failed", error);
      throw error;
    }
  };

  const changePassword = async (passwordData: PasswordData): Promise<any> => {
    try {
      const response = await api.put(
        "/api/user/change-password",
        {
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Change password failed", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        login,
        logout,
        loading,
        userInformation,
        updateUserInformation,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

