"use client";

import { useState } from "react";
import { tournamentInfo } from "@/lib/cricket-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Settings2, Gamepad2, Trophy, Monitor } from "lucide-react";

export default function SettingsPage() {
  // General Tab State
  const [generalForm, setGeneralForm] = useState({
    tournamentName: tournamentInfo.name,
    season: "4",
    format: "T8",
    startDate: "15 Jan 2025",
    endDate: "15 Feb 2025",
    venueName: "Shivaji Park",
    city: tournamentInfo.city,
    state: tournamentInfo.state,
    groundsAvailable: "2",
    organizationName: "Mumbai Gully Cricket Association",
    contactEmail: "info@gcpl-mumbai.com",
    contactPhone: "+91 98765 43210",
    website: "https://gcpl-mumbai.com",
  });

  // Match Rules State
  const [matchRules, setMatchRules] = useState({
    oversPerInnings: "8",
    maxPlayersPerTeam: "11",
    wideBallRule: "1 run",
    noBallRule: "free hit",
    powerplayOvers: "2",
    dlsMethod: true,
    superOver: true,
    lbwRule: true,
    mankading: false,
  });

  // Prizes State
  const [prizes, setPrizes] = useState({
    totalPrizePool: "₹50,000",
    winnerPrize: "₹25,000",
    runnerUpPrize: "₹12,000",
    bestBatsman: "₹3,000",
    bestBowler: "₹3,000",
    manOfTournament: "₹5,000",
  });

  // Display State
  const [displaySettings, setDisplaySettings] = useState({
    liveScoreHomepage: true,
    enableGallery: true,
    showPlayerStats: true,
    darkLightTheme: true,
    matchStartNotification: true,
    resultAnnouncement: true,
    newPhotoUploadAlert: false,
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          <p className="text-sm text-muted-foreground">Configure tournament settings and preferences</p>
        </div>
        <Button className="gap-2">
          <Save className="w-4 h-4" />
          Save Changes
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
