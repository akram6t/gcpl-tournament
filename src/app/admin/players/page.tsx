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
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
  Swords,
  Target,
  HandHelping,
  ArrowUpDown,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

// ── Types ────────────────────────────────────────────────────────────────────

interface PlayerData {
  id: string;
  name: string;
  team: string;
  teamShort: string;
  teamColor: string;
  teamId: string;
  role: string;
  matches: number;
  runs: number;
  wickets: number;
  avg: string;
  sr: string;
  bestBatting: string;
  bestBowling: string;
  isCaptain: boolean;
}

interface TeamData {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

type RoleFilter = "all" | "Batsman" | "Bowler" | "All-Rounder" | "Wicketkeeper";
type SortField = "name" | "team" | "matches" | "runs" | "wickets" | "avg" | "sr";
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 5;

const roleIcons: Record<string, React.ReactNode> = {
  Batsman: <Swords className="h-3.5 w-3.5" />,
  Bowler: <Target className="h-3.5 w-3.5" />,
  "All-Rounder": <HandHelping className="h-3.5 w-3.5" />,
  Wicketkeeper: <ShieldCheck className="h-3.5 w-3.5" />,
};

// ── Component ────────────────────────────────────────────────────────────────

export default function PlayersManagementPage() {
  // Data state
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<PlayerData | null>(null);
  const [deletingPlayerId, setDeletingPlayerId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    teamId: "",
    role: "Batsman",
    matches: "",
    runs: "",
    wickets: "",
    avg: "",
    sr: "",
    bestBatting: "",
    bestBowling: "",
    isCaptain: false,
  });

  // ── Data fetching ──────────────────────────────────────────────────────────

  const fetchPlayers = useCallback(async () => {
    try {
      const data = await apiGet<PlayerData[]>("/api/players");
      setPlayers(data);
    } catch (err) {
      console.error("Failed to fetch players:", err);
      toast.error("Failed to load players");
    }
  }, []);

  const fetchTeams = useCallback(async () => {
    try {
      const data = await apiGet<TeamData[]>("/api/teams");
      setTeams(data);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
      toast.error("Failed to load teams");
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([fetchPlayers(), fetchTeams()]);
      setLoading(false);
    };
    loadInitialData();
  }, [fetchPlayers, fetchTeams]);

  // ── Computed values ────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    return {
      total: players.length,
      batsmen: players.filter((p) => p.role === "Batsman").length,
      bowlers: players.filter((p) => p.role === "Bowler").length,
      allRounders: players.filter((p) => p.role === "All-Rounder").length,
    };
  }, [players]);

  const filteredPlayers = useMemo(() => {
    let result = [...players];

    if (roleFilter !== "all") {
      result = result.filter((p) => p.role === roleFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.team.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "team":
          comparison = a.team.localeCompare(b.team);
          break;
        case "matches":
          comparison = a.matches - b.matches;
          break;
        case "runs":
          comparison = a.runs - b.runs;
          break;
        case "wickets":
          comparison = a.wickets - b.wickets;
          break;
        case "avg":
          comparison = parseFloat(a.avg) - parseFloat(b.avg);
          break;
        case "sr":
          comparison = parseFloat(a.sr) - parseFloat(b.sr);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [players, roleFilter, searchQuery, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredPlayers.length / ITEMS_PER_PAGE);
  const paginatedPlayers = filteredPlayers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const refreshData = useCallback(async () => {
    await fetchPlayers();
    await fetchTeams();
  }, [fetchPlayers, fetchTeams]);

  const openEditDialog = (player: PlayerData) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      teamId: player.teamId,
      role: player.role,
      matches: player.matches.toString(),
      runs: player.runs.toString(),
      wickets: player.wickets.toString(),
      avg: player.avg,
      sr: player.sr,
      bestBatting: player.bestBatting || "",
      bestBowling: player.bestBowling || "",
      isCaptain: player.isCaptain,
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingPlayer(null);
    setFormData({
      name: "",
      teamId: "",
      role: "Batsman",
      matches: "",
      runs: "",
      wickets: "",
      avg: "",
      sr: "",
      bestBatting: "",
      bestBowling: "",
      isCaptain: false,
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (player: PlayerData) => {
    setDeletingPlayerId(player.id);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.teamId) {
      toast.error("Player name and team are required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        teamId: formData.teamId,
        role: formData.role,
        matches: parseInt(formData.matches) || 0,
        runs: parseInt(formData.runs) || 0,
        wickets: parseInt(formData.wickets) || 0,
        avg: formData.avg || "0.00",
        sr: formData.sr || "0.00",
        bestBatting: formData.bestBatting || "-",
        bestBowling: formData.bestBowling || "-",
        isCaptain: formData.isCaptain,
      };

      if (editingPlayer) {
        await apiPut("/api/players", { ...payload, id: editingPlayer.id });
        toast.success(`${payload.name} updated successfully`);
      } else {
        await apiPost("/api/players", payload);
        toast.success(`${payload.name} added successfully`);
      }

      setDialogOpen(false);
      await refreshData();
    } catch (err) {
      console.error("Failed to save player:", err);
      toast.error(err instanceof Error ? err.message : "Failed to save player");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPlayerId) return;

    setSubmitting(true);
    try {
      await apiDelete("/api/players", deletingPlayerId);
      toast.success("Player deleted successfully");
      setDeleteDialogOpen(false);
      setDeletingPlayerId(null);
      await refreshData();
    } catch (err) {
      console.error("Failed to delete player:", err);
      toast.error(err instanceof Error ? err.message : "Failed to delete player");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getTeamName = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : "Unknown";
  };

  const renderSortHeader = (field: SortField, children: React.ReactNode) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {children}
      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
      {sortField === field && (
        <span className="text-xs text-muted-foreground">
          {sortDirection === "asc" ? "↑" : "↓"}
        </span>
      )}
    </button>
  );

  const renderPlayerAvatar = (player: PlayerData, size: "sm" | "md") => {
    const initials = player.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2);
    const sizeClass = size === "sm" ? "w-9 h-9 text-xs" : "w-10 h-10 text-xs";
    return (
      <div
        className={`${sizeClass} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
        style={{ backgroundColor: player.teamColor }}
      >
        {initials}
      </div>
    );
  };

  const renderCaptainBadge = () => (
    <span className="text-amber-500" title="Captain">
      <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
      </svg>
    </span>
  );

  const renderTeamBadge = (player: PlayerData, className?: string) => (
    <Badge
      variant="outline"
      className={className || "border-border/50"}
      style={{
        borderColor: player.teamColor + "60",
        color: player.teamColor,
        backgroundColor: player.teamColor + "10",
      }}
    >
      {player.teamShort}
    </Badge>
  );

  const renderRoleWithIcon = (role: string) => (
    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
      {roleIcons[role] || null}
      {role}
    </span>
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
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mobile cards skeleton */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {[...Array(5)].map((_, i) => (
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
                  <div className="grid grid-cols-4 gap-2">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="h-14 rounded-lg" />
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
          title="Total Players"
          value={stats.total}
          icon={Users}
          description="In tournament"
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-500/15"
        />
        <StatsCard
          title="Batsmen"
          value={stats.batsmen}
          icon={Swords}
          description="Top performers"
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-100 dark:bg-amber-500/15"
        />
        <StatsCard
          title="Bowlers"
          value={stats.bowlers}
          icon={Target}
          description="Wicket takers"
          iconColor="text-red-600 dark:text-red-400"
          iconBg="bg-red-100 dark:bg-red-500/15"
        />
        <StatsCard
          title="All-Rounders"
          value={stats.allRounders}
          icon={HandHelping}
          description="Dual threat"
          iconColor="text-green-600 dark:text-green-400"
          iconBg="bg-green-100 dark:bg-green-500/15"
        />
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <Tabs
              value={roleFilter}
              onValueChange={(val) => {
                setRoleFilter(val as RoleFilter);
                setCurrentPage(1);
              }}
            >
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="Batsman" className="gap-1.5">
                  <Swords className="h-3.5 w-3.5 hidden sm:block" />
                  Batsmen
                </TabsTrigger>
                <TabsTrigger value="Bowler" className="gap-1.5">
                  <Target className="h-3.5 w-3.5 hidden sm:block" />
                  Bowlers
                </TabsTrigger>
                <TabsTrigger value="All-Rounder" className="gap-1.5">
                  <HandHelping className="h-3.5 w-3.5 hidden sm:block" />
                  All-Rounders
                </TabsTrigger>
                <TabsTrigger value="Wicketkeeper" className="gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 hidden sm:block" />
                  WK
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="relative flex-1 w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search players by name, team, or role..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9"
                />
              </div>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Player
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredPlayers.length === 0 && !loading && (
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {searchQuery || roleFilter !== "all"
                ? "No players match your filters"
                : "No players yet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || roleFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first player to the tournament."}
            </p>
            {!searchQuery && roleFilter === "all" && (
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Player
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Desktop Table */}
      {filteredPlayers.length > 0 && (
        <Card className="border-border/50 hidden md:block">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Player</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">Role</TableHead>
                  <TableHead className="text-center">
                    {renderSortHeader("matches", "M")}
                  </TableHead>
                  <TableHead className="text-center">
                    {renderSortHeader("runs", "Runs")}
                  </TableHead>
                  <TableHead className="text-center">
                    {renderSortHeader("wickets", "Wkts")}
                  </TableHead>
                  <TableHead className="text-center">
                    {renderSortHeader("avg", "Avg")}
                  </TableHead>
                  <TableHead className="text-center">
                    {renderSortHeader("sr", "SR")}
                  </TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPlayers.map((player) => (
                  <TableRow
                    key={player.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {renderPlayerAvatar(player, "sm")}
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground text-sm">
                            {player.name}
                          </span>
                          {player.isCaptain && renderCaptainBadge()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{renderTeamBadge(player)}</TableCell>
                    <TableCell className="text-center">
                      {renderRoleWithIcon(player.role)}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {player.matches}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-foreground">
                      {player.runs}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-foreground">
                      {player.wickets}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {player.avg}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {player.sr}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(player)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 dark:text-red-400"
                            onClick={() => openDeleteDialog(player)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Mobile Cards */}
      {filteredPlayers.length > 0 && (
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {paginatedPlayers.map((player) => (
            <Card key={player.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {renderPlayerAvatar(player, "md")}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">
                          {player.name}
                        </span>
                        {player.isCaptain && renderCaptainBadge()}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                        {renderTeamBadge(
                          player,
                          "text-[10px] px-1.5 py-0 h-4 border-border/50"
                        )}
                        <span className="flex items-center gap-0.5">
                          {roleIcons[player.role]}
                          {player.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(player)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400"
                        onClick={() => openDeleteDialog(player)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="text-xs text-muted-foreground">M</div>
                    <div className="font-bold text-foreground">{player.matches}</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="text-xs text-muted-foreground">Runs</div>
                    <div className="font-bold text-foreground">{player.runs}</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="text-xs text-muted-foreground">Wkts</div>
                    <div className="font-bold text-foreground">{player.wickets}</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="text-xs text-muted-foreground">Avg</div>
                    <div className="font-bold text-foreground text-sm">{player.avg}</div>
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
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
              {editingPlayer ? "Edit Player" : "Add New Player"}
            </DialogTitle>
            <DialogDescription>
              {editingPlayer
                ? "Update the player details below."
                : "Fill in the details to register a new player."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="player-name">Player Name</Label>
              <Input
                id="player-name"
                placeholder="e.g., Rahul Sharma"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="player-team">Team</Label>
                <Select
                  value={formData.teamId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, teamId: val })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="player-role">Role</Label>
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
                    <SelectItem value="Batsman">Batsman</SelectItem>
                    <SelectItem value="Bowler">Bowler</SelectItem>
                    <SelectItem value="All-Rounder">All-Rounder</SelectItem>
                    <SelectItem value="Wicketkeeper">Wicketkeeper</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="player-matches">Matches</Label>
                <Input
                  id="player-matches"
                  type="number"
                  placeholder="0"
                  value={formData.matches}
                  onChange={(e) =>
                    setFormData({ ...formData, matches: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="player-runs">Runs</Label>
                <Input
                  id="player-runs"
                  type="number"
                  placeholder="0"
                  value={formData.runs}
                  onChange={(e) =>
                    setFormData({ ...formData, runs: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="player-wickets">Wickets</Label>
                <Input
                  id="player-wickets"
                  type="number"
                  placeholder="0"
                  value={formData.wickets}
                  onChange={(e) =>
                    setFormData({ ...formData, wickets: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="player-avg">Batting Average</Label>
                <Input
                  id="player-avg"
                  placeholder="0.00"
                  value={formData.avg}
                  onChange={(e) =>
                    setFormData({ ...formData, avg: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="player-sr">Strike Rate</Label>
                <Input
                  id="player-sr"
                  placeholder="0.00"
                  value={formData.sr}
                  onChange={(e) =>
                    setFormData({ ...formData, sr: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="player-best-batting">Best Batting</Label>
                <Input
                  id="player-best-batting"
                  placeholder="e.g., 68*(32)"
                  value={formData.bestBatting}
                  onChange={(e) =>
                    setFormData({ ...formData, bestBatting: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="player-best-bowling">Best Bowling</Label>
                <Input
                  id="player-best-bowling"
                  placeholder="e.g., 3/18"
                  value={formData.bestBowling}
                  onChange={(e) =>
                    setFormData({ ...formData, bestBowling: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="player-captain"
                checked={formData.isCaptain}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isCaptain: checked === true })
                }
              />
              <Label htmlFor="player-captain" className="cursor-pointer">
                Team Captain
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingPlayer ? "Save Changes" : "Add Player"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Player</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this player? This action cannot be
              undone and will remove the player from all records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={submitting}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
