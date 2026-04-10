"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Shield, Trophy, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { fetchTeams, type Team } from "@/lib/cricket-data";

export function TeamsSection() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTeams();
      setTeams(data);
    } catch {
      setError("Failed to load teams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Teams</h2>
        <p className="text-muted-foreground text-sm">{!loading ? `${teams.length} teams battling for the GCPL Season 4 trophy` : "Loading teams..."}</p>
      </motion.div>

      {error && (
        <div className="text-center py-12">
          <p className="text-destructive mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={loadTeams}>
            <RefreshCw className="w-4 h-4 mr-2" /> Retry
          </Button>
        </div>
      )}

      {loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-5 border border-transparent">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-8 rounded-full" />
              </div>
              <div className="text-center mb-4">
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-3" />
                <Skeleton className="h-4 w-28 mx-auto mb-1" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[0, 1, 2].map((j) => (
                  <div key={j} className="inner-card rounded-lg p-2 text-center">
                    <Skeleton className="h-4 w-6 mx-auto mb-1" />
                    <Skeleton className="h-2.5 w-10 mx-auto" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedTeams.map((team, index) => (
            <motion.div key={team.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} className="group">
              <div className="glass rounded-2xl p-5 hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] h-full border border-transparent hover:border-primary/15">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="text-xs font-bold" style={{
                    backgroundColor: index === 0 ? "#fef3c7" : index < 4 ? "#dcfce7" : "#f3f4f6",
                    color: index === 0 ? "#b45309" : index < 4 ? "#15803d" : "#6b7280",
                    borderColor: index === 0 ? "#fcd34d" : index < 4 ? "#86efac" : "#d1d5db",
                  }}>#{index + 1}</Badge>
                  {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                </div>

                <div className="text-center mb-4">
                  <Avatar className="w-16 h-16 mx-auto mb-3 border-2" style={{ borderColor: team.color }}>
                    <AvatarFallback className="text-2xl text-white font-bold" style={{ backgroundColor: team.color }}>{team.logo}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-base font-bold">{team.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3" />{team.captain}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="inner-card rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-0.5 text-green-600 dark:text-green-400">
                      <TrendingUp className="w-3 h-3" /><span className="text-sm font-bold">{team.wins}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Wins</p>
                  </div>
                  <div className="inner-card rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-0.5 text-red-600 dark:text-red-400">
                      <TrendingDown className="w-3 h-3" /><span className="text-sm font-bold">{team.losses}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Losses</p>
                  </div>
                  <div className="inner-card rounded-lg p-2 text-center">
                    <span className="text-sm font-bold text-primary">{team.points}</span>
                    <p className="text-xs text-muted-foreground">Pts</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>NRR</span>
                    <span className={team.nrr.startsWith("+") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>{team.nrr}</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (team.points / 14) * 100)}%`, backgroundColor: team.color }} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
