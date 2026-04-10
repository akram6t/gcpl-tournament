"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Trophy, ArrowUp, ArrowDown, Minus, RefreshCw } from "lucide-react";
import { fetchStandings, type Team } from "@/lib/cricket-data";

export function PointsTableSection() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStandings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStandings();
      setTeams(data);
    } catch {
      setError("Failed to load standings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStandings();
  }, []);

  const sortedTeams = [...teams].sort((a, b) => b.points - a.points || (parseFloat(b.nrr) - parseFloat(a.nrr)));

  const getNRRColor = (nrr: string) => {
    const val = parseFloat(nrr);
    return val > 0 ? "text-green-600 dark:text-green-400" : val < 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground";
  };
  const getPositionIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-4 h-4 text-yellow-500" />;
    if (index === 1) return <Trophy className="w-4 h-4 text-gray-400" />;
    if (index === 2) return <Trophy className="w-4 h-4 text-orange-500" />;
    return <span className="text-xs text-muted-foreground">{index + 1}</span>;
  };
  const getNRRIcon = (nrr: string) => {
    const val = parseFloat(nrr);
    return val > 0 ? <ArrowUp className="w-3 h-3" /> : val < 0 ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Points Table</h2>
        <p className="text-muted-foreground text-sm">League standings • Top 4 qualify for Semi-Finals</p>
      </motion.div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-200 dark:bg-green-500/30 border border-green-400 dark:border-green-500/50" />
          <span className="text-xs text-muted-foreground">Semi-Final Qualification</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-200 dark:bg-red-500/30 border border-red-400 dark:border-red-500/50" />
          <span className="text-xs text-muted-foreground">Eliminated</span>
        </div>
      </div>

      {error && (
        <div className="text-center py-12">
          <p className="text-destructive mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={loadStandings}>
            <RefreshCw className="w-4 h-4 mr-2" /> Retry
          </Button>
        </div>
      )}

      {loading && !error && (
        <>
          {/* Desktop Skeleton */}
          <div className="hidden md:block glass rounded-2xl overflow-hidden p-4">
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
          {/* Mobile Skeleton */}
          <div className="md:hidden space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div><Skeleton className="h-4 w-24 mb-1" /><Skeleton className="h-3 w-16" /></div>
                  </div>
                  <Skeleton className="w-10 h-8" />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[0, 1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-10 rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && !error && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block glass rounded-2xl overflow-hidden">
            <ScrollArea>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead className="text-center">M</TableHead>
                    <TableHead className="text-center">W</TableHead>
                    <TableHead className="text-center">L</TableHead>
                    <TableHead className="text-center">D</TableHead>
                    <TableHead className="text-center">NRR</TableHead>
                    <TableHead className="text-center">Pts</TableHead>
                    <TableHead className="text-center">Form</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTeams.map((team, index) => (
                    <motion.tr key={team.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`border-border/30 transition-colors hover:bg-accent/50 ${index < 4 ? "bg-green-500/5 dark:bg-green-500/5" : ""}`}
                    >
                      <TableCell className="text-center font-bold">{getPositionIcon(index)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: team.color }}>{team.shortName}</div>
                          <div><p className="font-semibold text-sm">{team.name}</p><p className="text-xs text-muted-foreground">{team.captain} (C)</p></div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm">{team.matchesPlayed}</TableCell>
                      <TableCell className="text-center text-sm font-semibold text-green-600 dark:text-green-400">{team.wins}</TableCell>
                      <TableCell className="text-center text-sm font-semibold text-red-600 dark:text-red-400">{team.losses}</TableCell>
                      <TableCell className="text-center text-sm">{team.draws}</TableCell>
                      <TableCell className="text-center">
                        <div className={`flex items-center justify-center gap-1 text-sm font-medium ${getNRRColor(team.nrr)}`}>{getNRRIcon(team.nrr)}{team.nrr}</div>
                      </TableCell>
                      <TableCell className="text-center"><span className="text-lg font-bold text-primary">{team.points}</span></TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i < team.wins ? "bg-green-500" : i < team.wins + team.losses ? "bg-red-500" : "bg-muted-foreground/30"}`} />
                          ))}
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {sortedTeams.map((team, index) => (
              <motion.div key={team.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`glass rounded-2xl p-4 ${index < 4 ? "border-green-300/50 dark:border-green-500/10" : ""}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">{getPositionIcon(index)}</div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: team.color }}>{team.shortName}</div>
                    <div><p className="font-semibold text-sm">{team.name}</p><p className="text-xs text-muted-foreground">{team.captain}</p></div>
                  </div>
                  <div className="text-right"><p className="text-2xl font-bold text-primary">{team.points}</p><p className="text-xs text-muted-foreground">points</p></div>
                </div>
                <div className="grid grid-cols-5 gap-2 text-center">
                  <div className="inner-card rounded-lg py-1.5"><p className="text-xs font-bold">{team.matchesPlayed}</p><p className="text-xs text-muted-foreground">M</p></div>
                  <div className="inner-card rounded-lg py-1.5"><p className="text-xs font-bold text-green-600 dark:text-green-400">{team.wins}</p><p className="text-xs text-muted-foreground">W</p></div>
                  <div className="inner-card rounded-lg py-1.5"><p className="text-xs font-bold text-red-600 dark:text-red-400">{team.losses}</p><p className="text-xs text-muted-foreground">L</p></div>
                  <div className="inner-card rounded-lg py-1.5"><p className="text-xs font-bold text-muted-foreground">{team.draws}</p><p className="text-xs text-muted-foreground">D</p></div>
                  <div className="inner-card rounded-lg py-1.5"><p className={`text-xs font-bold ${getNRRColor(team.nrr)}`}>{team.nrr}</p><p className="text-xs text-muted-foreground">NRR</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
