import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Seeding GCPL database...");

  // Clean existing data
  await prisma.galleryImage.deleteMany();
  await prisma.fixture.deleteMany();
  await prisma.player.deleteMany();
  await prisma.team.deleteMany();
  await prisma.tournamentSetting.deleteMany();
  await prisma.user.deleteMany();

  // ============ USERS ============
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.create({
    data: { name: "GCPL Admin", email: "admin@gcpl.com", password: adminPassword, role: "ADMIN", phone: "+91 98765 43210" },
  });
  console.log(`✅ Admin user: admin@gcpl.com / admin123`);

  await prisma.user.create({
    data: { name: "Rahul Sharma", email: "rahul@gcpl.com", password: userPassword, role: "PLAYER", phone: "+91 98765 43211" },
  });

  await prisma.user.create({
    data: { name: "Vikram Patel", email: "vikram@gcpl.com", password: userPassword, role: "PLAYER", phone: "+91 98765 43212" },
  });

  await prisma.user.create({
    data: { name: "Cricket Fan", email: "fan@gcpl.com", password: userPassword, role: "SPECTATOR" },
  });

  const organizerPassword = await bcrypt.hash("org123", 10);
  await prisma.user.create({
    data: { name: "Organizer User", email: "organizer@gcpl.com", password: organizerPassword, role: "ORGANIZER", phone: "+91 98765 43213" },
  });

  // ============ TEAMS ============
  const teamsData = [
    { name: "Dadar Dynamos", shortName: "DD", color: "#ef4444", colorLight: "#fecaca", captain: "Rahul Sharma", logo: "🔥", wins: 5, losses: 1, draws: 0, points: 10, nrr: "+1.234", matchesPlayed: 6 },
    { name: "Andheri Avengers", shortName: "AA", color: "#22c55e", colorLight: "#bbf7d0", captain: "Vikram Patel", logo: "⚡", wins: 4, losses: 2, draws: 0, points: 8, nrr: "+0.856", matchesPlayed: 6 },
    { name: "Bandra Blazers", shortName: "BB", color: "#f97316", colorLight: "#fed7aa", captain: "Arjun Deshmukh", logo: "🌟", wins: 4, losses: 1, draws: 1, points: 9, nrr: "+0.762", matchesPlayed: 6 },
    { name: "Juhu Jaguars", shortName: "JJ", color: "#eab308", colorLight: "#fef08a", captain: "Sanjay Kumar", logo: "🐆", wins: 3, losses: 2, draws: 1, points: 7, nrr: "+0.445", matchesPlayed: 6 },
    { name: "Worli Warriors", shortName: "WW", color: "#a855f7", colorLight: "#e9d5ff", captain: "Deepak Singh", logo: "⚔️", wins: 3, losses: 3, draws: 0, points: 6, nrr: "-0.123", matchesPlayed: 6 },
    { name: "Powai Panthers", shortName: "PP", color: "#06b6d4", colorLight: "#cffafe", captain: "Amit Joshi", logo: "🐾", wins: 2, losses: 4, draws: 0, points: 4, nrr: "-0.567", matchesPlayed: 6 },
    { name: "Thane Tigers", shortName: "TT", color: "#ec4899", colorLight: "#fbcfe8", captain: "Rajesh Verma", logo: "🐯", wins: 1, losses: 5, draws: 0, points: 2, nrr: "-1.234", matchesPlayed: 6 },
    { name: "Kurla Knights", shortName: "KK", color: "#6366f1", colorLight: "#c7d2fe", captain: "Prakash Gupta", logo: "🛡️", wins: 1, losses: 5, draws: 0, points: 2, nrr: "-1.378", matchesPlayed: 6 },
  ];

  const createdTeams: Record<string, string> = {};
  for (const t of teamsData) {
    const team = await prisma.team.create({ data: t });
    createdTeams[t.shortName] = team.id;
    console.log(`✅ Team: ${t.name}`);
  }

  // ============ PLAYERS ============
  const playersData = [
    { name: "Rahul Sharma", teamShort: "DD", teamId: createdTeams.DD, role: "Batsman", matches: 6, runs: 285, wickets: 2, avg: "57.00", sr: "178.12", bestBatting: "68*(32)", bestBowling: "1/12", isCaptain: true },
    { name: "Vikram Patel", teamShort: "AA", teamId: createdTeams.AA, role: "All-Rounder", matches: 6, runs: 198, wickets: 12, avg: "39.60", sr: "156.25", bestBatting: "52*(28)", bestBowling: "3/8", isCaptain: true },
    { name: "Arjun Deshmukh", teamShort: "BB", teamId: createdTeams.BB, role: "Batsman", matches: 6, runs: 243, wickets: 0, avg: "48.60", sr: "165.06", bestBatting: "72*(30)", bestBowling: "-", isCaptain: true },
    { name: "Suresh Yadav", teamShort: "AA", teamId: createdTeams.AA, role: "Bowler", matches: 6, runs: 45, wickets: 15, avg: "12.33", sr: "-", bestBatting: "18*(12)", bestBowling: "4/11", isCaptain: false },
    { name: "Ravi Kulkarni", teamShort: "DD", teamId: createdTeams.DD, role: "All-Rounder", matches: 6, runs: 156, wickets: 10, avg: "31.20", sr: "148.57", bestBatting: "45*(22)", bestBowling: "3/9", isCaptain: false },
    { name: "Sanjay Kumar", teamShort: "JJ", teamId: createdTeams.JJ, role: "Batsman", matches: 6, runs: 189, wickets: 1, avg: "37.80", sr: "152.42", bestBatting: "58*(28)", bestBowling: "1/15", isCaptain: true },
    { name: "Deepak Singh", teamShort: "WW", teamId: createdTeams.WW, role: "Bowler", matches: 6, runs: 34, wickets: 13, avg: "14.15", sr: "-", bestBatting: "15*(10)", bestBowling: "3/12", isCaptain: true },
    { name: "Amit Joshi", teamShort: "PP", teamId: createdTeams.PP, role: "All-Rounder", matches: 6, runs: 134, wickets: 8, avg: "26.80", sr: "139.58", bestBatting: "41*(24)", bestBowling: "2/10", isCaptain: true },
    { name: "Manish Tiwari", teamShort: "BB", teamId: createdTeams.BB, role: "Bowler", matches: 6, runs: 22, wickets: 14, avg: "13.21", sr: "-", bestBatting: "12*(8)", bestBowling: "4/9", isCaptain: false },
    { name: "Karan Mehta", teamShort: "DD", teamId: createdTeams.DD, role: "Wicketkeeper", matches: 6, runs: 167, wickets: 0, avg: "33.40", sr: "161.16", bestBatting: "49*(26)", bestBowling: "-", isCaptain: false },
  ];

  for (const p of playersData) {
    const team = teamsData.find((t) => t.shortName === p.teamShort)!;
    await prisma.player.create({
      data: { ...p, teamColor: team.color },
    });
    console.log(`✅ Player: ${p.name}`);
  }

  // ============ FIXTURES ============
  const fixturesData = [
    { matchNumber: 1, team1Id: createdTeams.DD, team2Id: createdTeams.AA, date: "15 Jan", time: "4:00 PM", venue: "Shivaji Park Ground A", status: "COMPLETED", score: "DD 78/3 (8 ov) vs AA 65/7 (8 ov)", result: "Dadar Dynamos won by 13 runs" },
    { matchNumber: 2, team1Id: createdTeams.BB, team2Id: createdTeams.JJ, date: "15 Jan", time: "6:00 PM", venue: "Shivaji Park Ground B", status: "COMPLETED", score: "BB 92/2 (8 ov) vs JJ 71/5 (8 ov)", result: "Bandra Blazers won by 21 runs" },
    { matchNumber: 3, team1Id: createdTeams.WW, team2Id: createdTeams.PP, date: "16 Jan", time: "4:00 PM", venue: "Shivaji Park Ground A", status: "COMPLETED", score: "WW 84/4 (8 ov) vs PP 82/5 (8 ov)", result: "Worli Warriors won by 2 runs" },
    { matchNumber: 4, team1Id: createdTeams.TT, team2Id: createdTeams.KK, date: "16 Jan", time: "6:00 PM", venue: "Shivaji Park Ground B", status: "COMPLETED", score: "TT 56/8 (8 ov) vs KK 58/4 (7.2 ov)", result: "Kurla Knights won by 6 wickets" },
    { matchNumber: 5, team1Id: createdTeams.DD, team2Id: createdTeams.BB, date: "18 Jan", time: "4:00 PM", venue: "Shivaji Park Ground A", status: "COMPLETED", score: "DD 88/2 (8 ov) vs BB 79/4 (8 ov)", result: "Dadar Dynamos won by 9 runs" },
    { matchNumber: 6, team1Id: createdTeams.AA, team2Id: createdTeams.JJ, date: "18 Jan", time: "6:00 PM", venue: "Shivaji Park Ground B", status: "COMPLETED", score: "AA 95/1 (8 ov) vs JJ 68/6 (8 ov)", result: "Andheri Avengers won by 27 runs" },
    { matchNumber: 7, team1Id: createdTeams.WW, team2Id: createdTeams.TT, date: "19 Jan", time: "4:00 PM", venue: "Shivaji Park Ground A", status: "COMPLETED", score: "WW 72/5 (8 ov) vs TT 58/9 (8 ov)", result: "Worli Warriors won by 14 runs" },
    { matchNumber: 8, team1Id: createdTeams.PP, team2Id: createdTeams.KK, date: "19 Jan", time: "6:00 PM", venue: "Shivaji Park Ground B", status: "COMPLETED", score: "PP 83/3 (8 ov) vs KK 81/6 (8 ov)", result: "Powai Panthers won by 2 runs" },
    { matchNumber: 9, team1Id: createdTeams.DD, team2Id: createdTeams.JJ, date: "22 Jan", time: "4:00 PM", venue: "Shivaji Park Ground A", status: "COMPLETED", score: "DD 91/2 (8 ov) vs JJ 76/4 (8 ov)", result: "Dadar Dynamos won by 15 runs" },
    { matchNumber: 10, team1Id: createdTeams.BB, team2Id: createdTeams.AA, date: "22 Jan", time: "6:00 PM", venue: "Shivaji Park Ground B", status: "COMPLETED", score: "BB 67/7 (8 ov) vs AA 69/3 (7.4 ov)", result: "Andheri Avengers won by 7 wickets" },
    { matchNumber: 11, team1Id: createdTeams.WW, team2Id: createdTeams.KK, date: "23 Jan", time: "4:00 PM", venue: "Shivaji Park Ground A", status: "COMPLETED", score: "WW 86/3 (8 ov) vs KK 62/8 (8 ov)", result: "Worli Warriors won by 24 runs" },
    { matchNumber: 12, team1Id: createdTeams.PP, team2Id: createdTeams.TT, date: "23 Jan", time: "6:00 PM", venue: "Shivaji Park Ground B", status: "COMPLETED", score: "PP 71/5 (8 ov) vs TT 73/4 (7.5 ov)", result: "Thane Tigers won by 6 wickets" },
    { matchNumber: 13, team1Id: createdTeams.DD, team2Id: createdTeams.WW, date: "25 Jan", time: "4:00 PM", venue: "Shivaji Park Ground A", status: "COMPLETED", score: "DD 82/4 (8 ov) vs WW 78/5 (8 ov)", result: "Dadar Dynamos won by 4 runs" },
    { matchNumber: 14, team1Id: createdTeams.AA, team2Id: createdTeams.PP, date: "25 Jan", time: "6:00 PM", venue: "Shivaji Park Ground B", status: "COMPLETED", score: "AA 89/3 (8 ov) vs PP 71/6 (8 ov)", result: "Andheri Avengers won by 18 runs" },
    { matchNumber: 15, team1Id: createdTeams.BB, team2Id: createdTeams.TT, date: "26 Jan", time: "4:00 PM", venue: "Shivaji Park Ground A", status: "COMPLETED", score: "BB 94/1 (8 ov) vs TT 45/10 (6.3 ov)", result: "Bandra Blazers won by 49 runs" },
    { matchNumber: 16, team1Id: createdTeams.JJ, team2Id: createdTeams.KK, date: "26 Jan", time: "6:00 PM", venue: "Shivaji Park Ground B", status: "COMPLETED", score: "JJ 77/4 (8 ov) vs KK 79/5 (7.8 ov)", result: "Kurla Knights won by 5 wickets" },
    { matchNumber: 17, team1Id: createdTeams.DD, team2Id: createdTeams.TT, date: "28 Jan", time: "4:00 PM", venue: "Shivaji Park Ground A", status: "COMPLETED", score: "DD 98/1 (8 ov) vs TT 52/10 (5.4 ov)", result: "Dadar Dynamos won by 46 runs" },
    { matchNumber: 18, team1Id: createdTeams.AA, team2Id: createdTeams.WW, date: "1 Feb", time: "4:00 PM", venue: "Shivaji Park Ground A", status: "LIVE", score: "AA 45/2 (4.2 ov) vs WW -", result: null },
    { matchNumber: 19, team1Id: createdTeams.BB, team2Id: createdTeams.PP, date: "1 Feb", time: "6:00 PM", venue: "Shivaji Park Ground B", status: "UPCOMING" },
    { matchNumber: 20, team1Id: createdTeams.JJ, team2Id: createdTeams.TT, date: "2 Feb", time: "4:00 PM", venue: "Shivaji Park Ground A", status: "UPCOMING" },
    { matchNumber: 21, team1Id: createdTeams.DD, team2Id: createdTeams.PP, date: "5 Feb", time: "4:00 PM", venue: "Shivaji Park Ground A", status: "UPCOMING" },
    { matchNumber: 22, team1Id: createdTeams.AA, team2Id: createdTeams.TT, date: "5 Feb", time: "6:00 PM", venue: "Shivaji Park Ground B", status: "UPCOMING" },
    { matchNumber: 23, team1Id: createdTeams.BB, team2Id: createdTeams.WW, date: "8 Feb", time: "4:00 PM", venue: "Shivaji Park Ground A", status: "UPCOMING" },
    { matchNumber: 24, team1Id: createdTeams.JJ, team2Id: createdTeams.KK, date: "8 Feb", time: "6:00 PM", venue: "Shivaji Park Ground B", status: "UPCOMING" },
  ];

  for (const f of fixturesData) {
    await prisma.fixture.create({ data: f as any });
    console.log(`✅ Fixture: Match ${f.matchNumber}`);
  }

  // ============ GALLERY ============
  const galleryData = [
    { title: "Opening Ceremony - GCPL Season 4", category: "Events" },
    { title: "Rahul Sharma's Century Celebration", category: "Highlights" },
    { title: "Nail-Biting Finish - Match 3", category: "Highlights" },
    { title: "Team Dadar Dynamos Group Photo", category: "Teams" },
    { title: "Suresh Yadav's Hat-trick Ball", category: "Highlights" },
    { title: "Shivaji Park - Match Day Vibes", category: "Venues" },
    { title: "Andheri Avengers Victory Dance", category: "Celebrations" },
    { title: "Crowd Cheering at Finals", category: "Fans" },
    { title: "Umpire Making a Close LBW Decision", category: "Match Moments" },
    { title: "Bandra Blazers Batting Practice", category: "Behind the Scenes" },
    { title: "Man of the Match Presentation", category: "Events" },
    { title: "Kids Playing at the Side Nets", category: "Fans" },
  ];

  for (const g of galleryData) {
    await prisma.galleryImage.create({ data: g });
    console.log(`✅ Gallery: ${g.title}`);
  }

  // ============ SETTINGS ============
  const settingsData = [
    { key: "tournamentName", value: "Gully Cricket Premier League" },
    { key: "shortName", value: "GCPL" },
    { key: "season", value: "4" },
    { key: "format", value: "T8" },
    { key: "oversPerInnings", value: "8" },
    { key: "venue", value: "Shivaji Park, Dadar" },
    { key: "city", value: "Mumbai" },
    { key: "state", value: "Maharashtra" },
    { key: "prizePool", value: "₹50,000" },
    { key: "organizer", value: "Mumbai Gully Cricket Association" },
    { key: "maxPlayersPerTeam", value: "11" },
    { key: "wideBallRuns", value: "1" },
    { key: "noBallFreeHit", value: "true" },
    { key: "powerplayOvers", value: "2" },
    { key: "superOver", value: "true" },
    { key: "lbwRule", value: "false" },
    { key: "winnerPrize", value: "₹25,000" },
    { key: "runnerUpPrize", value: "₹15,000" },
    { key: "bestBatsmanPrize", value: "₹3,000" },
    { key: "bestBowlerPrize", value: "₹3,000" },
    { key: "motPrize", value: "₹4,000" },
  ];

  for (const s of settingsData) {
    await prisma.tournamentSetting.create({ data: s });
  }

  console.log("\n🎉 Seeding complete!");
  console.log("\n📋 Login Credentials:");
  console.log("   Admin:     admin@gcpl.com / admin123");
  console.log("   Organizer: organizer@gcpl.com / org123");
  console.log("   Player:    rahul@gcpl.com / user123");
  console.log("   Spectator: fan@gcpl.com / user123");
}

seed()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
