
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./use-auth";

export function useRequireAuth(requiredRole?: "admin" | "user") {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not logged in, redirect to login
        navigate("/login", { replace: true });
      } else if (requiredRole === "admin" && user.role !== "admin") {
        // Not an admin, redirect to unauthorized
        navigate("/unauthorized", { replace: true });
      }
    }
  }, [user, isLoading, navigate, requiredRole]);

  return { user, isLoading };
}
