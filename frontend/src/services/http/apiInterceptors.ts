import { api } from "./axios";

export const setupInterceptors = () => {
  api.interceptors.response.use(

    (res, ) => res,
    async (error) => {
      console.log("api intercept")
      const originalRequest = error.config;
      const code = error.response?.data?.error?.code;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        code === "ACCESS_TOKEN_EXPIRED"
      ) {
        originalRequest._retry = true;
        try {
          await api.post("/refresh");
          return api(originalRequest);
        } catch {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );
};
