"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Zap,
  ChevronRight,
  Play,
  Star,
} from "lucide-react";
import {
  tournamentInfo,
  teams,
  liveMatchData,
  recentResults,
} from "@/lib/cricket-data";

export function HeroSection() {
  const topTeam = teams[0];

  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-lime-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        {/* Cricket ball pattern */}
        <div className="absolute top-20 right-10 w-4 h-4 bg-green-500/20 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-40 right-32 w-2 h-2 bg-lime-500/30 rounded-full animate-bounce" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-green-500/20 rounded-full animate-bounce" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-60 right-20 w-2 h-2 bg-lime-500/25 rounded-full animate-bounce" style={{ animationDelay: "0.8s" }} />
      </div>

      <div className="relative px-4 pt-6 pb-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Tournament Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Badge className="mb-4 bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20 text-xs sm:text-sm">
            <Zap className="w-3 h-3 mr-1" />
            {tournamentInfo.season} • {tournamentInfo.format}
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3">
            <span className="text-cricket-gradient">{tournamentInfo.shortName}</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            {tournamentInfo.tagline}
          </p>
          <div className="flex items-center justify-center gap-2 mt-3 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{tournamentInfo.venue}, {tournamentInfo.city}</span>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8"
        >
          {[
            { icon: Users, label: "Teams", value: tournamentInfo.totalTeams, color: "text-green-400" },
            { icon: Calendar, label: "Matches", value: tournamentInfo.totalMatches, color: "text-lime-400" },
            { icon: Users, label: "Players", value: tournamentInfo.totalPlayers, color: "text-yellow-400" },
            { icon: IndianRupee, label: "Prize Pool", value: tournamentInfo.prizePool, color: "text-orange-400" },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass rounded-xl p-3 sm:p-4 text-center hover:bg-accent/50 transition-colors"
            >
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Live Match Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/5 via-card to-lime-500/5 glow-green">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-lime-500 to-green-500" />
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse-dot" />
                  <span className="text-sm font-semibold text-red-400">LIVE</span>
                  <Badge variant="secondary" className="text-xs bg-card/80">
                    Match {liveMatchData.matchNumber}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">Shivaji Park Ground A</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 text-center">
                  <div
                    className="text-3xl sm:text-4xl mb-2"
                    role="img"
                    aria-label={liveMatchData.team1.name}
                  >
                    ⚡
                  </div>
                  <h3 className="text-sm sm:text-base font-bold">
                    {liveMatchData.team1.name}
                  </h3>
                  <p className="text-xl sm:text-3xl font-extrabold text-green-400 mt-1">
                    {liveMatchData.team1.score}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ({liveMatchData.team1.overs} ov) • RR: {liveMatchData.team1.runRate}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-1 px-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card border border-border flex items-center justify-center">
                    <span className="text-xs font-bold text-muted-foreground">VS</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Target: {liveMatchData.target}</p>
                </div>

                <div className="flex-1 text-center">
                  <div
                    className="text-3xl sm:text-4xl mb-2"
                    role="img"
                    aria-label={liveMatchData.team2.name}
                  >
                    ⚔️
                  </div>
                  <h3 className="text-sm sm:text-base font-bold">
                    {liveMatchData.team2.name}
                  </h3>
                  <p className="text-xl sm:text-3xl font-extrabold text-purple-400 mt-1">
                    Yet to bat
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Need {liveMatchData.target} runs
                  </p>
                </div>
              </div>

              {/* Current batsmen */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-card/50 rounded-lg p-3">
                    <p className="text-muted-foreground mb-1">Batting</p>
                    {liveMatchData.batsmen.map((b, i) => (
                      <div key={i} className={`flex justify-between ${b.isOnStrike ? "text-green-400" : ""}`}>
                        <span>{b.name} {b.isOnStrike ? "*" : ""}</span>
                        <span className="font-mono">{b.runs}({b.balls})</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-card/50 rounded-lg p-3">
                    <p className="text-muted-foreground mb-1">Bowling</p>
                    <div className="flex justify-between">
                      <span>{liveMatchData.bowler.name}</span>
                      <span className="font-mono">{liveMatchData.bowler.wickets}/{liveMatchData.bowler.runs}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Overs</span>
                      <span className="font-mono">{liveMatchData.bowler.overs}</span>
                    </div>
                  </div>
                  <div className="bg-card/50 rounded-lg p-3">
                    <p className="text-muted-foreground mb-1">This Over</p>
                    <div className="flex gap-1.5">
                      {liveMatchData.currentOver.map((ball, i) => (
                        <span
                          key={i}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            ball === "W"
                              ? "bg-red-500/20 text-red-400"
                              : ball === "4"
                              ? "bg-blue-500/20 text-blue-400"
                              : ball === "6"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-card text-muted-foreground"
                          }`}
                        >
                          {ball}
                        </span>
                      ))}
                    </div>
                    <p className="text-muted-foreground mt-1">Last over: {liveMatchData.lastOver.join(" ")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Results + Top Team */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Results */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 glass rounded-2xl p-4 sm:p-6"
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Play className="w-4 h-4 text-green-400" />
              Recent Results
            </h2>
            <div className="space-y-3">
              {recentResults.map((match, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-card/50 hover:bg-card/80 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-muted-foreground w-6 shrink-0">
                      M{match.team1Short === match.result.split(" ")[0] ? "" : ""}
                    </span>
                    <div className="flex items-center gap-2 text-sm min-w-0">
                      <span className="font-semibold truncate">{match.team1Short}</span>
                      <span className="text-muted-foreground">vs</span>
                      <span className="font-semibold truncate">{match.team2Short}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-xs font-medium text-green-400">{match.result}</p>
                    <p className="text-xs text-muted-foreground">{match.margin}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tournament Leader */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass rounded-2xl p-4 sm:p-6"
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              Table Toppers
            </h2>
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{topTeam.logo}</div>
              <h3 className="text-lg font-bold">{topTeam.name}</h3>
              <p className="text-2xl font-extrabold text-green-400">{topTeam.points} pts</p>
              <p className="text-xs text-muted-foreground">NRR: {topTeam.nrr}</p>
            </div>
            <div className="space-y-2">
              {teams.slice(0, 3).map((team, i) => (
                <div
                  key={team.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-card/50"
                >
                  <span className={`text-lg font-bold w-6 text-center ${
                    i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-400" : "text-orange-400"
                  }`}>
                    {i + 1}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: team.color }}
                  >
                    {team.shortName}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{team.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {team.wins}W / {team.losses}L
                    </p>
                  </div>
                  <span className="text-sm font-bold text-green-400">{team.points}</span>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-3 text-green-400 hover:text-green-300 hover:bg-green-500/10 text-sm"
            >
              View Full Table
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
