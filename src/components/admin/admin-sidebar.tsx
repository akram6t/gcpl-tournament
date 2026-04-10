"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  PersonStanding,
  CalendarDays,
  Trophy,
  Camera,
  Settings,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/teams", label: "Teams", icon: Users },
  { href: "/admin/players", label: "Players", icon: PersonStanding },
  { href: "/admin/fixtures", label: "Fixtures", icon: CalendarDays },
  { href: "/admin/standings", label: "Standings", icon: Trophy },
  { href: "/admin/gallery", label: "Gallery", icon: Camera },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen flex flex-col bg-card border-r border-border transition-all duration-300",
          collapsed ? "w-[68px]" : "w-[250px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-lime-500 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-green-500/25 shrink-0">
            G
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-foreground truncate">GCPL Admin</h1>
              <p className="text-[10px] text-muted-foreground truncate">Season 4 Control Panel</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Management
            </p>
          )}
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const navLink = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary-foreground")} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              }
              return navLink;
            })}
          </div>
        </nav>

        <Separator />

        {/* Bottom Actions */}
        <div className="p-2 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="truncate">Back to Site</span>}
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-full justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span className="ml-2 text-xs">Collapse</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
