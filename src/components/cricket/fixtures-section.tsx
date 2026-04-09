"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Calendar, MapPin, Clock, CheckCircle, Radio, Circle } from "lucide-react";
import { fixtures } from "@/lib/cricket-data";

export function FixturesSection() {
  const [filter, setFilter] = useState<"all" | "live" | "completed" | "upcoming">("all");

  const filteredFixtures = fixtures.filter((f) => {
    if (filter === "all") return true;
    return f.status === filter;
  });

  const liveMatch = fixtures.find((f) => f.status === "live");

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Fixtures</h2>
        <p className="text-muted-foreground text-sm">
          {fixtures.length} matches scheduled in the tournament
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-6">
        <TabsList className="bg-card/80 border border-border/50">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            All ({fixtures.length})
          </TabsTrigger>
          <TabsTrigger value="live" className="text-xs sm:text-sm">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-red-400" />
              Live ({fixtures.filter((f) => f.status === "live").length})
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-green-400" />
              Completed ({fixtures.filter((f) => f.status === "completed").length})
            </span>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
            <span className="flex items-center gap-1.5">
              <Circle className="w-3 h-3 text-blue-400" />
              Upcoming ({fixtures.filter((f) => f.status === "upcoming").length})
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Fixtures List */}
      <ScrollArea className="h-[600px] pr-2">
        <div className="space-y-3">
          {filteredFixtures.map((fixture, index) => (
            <motion.div
              key={fixture.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              className={`rounded-2xl border transition-all duration-200 hover:scale-[1.01] ${
                fixture.status === "live"
                  ? "border-red-500/30 bg-gradient-to-r from-red-500/5 to-card glow-green"
                  : "border-border/50 bg-card/50 hover:bg-card/80"
              }`}
            >
              {/* Match Header */}
              <div className="flex items-center justify-between px-4 pt-3 pb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    className={`text-xs font-medium ${
                      fixture.status === "live"
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : fixture.status === "completed"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}
                  >
                    {fixture.status === "live" && (
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse-dot" />
                    )}
                    Match {fixture.matchNumber}
                  </Badge>
                  {fixture.status === "live" && (
                    <Badge className="text-xs bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                      LIVE
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {fixture.date}
                  <Clock className="w-3 h-3 ml-1" />
                  {fixture.time}
                </div>
              </div>

              {/* Teams */}
              <div className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  {/* Team 1 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ backgroundColor: fixture.team1Color }}
                      >
                        {fixture.team1Short}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{fixture.team1}</p>
                      </div>
                    </div>
                  </div>

                  {/* VS / Score */}
                  <div className="text-center shrink-0 px-2">
                    {fixture.status === "completed" || fixture.status === "live" ? (
                      <div className="text-xs font-mono text-muted-foreground">
                        <span className="text-green-400">{fixture.score?.split(" vs ")[0]}</span>
                        <br />
                        <span className="text-muted-foreground/60">vs</span>
                        <br />
                        <span>{fixture.score?.split(" vs ")[1]}</span>
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-muted-foreground">VS</div>
                    )}
                  </div>

                  {/* Team 2 */}
                  <div className="flex-1 text-right">
                    <div className="flex items-center gap-2 mb-1 justify-end">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{fixture.team2}</p>
                      </div>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ backgroundColor: fixture.team2Color }}
                      >
                        {fixture.team2Short}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Result */}
                {fixture.result && (
                  <div className="mt-2 pt-2 border-t border-border/30 text-center">
                    <p className="text-xs font-medium text-green-400">{fixture.result}</p>
                  </div>
                )}

                {/* Venue */}
                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {fixture.venue}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <ScrollBar className="opacity-0" />
      </ScrollArea>
    </div>
  );
}
