Figma Make Prompt — Extempore Olympiad Platform

🎨 Design System (Match CREST Olympiads Style)
Design Language: Clean, academic olympiad platform
Primary Color: #1B6B8A (teal-blue, matching CREST header)
Secondary Color: #2563EB (action blue for buttons)
Accent: #F97316 (orange for highlights/CTA)
Background: #F8FAFC (light gray-white)
Card Background: #FFFFFF
Text Primary: #1E293B
Text Secondary: #475569
Border Radius: 8px on cards, 6px on buttons, 4px on inputs
Font: Inter or Poppins (clean, academic feel)
Nav Style: Two-tier — top white nav with logo + main links,
           second teal bar with sub-navigation (like CREST)
Shadow: box-shadow: 0 2px 8px rgba(0,0,0,0.08)

📐 Page 1 — Instructional Page (Entry Screen)
Layout: Centered card, max-width 480px, vertically centered on page

TOP NAV (match CREST style):
- Logo top-left: "EO" monogram + "Extempore Olympiad" text in teal
- Top bar: white background, links: Olympiads | FAQs | Student Connect
- Second bar: teal (#1B6B8A), links: Account | Book Slot/Take Exam |
  Performance | Free Trial
- Right side: Subscribe button (orange) + Logout button (outlined)

MAIN CARD:
- White card, 8px radius, subtle shadow
- Header banner inside card: teal background, white text
  "Olympiad Instructions"
- Body (left-aligned list, 14px Inter):
  • 3 Rounds Total
  • Round 1: 30s Prep / 60s Speak / 20 Marks
  • Round 2: 45s Prep / 60s Speak / 30 Marks  
  • Round 3: 60s Prep / 60s Speak / 50 Marks
  • Timer runs in background — focus on speaking!
- Grade selector dropdown below list:
  Label: "Select Your Grade"
  Dropdown: Nursery | KG | Class 1 ... Class 10
  Style: bordered input, teal focus ring
- PRIMARY BUTTON full-width at bottom:
  "Start Olympiad"
  Color: #1B6B8A fill, white text, hover darkens 10%
  Height: 48px, bold 16px

📐 Page 2 — Round Prep Screen (Round 1 shown)
Layout: Centered card, max-width 520px

CARD HEADER:
- Left badge: "Round 1 of 3" pill — teal background, white text
- Right badge: "20 Marks" pill — orange background, white text
- Below badges: "Warm-Up Round" subtitle in gray

TIMER SECTION (background timer — styled but NOT counting down visibly):
- Clock icon + "1:59  (prep)" in large bold text (#1E293B)
- Subtext in gray: "Take your time to prepare"
- NOTE: Timer is decorative only — does not display countdown to user

TOPIC CARD (inside the main card):
- Light teal background (#E0F2FE), 6px radius, padding 20px
- Label above: "Round 1 — Topic" in teal, 13px uppercase tracking
- Topic text: "e.g. How I became President of America for 1 day."
  Font: 18px medium, dark text, centered

BUTTON:
- "I am Ready (skip prep)" 
- Style: dark gray fill (#374151), white text, 44px height
- Full width, centered, margin-top 24px
- Subtext below button: "or wait for prep time to complete"

📐 Page 3 — Recording Screen (Round 1 Active)
Layout: Same centered card, 520px

CARD HEADER:
- "Round 1 of 3" badge (teal) + "🔴 Recording" badge (red, pulsing dot animation)

TIMER ROW:
- Clock icon + "1:59 (Recording)" in red/coral color
- Microphone icon on the right (#1B6B8A teal)

WAVEFORM:
- Audio waveform visualization bar
- Animated bars in teal (#1B6B8A), varying heights
- Width: full card width, height: 48px
- Background: #F1F5F9

TOPIC REMINDER (same teal card as prep screen):
- "Round 1 — Topic" label
- Topic text repeated: "e.g. How I became President of America for 1 day."

FINISH BUTTON:
- "Finish Round 1"
- Style: #1B6B8A fill, white text, bold, 48px height, full width
- Corner radius 6px
- Hover: darken 8%

📐 Page 4 — Rest Screen (Between Rounds)
Layout: Centered card, 480px

ICON: Large checkmark circle in green (#22C55E), 64px, centered

HEADING: "Round 1 Complete!" — 22px bold, centered
SUBTEXT: "Uploading your recording..." — gray, 14px

PROGRESS BAR:
- Full width, teal fill (#1B6B8A), 8px height, rounded
- Animated fill from 0 → 100%
- Below: "Uploading... please wait"

DIVIDER LINE

BREAK TIMER:
- "⏱ Break: 2:00" — large, centered, gray text
- Subtext: "Round 2 begins automatically"

NEXT ROUND PREVIEW BOX:
- Light gray card (#F1F5F9), inside the main card
- "Coming Up: Round 2 — Creative Round" in teal
- "30 Marks  ·  45s Prep  ·  60s Speak" in small gray text

EARLY START BUTTON (appears after 60s):
- "Start Round 2 Early" — outlined teal button
- Disabled state until 60s elapsed (gray, not clickable)

📐 Page 5 — Post Round 3 / Submission Screen
Layout: Centered card, 480px

ICON: Spinning loader (CSS animation) — gray, 48px centered

HEADING: "Round 3 Complete" — 20px bold
SUBTEXT: "Submitting your responses..." — gray 14px

SUBMISSION CHECKLIST (3 rows):
Each row: checkmark icon (fills in as each uploads) + round name + status
- ✅ Round 1 — Warm Up         Uploaded
- ✅ Round 2 — Creative Round   Uploaded  
- ⏳ Round 3 — Challenge         Uploading...
Style: each row in white card, left green border when complete

BOTTOM TEXT (small, centered, gray):
"Do not close this tab until submission is complete"

📐 Page 6 — Result Page (Pending State)
Layout: Centered card, 520px

BANNER (teal, full width of card):
"Your submission is under review"

ICON: Hourglass or clock illustration, 56px, centered

HEADING: "Result Pending Approval" — 20px bold, centered
SUBTEXT: "Your teacher will review and approve your result.
          You'll be notified once it's available." — gray, 14px, centered

SESSION SUMMARY BOX (light gray card inside):
- Date: June 10, 2026
- Grade: Class 6
- Rounds completed: 3/3 ✓
- Status: Awaiting teacher approval

BOTTOM: 
- "Return to Dashboard" — outlined teal button
- Small text: "Results usually available within 24 hours"

📐 Page 7 — Result Page (Approved State)
Layout: Centered card, 560px, slight celebration feel

SCORE BANNER (teal gradient top section of card):
- "Your Score" label, 14px white
- "78 / 100" — 48px bold white
- "🥈 Silver Certificate" — 18px white with medal emoji
- Global Rank: "#342 of 4,891 in Class 6"

ROUND BREAKDOWN TABLE (inside card):
3 rows + header, clean table style
| Round       | Max  | Your Score | Feedback snippet     |
|-------------|------|------------|----------------------|
| Round 1     | 20   | 16         | "Good topic relevance..." |
| Round 2     | 30   | 24         | "Creative story!..."      |
| Round 3     | 50   | 38         | "All mystery words used!" |
Footer row: Total | 100 | 78 | —
Table style: alternating rows #F8FAFC / white, teal header

CRITERIA MINI BARS (5 bars, horizontal):
Label left (C1–C5), progress bar center (teal fill), score right
C1 Content         ████████░░  16/20
C2 Structure       ███████░░░  14/20
C3 Language        ████████░░  16/20
C4 Delivery        █████████░  18/20
C5 Originality     ███████░░░  14/20

BUTTONS ROW (two side by side):
- "📥 Download Certificate" — teal fill, white text
- "📊 View Detailed Feedback" — teal outlined

FOOTER TEXT:
"Reviewed and approved by: [Teacher Name] on [Date]"

📐 Page 8 — Admin / Judge Review Panel
Layout: Full-width dashboard (match CREST's two-nav layout)

SAME NAVIGATION as student-facing (two-tier teal/white nav)

SIDEBAR (240px, white, left):
- School name at top
- Menu items: Dashboard | Pending Reviews | Approved | Analytics | Settings
- Active state: teal left border + light teal background

MAIN CONTENT AREA:

STATS ROW (4 cards, flex row):
- Pending: 23 (orange)
- Approved: 41 (green)  
- Total Students: 64 (blue)
- Avg Score: 74.2 (teal)
Each card: white, shadow, 8px radius, 16px padding

STUDENT TABLE:
Header row: teal background, white text
Columns: Student Name | Grade | R1 | R2 | R3 | Total | Status | Action
Alternating rows: white / #F8FAFC
Action column: "Review" button (teal outlined, small) or "Approved ✓" (green badge)

FILTER BAR above table:
- Search input (left)
- Grade dropdown filter
- Status dropdown filter
- "Export CSV" button (right, outlined)

🔧 Component Specs
BUTTONS:
Primary:   bg #1B6B8A, white text, 6px radius, 44-48px height
Secondary: bg #F97316, white text (CTA/subscribe)
Outlined:  border #1B6B8A, teal text, transparent bg
Danger:    bg #DC2626, white text (flag/delete actions)
Disabled:  bg #CBD5E1, gray text

INPUTS:
Height: 44px, border: 1px solid #CBD5E1
Focus border: 2px solid #1B6B8A
Label: 12px uppercase, #475569, above input
Placeholder: #94A3B8

CARDS:
bg: white, border-radius: 8px
shadow: 0 2px 8px rgba(0,0,0,0.08)
padding: 24px

BADGES/PILLS:
Radius: 99px (fully rounded)
Padding: 4px 12px
Sizes: sm (12px), md (13px), lg (14px)

STATUS INDICATORS:
Pending:  bg #FEF3C7, text #92400E, dot #F59E0B
Approved: bg #DCFCE7, text #15803D, dot #22C55E
Recording: bg #FEE2E2, text #BE123C, dot red pulsing

NAVIGATION (match CREST exactly):
Top bar: white, height 64px, logo left, links center, buttons right
Second bar: #1B6B8A teal, height 44px, white text links, 
            active link: slightly darker teal underline

📱 Responsive Notes
Mobile (375px): Stack all two-column layouts, 
                full-width buttons, reduce card padding to 16px
Tablet (768px): Single column, cards max 560px centered
Desktop (1280px+): Full dashboard layout with sidebar
