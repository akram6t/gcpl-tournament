"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { teams } from "@/lib/cricket-data";

export function TeamsSection() {
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Teams</h2>
        <p className="text-muted-foreground text-sm">{teams.length} teams battling for the GCPL Season 4 trophy</p>
      </motion.div>

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
    </div>
  );
}
