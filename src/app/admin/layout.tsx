"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { Toaster } from "@/components/ui/sonner";

const pageMeta: Record<string, { title: string; description: string }> = {
  "/admin": { title: "Dashboard", description: "Overview of tournament statistics and activity" },
  "/admin/teams": { title: "Teams Management", description: "Manage tournament teams, rosters, and details" },
  "/admin/players": { title: "Players Management", description: "Manage player profiles, stats, and roles" },
  "/admin/fixtures": { title: "Fixtures Management", description: "Schedule and manage tournament matches" },
  "/admin/standings": { title: "Standings", description: "Points table and qualification tracking" },
  "/admin/gallery": { title: "Gallery Management", description: "Manage tournament photos and media" },
  "/admin/settings": { title: "Settings", description: "Configure tournament settings and preferences" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!mounted) {
      requestAnimationFrame(() => setMounted(true));
    }
  }, [mounted]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !isLoading && !token) {
      router.push("/login");
    }
  }, [mounted, isLoading, token, router]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // Check role-based access
  if (user.role !== "ADMIN" && user.role !== "ORGANIZER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-sm text-muted-foreground mb-4">You need Admin or Organizer role to access this panel.</p>
          <button onClick={() => router.push("/")} className="text-sm text-primary hover:underline cursor-pointer">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const meta = pageMeta[pathname] || { title: "Admin", description: "" };

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div
        className="transition-all duration-300 min-h-screen flex flex-col"
        style={{ marginLeft: collapsed ? "68px" : "250px" }}
      >
        <AdminTopbar pageTitle={meta.title} pageDescription={meta.description} />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
