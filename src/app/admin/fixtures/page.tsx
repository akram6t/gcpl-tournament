"use client";

import { useState, useMemo } from "react";
import { fixtures, teams } from "@/lib/cricket-data";
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
  ClipboardEdit,
  Calendar,
  CircleCheck,
  Radio,
  Clock,
  MapPin,
  Trophy,
} from "lucide-react";
import { Fixture } from "@/lib/cricket-data";

type StatusFilter = "all" | "live" | "completed" | "upcoming";

const ITEMS_PER_PAGE = 6;

const statusConfig: Record<string, { label: string; className: string }> = {
  live: {
    label: "Live",
    className:
      "border-red-300 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400",
  },
  completed: {
    label: "Completed",
    className:
      "border-green-300 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400",
  },
  upcoming: {
    label: "Upcoming",
    className:
      "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400",
  },
};

export default function FixturesManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
  const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);
  const [formData, setFormData] = useState({
    team1: "",
    team2: "",
    date: "",
    time: "",
    venue: "",
    status: "upcoming" as Fixture["status"],
  });
  const [scoreData, setScoreData] = useState({
    score: "",
    result: "",
  });

  const completedCount = fixtures.filter((f) => f.status === "completed").length;
  const liveCount = fixtures.filter((f) => f.status === "live").length;
  const upcomingCount = fixtures.filter((f) => f.status === "upcoming").length;

  const filteredFixtures = useMemo(() => {
    return fixtures.filter((fixture) => {
      const matchesSearch =
        fixture.team1.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fixture.team2.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fixture.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `match ${fixture.matchNumber}`.includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || fixture.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredFixtures.length / ITEMS_PER_PAGE);
  const paginatedFixtures = filteredFixtures.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const openEditDialog = (fixture: Fixture) => {
    setEditingFixture(fixture);
    setFormData({
      team1: fixture.team1,
      team2: fixture.team2,
      date: fixture.date,
      time: fixture.time,
      venue: fixture.venue,
      status: fixture.status,
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingFixture(null);
    setFormData({
      team1: "",
      team2: "",
      date: "",
      time: "",
      venue: "",
      status: "upcoming",
    });
    setDialogOpen(true);
  };

  const openScoreDialog = (fixture: Fixture) => {
    setEditingFixture(fixture);
    setScoreData({
      score: fixture.score || "",
      result: fixture.result || "",
    });
    setScoreDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Matches"
          value={fixtures.length}
          icon={Calendar}
          description="Scheduled fixtures"
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-500/15"
        />
        <StatsCard
          title="Completed"
          value={completedCount}
          icon={CircleCheck}
          description="Results available"
          iconColor="text-green-600 dark:text-green-400"
          iconBg="bg-green-100 dark:bg-green-500/15"
        />
        <StatsCard
          title="Live"
          value={liveCount}
          icon={Radio}
          description="In progress"
          iconColor="text-red-600 dark:text-red-400"
          iconBg="bg-red-100 dark:bg-red-500/15"
        />
        <StatsCard
          title="Upcoming"
          value={upcomingCount}
          icon={Clock}
          description="Yet to start"
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-100 dark:bg-amber-500/15"
        />
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <Tabs
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val as StatusFilter);
                setCurrentPage(1);
              }}
            >
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="all" className="gap-1.5">
                  <Calendar className="h-3.5 w-3.5 hidden sm:block" />
                  All
                </TabsTrigger>
                <TabsTrigger value="live" className="gap-1.5">
                  <Radio className="h-3.5 w-3.5 hidden sm:block" />
                  Live
                </TabsTrigger>
                <TabsTrigger value="completed" className="gap-1.5">
                  <CircleCheck className="h-3.5 w-3.5 hidden sm:block" />
                  Completed
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="gap-1.5">
                  <Clock className="h-3.5 w-3.5 hidden sm:block" />
                  Upcoming
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="relative flex-1 w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search matches, teams, venues..."
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
                Schedule Match
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table */}
      <Card className="border-border/50 hidden lg:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-20">Match</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Team 1</TableHead>
                <TableHead className="text-center">vs</TableHead>
                <TableHead>Team 2</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Score / Result</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFixtures.map((fixture) => (
                <TableRow
                  key={fixture.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    <span className="text-sm font-semibold text-muted-foreground">
                      #{fixture.matchNumber}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-foreground whitespace-nowrap">
                    {fixture.date}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {fixture.time}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                        style={{ backgroundColor: fixture.team1Color }}
                      >
                        {fixture.team1Short}
                      </div>
                      <span className="font-medium text-sm text-foreground whitespace-nowrap">
                        {fixture.team1}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-muted-foreground font-semibold text-xs">vs</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                        style={{ backgroundColor: fixture.team2Color }}
                      >
                        {fixture.team2Short}
                      </div>
                      <span className="font-medium text-sm text-foreground whitespace-nowrap">
                        {fixture.team2}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate max-w-[140px]">{fixture.venue}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {fixture.status === "live" && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                        </span>
                      )}
                      <Badge
                        variant="outline"
                        className={statusConfig[fixture.status].className}
                      >
                        {statusConfig[fixture.status].label}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      {fixture.score && (
                        <p className="text-xs text-muted-foreground truncate">
                          {fixture.score}
                        </p>
                      )}
                      {fixture.result && (
                        <p className="text-xs font-medium text-green-600 dark:text-green-400 truncate flex items-center gap-1">
                          <Trophy className="h-3 w-3 shrink-0" />
                          {fixture.result}
                        </p>
                      )}
                      {!fixture.score && !fixture.result && (
                        <p className="text-xs text-muted-foreground italic">
                          Not started
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(fixture)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openScoreDialog(fixture)}>
                          <ClipboardEdit className="h-4 w-4 mr-2" />
                          Update Score
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

      {/* Mobile/Tablet Cards (md-lg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:hidden">
        {paginatedFixtures.map((fixture) => (
          <Card key={fixture.id} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-muted-foreground">
                  Match #{fixture.matchNumber}
                </span>
                <div className="flex items-center gap-1.5">
                  {fixture.status === "live" && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                  )}
                  <Badge
                    variant="outline"
                    className={statusConfig[fixture.status].className}
                  >
                    {statusConfig[fixture.status].label}
                  </Badge>
                </div>
              </div>

              {/* Teams */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: fixture.team1Color }}
                  >
                    {fixture.team1Short}
                  </div>
                  <span className="font-semibold text-sm text-foreground truncate">
                    {fixture.team1}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-bold shrink-0">VS</span>
                <div className="flex-1 flex items-center gap-2 justify-end">
                  <span className="font-semibold text-sm text-foreground truncate text-right">
                    {fixture.team2}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: fixture.team2Color }}
                  >
                    {fixture.team2Short}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {fixture.date}
                </span>
                <span>{fixture.time}</span>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                <MapPin className="h-3 w-3 shrink-0" />
                {fixture.venue}
              </div>

              {/* Score/Result */}
              {fixture.score && (
                <div className="bg-muted/50 rounded-lg p-2 mb-3">
                  <p className="text-xs text-muted-foreground">{fixture.score}</p>
                  {fixture.result && (
                    <p className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                      <Trophy className="h-3 w-3" />
                      {fixture.result}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(fixture)}
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
                {fixture.status !== "upcoming" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openScoreDialog(fixture)}
                  >
                    <ClipboardEdit className="h-3.5 w-3.5 mr-1" />
                    Score
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
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

      {/* Add/Edit Fixture Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingFixture ? "Edit Match" : "Schedule Match"}
            </DialogTitle>
            <DialogDescription>
              {editingFixture
                ? "Update the match details below."
                : "Fill in the details to schedule a new match."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fixture-team1">Team 1</Label>
                <Select
                  value={formData.team1}
                  onValueChange={(val) =>
                    setFormData({ ...formData, team1: val })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.name}>
                        {team.logo} {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fixture-team2">Team 2</Label>
                <Select
                  value={formData.team2}
                  onValueChange={(val) =>
                    setFormData({ ...formData, team2: val })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.name}>
                        {team.logo} {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fixture-date">Date</Label>
                <Input
                  id="fixture-date"
                  placeholder="e.g., 15 Jan"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fixture-time">Time</Label>
                <Input
                  id="fixture-time"
                  placeholder="e.g., 4:00 PM"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fixture-venue">Venue</Label>
              <Input
                id="fixture-venue"
                placeholder="e.g., Shivaji Park Ground A"
                value={formData.venue}
                onChange={(e) =>
                  setFormData({ ...formData, venue: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fixture-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) =>
                  setFormData({ ...formData, status: val as Fixture["status"] })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDialogOpen(false)}>
              {editingFixture ? "Save Changes" : "Schedule Match"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Score Dialog */}
      <Dialog open={scoreDialogOpen} onOpenChange={setScoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Score</DialogTitle>
            <DialogDescription>
              {editingFixture
                ? `Match #${editingFixture.matchNumber}: ${editingFixture.team1Short} vs ${editingFixture.team2Short}`
                : "Update match score and result."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="match-score">Score</Label>
              <Input
                id="match-score"
                placeholder="e.g., DD 78/3 (8 ov) vs AA 65/7 (8 ov)"
                value={scoreData.score}
                onChange={(e) =>
                  setScoreData({ ...scoreData, score: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="match-result">Result</Label>
              <Input
                id="match-result"
                placeholder="e.g., Dadar Dynamos won by 13 runs"
                value={scoreData.result}
                onChange={(e) =>
                  setScoreData({ ...scoreData, result: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setScoreDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setScoreDialogOpen(false)}>
              Update Score
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
