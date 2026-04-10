"use client";

import { useState, useMemo } from "react";
import { teams } from "@/lib/cricket-data";
import { StatsCard } from "@/components/admin/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Trophy,
  XCircle,
  Shield,
} from "lucide-react";
import { Team } from "@/lib/cricket-data";

type StatusFilter = "all" | "qualified" | "eliminated";

const ITEMS_PER_PAGE = 5;

export default function TeamsManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    captain: "",
    color: "#ef4444",
  });

  const getTeamStatus = (index: number): "qualified" | "eliminated" => {
    return index < 4 ? "qualified" : "eliminated";
  };

  const qualifiedCount = 4;
  const eliminatedCount = 4;

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const matchesSearch =
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.captain.toLowerCase().includes(searchQuery.toLowerCase());

      const status = getTeamStatus(teams.indexOf(team));
      const matchesStatus =
        statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredTeams.length / ITEMS_PER_PAGE);
  const paginatedTeams = filteredTeams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTeams(new Set(paginatedTeams.map((t) => t.id)));
    } else {
      setSelectedTeams(new Set());
    }
  };

  const handleSelectTeam = (id: string, checked: boolean) => {
    const newSet = new Set(selectedTeams);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedTeams(newSet);
  };

  const isAllSelected =
    paginatedTeams.length > 0 &&
    paginatedTeams.every((t) => selectedTeams.has(t.id));

  const openEditDialog = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      shortName: team.shortName,
      captain: team.captain,
      color: team.color,
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingTeam(null);
    setFormData({
      name: "",
      shortName: "",
      captain: "",
      color: "#ef4444",
    });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Teams"
          value={teams.length}
          icon={Users}
          description="Registered teams"
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-500/15"
        />
        <StatsCard
          title="Qualified"
          value={qualifiedCount}
          icon={Trophy}
          description="For playoffs"
          iconColor="text-green-600 dark:text-green-400"
          iconBg="bg-green-100 dark:bg-green-500/15"
        />
        <StatsCard
          title="Eliminated"
          value={eliminatedCount}
          icon={XCircle}
          description="Out of tournament"
          iconColor="text-red-600 dark:text-red-400"
          iconBg="bg-red-100 dark:bg-red-500/15"
        />
      </div>

      {/* Filters and Search */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams, captains..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
            <div className="flex gap-3 items-center">
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val as StatusFilter);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="eliminated">Eliminated</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Team
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedTeams.size > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-3 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {selectedTeams.size} team{selectedTeams.size > 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Bulk Edit
              </Button>
              <Button variant="destructive" size="sm">
                Delete Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Desktop Table */}
      <Card className="border-border/50 hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(checked) => handleSelectAll(checked === true)}
                  />
                </TableHead>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-center">M</TableHead>
                <TableHead className="text-center">W/L/D</TableHead>
                <TableHead className="text-center">Pts</TableHead>
                <TableHead className="text-center">NRR</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTeams.map((team) => {
                const globalIndex = teams.findIndex((t) => t.id === team.id);
                const status = getTeamStatus(globalIndex);
                return (
                  <TableRow
                    key={team.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedTeams.has(team.id)}
                        onCheckedChange={(checked) =>
                          handleSelectTeam(team.id, checked === true)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">
                      {globalIndex + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: team.color }}
                        >
                          {team.shortName}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm">
                            {team.name}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            {team.captain}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {team.matchesPlayed}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5 text-sm">
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          {team.wins}
                        </span>
                        /
                        <span className="text-red-600 dark:text-red-400 font-semibold">
                          {team.losses}
                        </span>
                        /
                        <span className="text-muted-foreground">
                          {team.draws}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold text-foreground">
                      {team.points}
                    </TableCell>
                    <TableCell
                      className={`text-center text-sm font-medium ${
                        team.nrr.startsWith("+")
                          ? "text-green-600 dark:text-green-400"
                          : team.nrr.startsWith("-")
                          ? "text-red-600 dark:text-red-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {team.nrr}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={
                          status === "qualified"
                            ? "border-green-300 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400"
                            : "border-red-300 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
                        }
                      >
                        {status === "qualified" ? "Qualified" : "Eliminated"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(team)}>
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
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {paginatedTeams.map((team) => {
          const globalIndex = teams.findIndex((t) => t.id === team.id);
          const status = getTeamStatus(globalIndex);
          return (
            <Card key={team.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: team.color }}
                    >
                      {team.shortName}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{team.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {team.captain}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      status === "qualified"
                        ? "border-green-300 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400"
                        : "border-red-300 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
                    }
                  >
                    {status === "qualified" ? "Qualified" : "Eliminated"}
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="text-xs text-muted-foreground">M</div>
                    <div className="font-bold text-foreground">{team.matchesPlayed}</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="text-xs text-muted-foreground">W/L/D</div>
                    <div className="font-bold text-foreground text-sm">
                      <span className="text-green-600 dark:text-green-400">{team.wins}</span>
                      /<span className="text-red-600 dark:text-red-400">{team.losses}</span>
                      /{team.draws}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="text-xs text-muted-foreground">Pts</div>
                    <div className="font-bold text-foreground">{team.points}</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="text-xs text-muted-foreground">NRR</div>
                    <div
                      className={`font-bold text-sm ${
                        team.nrr.startsWith("+")
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {team.nrr}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(team)}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTeam ? "Edit Team" : "Add New Team"}
            </DialogTitle>
            <DialogDescription>
              {editingTeam
                ? "Update the team details below."
                : "Fill in the details to add a new team to the tournament."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                placeholder="e.g., Dadar Dynamos"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="short-name">Short Name</Label>
                <Input
                  id="short-name"
                  placeholder="e.g., DD"
                  value={formData.shortName}
                  onChange={(e) =>
                    setFormData({ ...formData, shortName: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="team-color">Team Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-9 h-9 rounded-md border border-border cursor-pointer"
                  />
                  <Input
                    id="team-color"
                    placeholder="#ef4444"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="captain">Captain Name</Label>
              <Input
                id="captain"
                placeholder="e.g., Rahul Sharma"
                value={formData.captain}
                onChange={(e) =>
                  setFormData({ ...formData, captain: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDialogOpen(false)}>
              {editingTeam ? "Save Changes" : "Add Team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
