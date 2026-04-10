"use client";

import { useState, useMemo } from "react";
import { topPlayers, tournamentInfo } from "@/lib/cricket-data";
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
} from "lucide-react";
import { Player } from "@/lib/cricket-data";

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

export default function PlayersManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    team: "",
    role: "Batsman",
    matches: "",
    runs: "",
    wickets: "",
    avg: "",
    sr: "",
  });

  const batsmanCount = topPlayers.filter((p) => p.role === "Batsman").length;
  const bowlerCount = topPlayers.filter((p) => p.role === "Bowler").length;
  const allRounderCount = topPlayers.filter(
    (p) => p.role === "All-Rounder"
  ).length;

  const filteredPlayers = useMemo(() => {
    let result = [...topPlayers];

    // Filter by role
    if (roleFilter !== "all") {
      result = result.filter((p) => p.role === roleFilter);
    }

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.team.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q)
      );
    }

    // Sort
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
  }, [searchQuery, roleFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredPlayers.length / ITEMS_PER_PAGE);
  const paginatedPlayers = filteredPlayers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const openEditDialog = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      team: player.team,
      role: player.role,
      matches: player.matches.toString(),
      runs: player.runs.toString(),
      wickets: player.wickets.toString(),
      avg: player.avg,
      sr: player.sr,
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingPlayer(null);
    setFormData({
      name: "",
      team: "",
      role: "Batsman",
      matches: "",
      runs: "",
      wickets: "",
      avg: "",
      sr: "",
    });
    setDialogOpen(true);
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

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Players"
          value={tournamentInfo.totalPlayers}
          icon={Users}
          description="In tournament"
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-500/15"
        />
        <StatsCard
          title="Batsmen"
          value={batsmanCount}
          icon={Swords}
          description="Top performers"
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-100 dark:bg-amber-500/15"
        />
        <StatsCard
          title="Bowlers"
          value={bowlerCount}
          icon={Target}
          description="Wicket takers"
          iconColor="text-red-600 dark:text-red-400"
          iconBg="bg-red-100 dark:bg-red-500/15"
        />
        <StatsCard
          title="All-Rounders"
          value={allRounderCount}
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

      {/* Desktop Table */}
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
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: player.teamColor }}
                      >
                        {player.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground text-sm">
                          {player.name}
                        </span>
                        {player.isCaptain && (
                          <span className="text-amber-500" title="Captain">
                            <svg
                              className="w-4 h-4 inline-block"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-border/50"
                      style={{
                        borderColor: player.teamColor + "60",
                        color: player.teamColor,
                        backgroundColor: player.teamColor + "10",
                      }}
                    >
                      {player.teamShort}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      {roleIcons[player.role] || null}
                      {player.role}
                    </span>
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
                        <DropdownMenuItem className="text-red-600 dark:text-red-400">
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

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {paginatedPlayers.map((player) => (
          <Card key={player.id} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: player.teamColor }}
                  >
                    {player.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground">
                        {player.name}
                      </span>
                      {player.isCaptain && (
                        <span className="text-amber-500">
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 h-4"
                        style={{
                          borderColor: player.teamColor + "60",
                          color: player.teamColor,
                          backgroundColor: player.teamColor + "10",
                        }}
                      >
                        {player.teamShort}
                      </Badge>
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
                    <DropdownMenuItem className="text-red-600 dark:text-red-400">
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
        <DialogContent className="sm:max-w-lg">
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
                  value={formData.team}
                  onValueChange={(val) =>
                    setFormData({ ...formData, team: val })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dadar Dynamos">Dadar Dynamos</SelectItem>
                    <SelectItem value="Andheri Avengers">
                      Andheri Avengers
                    </SelectItem>
                    <SelectItem value="Bandra Blazers">
                      Bandra Blazers
                    </SelectItem>
                    <SelectItem value="Juhu Jaguars">Juhu Jaguars</SelectItem>
                    <SelectItem value="Worli Warriors">Worli Warriors</SelectItem>
                    <SelectItem value="Powai Panthers">Powai Panthers</SelectItem>
                    <SelectItem value="Thane Tigers">Thane Tigers</SelectItem>
                    <SelectItem value="Kurla Knights">Kurla Knights</SelectItem>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDialogOpen(false)}>
              {editingPlayer ? "Save Changes" : "Add Player"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
