"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, CheckCircle, Radio, Circle, RefreshCw } from "lucide-react";
import { fetchFixtures, type Fixture } from "@/lib/cricket-data";

export function FixturesSection() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "live" | "completed" | "upcoming">("all");

  const loadFixtures = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFixtures();
      setFixtures(data);
    } catch {
      setError("Failed to load fixtures. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFixtures();
  }, []);

  const filteredFixtures = fixtures.filter((f) => filter === "all" ? true : f.status === filter);

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Fixtures</h2>
        <p className="text-muted-foreground text-sm">{!loading ? `${fixtures.length} matches scheduled in the tournament` : "Loading fixtures..."}</p>
      </motion.div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-6">
        <TabsList className="bg-muted/80 border border-border/50">
          <TabsTrigger value="all" className="text-xs sm:text-sm">All ({fixtures.length})</TabsTrigger>
          <TabsTrigger value="live" className="text-xs sm:text-sm">
            <span className="flex items-center gap-1.5"><Radio className="w-3 h-3 text-red-500" /> Live ({fixtures.filter(f => f.status === "live").length})</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" /> Completed ({fixtures.filter(f => f.status === "completed").length})</span>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
            <span className="flex items-center gap-1.5"><Circle className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Upcoming ({fixtures.filter(f => f.status === "upcoming").length})</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {error && (
        <div className="text-center py-12">
          <p className="text-destructive mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={loadFixtures}>
            <RefreshCw className="w-4 h-4 mr-2" /> Retry
          </Button>
        </div>
      )}

      {loading && !error && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/50 bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-1">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-6 w-10" />
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                </div>
              </div>
              <Skeleton className="h-3 w-32 mx-auto" />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <ScrollArea className="h-[600px] pr-2">
          <div className="space-y-3">
            {filteredFixtures.map((fixture, index) => (
              <motion.div key={fixture.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.02 }}
                className={`rounded-2xl border transition-all duration-200 hover:scale-[1.01] ${
                  fixture.status === "live"
                    ? "live-card-bg glow-green"
                    : "border-border/50 bg-card hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between px-4 pt-3 pb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs font-medium ${
                      fixture.status === "live" ? "bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30"
                      : fixture.status === "completed" ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20"
                      : "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                    }`}>
                      {fixture.status === "live" && <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse-dot" />}
                      Match {fixture.matchNumber}
                    </Badge>
                    {fixture.status === "live" && <Badge className="text-xs bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30 animate-pulse">LIVE</Badge>}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />{fixture.date}<Clock className="w-3 h-3 ml-1" />{fixture.time}
                  </div>
                </div>

                <div className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: fixture.team1Color }}>{fixture.team1Short}</div>
                        <p className="text-sm font-semibold truncate">{fixture.team1}</p>
                      </div>
                    </div>
                    <div className="text-center shrink-0 px-2">
                      {fixture.status === "completed" || fixture.status === "live" ? (
                        <div className="text-xs font-mono text-muted-foreground">
                          <span className="text-green-600 dark:text-green-400">{fixture.score?.split(" vs ")[0]}</span>
                          <br /><span className="text-muted-foreground/60">vs</span><br />
                          <span>{fixture.score?.split(" vs ")[1]}</span>
                        </div>
                      ) : (
                        <div className="text-xs font-bold text-muted-foreground">VS</div>
                      )}
                    </div>
                    <div className="flex-1 text-right">
                      <div className="flex items-center gap-2 mb-1 justify-end">
                        <p className="text-sm font-semibold truncate">{fixture.team2}</p>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: fixture.team2Color }}>{fixture.team2Short}</div>
                      </div>
                    </div>
                  </div>
                  {fixture.result && <div className="mt-2 pt-2 border-t border-border/30 text-center"><p className="text-xs font-medium text-green-600 dark:text-green-400">{fixture.result}</p></div>}
                  <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground"><MapPin className="w-3 h-3" />{fixture.venue}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <ScrollBar className="opacity-0" />
        </ScrollArea>
      )}
    </div>
  );
}
