"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { StatsCard } from "@/components/admin/stats-card";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
  UserPlus,
  CalendarCheck,
  TrendingUp,
  Eye,
  Shield,
  Award,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

// ── Types ────────────────────────────────────────────────────────────────────

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CountByRoleItem {
  role: string;
  _count: { role: number };
}

interface UsersResponse {
  users: UserData[];
  countByRole: CountByRoleItem[];
}

type RoleFilter = "all" | "SPECTATOR" | "PLAYER" | "ORGANIZER" | "ADMIN";

const ITEMS_PER_PAGE = 8;

const ROLE_COLORS: Record<string, { badge: string; dot: string }> = {
  ADMIN: {
    badge:
      "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 border-red-200 dark:border-red-500/30",
    dot: "bg-red-500",
  },
  ORGANIZER: {
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
    dot: "bg-amber-500",
  },
  PLAYER: {
    badge:
      "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400 border-green-200 dark:border-green-500/30",
    dot: "bg-green-500",
  },
  SPECTATOR: {
    badge:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
    dot: "bg-blue-500",
  },
};

const ROLE_TAB_ICONS: Record<string, React.ReactNode> = {
  SPECTATOR: <Eye className="h-3.5 w-3.5" />,
  PLAYER: <Award className="h-3.5 w-3.5" />,
  ORGANIZER: <TrendingUp className="h-3.5 w-3.5" />,
  ADMIN: <Shield className="h-3.5 w-3.5" />,
};

// ── Component ────────────────────────────────────────────────────────────────

export default function FansManagementPage() {
  // Data state
  const [users, setUsers] = useState<UserData[]>([]);
  const [countByRole, setCountByRole] = useState<CountByRoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("SPECTATOR");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "SPECTATOR",
    phone: "",
  });

  // ── Data fetching ──────────────────────────────────────────────────────────

  const fetchUsers = useCallback(
    async (role?: string, search?: string) => {
      try {
        const params = new URLSearchParams();
        if (role && role !== "all") params.set("role", role);
        if (search) params.set("search", search);
        const query = params.toString();
        const path = `/api/users${query ? `?${query}` : ""}`;
        const data = await apiGet<UsersResponse>(path);
        setUsers(data.users);
        setCountByRole(data.countByRole);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        toast.error("Failed to load users");
      }
    },
    []
  );

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await fetchUsers("SPECTATOR");
      setLoading(false);
    };
    loadInitialData();
  }, [fetchUsers]);

  // ── Computed values ────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const weekAgo = new Date(todayStart);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const spectatorCount =
      countByRole.find((c) => c.role === "SPECTATOR")?._count?.role ?? 0;
    const playerCount =
      countByRole.find((c) => c.role === "PLAYER")?._count?.role ?? 0;
    const activeToday = users.filter(
      (u) =>
        u.role === "SPECTATOR" &&
        new Date(u.createdAt) >= todayStart
    ).length;
    const newThisWeek = users.filter(
      (u) =>
        u.role === "SPECTATOR" && new Date(u.createdAt) >= weekAgo
    ).length;

    return {
      totalFans: spectatorCount,
      activeToday,
      newThisWeek,
      playerUsers: playerCount,
    };
  }, [users, countByRole]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleRoleFilterChange = (val: string) => {
    setRoleFilter(val as RoleFilter);
    setCurrentPage(1);
    setSearchQuery("");
    setLoading(true);
    const role = val === "all" ? undefined : val;
    fetchUsers(role).finally(() => setLoading(false));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const openEditDialog = (user: UserData) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      phone: user.phone || "",
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: roleFilter === "all" ? "SPECTATOR" : roleFilter,
      phone: "",
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (user: UserData) => {
    setDeletingUser(user);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    if (!editingUser && !formData.password.trim()) {
      toast.error("Password is required for new users");
      return;
    }

    setSubmitting(true);
    try {
      if (editingUser) {
        const payload: Record<string, string> = {
          id: editingUser.id,
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          phone: formData.phone.trim() || "",
        };
        if (formData.password.trim()) {
          payload.password = formData.password.trim();
        }
        await apiPut("/api/users", payload);
        toast.success(`${payload.name} updated successfully`);
      } else {
        await apiPost("/api/users", {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          role: formData.role,
          phone: formData.phone.trim() || undefined,
        });
        toast.success(`${formData.name.trim()} added successfully`);
      }

      setDialogOpen(false);
      const role = roleFilter === "all" ? undefined : roleFilter;
      await fetchUsers(role, searchQuery || undefined);
    } catch (err) {
      console.error("Failed to save user:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to save user"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;

    setSubmitting(true);
    try {
      await apiDelete("/api/users", deletingUser.id);
      toast.success(`${deletingUser.name} deleted successfully`);
      setDeleteDialogOpen(false);
      setDeletingUser(null);
      const role = roleFilter === "all" ? undefined : roleFilter;
      await fetchUsers(role, searchQuery || undefined);
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to delete user"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderRoleBadge = (role: string) => {
    const colors = ROLE_COLORS[role] || ROLE_COLORS.SPECTATOR;
    return (
      <Badge
        variant="outline"
        className={`border text-xs font-medium ${colors.badge}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${colors.dot}`} />
        {role.charAt(0) + role.slice(1).toLowerCase()}
      </Badge>
    );
  };

  const renderUserAvatar = (user: UserData, size: "sm" | "md") => {
    const sizeClass = size === "sm" ? "h-9 w-9 text-xs" : "h-10 w-10 text-xs";
    const colors = ROLE_COLORS[user.role] || ROLE_COLORS.SPECTATOR;

    if (user.avatar) {
      return (
        <Avatar className={sizeClass}>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className={sizeClass}>
            {getUserInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      );
    }

    return (
      <div
        className={`${sizeClass} rounded-full flex items-center justify-center font-bold shrink-0`}
        style={{
          backgroundColor:
            user.role === "ADMIN"
              ? "#ef4444"
              : user.role === "ORGANIZER"
              ? "#f59e0b"
              : user.role === "PLAYER"
              ? "#22c55e"
              : "#3b82f6",
          color: "white",
        }}
      >
        {getUserInitials(user.name)}
      </div>
    );
  };

  const renderActionMenu = (user: UserData) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => openEditDialog(user)}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600 dark:text-red-400"
          onClick={() => openDeleteDialog(user)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // ── Loading skeleton ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="w-11 h-11 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters skeleton */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-10 w-full sm:w-auto" />
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <Skeleton className="h-10 w-full sm:max-w-sm" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table skeleton */}
        <Card className="border-border/50 hidden md:block">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mobile cards skeleton */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="w-8 h-8 rounded" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[...Array(2)].map((_, j) => (
                      <Skeleton key={j} className="h-12 rounded-lg" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Fans"
          value={stats.totalFans}
          icon={Users}
          description="Registered spectators"
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-500/15"
        />
        <StatsCard
          title="Active Today"
          value={stats.activeToday}
          icon={CalendarCheck}
          description="Joined today"
          iconColor="text-green-600 dark:text-green-400"
          iconBg="bg-green-100 dark:bg-green-500/15"
        />
        <StatsCard
          title="New This Week"
          value={stats.newThisWeek}
          icon={TrendingUp}
          description="Last 7 days"
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-100 dark:bg-amber-500/15"
        />
        <StatsCard
          title="Player Users"
          value={stats.playerUsers}
          icon={Award}
          description="Registered players"
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-100 dark:bg-emerald-500/15"
        />
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <Tabs
              value={roleFilter}
              onValueChange={handleRoleFilterChange}
            >
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="SPECTATOR" className="gap-1.5">
                  <Eye className="h-3.5 w-3.5 hidden sm:block" />
                  Spectator
                </TabsTrigger>
                <TabsTrigger value="PLAYER" className="gap-1.5">
                  <Award className="h-3.5 w-3.5 hidden sm:block" />
                  Player
                </TabsTrigger>
                <TabsTrigger value="ORGANIZER" className="gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 hidden sm:block" />
                  Organizer
                </TabsTrigger>
                <TabsTrigger value="ADMIN" className="gap-1.5">
                  <Shield className="h-3.5 w-3.5 hidden sm:block" />
                  Admin
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="relative flex-1 w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button onClick={openAddDialog}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredUsers.length === 0 && !loading && (
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {searchQuery || roleFilter !== "all"
                ? "No users match your filters"
                : "No users yet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || roleFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first user to the platform."}
            </p>
            {!searchQuery && roleFilter !== "all" && (
              <Button onClick={openAddDialog}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Desktop Table */}
      {filteredUsers.length > 0 && (
        <Card className="border-border/50 hidden md:block">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {renderUserAvatar(user, "sm")}
                        <div>
                          <span className="font-semibold text-foreground text-sm block">
                            {user.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{renderRoleBadge(user.role)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.phone || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>{renderActionMenu(user)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Mobile Cards */}
      {filteredUsers.length > 0 && (
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {paginatedUsers.map((user) => (
            <Card key={user.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {renderUserAvatar(user, "md")}
                    <div>
                      <span className="font-semibold text-foreground block">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground block">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  {renderActionMenu(user)}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {renderRoleBadge(user.role)}
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="text-xs text-muted-foreground">Phone</div>
                    <div className="font-medium text-foreground text-sm truncate">
                      {user.phone || "—"}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="text-xs text-muted-foreground">Joined</div>
                    <div className="font-medium text-foreground text-sm">
                      {formatDate(user.createdAt)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Add New User"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Update the user details below."
                : "Fill in the details to register a new user."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="user-name">Name</Label>
              <Input
                id="user-name"
                placeholder="e.g., Rahul Sharma"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                placeholder="e.g., rahul@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-password">
                Password
                {editingUser && (
                  <span className="text-xs text-muted-foreground font-normal ml-2">
                    (leave blank to keep current)
                  </span>
                )}
              </Label>
              <Input
                id="user-password"
                type="password"
                placeholder={
                  editingUser ? "Enter new password (optional)" : "Enter password"
                }
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="user-role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(val) =>
                    setFormData({ ...formData, role: val })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SPECTATOR">Spectator</SelectItem>
                    <SelectItem value="PLAYER">Player</SelectItem>
                    <SelectItem value="ORGANIZER">Organizer</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-phone">Phone</Label>
                <Input
                  id="user-phone"
                  placeholder="e.g., +91 9876543210"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingUser ? "Save Changes" : "Add User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deletingUser?.name}
              </span>
              ? This action cannot be undone and will remove the user from all
              records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={submitting}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {submitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
