import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function RequireAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth(); // ← ใช้ loading
  const location = useLocation();

  if (loading) return null; // หรือ Skeleton UI

  if (!user)
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  if (user.role !== "ADMIN") return <Navigate to="/forbidden" replace />;

  return <>{children}</>;
}
