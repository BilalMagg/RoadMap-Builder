import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { type ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated , isLoading} = useAuth();

  if (isLoading) {
    // You can return null (blank screen) or a spinner here
    return <div>Loading...</div>; 
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
