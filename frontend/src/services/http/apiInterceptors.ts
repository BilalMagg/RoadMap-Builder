import { api } from "./axios";

export const setupInterceptors = () => {
  api.interceptors.response.use(

    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      const code = error.response?.data?.error?.code;
      const message = error.response?.data?.message || "";

      // Handle 401 errors (unauthorized) - try to refresh token
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        (code === "ACCESS_TOKEN_EXPIRED" || 
         message.includes("Token expired") || 
         message.includes("Unauthorized"))
      ) {
        // Skip refresh for login/signup/refresh endpoints to avoid infinite loops
        if (originalRequest.url?.includes("/auth/login") || 
            originalRequest.url?.includes("/auth/signup") ||
            originalRequest.url?.includes("/auth/refresh")) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;
        try {
          await api.post("/auth/refresh");
          return api(originalRequest);
        } catch {
          // Refresh failed, redirect to login
          window.location.href = "/login";
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
};
