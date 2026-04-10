"use client";

import { StatsCard } from "@/components/admin/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { teams, fixtures, topPlayers, recentResults, liveMatchData, tournamentInfo } from "@/lib/cricket-data";

const barChartData = teams
  .slice()
  .sort((a, b) => b.points - a.points)
  .map((t) => ({
    name: t.shortName,
    points: t.points,
    wins: t.wins,
    losses: t.losses,
    color: t.color,
  }));

const pieData = [
  { name: "Completed", value: fixtures.filter((f) => f.status === "completed").length, color: "#22c55e" },
  { name: "Live", value: fixtures.filter((f) => f.status === "live").length, color: "#ef4444" },
  { name: "Upcoming", value: fixtures.filter((f) => f.status === "upcoming").length, color: "#3b82f6" },
];

const recentActivity = [
  { text: "Match 18 started - AA vs WW", time: "2 min ago", type: "live" },
  { text: "Rahul Sharma scored 68* vs TT", time: "2 hours ago", type: "highlight" },
  { text: "DD won Match 17 by 46 runs", time: "3 days ago", type: "result" },
  { text: "New player registered: Amit S.", time: "4 days ago", type: "registration" },
  { text: "Gallery updated with 5 new photos", time: "5 days ago", type: "media" },
  { text: "BB won Match 15 by 49 runs", time: "6 days ago", type: "result" },
];

export default function AdminDashboardPage() {
  const topScorer = [...topPlayers].sort((a, b) => b.runs - a.runs)[0];
  const topWicketTaker = [...topPlayers].sort((a, b) => b.wickets - a.wickets)[0];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Teams"
          value={tournamentInfo.totalTeams}
          icon={Users}
          description="Active teams"
          trend={{ value: 0, positive: true }}
          iconColor="text-green-600 dark:text-green-400"
          iconBg="bg-green-100 dark:bg-green-500/15"
        />
        <StatsCard
          title="Total Players"
          value={tournamentInfo.totalPlayers}
          icon={PersonStanding}
          description="Registered"
          trend={{ value: 12, positive: true }}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-500/15"
        />
        <StatsCard
          title="Matches Played"
          value={`${fixtures.filter((f) => f.status === "completed").length}/${fixtures.length}`}
          icon={CalendarDays}
          description="Tournament progress"
          trend={{ value: 8, positive: true }}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-100 dark:bg-purple-500/15"
        />
        <StatsCard
          title="Prize Pool"
          value={tournamentInfo.prizePool}
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
              <Badge variant="secondary" className="text-[10px]">Season 4</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
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
          </CardContent>
        </Card>

        {/* Pie Chart - Match Status */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Match Status</CardTitle>
            <CardDescription className="text-xs">Tournament match breakdown</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
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
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] text-muted-foreground">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live Match */}
        <Card className="border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse-dot" />
                <CardTitle className="text-sm font-semibold">Live Match</CardTitle>
              </div>
              <Badge className="text-[10px] bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 border-red-200 dark:border-red-500/30">
                Match {liveMatchData.matchNumber}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div className="text-center flex-1">
                <div className="text-3xl mb-1">⚡</div>
                <p className="text-sm font-bold">{liveMatchData.team1.name}</p>
                <p className="text-2xl font-extrabold text-green-600 dark:text-green-400 mt-1">{liveMatchData.team1.score}</p>
                <p className="text-[11px] text-muted-foreground">{liveMatchData.team1.overs} ov</p>
              </div>
              <div className="text-center px-3">
                <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1.5 rounded-full">VS</span>
                <p className="text-[11px] text-muted-foreground mt-2">Target: {liveMatchData.target}</p>
              </div>
              <div className="text-center flex-1">
                <div className="text-3xl mb-1">⚔️</div>
                <p className="text-sm font-bold">{liveMatchData.team2.name}</p>
                <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">Yet to bat</p>
                <p className="text-[11px] text-muted-foreground">Need {liveMatchData.target} runs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 max-h-[250px] overflow-y-auto">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      item.type === "live" ? "bg-red-500 animate-pulse-dot" :
                      item.type === "highlight" ? "bg-amber-500" :
                      item.type === "result" ? "bg-green-500" :
                      item.type === "registration" ? "bg-blue-500" :
                      "bg-purple-500"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-foreground leading-snug">{item.text}</p>
                    <p className="text-[10px] text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
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
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-500/15 p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/15 flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <Avatar className="w-12 h-12 mx-auto mb-2 border-2 border-orange-300 dark:border-orange-500/40">
                  <AvatarFallback className="text-xs font-bold text-white" style={{ backgroundColor: topScorer.teamColor }}>
                    {topScorer.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs font-bold">{topScorer.name}</p>
                <p className="text-xl font-extrabold text-orange-600 dark:text-orange-400">{topScorer.runs}</p>
                <p className="text-[10px] text-muted-foreground">Orange Cap</p>
              </div>
              <div className="rounded-xl bg-purple-50 dark:bg-purple-500/5 border border-purple-200 dark:border-purple-500/15 p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/15 flex items-center justify-center mx-auto mb-2">
                  <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <Avatar className="w-12 h-12 mx-auto mb-2 border-2 border-purple-300 dark:border-purple-500/40">
                  <AvatarFallback className="text-xs font-bold text-white" style={{ backgroundColor: topWicketTaker.teamColor }}>
                    {topWicketTaker.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs font-bold">{topWicketTaker.name}</p>
                <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400">{topWicketTaker.wickets}</p>
                <p className="text-[10px] text-muted-foreground">Purple Cap</p>
              </div>
            </div>
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
                { label: "Add New Team", icon: Users, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-500/15" },
                { label: "Add Player", icon: PersonStanding, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-500/15" },
                { label: "Schedule Match", icon: CalendarDays, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-500/15" },
                { label: "Update Scores", icon: Trophy, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-500/15" },
                { label: "Upload Photos", icon: Zap, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-100 dark:bg-pink-500/15" },
                { label: "Tournament Settings", icon: Activity, color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-500/15" },
              ].map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-auto py-3 px-3 flex flex-col items-center gap-2 hover:bg-muted border-border/50 cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-lg ${action.bg} flex items-center justify-center`}>
                    <action.icon className={`w-4 h-4 ${action.color}`} />
                  </div>
                  <span className="text-[11px] font-medium text-foreground">{action.label}</span>
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
            <Button variant="ghost" size="sm" className="text-xs text-primary gap-1 cursor-pointer">
              View All <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-[11px] font-medium text-muted-foreground pb-2 pr-4">Match</th>
                  <th className="text-left text-[11px] font-medium text-muted-foreground pb-2 pr-4">Teams</th>
                  <th className="text-left text-[11px] font-medium text-muted-foreground pb-2 pr-4">Result</th>
                  <th className="text-left text-[11px] font-medium text-muted-foreground pb-2">Margin</th>
                </tr>
              </thead>
              <tbody>
                {recentResults.map((match, i) => (
                  <tr key={i} className="border-b border-border/30 last:border-0">
                    <td className="py-2.5 pr-4">
                      <Badge variant="secondary" className="text-[10px] font-mono">M{17 - i + 1}</Badge>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="text-xs font-semibold">{match.team1Short}</span>
                      <span className="text-xs text-muted-foreground mx-1">vs</span>
                      <span className="text-xs font-semibold">{match.team2Short}</span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <p className="text-xs font-medium text-green-600 dark:text-green-400">{match.result}</p>
                    </td>
                    <td className="py-2.5">
                      <p className="text-xs text-muted-foreground">{match.margin}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
