"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin, Calendar, Users, IndianRupee, Zap,
  ChevronRight, Play, Star, RefreshCw, Radio,
} from "lucide-react";
import { tournamentInfo, fetchTeams, fetchFixtures, type Team, type Fixture } from "@/lib/cricket-data";

// Helper to compute run rate from overs string and runs
function computeRunRate(runs: number | undefined, overs: string | undefined): string {
  if (runs == null || !overs) return "-";
  const parts = overs.split(".");
  const fullOvers = parseInt(parts[0], 10) || 0;
  const balls = parseInt(parts[1], 10) || 0;
  const totalOvers = fullOvers + balls / 6;
  if (totalOvers === 0) return "0.00";
  return (runs / totalOvers).toFixed(2);
}

// Helper to get ball color class for this over display
function getBallBadgeClass(ball: string): string {
  if (ball === "W" || ball === "w") return "bg-red-500 text-white";
  if (ball === "Wd" || ball === "wd" || ball === "Nb" || ball === "nb") return "bg-yellow-500 text-black";
  if (ball === "4") return "border-2 border-green-500 text-green-600 dark:text-green-400 bg-green-500/10";
  if (ball === "6") return "bg-green-500 text-white";
  if (ball === "0" || ball === ".") return "bg-muted text-muted-foreground";
  return "bg-card text-foreground border border-border";
}

export function HeroSection() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [teamsData, fixturesData, settingsRes] = await Promise.all([
        fetchTeams(),
        fetchFixtures(),
        fetch("/api/settings").then((r) => r.json()),
      ]);
      setTeams(teamsData);
      setFixtures(fixturesData);
      setSettings(settingsRes);
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh every 10 seconds when a live match exists
  useEffect(() => {
    const hasLive = fixtures.some((f) => f.status === "live");
    if (hasLive) {
      refreshTimerRef.current = setInterval(() => {
        // Only refresh fixtures, not everything
        fetchFixtures()
          .then((data) => setFixtures(data))
          .catch(() => {/* silent */});
      }, 10000);
    }
    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [fixtures.some((f) => f.status === "live")]);

  const liveMatch = useMemo(
    () => fixtures.find((f) => f.status === "live"),
    [fixtures]
  );

  const recentResults = useMemo(
    () =>
      fixtures
        .filter((f) => f.status === "completed")
        .slice(-5)
        .reverse(),
    [fixtures]
  );

  const topTeam = teams[0];
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points).slice(0, 3);

  // Derive dynamic stats from settings or fall back to tournamentInfo
  const totalTeams = settings.totalTeams || tournamentInfo.totalTeams;
  const totalMatches = settings.totalMatches || tournamentInfo.totalMatches;
  const totalPlayers = settings.totalPlayers || tournamentInfo.totalPlayers;
  const prizePool = settings.prizePool || settings.totalPrizePool || tournamentInfo.prizePool;

  // Parse this over balls for display
  const thisOverBalls = useMemo(() => {
    if (!liveMatch?.thisOver) return [];
    return liveMatch.thisOver.split(/\s+/).filter(Boolean);
  }, [liveMatch?.thisOver]);

  return (
    <div className="relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 dark:bg-green-500/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-lime-500/10 dark:bg-lime-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-4 h-4 bg-green-500/25 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-40 right-32 w-2 h-2 bg-lime-500/30 rounded-full animate-bounce" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-green-500/20 rounded-full animate-bounce" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-60 right-20 w-2 h-2 bg-lime-500/25 rounded-full animate-bounce" style={{ animationDelay: "0.8s" }} />
      </div>

      <div className="relative px-4 pt-6 pb-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-8">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 text-xs sm:text-sm">
            <Zap className="w-3 h-3 mr-1" />
            {tournamentInfo.season} • {tournamentInfo.format}
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3">
            <span className="text-cricket-gradient">{tournamentInfo.shortName}</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">{tournamentInfo.tagline}</p>
          <div className="flex items-center justify-center gap-2 mt-3 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{tournamentInfo.venue}, {tournamentInfo.city}</span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {[
            { icon: Users, label: "Teams", value: totalTeams, color: "text-green-600 dark:text-green-400" },
            { icon: Calendar, label: "Matches", value: totalMatches, color: "text-lime-600 dark:text-lime-400" },
            { icon: Users, label: "Players", value: totalPlayers, color: "text-yellow-600 dark:text-yellow-400" },
            { icon: IndianRupee, label: "Prize Pool", value: prizePool, color: "text-orange-600 dark:text-orange-400" },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-xl p-3 sm:p-4 text-center hover:bg-accent/50 transition-colors">
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Live Match */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-8">
          {loading ? (
            <div className="relative overflow-hidden rounded-2xl border border-border/50 glass">
              <div className="absolute top-0 left-0 right-0 h-1 bg-muted" />
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 text-center">
                    <Skeleton className="w-12 h-12 rounded-full mx-auto mb-2" />
                    <Skeleton className="h-5 w-28 mx-auto mb-1" />
                    <Skeleton className="h-8 w-20 mx-auto mb-1" />
                    <Skeleton className="h-3 w-24 mx-auto" />
                  </div>
                  <div className="flex flex-col items-center gap-1 px-2">
                    <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </div>
                  <div className="flex-1 text-center">
                    <Skeleton className="w-12 h-12 rounded-full mx-auto mb-2" />
                    <Skeleton className="h-5 w-28 mx-auto mb-1" />
                    <Skeleton className="h-8 w-20 mx-auto mb-1" />
                    <Skeleton className="h-3 w-24 mx-auto" />
                  </div>
                </div>
              </div>
            </div>
          ) : liveMatch ? (
            <div className="relative overflow-hidden rounded-2xl border live-card-bg glow-green">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-lime-500 to-green-500" />
              <div className="p-4 sm:p-6">
                {/* Live header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse-dot" />
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">LIVE</span>
                    <Badge variant="secondary" className="text-xs bg-card/80">Match {liveMatch.matchNumber}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{liveMatch.venue}</span>
                </div>

                {/* Scoreboard */}
                <div className="flex items-center justify-between gap-4">
                  {/* Team 1 */}
                  <div className={`flex-1 text-center rounded-xl p-3 transition-all ${liveMatch.battingTeam === 1 ? "ring-2 ring-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "opacity-75"}`}>
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl mx-auto mb-2"
                      style={{ backgroundColor: liveMatch.team1Color + "20" }}
                    >
                      <span style={{ color: liveMatch.team1Color }}>{liveMatch.team1Short}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold">{liveMatch.team1}</h3>
                    {liveMatch.team1Score != null ? (
                      <>
                        <p className="text-2xl sm:text-3xl font-extrabold mt-1" style={{ color: liveMatch.team1Color }}>
                          {liveMatch.team1Score}/{liveMatch.team1Wickets ?? 0}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ({liveMatch.team1Overs || "0"} ov)
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">
                          CRR: {computeRunRate(liveMatch.team1Score, liveMatch.team1Overs)}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg sm:text-xl font-extrabold mt-1 text-muted-foreground">
                        Yet to bat
                      </p>
                    )}
                    {liveMatch.battingTeam === 1 && (
                      <div className="flex items-center justify-center gap-1 mt-1.5">
                        <span className="text-[10px] bg-green-500/20 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded font-semibold">BATTING</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-1 px-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full inner-card flex items-center justify-center">
                      <span className="text-xs font-bold text-muted-foreground">VS</span>
                    </div>
                  </div>

                  {/* Team 2 */}
                  <div className={`flex-1 text-center rounded-xl p-3 transition-all ${liveMatch.battingTeam === 2 ? "ring-2 ring-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "opacity-75"}`}>
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl mx-auto mb-2"
                      style={{ backgroundColor: liveMatch.team2Color + "20" }}
                    >
                      <span style={{ color: liveMatch.team2Color }}>{liveMatch.team2Short}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold">{liveMatch.team2}</h3>
                    {liveMatch.team2Score != null ? (
                      <>
                        <p className="text-2xl sm:text-3xl font-extrabold mt-1" style={{ color: liveMatch.team2Color }}>
                          {liveMatch.team2Score}/{liveMatch.team2Wickets ?? 0}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ({liveMatch.team2Overs || "0"} ov)
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">
                          CRR: {computeRunRate(liveMatch.team2Score, liveMatch.team2Overs)}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg sm:text-xl font-extrabold mt-1 text-muted-foreground">
                        Yet to bat
                      </p>
                    )}
                    {liveMatch.battingTeam === 2 && (
                      <div className="flex items-center justify-center gap-1 mt-1.5">
                        <span className="text-[10px] bg-green-500/20 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded font-semibold">BATTING</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Current Batsmen & Bowler info */}
                {(liveMatch.striker || liveMatch.bowler) && (
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                    {/* Batsmen */}
                    {liveMatch.striker && (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
                        <span className="text-muted-foreground">Batsmen:</span>
                        <span className="font-semibold text-foreground">
                          <Zap className="w-3 h-3 inline text-yellow-500 mr-0.5" />
                          {liveMatch.striker} {liveMatch.strikerRuns ?? 0}({liveMatch.strikerBalls ?? 0})
                        </span>
                        {liveMatch.nonStriker && (
                          <span className="font-medium text-muted-foreground">
                            {liveMatch.nonStriker} {liveMatch.nonStrikerRuns ?? 0}({liveMatch.nonStrikerBalls ?? 0})
                          </span>
                        )}
                      </div>
                    )}
                    {/* Bowler */}
                    {liveMatch.bowler && (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
                        <span className="text-muted-foreground">Bowler:</span>
                        <span className="font-semibold text-foreground">
                          {liveMatch.bowler} {liveMatch.bowlerWickets ?? 0}/{liveMatch.bowlerRuns ?? 0} ({liveMatch.bowlerOvers || "0"} ov)
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* This Over ball display */}
                {thisOverBalls.length > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium shrink-0">This over:</span>
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

                {liveMatch.result && (
                  <p className="text-center text-sm font-medium text-green-600 dark:text-green-400 mt-3 pt-3 border-t border-border/50">
                    {liveMatch.result}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-border/50 glass">
              <div className="absolute top-0 left-0 right-0 h-1 bg-muted" />
              <div className="p-4 sm:p-6">
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <Radio className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-base font-semibold mb-1">No live match right now</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Check the fixtures tab for upcoming matches and schedules.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Recent Results + Top Team */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="lg:col-span-2 glass rounded-2xl p-4 sm:p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Play className="w-4 h-4 text-green-600 dark:text-green-400" /> Recent Results
            </h2>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl inner-card">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-6" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentResults.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No completed matches yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentResults.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-3 rounded-xl inner-card hover:bg-muted/80 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex items-center gap-2 text-sm min-w-0">
                        <span className="font-semibold truncate">{match.team1Short}</span>
                        <span className="text-muted-foreground">vs</span>
                        <span className="font-semibold truncate">{match.team2Short}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="text-xs font-medium text-green-600 dark:text-green-400">{match.result}</p>
                      {match.score && (
                        <p className="text-xs text-muted-foreground">{match.score}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="glass rounded-2xl p-4 sm:p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" /> Table Toppers
            </h2>

            {loading && (
              <div className="space-y-4">
                <div className="text-center">
                  <Skeleton className="w-16 h-16 rounded-full mx-auto mb-2" />
                  <Skeleton className="h-5 w-32 mx-auto mb-1" />
                  <Skeleton className="h-7 w-16 mx-auto mb-1" />
                  <Skeleton className="h-3 w-20 mx-auto" />
                </div>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <Skeleton className="w-6 h-5" />
                    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                    <div className="flex-1"><Skeleton className="h-4 w-24 mb-1" /><Skeleton className="h-3 w-16" /></div>
                    <Skeleton className="w-6 h-4" />
                  </div>
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="text-center py-4">
                <p className="text-destructive text-sm mb-2">{error}</p>
                <Button variant="ghost" size="sm" onClick={loadData}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retry
                </Button>
              </div>
            )}

            {!loading && !error && topTeam && (
              <>
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{topTeam.logo}</div>
                  <h3 className="text-lg font-bold">{topTeam.name}</h3>
                  <p className="text-2xl font-extrabold text-green-600 dark:text-green-400">{topTeam.points} pts</p>
                  <p className="text-xs text-muted-foreground">NRR: {topTeam.nrr}</p>
                </div>
                <div className="space-y-2">
                  {sortedTeams.map((team, i) => (
                    <div key={team.id} className="flex items-center gap-3 p-2 rounded-lg inner-card">
                      <span className={`text-lg font-bold w-6 text-center ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : "text-orange-500"}`}>{i + 1}</span>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: team.color }}>{team.shortName}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{team.name}</p>
                        <p className="text-xs text-muted-foreground">{team.wins}W / {team.losses}L</p>
                      </div>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">{team.points}</span>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-3 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-500/10 text-sm">
                  View Full Table <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
