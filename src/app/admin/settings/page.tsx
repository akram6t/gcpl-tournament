"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { apiGet, apiPut } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Settings2, Gamepad2, Trophy, Monitor, Loader2 } from "lucide-react";

// --------------- Default values (fallback when API returns nothing) ---------------

const DEFAULT_GENERAL = {
  tournamentName: "Gully Cricket Premier League",
  season: "4",
  format: "T8",
  startDate: "15 Jan 2025",
  endDate: "15 Feb 2025",
  venueName: "Shivaji Park",
  city: "Mumbai",
  state: "Maharashtra",
  groundsAvailable: "2",
  organizationName: "Mumbai Gully Cricket Association",
  contactEmail: "info@gcpl-mumbai.com",
  contactPhone: "+91 98765 43210",
  website: "https://gcpl-mumbai.com",
};

const DEFAULT_MATCH_RULES = {
  oversPerInnings: "8",
  maxPlayersPerTeam: "11",
  wideBallRule: "1 run",
  noBallRule: "free hit",
  powerplayOvers: "2",
  dlsMethod: true,
  superOver: true,
  lbwRule: true,
  mankading: false,
};

const DEFAULT_PRIZES = {
  totalPrizePool: "₹50,000",
  winnerPrize: "₹25,000",
  runnerUpPrize: "₹12,000",
  bestBatsman: "₹3,000",
  bestBowler: "₹3,000",
  manOfTournament: "₹5,000",
};

const DEFAULT_DISPLAY = {
  liveScoreHomepage: true,
  enableGallery: true,
  showPlayerStats: true,
  darkLightTheme: true,
  matchStartNotification: true,
  resultAnnouncement: true,
  newPhotoUploadAlert: false,
};

// --------------- Boolean field keys (known to come as "true"/"false" strings) ---------------

const BOOLEAN_KEYS = new Set([
  "dlsMethod",
  "superOver",
  "lbwRule",
  "mankading",
  "liveScoreHomepage",
  "enableGallery",
  "showPlayerStats",
  "darkLightTheme",
  "matchStartNotification",
  "resultAnnouncement",
  "newPhotoUploadAlert",
]);

/** Safely parse a string value from the API into the correct JS type */
function parseApiValue(key: string, value: string): string | boolean {
  if (BOOLEAN_KEYS.has(key)) {
    return value === "true";
  }
  return value;
}

// --------------- Component ---------------

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // General Tab State
  const [generalForm, setGeneralForm] = useState(DEFAULT_GENERAL);

  // Match Rules State
  const [matchRules, setMatchRules] = useState(DEFAULT_MATCH_RULES);

  // Prizes State
  const [prizes, setPrizes] = useState(DEFAULT_PRIZES);

  // Display State
  const [displaySettings, setDisplaySettings] = useState(DEFAULT_DISPLAY);

  // --------------- Fetch settings from API on mount ---------------

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data: Record<string, string> = await apiGet("/api/settings");

      if (data && Object.keys(data).length > 0) {
        // Populate general form
        setGeneralForm({
          tournamentName: data.tournamentName ?? DEFAULT_GENERAL.tournamentName,
          season: data.season ?? DEFAULT_GENERAL.season,
          format: data.format ?? DEFAULT_GENERAL.format,
          startDate: data.startDate ?? DEFAULT_GENERAL.startDate,
          endDate: data.endDate ?? DEFAULT_GENERAL.endDate,
          venueName: data.venue ?? data.venueName ?? DEFAULT_GENERAL.venueName,
          city: data.city ?? DEFAULT_GENERAL.city,
          state: data.state ?? DEFAULT_GENERAL.state,
          groundsAvailable: data.groundsAvailable ?? DEFAULT_GENERAL.groundsAvailable,
          organizationName: data.organizationName ?? DEFAULT_GENERAL.organizationName,
          contactEmail: data.contactEmail ?? DEFAULT_GENERAL.contactEmail,
          contactPhone: data.contactPhone ?? DEFAULT_GENERAL.contactPhone,
          website: data.website ?? DEFAULT_GENERAL.website,
        });

        // Populate match rules
        setMatchRules({
          oversPerInnings: data.oversPerInnings ?? DEFAULT_MATCH_RULES.oversPerInnings,
          maxPlayersPerTeam: data.maxPlayersPerTeam ?? DEFAULT_MATCH_RULES.maxPlayersPerTeam,
          wideBallRule: data.wideBallRule ?? DEFAULT_MATCH_RULES.wideBallRule,
          noBallRule: data.noBallRule ?? DEFAULT_MATCH_RULES.noBallRule,
          powerplayOvers: data.powerplayOvers ?? DEFAULT_MATCH_RULES.powerplayOvers,
          dlsMethod: parseApiValue("dlsMethod", String(data.dlsMethod ?? "true")) as boolean,
          superOver: parseApiValue("superOver", String(data.superOver ?? "true")) as boolean,
          lbwRule: parseApiValue("lbwRule", String(data.lbwRule ?? "true")) as boolean,
          mankading: parseApiValue("mankading", String(data.mankading ?? "false")) as boolean,
        });

        // Populate prizes
        setPrizes({
          totalPrizePool: data.prizePool ?? data.totalPrizePool ?? DEFAULT_PRIZES.totalPrizePool,
          winnerPrize: data.winnerPrize ?? DEFAULT_PRIZES.winnerPrize,
          runnerUpPrize: data.runnerUpPrize ?? DEFAULT_PRIZES.runnerUpPrize,
          bestBatsman: data.bestBatsman ?? DEFAULT_PRIZES.bestBatsman,
          bestBowler: data.bestBowler ?? DEFAULT_PRIZES.bestBowler,
          manOfTournament: data.manOfTournament ?? DEFAULT_PRIZES.manOfTournament,
        });

        // Populate display settings
        setDisplaySettings({
          liveScoreHomepage: parseApiValue("liveScoreHomepage", String(data.liveScoreHomepage ?? "true")) as boolean,
          enableGallery: parseApiValue("enableGallery", String(data.enableGallery ?? "true")) as boolean,
          showPlayerStats: parseApiValue("showPlayerStats", String(data.showPlayerStats ?? "true")) as boolean,
          darkLightTheme: parseApiValue("darkLightTheme", String(data.darkLightTheme ?? "true")) as boolean,
          matchStartNotification: parseApiValue("matchStartNotification", String(data.matchStartNotification ?? "true")) as boolean,
          resultAnnouncement: parseApiValue("resultAnnouncement", String(data.resultAnnouncement ?? "true")) as boolean,
          newPhotoUploadAlert: parseApiValue("newPhotoUploadAlert", String(data.newPhotoUploadAlert ?? "false")) as boolean,
        });
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      toast.error("Failed to load settings. Using defaults.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // --------------- Save all settings ---------------

  const handleSave = async () => {
    setSaving(true);
    try {
      // Merge all form groups into a single flat key-value object
      const payload: Record<string, string> = {
        // General
        tournamentName: generalForm.tournamentName,
        season: generalForm.season,
        format: generalForm.format,
        startDate: generalForm.startDate,
        endDate: generalForm.endDate,
        venue: generalForm.venueName,
        venueName: generalForm.venueName,
        city: generalForm.city,
        state: generalForm.state,
        groundsAvailable: generalForm.groundsAvailable,
        organizationName: generalForm.organizationName,
        contactEmail: generalForm.contactEmail,
        contactPhone: generalForm.contactPhone,
        website: generalForm.website,
        // Match Rules
        oversPerInnings: matchRules.oversPerInnings,
        maxPlayersPerTeam: matchRules.maxPlayersPerTeam,
        wideBallRule: matchRules.wideBallRule,
        noBallRule: matchRules.noBallRule,
        powerplayOvers: matchRules.powerplayOvers,
        dlsMethod: String(matchRules.dlsMethod),
        superOver: String(matchRules.superOver),
        lbwRule: String(matchRules.lbwRule),
        mankading: String(matchRules.mankading),
        // Prizes
        prizePool: prizes.totalPrizePool,
        totalPrizePool: prizes.totalPrizePool,
        winnerPrize: prizes.winnerPrize,
        runnerUpPrize: prizes.runnerUpPrize,
        bestBatsman: prizes.bestBatsman,
        bestBowler: prizes.bestBowler,
        manOfTournament: prizes.manOfTournament,
        // Display
        liveScoreHomepage: String(displaySettings.liveScoreHomepage),
        enableGallery: String(displaySettings.enableGallery),
        showPlayerStats: String(displaySettings.showPlayerStats),
        darkLightTheme: String(displaySettings.darkLightTheme),
        matchStartNotification: String(displaySettings.matchStartNotification),
        resultAnnouncement: String(displaySettings.resultAnnouncement),
        newPhotoUploadAlert: String(displaySettings.newPhotoUploadAlert),
      };

      await apiPut("/api/settings", payload);
      toast.success("Settings saved successfully!");
    } catch (err) {
      console.error("Failed to save settings:", err);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // --------------- Loading skeleton ---------------

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>

        {/* Tab bar skeleton */}
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28" />
          ))}
        </div>

        {/* Card skeletons */}
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-border/50">
            <CardHeader className="pb-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // --------------- Render ---------------

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          <p className="text-sm text-muted-foreground">Configure tournament settings and preferences</p>
        </div>
        <Button className="gap-2" onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="general" className="gap-1.5">
            <Settings2 className="w-3.5 h-3.5 hidden sm:block" />
            General
          </TabsTrigger>
          <TabsTrigger value="rules" className="gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5 hidden sm:block" />
            Match Rules
          </TabsTrigger>
          <TabsTrigger value="prizes" className="gap-1.5">
            <Trophy className="w-3.5 h-3.5 hidden sm:block" />
            Prizes
          </TabsTrigger>
          <TabsTrigger value="display" className="gap-1.5">
            <Monitor className="w-3.5 h-3.5 hidden sm:block" />
            Display
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6 mt-6">
          {/* Tournament Information */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Tournament Information</CardTitle>
              <CardDescription>Basic details about the tournament</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tournament-name">Tournament Name</Label>
                  <Input
                    id="tournament-name"
                    value={generalForm.tournamentName}
                    onChange={(e) => setGeneralForm({ ...generalForm, tournamentName: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="season">Season</Label>
                  <Input
                    id="season"
                    value={generalForm.season}
                    onChange={(e) => setGeneralForm({ ...generalForm, season: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="format">Format</Label>
                  <Select
                    value={generalForm.format}
                    onValueChange={(val) => setGeneralForm({ ...generalForm, format: val })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="T6">T6 - 6 Over Matches</SelectItem>
                      <SelectItem value="T8">T8 - 8 Over Matches</SelectItem>
                      <SelectItem value="T10">T10 - 10 Over Matches</SelectItem>
                      <SelectItem value="T12">T12 - 12 Over Matches</SelectItem>
                      <SelectItem value="T15">T15 - 15 Over Matches</SelectItem>
                      <SelectItem value="T20">T20 - 20 Over Matches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    value={generalForm.startDate}
                    onChange={(e) => setGeneralForm({ ...generalForm, startDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    value={generalForm.endDate}
                    onChange={(e) => setGeneralForm({ ...generalForm, endDate: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Venue Details */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Venue Details</CardTitle>
              <CardDescription>Information about the tournament venue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="venue-name">Venue Name</Label>
                  <Input
                    id="venue-name"
                    value={generalForm.venueName}
                    onChange={(e) => setGeneralForm({ ...generalForm, venueName: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={generalForm.city}
                    onChange={(e) => setGeneralForm({ ...generalForm, city: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={generalForm.state}
                    onChange={(e) => setGeneralForm({ ...generalForm, state: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="grounds">Grounds Available</Label>
                  <Input
                    id="grounds"
                    type="number"
                    value={generalForm.groundsAvailable}
                    onChange={(e) => setGeneralForm({ ...generalForm, groundsAvailable: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organizer Info */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Organizer Information</CardTitle>
              <CardDescription>Contact details for the tournament organizer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    value={generalForm.organizationName}
                    onChange={(e) => setGeneralForm({ ...generalForm, organizationName: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="org-email">Contact Email</Label>
                  <Input
                    id="org-email"
                    type="email"
                    value={generalForm.contactEmail}
                    onChange={(e) => setGeneralForm({ ...generalForm, contactEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="org-phone">Contact Phone</Label>
                  <Input
                    id="org-phone"
                    type="tel"
                    value={generalForm.contactPhone}
                    onChange={(e) => setGeneralForm({ ...generalForm, contactPhone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="org-website">Website</Label>
                  <Input
                    id="org-website"
                    value={generalForm.website}
                    onChange={(e) => setGeneralForm({ ...generalForm, website: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Match Rules Tab */}
        <TabsContent value="rules" className="space-y-6 mt-6">
          {/* Match Format */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Match Format</CardTitle>
              <CardDescription>Configure the match format and playing conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="overs">Overs per Innings</Label>
                  <Input
                    id="overs"
                    type="number"
                    value={matchRules.oversPerInnings}
                    onChange={(e) => setMatchRules({ ...matchRules, oversPerInnings: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max-players">Max Players per Team</Label>
                  <Input
                    id="max-players"
                    type="number"
                    value={matchRules.maxPlayersPerTeam}
                    onChange={(e) => setMatchRules({ ...matchRules, maxPlayersPerTeam: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="powerplay">Powerplay Overs</Label>
                  <Input
                    id="powerplay"
                    type="number"
                    value={matchRules.powerplayOvers}
                    onChange={(e) => setMatchRules({ ...matchRules, powerplayOvers: e.target.value })}
                  />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="wide-ball">Wide Ball Rules</Label>
                  <Select
                    value={matchRules.wideBallRule}
                    onValueChange={(val) => setMatchRules({ ...matchRules, wideBallRule: val })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 run">1 Run</SelectItem>
                      <SelectItem value="2 runs">2 Runs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="no-ball">No-Ball Rules</Label>
                  <Select
                    value={matchRules.noBallRule}
                    onValueChange={(val) => setMatchRules({ ...matchRules, noBallRule: val })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free hit">Free Hit</SelectItem>
                      <SelectItem value="no free hit">No Free Hit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tournament Rules */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Tournament Rules</CardTitle>
              <CardDescription>Additional rules and regulations for the tournament</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dls-method" className="text-sm font-medium">DLS Method</Label>
                  <p className="text-xs text-muted-foreground">
                    Apply Duckworth-Lewis-Stern method for rain-affected matches
                  </p>
                </div>
                <Switch
                  id="dls-method"
                  checked={matchRules.dlsMethod}
                  onCheckedChange={(checked) => setMatchRules({ ...matchRules, dlsMethod: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="super-over" className="text-sm font-medium">Super Over for Ties</Label>
                  <p className="text-xs text-muted-foreground">
                    Use a super over to determine the winner in case of a tie
                  </p>
                </div>
                <Switch
                  id="super-over"
                  checked={matchRules.superOver}
                  onCheckedChange={(checked) => setMatchRules({ ...matchRules, superOver: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="lbw-rule" className="text-sm font-medium">LBW Rule</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable Leg Before Wicket dismissals in matches
                  </p>
                </div>
                <Switch
                  id="lbw-rule"
                  checked={matchRules.lbwRule}
                  onCheckedChange={(checked) => setMatchRules({ ...matchRules, lbwRule: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="mankading" className="text-sm font-medium">Mankading Allowed</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow running out the non-striker at the bowler&apos;s end before delivery
                  </p>
                </div>
                <Switch
                  id="mankading"
                  checked={matchRules.mankading}
                  onCheckedChange={(checked) => setMatchRules({ ...matchRules, mankading: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prizes Tab */}
        <TabsContent value="prizes" className="space-y-6 mt-6">
          {/* Prize Distribution */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Prize Distribution</CardTitle>
              <CardDescription>Configure the prize pool and individual awards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="total-pool">Total Prize Pool</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                      ₹
                    </span>
                    <Input
                      id="total-pool"
                      value={prizes.totalPrizePool}
                      onChange={(e) => setPrizes({ ...prizes, totalPrizePool: e.target.value })}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="winner">Winner Prize</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                      ₹
                    </span>
                    <Input
                      id="winner"
                      value={prizes.winnerPrize}
                      onChange={(e) => setPrizes({ ...prizes, winnerPrize: e.target.value })}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="runner-up">Runner-up Prize</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                      ₹
                    </span>
                    <Input
                      id="runner-up"
                      value={prizes.runnerUpPrize}
                      onChange={(e) => setPrizes({ ...prizes, runnerUpPrize: e.target.value })}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mot">Man of the Tournament</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                      ₹
                    </span>
                    <Input
                      id="mot"
                      value={prizes.manOfTournament}
                      onChange={(e) => setPrizes({ ...prizes, manOfTournament: e.target.value })}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="best-batsman">Best Batsman Award</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                      ₹
                    </span>
                    <Input
                      id="best-batsman"
                      value={prizes.bestBatsman}
                      onChange={(e) => setPrizes({ ...prizes, bestBatsman: e.target.value })}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="best-bowler">Best Bowler Award</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                      ₹
                    </span>
                    <Input
                      id="best-bowler"
                      value={prizes.bestBowler}
                      onChange={(e) => setPrizes({ ...prizes, bestBowler: e.target.value })}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display" className="space-y-6 mt-6">
          {/* Appearance */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Appearance</CardTitle>
              <CardDescription>Control what features are visible to visitors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="live-score" className="text-sm font-medium">Show Live Score on Homepage</Label>
                  <p className="text-xs text-muted-foreground">
                    Display current live match score on the homepage
                  </p>
                </div>
                <Switch
                  id="live-score"
                  checked={displaySettings.liveScoreHomepage}
                  onCheckedChange={(checked) => setDisplaySettings({ ...displaySettings, liveScoreHomepage: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-gallery" className="text-sm font-medium">Enable Gallery</Label>
                  <p className="text-xs text-muted-foreground">
                    Show the photo gallery section on the website
                  </p>
                </div>
                <Switch
                  id="enable-gallery"
                  checked={displaySettings.enableGallery}
                  onCheckedChange={(checked) => setDisplaySettings({ ...displaySettings, enableGallery: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-stats" className="text-sm font-medium">Show Player Stats</Label>
                  <p className="text-xs text-muted-foreground">
                    Display player statistics and leaderboards
                  </p>
                </div>
                <Switch
                  id="show-stats"
                  checked={displaySettings.showPlayerStats}
                  onCheckedChange={(checked) => setDisplaySettings({ ...displaySettings, showPlayerStats: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme-toggle" className="text-sm font-medium">Enable Dark/Light Theme Toggle</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow visitors to switch between dark and light themes
                  </p>
                </div>
                <Switch
                  id="theme-toggle"
                  checked={displaySettings.darkLightTheme}
                  onCheckedChange={(checked) => setDisplaySettings({ ...displaySettings, darkLightTheme: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Notifications</CardTitle>
              <CardDescription>Configure which notifications are sent to users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="match-notification" className="text-sm font-medium">Match Start Notification</Label>
                  <p className="text-xs text-muted-foreground">
                    Send notifications when a match is about to begin
                  </p>
                </div>
                <Switch
                  id="match-notification"
                  checked={displaySettings.matchStartNotification}
                  onCheckedChange={(checked) => setDisplaySettings({ ...displaySettings, matchStartNotification: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="result-notification" className="text-sm font-medium">Result Announcement</Label>
                  <p className="text-xs text-muted-foreground">
                    Notify users when a match result is announced
                  </p>
                </div>
                <Switch
                  id="result-notification"
                  checked={displaySettings.resultAnnouncement}
                  onCheckedChange={(checked) => setDisplaySettings({ ...displaySettings, resultAnnouncement: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="photo-notification" className="text-sm font-medium">New Photo Upload Alert</Label>
                  <p className="text-xs text-muted-foreground">
                    Alert users when new photos are uploaded to the gallery
                  </p>
                </div>
                <Switch
                  id="photo-notification"
                  checked={displaySettings.newPhotoUploadAlert}
                  onCheckedChange={(checked) => setDisplaySettings({ ...displaySettings, newPhotoUploadAlert: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
