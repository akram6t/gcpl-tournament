"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { apiGet, apiPut } from "@/lib/api";
import { tournamentInfo } from "@/lib/cricket-data";
import { Team } from "@/lib/cricket-data";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  RotateCcw,
  Trophy,
  Medal,
  Award,
  Pencil,
  TrendingUp,
  Gamepad2,
  Swords,
  Info,
  CheckCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface ExtendedTeam extends Team {
  form: ("W" | "L" | "D" | "N")[];
}

// Generate form data based on wins/losses/draws
function generateForm(team: Team): ExtendedTeam["form"] {
  const total = team.wins + team.losses + team.draws;
  const form: ExtendedTeam["form"] = [];
  for (let i = 0; i < Math.min(5, total); i++) {
    if (i < team.wins) {
      form.push("W");
    } else if (i < team.wins + team.losses) {
      form.push("L");
    } else {
      form.push("D");
    }
  }
  while (form.length < 5) {
    form.push("N");
  }
  return form;
}

export default function StandingsPage() {
  const [teams, setTeams] = useState<ExtendedTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<ExtendedTeam | null>(null);
  const [editNrr, setEditNrr] = useState("");
  const [editPoints, setEditPoints] = useState("");
  const [editWins, setEditWins] = useState("");
  const [editLosses, setEditLosses] = useState("");
  const [editDraws, setEditDraws] = useState("");
  const [editMatchesPlayed, setEditMatchesPlayed] = useState("");

  const fetchStandings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGet<Team[]>("/api/standings");
      const extended: ExtendedTeam[] = data.map((t) => ({
        ...t,
        form: generateForm(t),
      }));
      setTeams(extended);
    } catch (error) {
      console.error("Failed to fetch standings:", error);
      toast.error("Failed to load standings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStandings();
  }, [fetchStandings]);

  const leader = teams[0];

  // Find closest race
  let closestRace = "";
  for (let i = 0; i < teams.length - 1; i++) {
    const diff = teams[i].points - teams[i + 1].points;
    if (diff <= 1) {
      closestRace = `${teams[i].shortName} vs ${teams[i + 1].shortName}`;
      break;
    }
  }

  const totalMatches = tournamentInfo.totalMatches;
  const totalPlayed = teams.length > 0
    ? teams.reduce((sum, t) => sum + t.matchesPlayed, 0) / 2
    : 0;
  const remaining = totalMatches - totalPlayed;

  const openEditDialog = (team: ExtendedTeam) => {
    setEditingTeam(team);
    setEditNrr(team.nrr);
    setEditPoints(String(team.points));
    setEditWins(String(team.wins));
    setEditLosses(String(team.losses));
    setEditDraws(String(team.draws));
    setEditMatchesPlayed(String(team.matchesPlayed));
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingTeam) return;

    const points = parseInt(editPoints, 10);
    const wins = parseInt(editWins, 10);
    const losses = parseInt(editLosses, 10);
    const draws = parseInt(editDraws, 10);
    const matchesPlayed = parseInt(editMatchesPlayed, 10);

    if (isNaN(points) || isNaN(wins) || isNaN(losses) || isNaN(draws) || isNaN(matchesPlayed)) {
      toast.error("Please enter valid numbers for all fields.");
      return;
    }

    if (editNrr === "") {
      toast.error("Please enter a valid NRR value.");
      return;
    }

    try {
      setSaving(true);
      const updated = await apiPut<Team>("/api/standings", {
        id: editingTeam.id,
        points,
        nrr: editNrr,
        wins,
        losses,
        draws,
        matchesPlayed,
      });

      // Update local state with the returned team
      setTeams((prev) => {
        const updatedTeams = prev.map((t) =>
          t.id === updated.id ? { ...updated, form: generateForm(updated) } : t
        );
        // Re-sort by points desc, nrr desc
        return updatedTeams.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          const aNrr = parseFloat(a.nrr);
          const bNrr = parseFloat(b.nrr);
          return bNrr - aNrr;
        });
      });

      setEditDialogOpen(false);
      toast.success(`${editingTeam.name} standings updated successfully!`);
    } catch (error) {
      console.error("Failed to save standings:", error);
      toast.error("Failed to save standings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = () => {
    if (teams.length === 0) return;

    const headers = ["Pos", "Team", "Short", "M", "W", "L", "D", "NRR", "Pts", "Captain"];
    const rows = teams.map((t, idx) => [
      idx + 1,
      `"${t.name}"`,
      t.shortName,
      t.matchesPlayed,
      t.wins,
      t.losses,
      t.draws,
      t.nrr,
      t.points,
      `"${t.captain}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gcpl-standings.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Standings exported to CSV!");
  };

  const getNrrColor = (nrr: string) => {
    const val = parseFloat(nrr);
    if (val > 0) return "text-green-600 dark:text-green-400";
    if (val < 0) return "text-red-600 dark:text-red-400";
    return "text-muted-foreground";
  };

  const getNrrBg = (nrr: string) => {
    const val = parseFloat(nrr);
    if (val > 0) return "bg-green-50 dark:bg-green-500/10";
    if (val < 0) return "bg-red-50 dark:bg-red-500/10";
    return "";
  };

  const getFormDotColor = (result: string) => {
    switch (result) {
      case "W":
        return "bg-green-500";
      case "L":
        return "bg-red-500";
      case "D":
        return "bg-amber-500";
      default:
        return "bg-muted-foreground/30";
    }
  };

  const getPositionIcon = (pos: number) => {
    if (pos === 1) return <Trophy className="w-4 h-4 text-amber-500" />;
    if (pos === 2) return <Medal className="w-4 h-4 text-gray-400" />;
    if (pos === 3) return <Award className="w-4 h-4 text-amber-700" />;
    return <span className="text-sm font-medium text-muted-foreground">{pos}</span>;
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <div className="h-6 w-36 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-28 bg-muted animate-pulse rounded" />
            <div className="h-9 w-32 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Alert skeleton */}
        <div className="h-12 bg-muted animate-pulse rounded-lg" />

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                    <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="w-11 h-11 bg-muted animate-pulse rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table skeleton */}
        <Card className="border-border/50 hidden md:block">
          <CardContent className="p-0">
            <div className="px-4 py-3 border-b">
              <div className="flex gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-4 bg-muted animate-pulse rounded flex-1" />
                ))}
              </div>
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex gap-4 px-4 py-3 border-b last:border-0">
                {Array.from({ length: 10 }).map((_, j) => (
                  <div key={j} className="h-4 bg-muted animate-pulse rounded flex-1" />
                ))}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mobile cards skeleton */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-muted animate-pulse rounded" />
                    <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
                    <div className="space-y-1">
                      <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                  <div className="w-20 h-6 bg-muted animate-pulse rounded" />
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} className="space-y-1 text-center">
                      <div className="h-3 w-6 bg-muted animate-pulse rounded mx-auto" />
                      <div className="h-4 w-6 bg-muted animate-pulse rounded mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Points Table</h2>
          <p className="text-sm text-muted-foreground">Manage league standings and qualification</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button variant="outline" className="gap-2" onClick={fetchStandings}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="destructive" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset Standings
          </Button>
        </div>
      </div>

      {/* Info Alert */}
      <Alert className="border-green-200 bg-green-50 dark:border-green-500/20 dark:bg-green-500/5">
        <Info className="w-4 h-4 text-green-600 dark:text-green-400" />
        <AlertDescription className="text-green-800 dark:text-green-300">
          <strong>Top 4 teams</strong> qualify for Semi-Finals. <strong>Bottom 4</strong> are eliminated from the tournament.
        </AlertDescription>
      </Alert>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Matches Played"
          value={`${Math.round(totalPlayed)}/${totalMatches}`}
          icon={Gamepad2}
          description="League stage"
          iconColor="text-green-600 dark:text-green-400"
          iconBg="bg-green-100 dark:bg-green-500/15"
        />
        <StatsCard
          title="Remaining"
          value={remaining}
          icon={TrendingUp}
          description="League stage left"
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-100 dark:bg-amber-500/15"
        />
        <StatsCard
          title="Leader"
          value={leader ? leader.shortName : "—"}
          icon={Trophy}
          description={leader ? leader.name : "No data"}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-100 dark:bg-amber-500/15"
        />
        <StatsCard
          title="Closest Race"
          value={closestRace || "None"}
          icon={Swords}
          description="Tightest battle"
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-100 dark:bg-purple-500/15"
        />
      </div>

      {/* Desktop Table */}
      <Card className="border-border/50 hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-14 text-center">Pos</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-center">M</TableHead>
                <TableHead className="text-center">W</TableHead>
                <TableHead className="text-center">L</TableHead>
                <TableHead className="text-center">D</TableHead>
                <TableHead className="text-center">NRR</TableHead>
                <TableHead className="text-center font-bold">Pts</TableHead>
                <TableHead className="text-center">Form</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team, idx) => {
                const pos = idx + 1;
                const isQualified = pos <= 4;
                return (
                  <TableRow
                    key={team.id}
                    className={`hover:bg-muted/50 transition-colors ${
                      isQualified
                        ? "border-l-4 border-l-green-500 bg-green-50/30 dark:bg-green-500/5"
                        : "border-l-4 border-l-red-500/40 bg-red-50/20 dark:bg-red-500/5"
                    }`}
                  >
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        {getPositionIcon(pos)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
                          style={{ backgroundColor: team.colorLight }}
                        >
                          {team.logo}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">{team.name}</p>
                          <p className="text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              {team.captain}
                            </span>
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm font-medium text-foreground">
                      {team.matchesPlayed}
                    </TableCell>
                    <TableCell className="text-center text-sm font-medium text-green-600 dark:text-green-400">
                      {team.wins}
                    </TableCell>
                    <TableCell className="text-center text-sm font-medium text-red-600 dark:text-red-400">
                      {team.losses}
                    </TableCell>
                    <TableCell className="text-center text-sm font-medium text-amber-600 dark:text-amber-400">
                      {team.draws}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`text-sm font-semibold inline-block px-2 py-0.5 rounded ${getNrrColor(team.nrr)} ${getNrrBg(team.nrr)}`}
                      >
                        {team.nrr}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-lg font-bold text-foreground">{team.points}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {team.form.map((result, fIdx) => (
                          <span
                            key={fIdx}
                            className={`w-2.5 h-2.5 rounded-full ${getFormDotColor(result)}`}
                            title={result === "W" ? "Win" : result === "L" ? "Loss" : result === "D" ? "Draw" : "Not played"}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(team)}
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </Button>
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
        {teams.map((team, idx) => {
          const pos = idx + 1;
          const isQualified = pos <= 4;
          return (
            <Card
              key={team.id}
              className={`border-border/50 ${
                isQualified
                  ? "border-l-4 border-l-green-500"
                  : "border-l-4 border-l-red-500/40"
              }`}
            >
              <CardContent className="p-4">
                {/* Position & Team Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6">
                      {getPositionIcon(pos)}
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                        style={{ backgroundColor: team.colorLight }}
                      >
                        {team.logo}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{team.name}</p>
                        <p className="text-xs text-muted-foreground">{team.captain}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isQualified ? "default" : "secondary"}
                      className={isQualified ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400 border-0" : ""}
                    >
                      {isQualified ? "Qualified" : "Eliminated"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => openEditDialog(team)}
                    >
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-6 gap-2 text-center mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">M</p>
                    <p className="text-sm font-bold text-foreground">{team.matchesPlayed}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">W</p>
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">{team.wins}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">L</p>
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">{team.losses}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">D</p>
                    <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{team.draws}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">NRR</p>
                    <p className={`text-sm font-bold ${getNrrColor(team.nrr)}`}>{team.nrr}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pts</p>
                    <p className="text-sm font-bold text-foreground">{team.points}</p>
                  </div>
                </div>

                {/* Form */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Form:</span>
                  <div className="flex items-center gap-1">
                    {team.form.map((result, fIdx) => (
                      <span
                        key={fIdx}
                        className={`w-3 h-3 rounded-full ${getFormDotColor(result)}`}
                        title={result === "W" ? "Win" : result === "L" ? "Loss" : result === "D" ? "Draw" : "Not played"}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Qualification Legend */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-green-500" />
              <span className="text-muted-foreground">Qualification Zone (Top 4 - Semi-Finals)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-red-500/60" />
              <span className="text-muted-foreground">Elimination Zone (Bottom 4)</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Win</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Loss</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Draw</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
              <span className="text-muted-foreground">Not Played</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Team Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Team Standings</DialogTitle>
            <DialogDescription>
              {editingTeam
                ? `Update standings for ${editingTeam.name}`
                : "Edit team standings."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {editingTeam && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: editingTeam.colorLight }}
                >
                  {editingTeam.logo}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{editingTeam.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Captain: {editingTeam.captain}
                  </p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="edit-matches">Matches</Label>
                <Input
                  id="edit-matches"
                  type="number"
                  min="0"
                  placeholder="e.g., 6"
                  value={editMatchesPlayed}
                  onChange={(e) => setEditMatchesPlayed(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-wins">Wins</Label>
                <Input
                  id="edit-wins"
                  type="number"
                  min="0"
                  placeholder="e.g., 5"
                  value={editWins}
                  onChange={(e) => setEditWins(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-losses">Losses</Label>
                <Input
                  id="edit-losses"
                  type="number"
                  min="0"
                  placeholder="e.g., 1"
                  value={editLosses}
                  onChange={(e) => setEditLosses(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="edit-draws">Draws</Label>
                <Input
                  id="edit-draws"
                  type="number"
                  min="0"
                  placeholder="e.g., 0"
                  value={editDraws}
                  onChange={(e) => setEditDraws(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-points">Points</Label>
                <Input
                  id="edit-points"
                  type="number"
                  min="0"
                  placeholder="e.g., 10"
                  value={editPoints}
                  onChange={(e) => setEditPoints(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-nrr">Net Run Rate (NRR)</Label>
              <Input
                id="edit-nrr"
                placeholder="e.g., +1.234"
                value={editNrr}
                onChange={(e) => setEditNrr(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
