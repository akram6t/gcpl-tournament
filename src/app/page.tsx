"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Home as HomeIcon,
  Users,
  CalendarDays,
  Trophy,
  PersonStanding,
  Camera,
  UserCog,
  Menu,
  X,
} from "lucide-react";
import { HeroSection } from "@/components/cricket/hero-section";
import { TeamsSection } from "@/components/cricket/teams-section";
import { FixturesSection } from "@/components/cricket/fixtures-section";
import { PointsTableSection } from "@/components/cricket/points-table-section";
import { PlayersSection } from "@/components/cricket/players-section";
import { GallerySection } from "@/components/cricket/gallery-section";
import { RolesSection } from "@/components/cricket/roles-section";
import { Footer } from "@/components/cricket/footer";
import { liveMatchData } from "@/lib/cricket-data";

const tabs = [
  { value: "home", label: "Home", icon: HomeIcon },
  { value: "teams", label: "Teams", icon: Users },
  { value: "fixtures", label: "Fixtures", icon: CalendarDays },
  { value: "points", label: "Standings", icon: Trophy },
  { value: "players", label: "Players", icon: PersonStanding },
  { value: "gallery", label: "Gallery", icon: Camera },
  { value: "roles", label: "Roles", icon: UserCog },
] as const;

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 glass border-b border-border/30">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-green-500 to-lime-500 flex items-center justify-center text-white font-extrabold text-sm sm:text-base shadow-lg shadow-green-500/20">
                G
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-cricket-gradient leading-tight">
                  GCPL
                </h1>
                <p className="text-xs text-muted-foreground leading-tight">
                  Season 4
                </p>
              </div>
            </div>

            {/* Live Indicator (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse-dot" />
                <span className="text-xs font-semibold text-red-400">LIVE</span>
                <span className="text-xs text-muted-foreground">
                  AA vs WW • M{liveMatchData.matchNumber}
                </span>
              </div>
            </div>

            {/* Desktop Nav Tabs */}
            <nav className="hidden lg:block">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-transparent h-auto gap-1 p-0">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="rounded-lg px-3 py-2 text-xs font-medium data-[state=active]:bg-green-500/15 data-[state=active]:text-green-400 data-[state=active]:shadow-none transition-all hover:bg-card/50"
                    >
                      <tab.icon className="w-3.5 h-3.5 mr-1.5" />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-card transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-border/30 overflow-hidden"
            >
              {/* Live Indicator (Mobile) */}
              <div className="flex items-center gap-2 px-4 py-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse-dot" />
                  <span className="text-xs font-semibold text-red-400">LIVE</span>
                  <span className="text-xs text-muted-foreground">
                    AA vs WW
                  </span>
                </div>
              </div>
              <nav className="px-4 pb-3">
                <div className="grid grid-cols-4 gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => {
                        setActiveTab(tab.value);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-medium transition-all ${
                        activeTab === tab.value
                          ? "bg-green-500/15 text-green-400"
                          : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
                      }`}
                    >
                      <tab.icon className="w-4.5 h-4.5" />
                      <span className="text-xs">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "home" && <HeroSection />}
            {activeTab === "teams" && <TeamsSection />}
            {activeTab === "fixtures" && <FixturesSection />}
            {activeTab === "points" && <PointsTableSection />}
            {activeTab === "players" && <PlayersSection />}
            {activeTab === "gallery" && <GallerySection />}
            {activeTab === "roles" && <RolesSection />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
