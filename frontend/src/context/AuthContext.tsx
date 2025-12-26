import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api } from "../services/http/index";

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number | null;
  isActive: boolean;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error?: any;
  timestamp: Date;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verify authentication status on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await api.get<ApiResponse<{ user: User }>>("/auth/profil");
        if (response.data.success && response.data.data?.user) {
          setUser(response.data.data.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        // Not authenticated or token expired
        setIsAuthenticated(false);
        setUser(null);
      } finally {
      // <--- ADD THIS: Stop loading regardless of success or failure
      setIsLoading(false);
    }
    };

    verifyAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<ApiResponse<User>>("/auth/login", {
        email,
        password,
        rememberMe,
      });

      if (response.data.success && response.data.data) {
        // Backend sets accessToken and refreshToken as httpOnly cookies
        // We just need to store the user data
        setUser(response.data.data);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (err: any) {
      let errorMessage = "Login failed. Please try again.";

      if (err.response?.data) {
        const apiError = err.response.data as ApiResponse<null>;
        if (apiError.error) {
          // Handle validation errors (array of error messages)
          if (Array.isArray(apiError.error)) {
            errorMessage = apiError.error.join(", ");
          } else {
            errorMessage = apiError.message || errorMessage;
          }
        } else {
          errorMessage = apiError.message || errorMessage;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<ApiResponse<User>>("/auth/signup", {
        username: name, // Backend expects 'username' field
        email,
        password,
      });

      if (response.data.success && response.data.data) {
        // After signup, automatically log in the user
        setUser(response.data.data);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.data.message || "Signup failed");
      }
    } catch (err: any) {
      let errorMessage = "Signup failed. Please try again.";

      if (err.response?.data) {
        const apiError = err.response.data as ApiResponse<null>;
        if (apiError.error) {
          // Handle validation errors (array of error messages)
          if (Array.isArray(apiError.error)) {
            errorMessage = apiError.error.join(", ");
          } else {
            errorMessage = apiError.message || errorMessage;
          }
        } else {
          errorMessage = apiError.message || errorMessage;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear cookies on backend
      // Backend cookies will be cleared by browser when they expire
      await api.post("/auth/logout").catch(() => {
        // Ignore errors if logout endpoint doesn't exist
      });
    } catch {
      // Ignore errors
    } finally {
      // Clear local state
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      // Force a page reload to ensure cookies are cleared and auth state is reset
      // This ensures that on refresh, the user won't appear as logged in
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signup,
        logout,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
