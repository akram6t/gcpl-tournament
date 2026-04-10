"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Flame, Target, Award, TrendingUp, Shield, Swords, RefreshCw } from "lucide-react";
import { fetchPlayers, type Player } from "@/lib/cricket-data";

type PlayerTab = "all" | "batsmen" | "bowlers" | "allrounders";

export function PlayersSection() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<PlayerTab>("all");

  const loadPlayers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPlayers();
      setPlayers(data);
    } catch {
      setError("Failed to load players. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const filteredPlayers = players.filter((p) => {
    if (tab === "all") return true;
    if (tab === "batsmen") return p.role === "Batsman" || p.role === "Wicketkeeper";
    if (tab === "bowlers") return p.role === "Bowler";
    if (tab === "allrounders") return p.role === "All-Rounder";
    return true;
  });

  const orangeCap = [...players].sort((a, b) => b.runs - a.runs)[0];
  const purpleCap = [...players].sort((a, b) => b.wickets - a.wickets)[0];

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Players</h2>
        <p className="text-muted-foreground text-sm">Top performers of the tournament</p>
      </motion.div>

      {error && (
        <div className="text-center py-12">
          <p className="text-destructive mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={loadPlayers}>
            <RefreshCw className="w-4 h-4 mr-2" /> Retry
          </Button>
        </div>
      )}

      {loading && !error && (
        <>
          {/* Cap Holders Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[0, 1].map((i) => (
              <div key={i} className="glass rounded-2xl p-5 border border-border/30">
                <div className="flex items-center gap-2 mb-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div><Skeleton className="h-3.5 w-20 mb-1" /><Skeleton className="h-2.5 w-28" /></div>
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="w-14 h-14 rounded-full" />
                  <div><Skeleton className="h-4 w-32 mb-1" /><Skeleton className="h-2.5 w-20 mb-1" /><Skeleton className="h-7 w-16" /></div>
                </div>
              </div>
            ))}
          </div>
          {/* Player Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-5">
                <div className="flex items-start gap-4 mb-4">
                  <Skeleton className="w-14 h-14 rounded-full shrink-0" />
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-4 w-28 mb-2" />
                    <div className="flex gap-2"><Skeleton className="h-5 w-8 rounded-full" /><Skeleton className="h-3 w-16" /></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="inner-card rounded-lg p-3"><Skeleton className="h-3 w-12 mb-2" /><Skeleton className="h-6 w-10 mb-1" /><Skeleton className="h-2.5 w-full" /></div>
                  <div className="inner-card rounded-lg p-3"><Skeleton className="h-3 w-14 mb-2" /><Skeleton className="h-6 w-10 mb-1" /><Skeleton className="h-2.5 w-16" /></div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && !error && (
        <>
          {/* Cap Holders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {orangeCap && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                className="glass rounded-2xl p-5 border border-orange-300/50 dark:border-orange-500/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div><h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">Orange Cap</h3><p className="text-xs text-muted-foreground">Highest Run Scorer</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14 border-2 border-orange-300 dark:border-orange-500/50">
                    <AvatarFallback className="text-lg font-bold text-white" style={{ backgroundColor: orangeCap.teamColor }}>
                      {orangeCap.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">{orangeCap.name}</p>
                    <p className="text-xs text-muted-foreground">{orangeCap.team}</p>
                    <p className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 mt-1">
                      {orangeCap.runs} <span className="text-xs font-normal text-muted-foreground">runs</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {purpleCap && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
                className="glass rounded-2xl p-5 border border-purple-300/50 dark:border-purple-500/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                    <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div><h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Purple Cap</h3><p className="text-xs text-muted-foreground">Highest Wicket Taker</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14 border-2 border-purple-300 dark:border-purple-500/50">
                    <AvatarFallback className="text-lg font-bold text-white" style={{ backgroundColor: purpleCap.teamColor }}>
                      {purpleCap.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">{purpleCap.name}</p>
                    <p className="text-xs text-muted-foreground">{purpleCap.team}</p>
                    <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                      {purpleCap.wickets} <span className="text-xs font-normal text-muted-foreground">wickets</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Filter */}
          <Tabs value={tab} onValueChange={(v) => setTab(v as PlayerTab)} className="mb-6">
            <TabsList className="bg-muted/80 border border-border/50">
              <TabsTrigger value="all" className="text-xs sm:text-sm">All Players</TabsTrigger>
              <TabsTrigger value="batsmen" className="text-xs sm:text-sm"><Swords className="w-3 h-3 mr-1" />Batsmen</TabsTrigger>
              <TabsTrigger value="bowlers" className="text-xs sm:text-sm"><Target className="w-3 h-3 mr-1" />Bowlers</TabsTrigger>
              <TabsTrigger value="allrounders" className="text-xs sm:text-sm"><Award className="w-3 h-3 mr-1" />All-Rounders</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Player Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlayers.map((player, index) => (
              <motion.div key={player.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glass rounded-2xl p-5 hover:bg-card/80 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-14 h-14 border-2 shrink-0 group-hover:scale-105 transition-transform" style={{ borderColor: player.teamColor }}>
                    <AvatarFallback className="text-lg font-bold text-white" style={{ backgroundColor: player.teamColor }}>
                      {player.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold truncate">{player.name}</h3>
                      {player.isCaptain && <Shield className="w-3.5 h-3.5 text-yellow-500 shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="text-xs" style={{ backgroundColor: `${player.teamColor}18`, color: player.teamColor, borderColor: `${player.teamColor}35` }}>{player.teamShort}</Badge>
                      <span className="text-xs text-muted-foreground">{player.role}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="inner-card rounded-lg p-3">
                    <div className="flex items-center gap-1 mb-1"><Swords className="w-3 h-3 text-green-600 dark:text-green-400" /><span className="text-xs text-muted-foreground">Runs</span></div>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">{player.runs}</p>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>Avg: {player.avg}</span><span>SR: {player.sr}</span></div>
                  </div>
                  <div className="inner-card rounded-lg p-3">
                    <div className="flex items-center gap-1 mb-1"><Target className="w-3 h-3 text-purple-600 dark:text-purple-400" /><span className="text-xs text-muted-foreground">Wickets</span></div>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{player.wickets}</p>
                    <div className="text-xs text-muted-foreground mt-1">Best: {player.bestBowling}</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Best: {player.bestBatting} | {player.wickets > 0 ? `${player.wickets} wickets` : "N/A"}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
