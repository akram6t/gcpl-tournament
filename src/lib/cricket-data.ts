// ============ Interfaces ============

export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  colorLight: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  nrr: string;
  matchesPlayed: number;
  captain: string;
  logo: string;
}

export interface Player {
  id: string;
  name: string;
  team: string;
  teamShort: string;
  teamColor: string;
  role: string;
  matches: number;
  runs: number;
  wickets: number;
  avg: string;
  sr: string;
  bestBatting: string;
  bestBowling: string;
  isCaptain?: boolean;
}

export interface Fixture {
  id: string;
  matchNumber: number;
  team1: string;
  team1Short: string;
  team1Color: string;
  team2: string;
  team2Short: string;
  team2Color: string;
  date: string;
  time: string;
  venue: string;
  status: "completed" | "live" | "upcoming";
  score?: string;
  result?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  imageUrl?: string;
}

export interface TournamentRole {
  id: string;
  name: string;
  icon: string;
  description: string;
  responsibilities: string[];
  color: string;
}

// ============ Static Data (no API equivalent) ============

export const tournamentInfo = {
  name: "Gully Cricket Premier League",
  shortName: "GCPL",
  season: "Season 4",
  tagline: "Where Legends Are Made on the Streets",
  totalTeams: 8,
  totalMatches: 28,
  totalPlayers: 88,
  startDate: "15 Jan 2025",
  endDate: "15 Feb 2025",
  currentMatch: "Match 18",
  venue: "Shivaji Park, Dadar",
  city: "Mumbai",
  state: "Maharashtra",
  prizePool: "₹50,000",
  format: "T8 - 8 Over Matches",
  organizer: "Mumbai Gully Cricket Association",
};

export const tournamentRoles: TournamentRole[] = [
  {
    id: "1",
    name: "Tournament Organizer",
    icon: "crown",
    description: "The mastermind behind the tournament. Handles scheduling, venue booking, dispute resolution, and overall management.",
    responsibilities: [
      "Schedule & manage all matches",
      "Book venues & arrange equipment",
      "Handle disputes & rule enforcement",
      "Manage prize distribution",
      "Coordinate with sponsors",
    ],
    color: "#eab308",
  },
  {
    id: "2",
    name: "Team Captain",
    icon: "shield",
    description: "Leads the team on and off the field. Responsible for team selection, strategy, and player motivation.",
    responsibilities: [
      "Select playing XI for each match",
      "Make bowling & batting changes",
      "Motivate & lead the team",
      "Represent team in toss",
      "Handle team communications",
    ],
    color: "#ef4444",
  },
  {
    id: "3",
    name: "Player",
    icon: "user",
    description: "The heart of gully cricket. Players bring their passion, skills, and love for the game to every match.",
    responsibilities: [
      "Give 100% on the field",
      "Maintain sportsmanship",
      "Follow tournament rules",
      "Support teammates",
      "Respect umpire decisions",
    ],
    color: "#22c55e",
  },
  {
    id: "4",
    name: "Umpire",
    icon: "eye",
    description: "The guardian of fair play. Makes crucial decisions and ensures the game is played in the right spirit.",
    responsibilities: [
      "Make fair & unbiased decisions",
      "Enforce tournament rules",
      "Count & verify deliveries",
      "Handle LBW & wide decisions",
      "Report any misconduct",
    ],
    color: "#f97316",
  },
  {
    id: "5",
    name: "Scorer",
    icon: "clipboard",
    description: "Keeps track of every ball, run, and wicket. The unsung hero who ensures accurate records.",
    responsibilities: [
      "Record ball-by-ball scores",
      "Track run rates & stats",
      "Calculate over counts",
      "Maintain scorecards",
      "Update digital scoreboard",
    ],
    color: "#06b6d4",
  },
  {
    id: "6",
    name: "Spectator / Fan",
    icon: "heart",
    description: "The energy of gully cricket! Fans bring the noise, the cheers, and the unforgettable atmosphere.",
    responsibilities: [
      "Cheer for your favorite team",
      "Maintain crowd discipline",
      "Respect all teams & players",
      "Share on social media",
      "Enjoy the gully cricket spirit!",
    ],
    color: "#ec4899",
  },
];

export const liveMatchData = {
  matchNumber: 18,
  team1: {
    name: "Andheri Avengers",
    short: "AA",
    color: "#22c55e",
    score: "45/2",
    overs: "4.2",
    runRate: "10.59",
  },
  team2: {
    name: "Worli Warriors",
    short: "WW",
    color: "#a855f7",
    score: "Yet to bat",
    overs: "0",
    runRate: "-",
  },
  batsmen: [
    { name: "Vikram Patel", runs: 22, balls: 15, fours: 3, sixes: 1, isOnStrike: true },
    { name: "Rajesh Naik", runs: 12, balls: 9, fours: 2, sixes: 0, isOnStrike: false },
  ],
  bowler: { name: "Deepak Singh", overs: "1.2", maidens: 0, runs: 18, wickets: 1, economy: "12.86" },
  lastOver: ["1", "4", "W", "0", "2", "6"],
  currentOver: ["1", ".", "4"],
  target: "83",
};

export const recentResults = [
  { team1: "Dadar Dynamos", team1Short: "DD", team2: "Thane Tigers", team2Short: "TT", result: "DD won by 46 runs", margin: "46 runs" },
  { team1: "Juhu Jaguars", team1Short: "JJ", team2: "Kurla Knights", team2Short: "KK", result: "KK won by 5 wickets", margin: "5 wickets" },
  { team1: "Bandra Blazers", team1Short: "BB", team2: "Thane Tigers", team2Short: "TT", result: "BB won by 49 runs", margin: "49 runs" },
  { team1: "Andheri Avengers", team1Short: "AA", team2: "Powai Panthers", team2Short: "PP", result: "AA won by 18 runs", margin: "18 runs" },
  { team1: "Dadar Dynamos", team1Short: "DD", team2: "Worli Warriors", team2Short: "WW", result: "DD won by 4 runs", margin: "4 runs" },
];

// ============ Static Data (kept for backward compatibility with admin pages) ============

/** @deprecated Use fetchTeams() for live data from API */
export const teams: Team[] = [
  {
    id: "1",
    name: "Dadar Dynamos",
    shortName: "DD",
    color: "#ef4444",
    colorLight: "#fecaca",
    wins: 5,
    losses: 1,
    draws: 0,
    points: 10,
    nrr: "+1.234",
    matchesPlayed: 6,
    captain: "Rahul Sharma",
    logo: "🔥",
  },
  {
    id: "2",
    name: "Andheri Avengers",
    shortName: "AA",
    color: "#22c55e",
    colorLight: "#bbf7d0",
    wins: 4,
    losses: 2,
    draws: 0,
    points: 8,
    nrr: "+0.856",
    matchesPlayed: 6,
    captain: "Vikram Patel",
    logo: "⚡",
  },
  {
    id: "3",
    name: "Bandra Blazers",
    shortName: "BB",
    color: "#f97316",
    colorLight: "#fed7aa",
    wins: 4,
    losses: 1,
    draws: 1,
    points: 9,
    nrr: "+0.762",
    matchesPlayed: 6,
    captain: "Arjun Deshmukh",
    logo: "🌟",
  },
  {
    id: "4",
    name: "Juhu Jaguars",
    shortName: "JJ",
    color: "#eab308",
    colorLight: "#fef08a",
    wins: 3,
    losses: 2,
    draws: 1,
    points: 7,
    nrr: "+0.445",
    matchesPlayed: 6,
    captain: "Sanjay Kumar",
    logo: "🐆",
  },
  {
    id: "5",
    name: "Worli Warriors",
    shortName: "WW",
    color: "#a855f7",
    colorLight: "#e9d5ff",
    wins: 3,
    losses: 3,
    draws: 0,
    points: 6,
    nrr: "-0.123",
    matchesPlayed: 6,
    captain: "Deepak Singh",
    logo: "⚔️",
  },
  {
    id: "6",
    name: "Powai Panthers",
    shortName: "PP",
    color: "#06b6d4",
    colorLight: "#cffafe",
    wins: 2,
    losses: 4,
    draws: 0,
    points: 4,
    nrr: "-0.567",
    matchesPlayed: 6,
    captain: "Amit Joshi",
    logo: "🐾",
  },
  {
    id: "7",
    name: "Thane Tigers",
    shortName: "TT",
    color: "#ec4899",
    colorLight: "#fbcfe8",
    wins: 1,
    losses: 5,
    draws: 0,
    points: 2,
    nrr: "-1.234",
    matchesPlayed: 6,
    captain: "Rajesh Verma",
    logo: "🐯",
  },
  {
    id: "8",
    name: "Kurla Knights",
    shortName: "KK",
    color: "#6366f1",
    colorLight: "#c7d2fe",
    wins: 1,
    losses: 5,
    draws: 0,
    points: 2,
    nrr: "-1.378",
    matchesPlayed: 6,
    captain: "Prakash Gupta",
    logo: "🛡️",
  },
];

/** @deprecated Use fetchFixtures() for live data from API */
export const fixtures: Fixture[] = [
  {
    id: "1",
    matchNumber: 1,
    team1: "Dadar Dynamos",
    team1Short: "DD",
    team1Color: "#ef4444",
    team2: "Andheri Avengers",
    team2Short: "AA",
    team2Color: "#22c55e",
    date: "15 Jan",
    time: "4:00 PM",
    venue: "Shivaji Park Ground A",
    status: "completed",
    score: "DD 78/3 (8 ov) vs AA 65/7 (8 ov)",
    result: "Dadar Dynamos won by 13 runs",
  },
  {
    id: "2",
    matchNumber: 2,
    team1: "Bandra Blazers",
    team1Short: "BB",
    team1Color: "#f97316",
    team2: "Juhu Jaguars",
    team2Short: "JJ",
    team2Color: "#eab308",
    date: "15 Jan",
    time: "6:00 PM",
    venue: "Shivaji Park Ground B",
    status: "completed",
    score: "BB 92/2 (8 ov) vs JJ 71/5 (8 ov)",
    result: "Bandra Blazers won by 21 runs",
  },
  {
    id: "3",
    matchNumber: 3,
    team1: "Worli Warriors",
    team1Short: "WW",
    team1Color: "#a855f7",
    team2: "Powai Panthers",
    team2Short: "PP",
    team2Color: "#06b6d4",
    date: "16 Jan",
    time: "4:00 PM",
    venue: "Shivaji Park Ground A",
    status: "completed",
    score: "WW 84/4 (8 ov) vs PP 82/5 (8 ov)",
    result: "Worli Warriors won by 2 runs",
  },
  {
    id: "4",
    matchNumber: 4,
    team1: "Thane Tigers",
    team1Short: "TT",
    team2Color: "#ec4899",
    team2: "Kurla Knights",
    team2Short: "KK",
    team2Color: "#6366f1",
    date: "16 Jan",
    time: "6:00 PM",
    venue: "Shivaji Park Ground B",
    status: "completed",
    score: "TT 56/8 (8 ov) vs KK 58/4 (7.2 ov)",
    result: "Kurla Knights won by 6 wickets",
  },
  {
    id: "5",
    matchNumber: 5,
    team1: "Dadar Dynamos",
    team1Short: "DD",
    team1Color: "#ef4444",
    team2: "Bandra Blazers",
    team2Short: "BB",
    team2Color: "#f97316",
    date: "18 Jan",
    time: "4:00 PM",
    venue: "Shivaji Park Ground A",
    status: "completed",
    score: "DD 88/2 (8 ov) vs BB 79/4 (8 ov)",
    result: "Dadar Dynamos won by 9 runs",
  },
  {
    id: "6",
    matchNumber: 6,
    team1: "Andheri Avengers",
    team1Short: "AA",
    team1Color: "#22c55e",
    team2: "Juhu Jaguars",
    team2Short: "JJ",
    team2Color: "#eab308",
    date: "18 Jan",
    time: "6:00 PM",
    venue: "Shivaji Park Ground B",
    status: "completed",
    score: "AA 95/1 (8 ov) vs JJ 68/6 (8 ov)",
    result: "Andheri Avengers won by 27 runs",
  },
  {
    id: "7",
    matchNumber: 7,
    team1: "Worli Warriors",
    team1Short: "WW",
    team1Color: "#a855f7",
    team2: "Thane Tigers",
    team2Short: "TT",
    team2Color: "#ec4899",
    date: "19 Jan",
    time: "4:00 PM",
    venue: "Shivaji Park Ground A",
    status: "completed",
    score: "WW 72/5 (8 ov) vs TT 58/9 (8 ov)",
    result: "Worli Warriors won by 14 runs",
  },
  {
    id: "8",
    matchNumber: 8,
    team1: "Powai Panthers",
    team1Short: "PP",
    team1Color: "#06b6d4",
    team2: "Kurla Knights",
    team2Short: "KK",
    team2Color: "#6366f1",
    date: "19 Jan",
    time: "6:00 PM",
    venue: "Shivaji Park Ground B",
    status: "completed",
    score: "PP 83/3 (8 ov) vs KK 81/6 (8 ov)",
    result: "Powai Panthers won by 2 runs",
  },
  {
    id: "9",
    matchNumber: 9,
    team1: "Dadar Dynamos",
    team1Short: "DD",
    team1Color: "#ef4444",
    team2: "Juhu Jaguars",
    team2Short: "JJ",
    team2Color: "#eab308",
    date: "22 Jan",
    time: "4:00 PM",
    venue: "Shivaji Park Ground A",
    status: "completed",
    score: "DD 91/2 (8 ov) vs JJ 76/4 (8 ov)",
    result: "Dadar Dynamos won by 15 runs",
  },
  {
    id: "10",
    matchNumber: 10,
    team1: "Bandra Blazers",
    team1Short: "BB",
    team1Color: "#f97316",
    team2: "Andheri Avengers",
    team2Short: "AA",
    team2Color: "#22c55e",
    date: "22 Jan",
    time: "6:00 PM",
    venue: "Shivaji Park Ground B",
    status: "completed",
    score: "BB 67/7 (8 ov) vs AA 69/3 (7.4 ov)",
    result: "Andheri Avengers won by 7 wickets",
  },
  {
    id: "11",
    matchNumber: 11,
    team1: "Worli Warriors",
    team1Short: "WW",
    team1Color: "#a855f7",
    team2: "Kurla Knights",
    team2Short: "KK",
    team2Color: "#6366f1",
    date: "23 Jan",
    time: "4:00 PM",
    venue: "Shivaji Park Ground A",
    status: "completed",
    score: "WW 86/3 (8 ov) vs KK 62/8 (8 ov)",
    result: "Worli Warriors won by 24 runs",
  },
  {
    id: "12",
    matchNumber: 12,
    team1: "Powai Panthers",
    team1Short: "PP",
    team1Color: "#06b6d4",
    team2: "Thane Tigers",
    team2Short: "TT",
    team2Color: "#ec4899",
    date: "23 Jan",
    time: "6:00 PM",
    venue: "Shivaji Park Ground B",
    status: "completed",
    score: "PP 71/5 (8 ov) vs TT 73/4 (7.5 ov)",
    result: "Thane Tigers won by 6 wickets",
  },
  {
    id: "13",
    matchNumber: 13,
    team1: "Dadar Dynamos",
    team1Short: "DD",
    team1Color: "#ef4444",
    team2: "Worli Warriors",
    team2Short: "WW",
    team2Color: "#a855f7",
    date: "25 Jan",
    time: "4:00 PM",
    venue: "Shivaji Park Ground A",
    status: "completed",
    score: "DD 82/4 (8 ov) vs WW 78/5 (8 ov)",
    result: "Dadar Dynamos won by 4 runs",
  },
  {
    id: "14",
    matchNumber: 14,
    team1: "Andheri Avengers",
    team1Short: "AA",
    team1Color: "#22c55e",
    team2: "Powai Panthers",
    team2Short: "PP",
    team2Color: "#06b6d4",
    date: "25 Jan",
    time: "6:00 PM",
    venue: "Shivaji Park Ground B",
    status: "completed",
    score: "AA 89/3 (8 ov) vs PP 71/6 (8 ov)",
    result: "Andheri Avengers won by 18 runs",
  },
  {
    id: "15",
    matchNumber: 15,
    team1: "Bandra Blazers",
    team1Short: "BB",
    team1Color: "#f97316",
    team2: "Thane Tigers",
    team2Short: "TT",
    team2Color: "#ec4899",
    date: "26 Jan",
    time: "4:00 PM",
    venue: "Shivaji Park Ground A",
    status: "completed",
    score: "BB 94/1 (8 ov) vs TT 45/10 (6.3 ov)",
    result: "Bandra Blazers won by 49 runs",
  },
  {
    id: "16",
    matchNumber: 16,
    team1: "Juhu Jaguars",
    team1Short: "JJ",
    team1Color: "#eab308",
    team2: "Kurla Knights",
    team2Short: "KK",
    team2Color: "#6366f1",
    date: "26 Jan",
    time: "6:00 PM",
    venue: "Shivaji Park Ground B",
    status: "completed",
    score: "JJ 77/4 (8 ov) vs KK 79/5 (7.8 ov)",
    result: "Kurla Knights won by 5 wickets",
  },
  {
    id: "17",
    matchNumber: 17,
    team1: "Dadar Dynamos",
    team1Short: "DD",
    team1Color: "#ef4444",
    team2: "Thane Tigers",
    team2Short: "TT",
    team2Color: "#ec4899",
    date: "28 Jan",
    time: "4:00 PM",
    venue: "Shivaji Park Ground A",
    status: "completed",
    score: "DD 98/1 (8 ov) vs TT 52/10 (5.4 ov)",
    result: "Dadar Dynamos won by 46 runs",
  },
  {
    id: "18",
    matchNumber: 18,
    team1: "Andheri Avengers",
    team1Short: "AA",
    team1Color: "#22c55e",
    team2: "Worli Warriors",
    team2Short: "WW",
    team2Color: "#a855f7",
    date: "1 Feb",
    time: "4:00 PM",
    venue: "Shivaji Park Ground A",
    status: "live",
    score: "AA 45/2 (4.2 ov) vs WW -",
  },
  {
    id: "19",
    matchNumber: 19,
    team1: "Bandra Blazers",
    team1Short: "BB",
    team1Color: "#f97316",
    team2: "Powai Panthers",
    team2Short: "PP",
    team2Color: "#06b6d4",
    date: "1 Feb",
    time: "6:00 PM",
    venue: "Shivaji Park Ground B",
    status: "upcoming",
  },
  {
    id: "20",
    matchNumber: 20,
    team1: "Juhu Jaguars",
    team1Short: "JJ",
    team1Color: "#eab308",
    team2: "Thane Tigers",
    team2Short: "TT",
    team2Color: "#ec4899",
    date: "2 Feb",
    time: "4:00 PM",
    venue: "Shivaji Park Ground A",
    status: "upcoming",
  },
  {
    id: "21",
    matchNumber: 21,
    team1: "Dadar Dynamos",
    team1Short: "DD",
    team1Color: "#ef4444",
    team2: "Powai Panthers",
    team2Short: "PP",
    team2Color: "#06b6d4",
    date: "5 Feb",
    time: "4:00 PM",
    venue: "Shivaji Park Ground A",
    status: "upcoming",
  },
  {
    id: "22",
    matchNumber: 22,
    team1: "Andheri Avengers",
    team1Short: "AA",
    team1Color: "#22c55e",
    team2: "Thane Tigers",
    team2Short: "TT",
    team2Color: "#ec4899",
    date: "5 Feb",
    time: "6:00 PM",
    venue: "Shivaji Park Ground B",
    status: "upcoming",
  },
  {
    id: "23",
    matchNumber: 23,
    team1: "Bandra Blazers",
    team1Short: "BB",
    team1Color: "#f97316",
    team2: "Worli Warriors",
    team2Short: "WW",
    team2Color: "#a855f7",
    date: "8 Feb",
    time: "4:00 PM",
    venue: "Shivaji Park Ground A",
    status: "upcoming",
  },
  {
    id: "24",
    matchNumber: 24,
    team1: "Juhu Jaguars",
    team1Short: "JJ",
    team1Color: "#eab308",
    team2: "Kurla Knights",
    team2Short: "KK",
    team2Color: "#6366f1",
    date: "8 Feb",
    time: "6:00 PM",
    venue: "Shivaji Park Ground B",
    status: "upcoming",
  },
];

/** @deprecated Use fetchPlayers() for live data from API */
export const topPlayers: Player[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    team: "Dadar Dynamos",
    teamShort: "DD",
    teamColor: "#ef4444",
    role: "Batsman",
    matches: 6,
    runs: 285,
    wickets: 2,
    avg: "57.00",
    sr: "178.12",
    bestBatting: "68*(32)",
    bestBowling: "1/12",
    isCaptain: true,
  },
  {
    id: "2",
    name: "Vikram Patel",
    team: "Andheri Avengers",
    teamShort: "AA",
    teamColor: "#22c55e",
    role: "All-Rounder",
    matches: 6,
    runs: 198,
    wickets: 12,
    avg: "39.60",
    sr: "156.25",
    bestBatting: "52*(28)",
    bestBowling: "3/8",
    isCaptain: true,
  },
  {
    id: "3",
    name: "Arjun Deshmukh",
    team: "Bandra Blazers",
    teamShort: "BB",
    teamColor: "#f97316",
    role: "Batsman",
    matches: 6,
    runs: 243,
    wickets: 0,
    avg: "48.60",
    sr: "165.06",
    bestBatting: "72*(30)",
    bestBowling: "-",
    isCaptain: true,
  },
  {
    id: "4",
    name: "Suresh Yadav",
    team: "Andheri Avengers",
    teamShort: "AA",
    teamColor: "#22c55e",
    role: "Bowler",
    matches: 6,
    runs: 45,
    wickets: 15,
    avg: "12.33",
    sr: "-",
    bestBatting: "18*(12)",
    bestBowling: "4/11",
  },
  {
    id: "5",
    name: "Ravi Kulkarni",
    team: "Dadar Dynamos",
    teamShort: "DD",
    teamColor: "#ef4444",
    role: "All-Rounder",
    matches: 6,
    runs: 156,
    wickets: 10,
    avg: "31.20",
    sr: "148.57",
    bestBatting: "45*(22)",
    bestBowling: "3/9",
  },
  {
    id: "6",
    name: "Sanjay Kumar",
    team: "Juhu Jaguars",
    teamShort: "JJ",
    teamColor: "#eab308",
    role: "Batsman",
    matches: 6,
    runs: 189,
    wickets: 1,
    avg: "37.80",
    sr: "152.42",
    bestBatting: "58*(28)",
    bestBowling: "1/15",
    isCaptain: true,
  },
  {
    id: "7",
    name: "Deepak Singh",
    team: "Worli Warriors",
    teamShort: "WW",
    teamColor: "#a855f7",
    role: "Bowler",
    matches: 6,
    runs: 34,
    wickets: 13,
    avg: "14.15",
    sr: "-",
    bestBatting: "15*(10)",
    bestBowling: "3/12",
    isCaptain: true,
  },
  {
    id: "8",
    name: "Amit Joshi",
    team: "Powai Panthers",
    teamShort: "PP",
    teamColor: "#06b6d4",
    role: "All-Rounder",
    matches: 6,
    runs: 134,
    wickets: 8,
    avg: "26.80",
    sr: "139.58",
    bestBatting: "41*(24)",
    bestBowling: "2/10",
    isCaptain: true,
  },
  {
    id: "9",
    name: "Manish Tiwari",
    team: "Bandra Blazers",
    teamShort: "BB",
    teamColor: "#f97316",
    role: "Bowler",
    matches: 6,
    runs: 22,
    wickets: 14,
    avg: "13.21",
    sr: "-",
    bestBatting: "12*(8)",
    bestBowling: "4/9",
  },
  {
    id: "10",
    name: "Karan Mehta",
    team: "Dadar Dynamos",
    teamShort: "DD",
    teamColor: "#ef4444",
    role: "Wicketkeeper",
    matches: 6,
    runs: 167,
    wickets: 0,
    avg: "33.40",
    sr: "161.16",
    bestBatting: "49*(26)",
    bestBowling: "-",
  },
];

/** @deprecated Use fetchGallery() for live data from API */
export const galleryImages: GalleryImage[] = [
  { id: "1", title: "Opening Ceremony - GCPL Season 4", category: "Events" },
  { id: "2", title: "Rahul Sharma's Century Celebration", category: "Highlights" },
  { id: "3", title: "Nail-Biting Finish - Match 3", category: "Highlights" },
  { id: "4", title: "Team Dadar Dynamos Group Photo", category: "Teams" },
  { id: "5", title: "Suresh Yadav's Hat-trick Ball", category: "Highlights" },
  { id: "6", title: "Shivaji Park - Match Day Vibes", category: "Venues" },
  { id: "7", title: "Andheri Avengers Victory Dance", category: "Celebrations" },
  { id: "8", title: "Crowd Cheering at Finals", category: "Fans" },
  { id: "9", title: "Umpire Making a Close LBW Decision", category: "Match Moments" },
  { id: "10", title: "Bandra Blazers Batting Practice", category: "Behind the Scenes" },
  { id: "11", title: "Man of the Match Presentation", category: "Events" },
  { id: "12", title: "Kids Playing at the Side Nets", category: "Fans" },
];

// ============ API Types (raw backend responses) ============

interface ApiTeam {
  id: string;
  name: string;
  shortName: string;
  color: string;
  colorLight: string;
  captain: string;
  logo: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  nrr: string;
  matchesPlayed: number;
  createdAt: string;
  updatedAt: string;
  _count?: { players: number };
}

interface ApiPlayer {
  id: string;
  name: string;
  team: string;
  teamShort: string;
  teamColor: string;
  teamId: string;
  role: string;
  matches: number;
  runs: number;
  wickets: number;
  avg: string | number;
  sr: string | number;
  bestBatting: string;
  bestBowling: string;
  isCaptain: boolean;
}

interface ApiFixture {
  id: string;
  matchNumber: number;
  team1: string;
  team1Short: string;
  team1Color: string;
  team2: string;
  team2Short: string;
  team2Color: string;
  date: string;
  time: string;
  venue: string;
  status: string;
  score?: string;
  result?: string;
}

interface ApiGalleryImage {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// ============ Fetcher Functions ============

export async function fetchTeams(): Promise<Team[]> {
  try {
    const res = await fetch("/api/teams");
    if (!res.ok) throw new Error("Failed to fetch teams");
    const data: ApiTeam[] = await res.json();
    return data.map((t) => ({
      id: t.id,
      name: t.name,
      shortName: t.shortName,
      color: t.color,
      colorLight: t.colorLight,
      captain: t.captain,
      logo: t.logo,
      wins: t.wins ?? 0,
      losses: t.losses ?? 0,
      draws: t.draws ?? 0,
      points: t.points ?? 0,
      nrr: t.nrr ?? "0.000",
      matchesPlayed: t.matchesPlayed ?? 0,
    }));
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
}

export async function fetchStandings(): Promise<Team[]> {
  try {
    const res = await fetch("/api/standings");
    if (!res.ok) throw new Error("Failed to fetch standings");
    const data: ApiTeam[] = await res.json();
    return data.map((t) => ({
      id: t.id,
      name: t.name,
      shortName: t.shortName,
      color: t.color,
      colorLight: t.colorLight,
      captain: t.captain,
      logo: t.logo,
      wins: t.wins ?? 0,
      losses: t.losses ?? 0,
      draws: t.draws ?? 0,
      points: t.points ?? 0,
      nrr: t.nrr ?? "0.000",
      matchesPlayed: t.matchesPlayed ?? 0,
    }));
  } catch (error) {
    console.error("Error fetching standings:", error);
    throw error;
  }
}

export async function fetchPlayers(role?: string): Promise<Player[]> {
  try {
    const params = new URLSearchParams();
    if (role && role !== "all") {
      // Map frontend role filter to API role values
      if (role === "batsmen") params.set("role", "Batsman");
      else if (role === "bowlers") params.set("role", "Bowler");
      else if (role === "allrounders") params.set("role", "All-Rounder");
    }
    const url = `/api/players${params.toString() ? `?${params.toString()}` : ""}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch players");
    const data: ApiPlayer[] = await res.json();
    return data.map((p) => ({
      id: p.id,
      name: p.name,
      team: p.team,
      teamShort: p.teamShort,
      teamColor: p.teamColor,
      role: p.role,
      matches: p.matches ?? 0,
      runs: p.runs ?? 0,
      wickets: p.wickets ?? 0,
      avg: p.avg != null ? String(p.avg) : "0.00",
      sr: p.sr != null ? String(p.sr) : "0.00",
      bestBatting: p.bestBatting ?? "-",
      bestBowling: p.bestBowling ?? "-",
      isCaptain: p.isCaptain ?? false,
    }));
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error;
  }
}

export async function fetchFixtures(status?: string): Promise<Fixture[]> {
  try {
    const params = new URLSearchParams();
    if (status && status !== "all") {
      // Map frontend status to API status
      params.set("status", status.toUpperCase());
    }
    const url = `/api/fixtures${params.toString() ? `?${params.toString()}` : ""}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch fixtures");
    const data: ApiFixture[] = await res.json();
    return data.map((f) => ({
      id: f.id,
      matchNumber: f.matchNumber,
      team1: f.team1,
      team1Short: f.team1Short,
      team1Color: f.team1Color,
      team2: f.team2,
      team2Short: f.team2Short,
      team2Color: f.team2Color,
      date: f.date,
      time: f.time,
      venue: f.venue,
      status: (f.status?.toLowerCase() as "completed" | "live" | "upcoming") ?? "upcoming",
      score: f.score ?? undefined,
      result: f.result ?? undefined,
    }));
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    throw error;
  }
}

export async function fetchGallery(): Promise<GalleryImage[]> {
  try {
    const res = await fetch("/api/gallery");
    if (!res.ok) throw new Error("Failed to fetch gallery");
    const data: ApiGalleryImage[] = await res.json();
    return data.map((g) => ({
      id: g.id,
      title: g.title,
      category: g.category,
      imageUrl: g.imageUrl ?? undefined,
    }));
  } catch (error) {
    console.error("Error fetching gallery:", error);
    throw error;
  }
}
