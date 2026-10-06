"use client";

import { usePathname } from "next/navigation";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";

const legacyDashboardRoutes = new Set([
  "/chats",
  "/documents",
  "/profile",
  "/projects",
  "/receipts",
  "/settings",
  "/support",
  "/tasks",
  "/teams",
]);

export function LegacyMobileNavigation() {
  const pathname = usePathname();

  if (!legacyDashboardRoutes.has(pathname)) return null;

  return <MobileBottomNav />;
}
