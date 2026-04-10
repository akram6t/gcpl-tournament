"use client";

import { useEffect, useState, useMemo } from "react";
import { StatsCard } from "@/components/admin/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  PersonStanding,
  CalendarDays,
  Trophy,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Activity,
  Zap,
  Target,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { apiGet } from "@/lib/api";

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
  matches: number;
  runs: number;
  wickets: number;
  avg: string | number;
  sr: string | number;
  bestBatting: string;
  bestBowling: string;
  isCaptain: boolean;
}

interface ApiFixture {
  id: string;
  matchNumber: number;
  team1: string;
  team1Short: string;
  team1Color: string;
  team2: string;
  team2Short: string;
  team2Color: string;
  date: string;
  time: string;
  venue: string;
  status: string;
  score?: string;
  result?: string;
}

interface ApiGalleryImage {
  id: string;
  title: string;
  category: string;
  imageUrl: string | null;
  createdAt: string;
}

interface Settings {
  [key: string]: string;
}

// ============ Loading Skeletons ============

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-11 w-11 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-40 mb-1" />
            <Skeleton className="h-3 w-32" />
          </CardHeader>
          <CardContent className="pt-0">
            <Skeleton className="h-[280px] w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-28 mb-1" />
            <Skeleton className="h-3 w-40" />
          </CardHeader>
          <CardContent className="pt-0">
            <Skeleton className="h-[180px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Skeleton className="w-2 h-2 rounded-full mt-1.5 shrink-0" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-2 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers + Quick Actions Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-28 mb-1" />
            <Skeleton className="h-3 w-48" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-44 rounded-xl" />
              <Skeleton className="h-44 rounded-xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-28 mb-1" />
            <Skeleton className="h-3 w-36" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Results Skeleton */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-28 mb-1" />
          <Skeleton className="h-3 w-40" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ Helper: format relative time ============

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// ============ Main Component ============

export default function AdminDashboardPage() {
  const [teams, setTeams] = useState<ApiTeam[]>([]);
  const [players, setPlayers] = useState<ApiPlayer[]>([]);
  const [fixtures, setFixtures] = useState<ApiFixture[]>([]);
  const [gallery, setGallery] = useState<ApiGalleryImage[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data on mount
  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      setError(null);
      try {
        const [teamsData, playersData, fixturesData, galleryData, settingsData] =
          await Promise.allSettled([
            apiGet<ApiTeam[]>("/api/teams"),
            apiGet<ApiPlayer[]>("/api/players"),
            apiGet<ApiFixture[]>("/api/fixtures"),
            apiGet<ApiGalleryImage[]>("/api/gallery"),
            apiGet<Settings>("/api/settings"),
          ]);

        if (teamsData.status === "fulfilled") setTeams(teamsData.value);
        if (playersData.status === "fulfilled") setPlayers(playersData.value);
        if (fixturesData.status === "fulfilled") setFixtures(fixturesData.value);
        if (galleryData.status === "fulfilled") setGallery(galleryData.value);
        if (settingsData.status === "fulfilled") setSettings(settingsData.value);

        // Only error if all failed
        const allFailed = [teamsData, playersData, fixturesData, galleryData, settingsData].every(
          (r) => r.status === "rejected"
        );
        if (allFailed) {
          setError("Failed to load dashboard data. Please try again.");
        }
      } catch {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  // ============ Computed Data ============

  const stats = useMemo(() => {
    const completedCount = fixtures.filter((f) => f.status === "COMPLETED").length;
    const liveCount = fixtures.filter((f) => f.status === "LIVE").length;
    const upcomingCount = fixtures.filter((f) => f.status === "UPCOMING").length;
    const totalPlayers = players.length;
    const totalTeams = teams.length;
    const prizePool = settings.prizePool || "—";

    return {
      totalTeams,
      totalPlayers,
      completedCount,
      liveCount,
      upcomingCount,
      totalFixtures: fixtures.length,
      prizePool,
    };
  }, [teams, players, fixtures, settings]);

  // Bar chart data: teams sorted by points
  const barChartData = useMemo(() => {
    return teams
      .slice()
      .sort((a, b) => b.points - a.points)
      .map((t) => ({
        name: t.shortName,
        points: t.points,
        wins: t.wins,
        losses: t.losses,
        color: t.color,
      }));
  }, [teams]);

  // Pie chart data: fixture statuses
  const pieData = useMemo(() => {
    return [
      { name: "Completed", value: stats.completedCount, color: "#22c55e" },
      { name: "Live", value: stats.liveCount, color: "#ef4444" },
      { name: "Upcoming", value: stats.upcomingCount, color: "#3b82f6" },
    ];
  }, [stats.completedCount, stats.liveCount, stats.upcomingCount]);

  // Live fixture (if any)
  const liveFixture = useMemo(() => {
    return fixtures.find((f) => f.status === "LIVE") || null;
  }, [fixtures]);

  // Recent completed fixtures (last 5)
  const recentCompleted = useMemo(() => {
    return fixtures
      .filter((f) => f.status === "COMPLETED")
      .sort((a, b) => b.matchNumber - a.matchNumber)
      .slice(0, 5);
  }, [fixtures]);

  // Top performers
  const topScorer = useMemo(() => {
    if (players.length === 0) return null;
    return [...players].sort((a, b) => b.runs - a.runs)[0];
  }, [players]);

  const topWicketTaker = useMemo(() => {
    if (players.length === 0) return null;
    return [...players].sort((a, b) => b.wickets - a.wickets)[0];
  }, [players]);

  // Recent activity derived from real data
  const recentActivity = useMemo(() => {
    const activities: { text: string; time: string; type: string }[] = [];

    // Live match
    if (liveFixture) {
      activities.push({
        text: `Match ${liveFixture.matchNumber} started - ${liveFixture.team1Short} vs ${liveFixture.team2Short}`,
        time: "Live now",
        type: "live",
      });
    }

    // Recent completed fixtures
    const recentCompletedForActivity = fixtures
      .filter((f) => f.status === "COMPLETED")
      .sort((a, b) => b.matchNumber - a.matchNumber)
      .slice(0, 3);

    recentCompletedForActivity.forEach((f) => {
      if (f.result) {
        activities.push({
          text: f.result,
          time: `Match ${f.matchNumber}`,
          type: "result",
        });
      }
    });

    // Recent gallery uploads
    const recentGallery = gallery.slice(0, 2);
    recentGallery.forEach((g) => {
      activities.push({
        text: `Gallery: ${g.title}`,
        time: formatRelativeTime(g.createdAt),
        type: "media",
      });
    });

    // Top performer highlight
    if (topScorer && topScorer.runs > 0) {
      activities.push({
        text: `${topScorer.name} leading runs with ${topScorer.runs} runs`,
        time: `${topScorer.teamShort}`,
        type: "highlight",
      });
    }

    return activities.slice(0, 8);
  }, [fixtures, gallery, liveFixture, topScorer]);

  // Parse live match score into team scores
  const liveMatchScores = useMemo(() => {
    if (!liveFixture || !liveFixture.score) return null;
    const scoreStr = liveFixture.score;
    // Expected format: "Team1Score (overs) vs Team2Score (overs)" or "Team1Score vs Team2Score"
    const parts = scoreStr.split(" vs ");
    if (parts.length < 2) return null;

    const team1Score = parts[0].trim();
    const team2Score = parts[1].trim();

    return { team1Score, team2Score };
  }, [liveFixture]);

  // ============ Render ============

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-500/20">
        <CardContent className="p-8 text-center">
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="cursor-pointer"
          >
            <Loader2 className="w-3.5 h-3.5 mr-1.5" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Teams"
          value={stats.totalTeams}
          icon={Users}
          description="Active teams"
          trend={{ value: 0, positive: true }}
          iconColor="text-green-600 dark:text-green-400"
          iconBg="bg-green-100 dark:bg-green-500/15"
        />
        <StatsCard
          title="Total Players"
          value={stats.totalPlayers}
          icon={PersonStanding}
          description="Registered"
          trend={{ value: 12, positive: true }}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-500/15"
        />
        <StatsCard
          title="Matches Played"
          value={`${stats.completedCount}/${stats.totalFixtures}`}
          icon={CalendarDays}
          description="Tournament progress"
          trend={{ value: 8, positive: true }}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-100 dark:bg-purple-500/15"
        />
        <StatsCard
          title="Prize Pool"
          value={stats.prizePool}
          icon={Trophy}
          description="Sponsored"
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-100 dark:bg-amber-500/15"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart - Team Points */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Team Points Overview</CardTitle>
                <CardDescription className="text-xs">Points earned by each team</CardDescription>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                {settings.season || "Season 4"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {barChartData.length > 0 ? (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="wins" name="Wins" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="points" name="Points" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No team data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart - Match Status */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Match Status</CardTitle>
            <CardDescription className="text-xs">Tournament match breakdown</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {stats.totalFixtures > 0 ? (
              <>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-4 mt-2">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[11px] text-muted-foreground">
                        {item.name} ({item.value})
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[220px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No match data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live Match or No Live Match */}
        {liveFixture ? (
          <Card className="border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse-dot" />
                  <CardTitle className="text-sm font-semibold">Live Match</CardTitle>
                </div>
                <Badge className="text-[10px] bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 border-red-200 dark:border-red-500/30">
                  Match {liveFixture.matchNumber}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div className="text-center flex-1">
                  <div className="text-3xl mb-1">🏏</div>
                  <p className="text-sm font-bold">{liveFixture.team1}</p>
                  <p className="text-2xl font-extrabold text-green-600 dark:text-green-400 mt-1">
                    {liveMatchScores ? liveMatchScores.team1Score : liveFixture.score || "—"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {liveFixture.date} • {liveFixture.time}
                  </p>
                </div>
                <div className="text-center px-3">
                  <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                    VS
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-2">{liveFixture.venue}</p>
                </div>
                <div className="text-center flex-1">
                  <div className="text-3xl mb-1">⚔️</div>
                  <p className="text-sm font-bold">{liveFixture.team2}</p>
                  <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                    {liveMatchScores ? liveMatchScores.team2Score : liveFixture.score || "—"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {liveFixture.result || "In Progress"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-2 border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">Live Match</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                  <CalendarDays className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No live match right now</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.upcomingCount > 0
                    ? `${stats.upcomingCount} upcoming match${stats.upcomingCount > 1 ? "es" : ""} scheduled`
                    : "Check back later for updates"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {recentActivity.length > 0 ? (
              <div className="space-y-3 max-h-[250px] overflow-y-auto">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        item.type === "live"
                          ? "bg-red-500 animate-pulse-dot"
                          : item.type === "highlight"
                            ? "bg-amber-500"
                            : item.type === "result"
                              ? "bg-green-500"
                              : item.type === "registration"
                                ? "bg-blue-500"
                                : "bg-purple-500"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-foreground leading-snug">{item.text}</p>
                      <p className="text-[10px] text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-6">
                <Activity className="w-6 h-6 text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Performers + Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Performers */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Top Performers</CardTitle>
            <CardDescription className="text-xs">Leading run-scorer and wicket-taker</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {topScorer && topWicketTaker ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-500/15 p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/15 flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <Avatar className="w-12 h-12 mx-auto mb-2 border-2 border-orange-300 dark:border-orange-500/40">
                    <AvatarFallback
                      className="text-xs font-bold text-white"
                      style={{ backgroundColor: topScorer.teamColor }}
                    >
                      {topScorer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs font-bold">{topScorer.name}</p>
                  <p className="text-xl font-extrabold text-orange-600 dark:text-orange-400">
                    {topScorer.runs}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Orange Cap</p>
                </div>
                <div className="rounded-xl bg-purple-50 dark:bg-purple-500/5 border border-purple-200 dark:border-purple-500/15 p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/15 flex items-center justify-center mx-auto mb-2">
                    <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <Avatar className="w-12 h-12 mx-auto mb-2 border-2 border-purple-300 dark:border-purple-500/40">
                    <AvatarFallback
                      className="text-xs font-bold text-white"
                      style={{ backgroundColor: topWicketTaker.teamColor }}
                    >
                      {topWicketTaker.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs font-bold">{topWicketTaker.name}</p>
                  <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                    {topWicketTaker.wickets}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Purple Cap</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8">
                <p className="text-sm text-muted-foreground">No player data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
            <CardDescription className="text-xs">Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  label: "Add New Team",
                  icon: Users,
                  color: "text-green-600 dark:text-green-400",
                  bg: "bg-green-100 dark:bg-green-500/15",
                  href: "/admin/teams",
                },
                {
                  label: "Add Player",
                  icon: PersonStanding,
                  color: "text-blue-600 dark:text-blue-400",
                  bg: "bg-blue-100 dark:bg-blue-500/15",
                  href: "/admin/players",
                },
                {
                  label: "Schedule Match",
                  icon: CalendarDays,
                  color: "text-purple-600 dark:text-purple-400",
                  bg: "bg-purple-100 dark:bg-purple-500/15",
                  href: "/admin/fixtures",
                },
                {
                  label: "Update Scores",
                  icon: Trophy,
                  color: "text-amber-600 dark:text-amber-400",
                  bg: "bg-amber-100 dark:bg-amber-500/15",
                  href: "/admin/fixtures",
                },
                {
                  label: "Upload Photos",
                  icon: Zap,
                  color: "text-pink-600 dark:text-pink-400",
                  bg: "bg-pink-100 dark:bg-pink-500/15",
                  href: "/admin/gallery",
                },
                {
                  label: "Tournament Settings",
                  icon: Activity,
                  color: "text-gray-600 dark:text-gray-400",
                  bg: "bg-gray-100 dark:bg-gray-500/15",
                  href: "/admin/settings",
                },
              ].map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-auto py-3 px-3 flex flex-col items-center gap-2 hover:bg-muted border-border/50 cursor-pointer"
                  asChild
                >
                  <a href={action.href}>
                    <div
                      className={`w-9 h-9 rounded-lg ${action.bg} flex items-center justify-center`}
                    >
                      <action.icon className={`w-4 h-4 ${action.color}`} />
                    </div>
                    <span className="text-[11px] font-medium text-foreground">{action.label}</span>
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Results Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Recent Results</CardTitle>
              <CardDescription className="text-xs">Latest completed matches</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-primary gap-1 cursor-pointer"
              asChild
            >
              <a href="/admin/fixtures">
                View All <ArrowRight className="w-3 h-3" />
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {recentCompleted.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left text-[11px] font-medium text-muted-foreground pb-2 pr-4">
                      Match
                    </th>
                    <th className="text-left text-[11px] font-medium text-muted-foreground pb-2 pr-4">
                      Teams
                    </th>
                    <th className="text-left text-[11px] font-medium text-muted-foreground pb-2 pr-4">
                      Result
                    </th>
                    <th className="text-left text-[11px] font-medium text-muted-foreground pb-2">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentCompleted.map((match) => (
                    <tr key={match.id} className="border-b border-border/30 last:border-0">
                      <td className="py-2.5 pr-4">
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          M{match.matchNumber}
                        </Badge>
                      </td>
                      <td className="py-2.5 pr-4">
                        <span className="text-xs font-semibold">{match.team1Short}</span>
                        <span className="text-xs text-muted-foreground mx-1">vs</span>
                        <span className="text-xs font-semibold">{match.team2Short}</span>
                      </td>
                      <td className="py-2.5 pr-4">
                        <p className="text-xs font-medium text-green-600 dark:text-green-400">
                          {match.result || "Completed"}
                        </p>
                      </td>
                      <td className="py-2.5">
                        <p className="text-xs text-muted-foreground">{match.score || "—"}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8">
              <Trophy className="w-6 h-6 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No completed matches yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
