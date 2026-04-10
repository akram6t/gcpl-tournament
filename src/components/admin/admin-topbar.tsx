"use client";

import { Bell, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface AdminTopbarProps {
  pageTitle: string;
  pageDescription?: string;
}

export function AdminTopbar({ pageTitle, pageDescription }: AdminTopbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate">{pageTitle}</h1>
            {pageDescription && (
              <p className="text-xs text-muted-foreground truncate hidden sm:block">{pageDescription}</p>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 w-[220px] h-9 text-sm bg-muted/50 border-border/50 focus:bg-background"
            />
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-500 text-white border-0">
              3
            </Badge>
          </Button>

          {/* Divider */}
          <div className="w-px h-6 bg-border mx-1" />

          {/* User */}
          <div className="flex items-center gap-2.5 cursor-pointer hover:bg-muted rounded-lg px-2 py-1.5 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-green-500 to-lime-500 text-white">
                A
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:block">
              <p className="text-xs font-semibold text-foreground leading-tight">Admin</p>
              <p className="text-[10px] text-muted-foreground leading-tight">Organizer</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
