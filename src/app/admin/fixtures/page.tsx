"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
import { Separator } from "@/components/ui/separator";
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
  Loader2,
  Zap,
  ArrowLeftRight,
  RotateCcw,
  Undo2,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

// ============ Types ============

interface ApiTeam {
  id: string;
  name: string;
  shortName: string;
  color: string;
  colorLight: string;
  captain: string;
  logo: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  nrr: string;
  matchesPlayed: number;
  createdAt: string;
  updatedAt: string;
  _count?: { players: number };
}

interface ApiPlayer {
  id: string;
  name: string;
  team: string;
  teamShort: string;
  teamColor: string;
  teamId: string;
  role: string;
}

interface FixtureItem {
  id: string;
  matchNumber: number;
  team1: string;
  team1Short: string;
  team1Color: string;
  team1Id?: string;
  team2: string;
  team2Short: string;
  team2Color: string;
  team2Id?: string;
  date: string;
  time: string;
  venue: string;
  status: "completed" | "live" | "upcoming";
  score?: string;
  result?: string;
  // Live score fields
  battingTeam?: number;
  team1Score?: number;
  team1Wickets?: number;
  team1Overs?: string;
  team2Score?: number;
  team2Wickets?: number;
  team2Overs?: string;
  striker?: string;
  nonStriker?: string;
  bowler?: string;
  strikerRuns?: number;
  strikerBalls?: number;
  nonStrikerRuns?: number;
  nonStrikerBalls?: number;
  bowlerRuns?: number;
  bowlerWickets?: number;
  bowlerOvers?: string;
  thisOver?: string;
}

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
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400",
  },
};

// ============ Helper Functions ============

function parseOvers(overs: string): { full: number; balls: number } {
  const parts = overs.split(".");
  return { full: parseInt(parts[0], 10) || 0, balls: parseInt(parts[1], 10) || 0 };
}

function formatOvers(full: number, balls: number): string {
  return `${full}.${balls}`;
}

function addBallToOvers(overs: string, count: number): string {
  const { full, balls } = parseOvers(overs);
  const totalBalls = full * 6 + balls + count;
  return formatOvers(Math.floor(totalBalls / 6), totalBalls % 6);
}

function computeRunRate(runs: number, overs: string): string {
  const { full, balls } = parseOvers(overs);
  const totalOvers = full + balls / 6;
  if (totalOvers === 0) return "0.00";
  return (runs / totalOvers).toFixed(2);
}

function getBallBadgeClass(ball: string): string {
  if (ball === "W") return "bg-red-500 text-white";
  if (ball === "Wd") return "bg-yellow-500 text-black";
  if (ball === "Nb") return "bg-yellow-500 text-black";
  if (ball === "4") return "border-2 border-green-500 text-green-600 dark:text-green-400 bg-green-500/10";
  if (ball === "6") return "bg-green-600 text-white";
  if (ball === "0" || ball === ".") return "bg-muted text-muted-foreground";
  return "bg-card text-foreground border border-border";
}

// ============ Live Score State Interface ============

interface LiveScoreState {
  battingTeam: number;
  team1Score: number;
  team1Wickets: number;
  team1Overs: string;
  team2Score: number;
  team2Wickets: number;
  team2Overs: string;
  striker: string;
  strikerRuns: number;
  strikerBalls: number;
  nonStriker: string;
  nonStrikerRuns: number;
  nonStrikerBalls: number;
  bowler: string;
  bowlerRuns: number;
  bowlerWickets: number;
  bowlerOvers: string;
  thisOver: string;
  result: string;
}

function createDefaultLiveScore(): LiveScoreState {
  return {
    battingTeam: 1,
    team1Score: 0,
    team1Wickets: 0,
    team1Overs: "0.0",
    team2Score: 0,
    team2Wickets: 0,
    team2Overs: "0.0",
    striker: "",
    strikerRuns: 0,
    strikerBalls: 0,
    nonStriker: "",
    nonStrikerRuns: 0,
    nonStrikerBalls: 0,
    bowler: "",
    bowlerRuns: 0,
    bowlerWickets: 0,
    bowlerOvers: "0.0",
    thisOver: "",
    result: "",
  };
}

// ============ Component ============

export default function FixturesManagementPage() {
  // Data state
  const [fixtures, setFixtures] = useState<FixtureItem[]>([]);
  const [teams, setTeams] = useState<ApiTeam[]>([]);
  const [players, setPlayers] = useState<ApiPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
  const [editingFixture, setEditingFixture] = useState<FixtureItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    team1Id: "",
    team2Id: "",
    date: "",
    time: "",
    venue: "",
    status: "upcoming" as string,
  });

  // Live score state
  const [liveScore, setLiveScore] = useState<LiveScoreState>(createDefaultLiveScore());
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Manual override state
  const [manualOverride, setManualOverride] = useState({
    team1Score: "",
    team1Wickets: "",
    team1Overs: "",
    team2Score: "",
    team2Wickets: "",
    team2Overs: "",
  });

  // ============ Data Fetching ============

  const loadFixtures = useCallback(async () => {
    try {
      const data = await apiGet<Record<string, unknown>[]>("/api/fixtures");
      const normalized: FixtureItem[] = data.map((f) => ({
        id: f.id as string,
        matchNumber: f.matchNumber as number,
        team1: f.team1 as string,
        team1Short: f.team1Short as string,
        team1Color: f.team1Color as string,
        team2: f.team2 as string,
        team2Short: f.team2Short as string,
        team2Color: f.team2Color as string,
        date: f.date as string,
        time: f.time as string,
        venue: f.venue as string,
        status: ((f.status as string)?.toLowerCase() ?? "upcoming") as FixtureItem["status"],
        score: (f.score as string) ?? undefined,
        result: (f.result as string) ?? undefined,
        battingTeam: (f.battingTeam as number) ?? undefined,
        team1Score: (f.team1Score as number) ?? undefined,
        team1Wickets: (f.team1Wickets as number) ?? undefined,
        team1Overs: (f.team1Overs as string) ?? undefined,
        team2Score: (f.team2Score as number) ?? undefined,
        team2Wickets: (f.team2Wickets as number) ?? undefined,
        team2Overs: (f.team2Overs as string) ?? undefined,
        striker: (f.striker as string) ?? undefined,
        nonStriker: (f.nonStriker as string) ?? undefined,
        bowler: (f.bowler as string) ?? undefined,
        strikerRuns: (f.strikerRuns as number) ?? undefined,
        strikerBalls: (f.strikerBalls as number) ?? undefined,
        nonStrikerRuns: (f.nonStrikerRuns as number) ?? undefined,
        nonStrikerBalls: (f.nonStrikerBalls as number) ?? undefined,
        bowlerRuns: (f.bowlerRuns as number) ?? undefined,
        bowlerWickets: (f.bowlerWickets as number) ?? undefined,
        bowlerOvers: (f.bowlerOvers as string) ?? undefined,
        thisOver: (f.thisOver as string) ?? undefined,
      }));
      setFixtures(normalized);
    } catch {
      toast.error("Failed to load fixtures");
    }
  }, []);

  const loadTeams = useCallback(async () => {
    try {
      const data = await apiGet<ApiTeam[]>("/api/teams");
      setTeams(data);
    } catch {
      toast.error("Failed to load teams");
    }
  }, []);

  const loadPlayers = useCallback(async () => {
    try {
      const data = await apiGet<ApiPlayer[]>("/api/players");
      setPlayers(data);
    } catch {
      toast.error("Failed to load players");
    }
  }, []);

  useEffect(() => {
    Promise.all([loadFixtures(), loadTeams(), loadPlayers()]).finally(() =>
      setIsLoading(false)
    );
  }, [loadFixtures, loadTeams, loadPlayers]);

  // ============ Computed Values ============

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
  }, [fixtures, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredFixtures.length / ITEMS_PER_PAGE);
  const paginatedFixtures = filteredFixtures.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Players filtered by team for the live score dialog
  const battingTeamPlayers = useMemo(() => {
    if (!editingFixture) return [];
    const teamName = liveScore.battingTeam === 1 ? editingFixture.team1 : editingFixture.team2;
    return players.filter((p) => p.team === teamName);
  }, [editingFixture, players, liveScore.battingTeam]);

  const bowlingTeamPlayers = useMemo(() => {
    if (!editingFixture) return [];
    const teamName = liveScore.battingTeam === 1 ? editingFixture.team2 : editingFixture.team1;
    return players.filter((p) => p.team === teamName);
  }, [editingFixture, players, liveScore.battingTeam]);

  // Current over balls parsed
  const thisOverBalls = useMemo(() => {
    if (!liveScore.thisOver) return [];
    return liveScore.thisOver.split(/\s+/).filter(Boolean);
  }, [liveScore.thisOver]);

  // Run rates
  const battingRunRate = useMemo(() => {
    const bt = liveScore.battingTeam;
    const runs = bt === 1 ? liveScore.team1Score : liveScore.team2Score;
    const overs = bt === 1 ? liveScore.team1Overs : liveScore.team2Overs;
    return computeRunRate(runs, overs);
  }, [liveScore]);

  // ============ Helpers ============

  const getTeamIdByName = (name: string): string => {
    const team = teams.find((t) => t.name === name);
    return team?.id ?? "";
  };

  // ============ Auto-save with debounce ============

  const saveLiveScore = useCallback(async () => {
    if (!editingFixture) return;
    setIsSaving(true);
    try {
      const payload: Record<string, unknown> = {
        id: editingFixture.id,
        matchNumber: editingFixture.matchNumber,
        team1Id: getTeamIdByName(editingFixture.team1) || undefined,
        team2Id: getTeamIdByName(editingFixture.team2) || undefined,
        date: editingFixture.date,
        time: editingFixture.time,
        venue: editingFixture.venue,
        status: editingFixture.status.toUpperCase(),
        battingTeam: liveScore.battingTeam,
        team1Score: liveScore.team1Score,
        team1Wickets: liveScore.team1Wickets,
        team1Overs: liveScore.team1Overs,
        team2Score: liveScore.team2Score,
        team2Wickets: liveScore.team2Wickets,
        team2Overs: liveScore.team2Overs,
        striker: liveScore.striker || null,
        nonStriker: liveScore.nonStriker || null,
        bowler: liveScore.bowler || null,
        strikerRuns: liveScore.strikerRuns,
        strikerBalls: liveScore.strikerBalls,
        nonStrikerRuns: liveScore.nonStrikerRuns,
        nonStrikerBalls: liveScore.nonStrikerBalls,
        bowlerRuns: liveScore.bowlerRuns,
        bowlerWickets: liveScore.bowlerWickets,
        bowlerOvers: liveScore.bowlerOvers,
        thisOver: liveScore.thisOver || null,
        result: liveScore.result || null,
      };
      await apiPut("/api/fixtures", payload);
      await loadFixtures();
    } catch {
      toast.error("Failed to auto-save score");
    } finally {
      setIsSaving(false);
    }
  }, [editingFixture, liveScore, loadFixtures]);

  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveLiveScore();
    }, 2000);
  }, [saveLiveScore]);

  // ============ Quick Action Handlers ============

  const handleQuickAction = useCallback((type: string) => {
    setLiveScore((prev) => {
      const next = { ...prev };
      const bt = prev.battingTeam;
      const isLegalBall = type !== "Wd" && type !== "Nb";

      // Count balls in this over (legal deliveries only)
      const currentBalls = prev.thisOver ? prev.thisOver.split(/\s+/).filter(b => b !== "Wd" && b !== "Nb").length : 0;

      switch (type) {
        case "0":
        case "1":
        case "2":
        case "3": {
          const runs = parseInt(type, 10);
          if (bt === 1) {
            next.team1Score += runs;
          } else {
            next.team2Score += runs;
          }
          next.strikerRuns += runs;
          next.strikerBalls += 1;
          next.bowlerRuns += runs;
          next.thisOver = (prev.thisOver ? prev.thisOver + " " : "") + type;
          // Odd runs = swap strike
          if (runs % 2 !== 0) {
            [next.striker, next.nonStriker] = [prev.nonStriker, prev.striker];
            [next.strikerRuns, next.nonStrikerRuns] = [prev.nonStrikerRuns, prev.strikerRuns];
            [next.strikerBalls, next.nonStrikerBalls] = [prev.nonStrikerBalls, prev.strikerBalls];
          }
          // Check if over is complete (6 legal deliveries)
          if (currentBalls + 1 >= 6) {
            if (bt === 1) next.team1Overs = addBallToOvers(prev.team1Overs, 1);
            else next.team2Overs = addBallToOvers(prev.team2Overs, 1);
            next.bowlerOvers = addBallToOvers(prev.bowlerOvers, 1);
            next.thisOver = "";
            // Swap strike at end of over
            [next.striker, next.nonStriker] = [next.nonStriker, next.striker];
            [next.strikerRuns, next.nonStrikerRuns] = [next.nonStrikerRuns, next.strikerRuns];
            [next.strikerBalls, next.nonStrikerBalls] = [next.nonStrikerBalls, next.strikerBalls];
          }
          break;
        }
        case "4": {
          if (bt === 1) next.team1Score += 4;
          else next.team2Score += 4;
          next.strikerRuns += 4;
          next.strikerBalls += 1;
          next.bowlerRuns += 4;
          next.thisOver = (prev.thisOver ? prev.thisOver + " " : "") + "4";
          if (currentBalls + 1 >= 6) {
            if (bt === 1) next.team1Overs = addBallToOvers(prev.team1Overs, 1);
            else next.team2Overs = addBallToOvers(prev.team2Overs, 1);
            next.bowlerOvers = addBallToOvers(prev.bowlerOvers, 1);
            next.thisOver = "";
            [next.striker, next.nonStriker] = [next.nonStriker, next.striker];
            [next.strikerRuns, next.nonStrikerRuns] = [next.nonStrikerRuns, next.strikerRuns];
            [next.strikerBalls, next.nonStrikerBalls] = [next.nonStrikerBalls, next.strikerBalls];
          }
          break;
        }
        case "6": {
          if (bt === 1) next.team1Score += 6;
          else next.team2Score += 6;
          next.strikerRuns += 6;
          next.strikerBalls += 1;
          next.bowlerRuns += 6;
          next.thisOver = (prev.thisOver ? prev.thisOver + " " : "") + "6";
          if (currentBalls + 1 >= 6) {
            if (bt === 1) next.team1Overs = addBallToOvers(prev.team1Overs, 1);
            else next.team2Overs = addBallToOvers(prev.team2Overs, 1);
            next.bowlerOvers = addBallToOvers(prev.bowlerOvers, 1);
            next.thisOver = "";
            [next.striker, next.nonStriker] = [next.nonStriker, next.striker];
            [next.strikerRuns, next.nonStrikerRuns] = [next.nonStrikerRuns, next.strikerRuns];
            [next.strikerBalls, next.nonStrikerBalls] = [next.nonStrikerBalls, next.strikerBalls];
          }
          break;
        }
        case "W": {
          if (bt === 1) next.team1Wickets += 1;
          else next.team2Wickets += 1;
          next.strikerBalls += 1;
          next.bowlerWickets += 1;
          next.thisOver = (prev.thisOver ? prev.thisOver + " " : "") + "W";
          if (currentBalls + 1 >= 6) {
            if (bt === 1) next.team1Overs = addBallToOvers(prev.team1Overs, 1);
            else next.team2Overs = addBallToOvers(prev.team2Overs, 1);
            next.bowlerOvers = addBallToOvers(prev.bowlerOvers, 1);
            next.thisOver = "";
            [next.striker, next.nonStriker] = [next.nonStriker, next.striker];
            [next.strikerRuns, next.nonStrikerRuns] = [next.nonStrikerRuns, next.strikerRuns];
            [next.strikerBalls, next.nonStrikerBalls] = [next.nonStrikerBalls, next.strikerBalls];
          }
          break;
        }
        case "Wd": {
          if (bt === 1) next.team1Score += 1;
          else next.team2Score += 1;
          next.bowlerRuns += 1;
          next.thisOver = (prev.thisOver ? prev.thisOver + " " : "") + "Wd";
          break;
        }
        case "Nb": {
          if (bt === 1) next.team1Score += 1;
          else next.team2Score += 1;
          next.bowlerRuns += 1;
          next.thisOver = (prev.thisOver ? prev.thisOver + " " : "") + "Nb";
          break;
        }
      }
      return next;
    });
    debouncedSave();
  }, [debouncedSave]);

  const handleUndoLastBall = useCallback(() => {
    setLiveScore((prev) => {
      const balls = prev.thisOver ? prev.thisOver.split(/\s+/).filter(Boolean) : [];
      if (balls.length === 0) return prev;
      const lastBall = balls[balls.length - 1];
      const next = { ...prev };

      switch (lastBall) {
        case "0":
        case "1":
        case "2":
        case "3": {
          const runs = parseInt(lastBall, 10);
          const bt = prev.battingTeam;
          if (bt === 1) next.team1Score -= runs;
          else next.team2Score -= runs;
          next.strikerRuns -= runs;
          next.strikerBalls -= 1;
          next.bowlerRuns -= runs;
          break;
        }
        case "4": {
          const bt = prev.battingTeam;
          if (bt === 1) next.team1Score -= 4;
          else next.team2Score -= 4;
          next.strikerRuns -= 4;
          next.strikerBalls -= 1;
          next.bowlerRuns -= 4;
          break;
        }
        case "6": {
          const bt = prev.battingTeam;
          if (bt === 1) next.team1Score -= 6;
          else next.team2Score -= 6;
          next.strikerRuns -= 6;
          next.strikerBalls -= 1;
          next.bowlerRuns -= 6;
          break;
        }
        case "W": {
          const bt = prev.battingTeam;
          if (bt === 1) next.team1Wickets -= 1;
          else next.team2Wickets -= 1;
          next.strikerBalls -= 1;
          next.bowlerWickets -= 1;
          break;
        }
        case "Wd": {
          const bt = prev.battingTeam;
          if (bt === 1) next.team1Score -= 1;
          else next.team2Score -= 1;
          next.bowlerRuns -= 1;
          break;
        }
        case "Nb": {
          const bt = prev.battingTeam;
          if (bt === 1) next.team1Score -= 1;
          else next.team2Score -= 1;
          next.bowlerRuns -= 1;
          break;
        }
      }

      // Remove last ball from thisOver
      const newBalls = balls.slice(0, -1);
      next.thisOver = newBalls.join(" ");

      return next;
    });
    debouncedSave();
  }, [debouncedSave]);

  const handleSwapStrike = useCallback(() => {
    setLiveScore((prev) => ({
      ...prev,
      striker: prev.nonStriker,
      strikerRuns: prev.nonStrikerRuns,
      strikerBalls: prev.nonStrikerBalls,
      nonStriker: prev.striker,
      nonStrikerRuns: prev.strikerRuns,
      nonStrikerBalls: prev.strikerBalls,
    }));
  }, []);

  const handleSwitchInnings = useCallback(() => {
    setLiveScore((prev) => ({
      ...prev,
      battingTeam: prev.battingTeam === 1 ? 2 : 1,
      // Reset bowler for new innings
      bowler: "",
      bowlerRuns: 0,
      bowlerWickets: 0,
      bowlerOvers: "0.0",
      thisOver: "",
      // Swap striker/non-striker to fresh batsmen
      striker: "",
      strikerRuns: 0,
      strikerBalls: 0,
      nonStriker: "",
      nonStrikerRuns: 0,
      nonStrikerBalls: 0,
    }));
    debouncedSave();
  }, [debouncedSave]);

  const handleSetLive = useCallback(async () => {
    if (!editingFixture) return;
    setIsSubmitting(true);
    try {
      await apiPut("/api/fixtures", {
        id: editingFixture.id,
        matchNumber: editingFixture.matchNumber,
        team1Id: getTeamIdByName(editingFixture.team1) || undefined,
        team2Id: getTeamIdByName(editingFixture.team2) || undefined,
        date: editingFixture.date,
        time: editingFixture.time,
        venue: editingFixture.venue,
        status: "LIVE",
      });
      setEditingFixture({ ...editingFixture, status: "live" });
      toast.success(`Match #${editingFixture.matchNumber} set to LIVE`);
      await loadFixtures();
    } catch {
      toast.error("Failed to set match as live");
    } finally {
      setIsSubmitting(false);
    }
  }, [editingFixture, loadFixtures]);

  const handleEndMatch = useCallback(async () => {
    if (!editingFixture) return;
    setIsSubmitting(true);
    try {
      await saveLiveScore();
      await apiPut("/api/fixtures", {
        id: editingFixture.id,
        matchNumber: editingFixture.matchNumber,
        team1Id: getTeamIdByName(editingFixture.team1) || undefined,
        team2Id: getTeamIdByName(editingFixture.team2) || undefined,
        date: editingFixture.date,
        time: editingFixture.time,
        venue: editingFixture.venue,
        status: "COMPLETED",
      });
      setEditingFixture({ ...editingFixture, status: "completed" });
      toast.success(`Match #${editingFixture.matchNumber} completed`);
      await loadFixtures();
    } catch {
      toast.error("Failed to end match");
    } finally {
      setIsSubmitting(false);
    }
  }, [editingFixture, saveLiveScore, loadFixtures]);

  const handleResetScore = useCallback(() => {
    setLiveScore(createDefaultLiveScore());
    setManualOverride({
      team1Score: "",
      team1Wickets: "",
      team1Overs: "",
      team2Score: "",
      team2Wickets: "",
      team2Overs: "",
    });
    toast.success("Score reset");
  }, []);

  const handleManualOverride = useCallback(() => {
    setLiveScore((prev) => ({
      ...prev,
      team1Score: parseInt(manualOverride.team1Score) || 0,
      team1Wickets: parseInt(manualOverride.team1Wickets) || 0,
      team1Overs: manualOverride.team1Overs || "0.0",
      team2Score: parseInt(manualOverride.team2Score) || 0,
      team2Wickets: parseInt(manualOverride.team2Wickets) || 0,
      team2Overs: manualOverride.team2Overs || "0.0",
    }));
    toast.success("Manual override applied");
    debouncedSave();
  }, [manualOverride, debouncedSave]);

  // ============ CRUD Handlers ============

  const openAddDialog = () => {
    setEditingFixture(null);
    setFormData({
      team1Id: "",
      team2Id: "",
      date: "",
      time: "",
      venue: "",
      status: "upcoming",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (fixture: FixtureItem) => {
    setEditingFixture(fixture);
    setFormData({
      team1Id: getTeamIdByName(fixture.team1),
      team2Id: getTeamIdByName(fixture.team2),
      date: fixture.date,
      time: fixture.time,
      venue: fixture.venue,
      status: fixture.status,
    });
    setDialogOpen(true);
  };

  const openScoreDialog = (fixture: FixtureItem) => {
    setEditingFixture(fixture);
    // Initialize live score state from fixture data
    const ls = createDefaultLiveScore();
    ls.battingTeam = fixture.battingTeam ?? 1;
    ls.team1Score = fixture.team1Score ?? 0;
    ls.team1Wickets = fixture.team1Wickets ?? 0;
    ls.team1Overs = fixture.team1Overs ?? "0.0";
    ls.team2Score = fixture.team2Score ?? 0;
    ls.team2Wickets = fixture.team2Wickets ?? 0;
    ls.team2Overs = fixture.team2Overs ?? "0.0";
    ls.striker = fixture.striker ?? "";
    ls.strikerRuns = fixture.strikerRuns ?? 0;
    ls.strikerBalls = fixture.strikerBalls ?? 0;
    ls.nonStriker = fixture.nonStriker ?? "";
    ls.nonStrikerRuns = fixture.nonStrikerRuns ?? 0;
    ls.nonStrikerBalls = fixture.nonStrikerBalls ?? 0;
    ls.bowler = fixture.bowler ?? "";
    ls.bowlerRuns = fixture.bowlerRuns ?? 0;
    ls.bowlerWickets = fixture.bowlerWickets ?? 0;
    ls.bowlerOvers = fixture.bowlerOvers ?? "0.0";
    ls.thisOver = fixture.thisOver ?? "";
    ls.result = fixture.result ?? "";
    setLiveScore(ls);
    setManualOverride({
      team1Score: String(fixture.team1Score ?? ""),
      team1Wickets: String(fixture.team1Wickets ?? ""),
      team1Overs: fixture.team1Overs ?? "",
      team2Score: String(fixture.team2Score ?? ""),
      team2Wickets: String(fixture.team2Wickets ?? ""),
      team2Overs: fixture.team2Overs ?? "",
    });
    setScoreDialogOpen(true);
  };

  const handleSaveFixture = async () => {
    if (!formData.team1Id || !formData.team2Id) {
      toast.error("Please select both teams");
      return;
    }
    if (formData.team1Id === formData.team2Id) {
      toast.error("Please select two different teams");
      return;
    }
    if (!formData.date || !formData.venue) {
      toast.error("Date and venue are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        matchNumber: editingFixture?.matchNumber,
        team1Id: formData.team1Id,
        team2Id: formData.team2Id,
        date: formData.date,
        time: formData.time || "4:00 PM",
        venue: formData.venue,
        status: formData.status.toUpperCase(),
      };

      if (editingFixture) {
        await apiPut("/api/fixtures", { id: editingFixture.id, ...payload });
        toast.success(`Match #${editingFixture.matchNumber} updated successfully`);
      } else {
        await apiPost("/api/fixtures", payload);
        toast.success("New match scheduled successfully");
      }

      setDialogOpen(false);
      await loadFixtures();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save fixture");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (fixture: FixtureItem) => {
    setIsSubmitting(true);
    try {
      await apiDelete("/api/fixtures", fixture.id);
      toast.success(`Match #${fixture.matchNumber} deleted`);
      await loadFixtures();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete fixture");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============ Loading State ============

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                    <div className="h-7 w-10 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-muted animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter skeleton */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="h-9 w-full sm:w-80 bg-muted rounded animate-pulse" />
              <div className="flex gap-3">
                <div className="h-10 flex-1 sm:max-w-sm bg-muted rounded animate-pulse" />
                <div className="h-10 w-36 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table skeleton */}
        <Card className="border-border/50 hidden lg:block">
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  <div className="flex-1 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-muted animate-pulse" />
                    <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-6 bg-muted rounded animate-pulse" />
                  <div className="flex-1 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-muted animate-pulse" />
                    <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-36 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============ Render ============

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Matches"
          value={fixtures.length}
          icon={Calendar}
          description="Scheduled fixtures"
          iconColor="text-green-600 dark:text-green-400"
          iconBg="bg-green-100 dark:bg-green-500/15"
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

      {/* Empty State */}
      {!isLoading && filteredFixtures.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No fixtures found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter."
                : "Get started by scheduling the first match."}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Match
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Desktop Table */}
      {filteredFixtures.length > 0 && (
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
                            Live Score
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 dark:text-red-400"
                            onClick={() => handleDelete(fixture)}
                            disabled={isSubmitting}
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

      {/* Mobile/Tablet Cards (md-lg) */}
      {filteredFixtures.length > 0 && (
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
                        <Trophy className="h-3 h-3" />
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openScoreDialog(fixture)}
                  >
                    <ClipboardEdit className="h-3.5 w-3.5 mr-1" />
                    Score
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    onClick={() => handleDelete(fixture)}
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Delete
                  </Button>
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

      {/* Add/Edit Fixture Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) setDialogOpen(false); }}>
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
                  value={formData.team1Id}
                  onValueChange={(val) =>
                    setFormData({ ...formData, team1Id: val })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        <span className="mr-1.5">{team.logo}</span>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fixture-team2">Team 2</Label>
                <Select
                  value={formData.team2Id}
                  onValueChange={(val) =>
                    setFormData({ ...formData, team2Id: val })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        <span className="mr-1.5">{team.logo}</span>
                        {team.name}
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
                  setFormData({ ...formData, status: val })
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
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSaveFixture} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingFixture ? "Save Changes" : "Schedule Match"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============ Live Score Control Dialog ============ */}
      <Dialog open={scoreDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setScoreDialogOpen(false);
          // Force save on close
          if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = null;
          }
          saveLiveScore();
        }
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {editingFixture && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ClipboardEdit className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Live Score Control
                </DialogTitle>
                <DialogDescription>
                  Match #{editingFixture.matchNumber}: {editingFixture.team1Short} vs {editingFixture.team2Short}
                </DialogDescription>
              </DialogHeader>

              {/* Saving indicator */}
              {isSaving && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Auto-saving...
                </div>
              )}

              {/* A. Scoreboard Header */}
              <div className="grid grid-cols-2 gap-3">
                {/* Team 1 */}
                <div
                  className={`rounded-xl p-3 border-2 transition-all ${
                    liveScore.battingTeam === 1
                      ? "border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.25)] bg-green-500/5"
                      : "border-border/50 bg-muted/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ backgroundColor: editingFixture.team1Color }}
                    >
                      {editingFixture.team1Short}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{editingFixture.team1}</p>
                      {liveScore.battingTeam === 1 && (
                        <Badge className="text-[10px] bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30 h-4 px-1.5">BATTING</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-extrabold" style={{ color: editingFixture.team1Color }}>
                      {liveScore.team1Score}/{liveScore.team1Wickets}
                    </p>
                    <p className="text-xs text-muted-foreground">({liveScore.team1Overs} ov)</p>
                    {liveScore.battingTeam === 1 && (
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">
                        CRR: {battingRunRate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Team 2 */}
                <div
                  className={`rounded-xl p-3 border-2 transition-all ${
                    liveScore.battingTeam === 2
                      ? "border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.25)] bg-green-500/5"
                      : "border-border/50 bg-muted/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ backgroundColor: editingFixture.team2Color }}
                    >
                      {editingFixture.team2Short}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{editingFixture.team2}</p>
                      {liveScore.battingTeam === 2 && (
                        <Badge className="text-[10px] bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30 h-4 px-1.5">BATTING</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-extrabold" style={{ color: editingFixture.team2Color }}>
                      {liveScore.team2Score}/{liveScore.team2Wickets}
                    </p>
                    <p className="text-xs text-muted-foreground">({liveScore.team2Overs} ov)</p>
                    {liveScore.battingTeam === 2 && (
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">
                        CRR: {battingRunRate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* B. Match Controls */}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleSetLive}
                  disabled={editingFixture.status === "live" || isSubmitting}
                >
                  <Radio className="h-3.5 w-3.5 mr-1" />
                  Set LIVE
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSwitchInnings}
                >
                  <ArrowLeftRight className="h-3.5 w-3.5 mr-1" />
                  Switch Innings
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10"
                  onClick={handleEndMatch}
                  disabled={isSubmitting}
                >
                  <CircleCheck className="h-3.5 w-3.5 mr-1" />
                  End Match
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-400 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                  onClick={handleResetScore}
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  Reset
                </Button>
              </div>

              <Separator />

              {/* C. Current Batsmen Section */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Current Batsmen</p>
                <div className="grid grid-cols-2 gap-3">
                  {/* Striker */}
                  <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3">
                    <div className="flex items-center gap-1 mb-2">
                      <Zap className="h-3.5 w-3.5 text-yellow-500" />
                      <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Striker</span>
                    </div>
                    <Select
                      value={liveScore.striker}
                      onValueChange={(val) => setLiveScore((prev) => ({ ...prev, striker: val }))}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select batsman" />
                      </SelectTrigger>
                      <SelectContent>
                        {battingTeamPlayers.map((p) => (
                          <SelectItem key={p.id} value={p.name}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-3 mt-2">
                      <div className="text-center flex-1">
                        <p className="text-lg font-bold">{liveScore.strikerRuns}</p>
                        <p className="text-[10px] text-muted-foreground">Runs</p>
                      </div>
                      <div className="text-center flex-1">
                        <p className="text-lg font-bold">{liveScore.strikerBalls}</p>
                        <p className="text-[10px] text-muted-foreground">Balls</p>
                      </div>
                    </div>
                  </div>

                  {/* Non-Striker */}
                  <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                    <p className="text-xs font-bold text-muted-foreground mb-2">Non-Striker</p>
                    <Select
                      value={liveScore.nonStriker}
                      onValueChange={(val) => setLiveScore((prev) => ({ ...prev, nonStriker: val }))}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select batsman" />
                      </SelectTrigger>
                      <SelectContent>
                        {battingTeamPlayers.map((p) => (
                          <SelectItem key={p.id} value={p.name}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-3 mt-2">
                      <div className="text-center flex-1">
                        <p className="text-lg font-bold">{liveScore.nonStrikerRuns}</p>
                        <p className="text-[10px] text-muted-foreground">Runs</p>
                      </div>
                      <div className="text-center flex-1">
                        <p className="text-lg font-bold">{liveScore.nonStrikerBalls}</p>
                        <p className="text-[10px] text-muted-foreground">Balls</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Swap Strike */}
                <div className="flex justify-center mt-2">
                  <Button size="sm" variant="ghost" onClick={handleSwapStrike} className="text-xs">
                    <ArrowLeftRight className="h-3.5 w-3.5 mr-1" />
                    Swap Strike
                  </Button>
                </div>
              </div>

              <Separator />

              {/* D. Current Bowler Section */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Current Bowler</p>
                <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                  <Select
                    value={liveScore.bowler}
                    onValueChange={(val) => setLiveScore((prev) => ({ ...prev, bowler: val }))}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select bowler" />
                    </SelectTrigger>
                    <SelectContent>
                      {bowlingTeamPlayers.map((p) => (
                        <SelectItem key={p.id} value={p.name}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <div className="text-center">
                      <p className="text-lg font-bold">{liveScore.bowlerWickets}/{liveScore.bowlerRuns}</p>
                      <p className="text-[10px] text-muted-foreground">Wickets/Runs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{liveScore.bowlerOvers}</p>
                      <p className="text-[10px] text-muted-foreground">Overs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">
                        {liveScore.bowlerRuns > 0
                          ? (liveScore.bowlerRuns / (parseOvers(liveScore.bowlerOvers).full + parseOvers(liveScore.bowlerOvers).balls / 6 || 1)).toFixed(1)
                          : "0.0"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Econ</p>
                    </div>
                  </div>
                  {/* This Over ball display */}
                  {thisOverBalls.length > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-medium shrink-0">This over:</span>
                      <div className="flex items-center gap-1.5">
                        {thisOverBalls.map((ball, i) => (
                          <span
                            key={i}
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getBallBadgeClass(ball)}`}
                          >
                            {ball}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* E. Quick Action Buttons Grid */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quick Score</p>
                <div className="grid grid-cols-4 gap-2">
                  {/* Row 1: 0, 1, 2, 3 */}
                  <Button
                    variant="outline"
                    className="h-12 text-lg font-bold bg-muted/30 hover:bg-muted/50"
                    onClick={() => handleQuickAction("0")}
                  >
                    0
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 text-lg font-bold bg-muted/30 hover:bg-muted/50"
                    onClick={() => handleQuickAction("1")}
                  >
                    1
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 text-lg font-bold bg-muted/30 hover:bg-muted/50"
                    onClick={() => handleQuickAction("2")}
                  >
                    2
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 text-lg font-bold bg-muted/30 hover:bg-muted/50"
                    onClick={() => handleQuickAction("3")}
                  >
                    3
                  </Button>
                  {/* Row 2: 4, 6, W, Wd */}
                  <Button
                    className="h-12 text-sm font-bold bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleQuickAction("4")}
                  >
                    FOUR!
                  </Button>
                  <Button
                    className="h-12 text-sm font-bold bg-green-800 hover:bg-green-900 text-white"
                    onClick={() => handleQuickAction("6")}
                  >
                    SIX!
                  </Button>
                  <Button
                    className="h-12 text-sm font-bold bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleQuickAction("W")}
                  >
                    WICKET!
                  </Button>
                  <Button
                    className="h-12 text-sm font-bold bg-yellow-500 hover:bg-yellow-600 text-black"
                    onClick={() => handleQuickAction("Wd")}
                  >
                    WIDE
                  </Button>
                  {/* Row 3: Nb, Undo */}
                  <Button
                    className="h-12 text-sm font-bold bg-yellow-500 hover:bg-yellow-600 text-black"
                    onClick={() => handleQuickAction("Nb")}
                  >
                    NO BALL
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 text-sm font-bold bg-muted hover:bg-muted/80 col-span-3"
                    onClick={handleUndoLastBall}
                    disabled={thisOverBalls.length === 0}
                  >
                    <Undo2 className="h-4 w-4 mr-1" />
                    UNDO Last Ball
                  </Button>
                </div>
              </div>

              <Separator />

              {/* F. Manual Override */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Manual Override</p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">
                        {editingFixture.team1Short} Score
                      </Label>
                      <Input
                        className="h-8 text-xs mt-1"
                        value={manualOverride.team1Score}
                        onChange={(e) => setManualOverride((prev) => ({ ...prev, team1Score: e.target.value }))}
                        placeholder="Runs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">
                        {editingFixture.team1Short} Wickets
                      </Label>
                      <Input
                        className="h-8 text-xs mt-1"
                        value={manualOverride.team1Wickets}
                        onChange={(e) => setManualOverride((prev) => ({ ...prev, team1Wickets: e.target.value }))}
                        placeholder="Wickets"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">
                        {editingFixture.team1Short} Overs
                      </Label>
                      <Input
                        className="h-8 text-xs mt-1"
                        value={manualOverride.team1Overs}
                        onChange={(e) => setManualOverride((prev) => ({ ...prev, team1Overs: e.target.value }))}
                        placeholder="e.g. 5.3"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">
                        {editingFixture.team2Short} Score
                      </Label>
                      <Input
                        className="h-8 text-xs mt-1"
                        value={manualOverride.team2Score}
                        onChange={(e) => setManualOverride((prev) => ({ ...prev, team2Score: e.target.value }))}
                        placeholder="Runs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">
                        {editingFixture.team2Short} Wickets
                      </Label>
                      <Input
                        className="h-8 text-xs mt-1"
                        value={manualOverride.team2Wickets}
                        onChange={(e) => setManualOverride((prev) => ({ ...prev, team2Wickets: e.target.value }))}
                        placeholder="Wickets"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">
                        {editingFixture.team2Short} Overs
                      </Label>
                      <Input
                        className="h-8 text-xs mt-1"
                        value={manualOverride.team2Overs}
                        onChange={(e) => setManualOverride((prev) => ({ ...prev, team2Overs: e.target.value }))}
                        placeholder="e.g. 5.3"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Result</Label>
                    <Input
                      className="h-8 text-xs mt-1"
                      value={liveScore.result}
                      onChange={(e) => setLiveScore((prev) => ({ ...prev, result: e.target.value }))}
                      placeholder="e.g. Dadar Dynamos won by 13 runs"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleManualOverride}
                  >
                    <Save className="h-3.5 w-3.5 mr-1" />
                    Apply Manual Override
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
