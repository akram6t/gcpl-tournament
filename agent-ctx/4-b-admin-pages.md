# Task 4-b: Admin Pages (Standings, Gallery, Settings)

## Summary
Created 3 admin pages for the GCPL tournament app. All pages are UI-only (no backend), fully responsive, and use shadcn/ui components with proper theme support.

## Files Created

### 1. `/src/app/admin/standings/page.tsx` - Points Table / Standings Management
- **Header**: "Points Table" with Export CSV and Reset Standings buttons
- **Info Alert**: Green-styled alert about Top 4 qualifying for Semi-Finals
- **Stats Cards**: 4 cards - Matches Played (17/28), Remaining (11), Leader (DD), Closest Race
- **Desktop Table**: Full points table with columns: Pos (trophy/medal icons), Team (avatar + name + captain), M, W, L, D, NRR (color-coded green/red), Pts, Form (5 colored dots), Edit action
- **Mobile Cards**: Responsive card layout for each team with same data
- **Qualification Zone**: Top 4 rows have green left border/tint, bottom 4 have red tint
- **Form Dots**: Green=Win, Red=Loss, Amber=Draw, Gray=Not Played
- **Legend**: Color-coded qualification and form legend below table
- **Edit Dialog**: Dialog for manually editing NRR and Points

### 2. `/src/app/admin/gallery/page.tsx` - Gallery Management
- **Header**: "Gallery Management" with Upload Photos button
- **Stats Cards**: Total Photos (12), Categories (7), Latest Upload (28 Jan 2025)
- **Category Filter**: Button badges for All, Events, Highlights, Teams, Venues, Celebrations, Fans, Match Moments, Behind the Scenes with count badges
- **View Toggle**: Grid/List toggle buttons
- **Grid View**: 3-column responsive grid (1/2/3 cols) with gradient placeholders, hover effects showing Edit/Delete buttons, category badges
- **List View**: Compact table with thumbnail, title, category, date, actions
- **Upload Dialog**: Form with Title, Category (Select), dashed file upload area
- **Edit Dialog**: Update title and category
- **Delete Dialog**: AlertDialog confirmation with destructive action button
- **Empty State**: Shown when no photos match filter

### 3. `/src/app/admin/settings/page.tsx` - Settings
- **Header**: "Settings" with Save Changes button
- **4 Tabs**: General, Match Rules, Prizes, Display
- **General Tab**: 3 cards - Tournament Info (name, season, format select T6-T20, dates), Venue Details (name, city, state, grounds), Organizer Info (org name, email, phone, website)
- **Match Rules Tab**: 2 cards - Match Format (overs, max players, powerplay, wide/no-ball rules), Tournament Rules (DLS, Super Over, LBW, Mankading - all with Switch toggles)
- **Prizes Tab**: Prize Distribution card with ₹-prefixed inputs in 2-column grid (total pool, winner, runner-up, MOT, best batsman, best bowler)
- **Display Tab**: 2 cards - Appearance (4 Switch toggles), Notifications (3 Switch toggles)
- All fields pre-filled with tournament data from `tournamentInfo`

## Technical Notes
- All pages use `"use client"` directive
- Proper theme support with `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border`, `dark:` prefixes
- No indigo/blue colors used
- Lint passed with no errors
- Dev server shows no compilation errors
