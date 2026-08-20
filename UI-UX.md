ECOQUEST — UI/UX SPECIFICATION v1.0

Product: EcoQuest
Design Direction: Gamified Environmental Education + Modern Technology
Target: Schools and Colleges
Primary Users: Students, Teachers, Institution Administrators

1. Design Vision

EcoQuest should visually communicate:

Environment + Education + Technology + Gamification

The design should feel:

🌱 Eco-friendly
⚡ Modern
🎮 Gamified
🎓 Educational
🤖 Intelligent
📊 Data-driven
Professional

Avoid making it look like a generic green environmental website.

The visual identity should combine natural elements with modern technology.

2. Design Style
Primary style

Modern SaaS + Gamified EdTech

Think:

Clean cards
+
Soft gradients
+
Green/teal accents
+
Subtle glass effects
+
Charts
+
Progress indicators
+
Micro-interactions

Do not overuse glassmorphism.

The interface should remain readable and practical.

3. Color System
Primary

Eco Green

#16A34A

Used for:

Primary buttons
Success states
Environmental elements
Progress
Secondary

Emerald

#059669

Technology Accent

Teal

#0D9488

Dark

#0F172A

Used for:

Headings
Navigation
Important text
Background

#F8FAFC

Cards

#FFFFFF

Warning

#F59E0B

Error

#EF4444

Success

#22C55E

4. Typography

Use a modern sans-serif font.

Recommended:

Primary

Inter

Fallback:

system-ui, sans-serif
Typography hierarchy
H1 → 40–48px
H2 → 28–36px
H3 → 20–24px
Body → 14–16px
Small → 12–14px

On mobile, headings should scale down automatically.

5. Design Principles
Principle 1 — Visual hierarchy

Users should immediately understand:

What should I do next?

Principle 2 — Gamification should feel meaningful

Don't cover every screen with:

XP +100!

Use gamification strategically.

Principle 3 — Environmental identity

Use subtle:

Leaf icons
Circular growth indicators
Nature illustrations
Sustainability symbols

Avoid cartoonish environmental graphics.

Principle 4 — Data visualization

Impact should be visual, not just numbers.

Example:

         🌱
     72 Impact
       Score

with a progress ring.

6. Responsive Design

EcoQuest must work on:

Desktop

Primary target for:

Teacher
Admin
Institution dashboards
Tablet
Mobile

Primary target for:

Student challenge participation
Learning
Evidence submission
Leaderboard

Use responsive breakpoints.

Never create separate desktop/mobile applications.

7. Global Navigation
Student Navigation

Desktop:

┌──────────────────────────────────────────────┐
│ 🌱 EcoQuest │ Dashboard │ Learn │ Challenges │
│             │ Leaderboard │ Impact │ Profile │
└──────────────────────────────────────────────┘

Mobile:

Bottom navigation:

🏠 Home
📚 Learn
🎯 Challenges
🏆 Rank
👤 Profile
8. Landing Page

The landing page should immediately explain EcoQuest.

Hero
Heading

Turn Learning Into Environmental Action.

Subheading

Learn. Take challenges. Make an impact.

CTA

Start Your Eco Journey

Secondary:

Explore EcoQuest

Hero Visual

Use an interactive visual representing:

Learn
 ↓
Challenge
 ↓
Act
 ↓
Verify
 ↓
Impact

Could include subtle animated particles/leaves.

9. Landing Page Sections
Section 1

Hero

Section 2

How EcoQuest Works

Learn → Challenge → Act → Verify → Earn → Impact
Section 3

Why EcoQuest?

Three cards:

🌱 Learn
🎯 Act
📊 Measure

Section 4

Gamification

Show:

XP
Badges
Streaks
Leaderboards
Section 5

Environmental Impact

Show example analytics.

Section 6

For Institutions

Explain teacher/admin capabilities.

Section 7

CTA

Start Building a Greener Campus

10. Authentication UI

Pages:

/login
/register
/forgot-password
Login

Fields:

Email
Password

Buttons:

Login

Continue with Google — only if Google authentication is implemented.

11. Student Dashboard

This is the most important screen.

Top section
Good morning, Sujal 🌱


Level 7
████████████░░░ 720 / 1000 XP


🔥 7 Day Streak
Recommended Challenge

Large card:

┌─────────────────────────────────────┐
│ 🎯 RECOMMENDED FOR YOU              │
│                                     │
│ Water Warrior                       │
│ Reduce water wastage for 3 days.   │
│                                     │
│ +100 XP       Medium                │
│                                     │
│ [Start Challenge]                   │
└─────────────────────────────────────┘
12. Dashboard Statistics

Four cards:

XP

720

Challenges

18 Completed

Impact

64

Streak

7 Days 🔥

13. Progress Section

Use a chart showing:

Environmental activity over time

Example:

Impact
  │
  │          ╭──╮
  │      ╭───╯  │
  │  ╭───╯      ╰──
  └──────────────────
     Week 1 → Week 4
14. Challenge Page

Route:

/student/challenges

Filters
All
Waste
Water
Energy
Biodiversity
E-Waste
Climate
Easy
Medium
Hard
Challenge Card
┌────────────────────────────┐
│ ♻️ Waste Warrior           │
│                            │
│ Sort household waste      │
│ correctly for 3 days.     │
│                            │
│ 🟢 Easy    +50 XP         │
│                            │
│ [View Challenge]           │
└────────────────────────────┘
15. Challenge Details

Display:

Title
Category
Difficulty
Description
Objective
Instructions
Reward
Environmental Impact
Evidence Required
Deadline

CTA:

Start Challenge

16. Evidence Submission

Page:

/student/submit/:challengeId

Upload

Allow:

Camera/photo
File upload
Description

Explain what you completed.

Optional
Location
Timestamp
Submit

Submit for Verification

Show:

Your submission will be reviewed before rewards are issued.

17. Verification Status

Student should see:

Pending

🟡 Under Review

Approved

🟢 Verified!

+100 XP
🏆 Badge Progress
🌱 Impact +5
Rejected

🔴 Submission Not Verified

Provide:

Reason

and:

Try Again

18. Gamification UI
XP

Use progress bars.

Levels

Example:

LEVEL 7
████████████░░░
720 / 1000 XP
Badges

Display as a collection.

🏆 Recycling Hero
💧 Water Warrior
🌳 Green Starter
🔥 Streak Master

Locked badges should appear muted.

19. Leaderboard

Route:

/student/leaderboard

Tabs:

My Class | My Institution | Global

Each row:

🥇 1  Aarav       1240 XP
🥈 2  Sujal       1180 XP
🥉 3  Priya       1050 XP

Show:

Rank
Name
XP
Verified actions
Impact score
20. Impact Dashboard

This should be one of EcoQuest's most visually impressive screens.

Hero metric
        🌱
     IMPACT SCORE


        742

Then categories:

♻️ Waste       █████████░ 82
💧 Water       ███████░░░ 65
⚡ Energy      ██████░░░░ 54
🌳 Biodiversity████████░░ 76

Use Recharts for historical trends.

21. Teacher Dashboard

Teacher layout:

┌───────────────────────────────────────┐
│ Teacher Dashboard                     │
│                                       │
│ 124 Students   18 Challenges          │
│ 82 Pending     74% Participation      │
│                                       │
│ ───────── Activity Chart ─────────    │
│                                       │
│ Recent Submissions                    │
│                                       │
└───────────────────────────────────────┘
22. Teacher Challenge Creation

Form:

Challenge Name
Description
Category
Difficulty
XP Reward
Impact Metric
Evidence Type
Verification Method
Deadline

CTA:

Create Challenge

23. Submission Review

Teacher should see:

Student: Aarav
Challenge: Waste Warrior


[Evidence Image]


Description:
"Sorted waste into four categories."


AI Confidence:
91%


[Approve] [Reject] [Request Review]
24. Admin Dashboard

Admin gets an institution-wide overview.

Metrics
Total Students
Active Students
Teachers
Challenges
Verified Actions
Institution Impact Score
Charts
Monthly participation
Class comparison
Activity categories
Environmental impact
25. AI Recommendation UI

Don't expose technical AI details to students.

Instead:

Recommended for You

🌊 Water Warrior

Based on your recent activities, this challenge could be a good next step.

Start Challenge

The user shouldn't see:

“Our scikit-learn model calculated…”

Keep AI invisible and useful.

26. AI Verification UI

When applicable:

Analyzing your submission...


████████████░░ 87%


Possible match:
Plastic Waste


Confidence:
91%


✓ Sent for verification

If uncertain:

Our system couldn't confidently verify this submission. A teacher will review it.

This is much more trustworthy than pretending AI is always correct.

27. Notifications

Use a notification dropdown.

Examples:

🎉 You unlocked Recycling Hero!

🎯 New challenge recommended for you.

✅ Your submission was verified.

🏆 You moved to #3 on the leaderboard.

28. Empty States

Every major page needs an empty state.

Example:

No Challenges

🌱 Your next eco-adventure is coming soon.

Explore Learning

Don't leave blank white space.

29. Loading States

Use skeleton loaders rather than a generic spinner everywhere.

Example:

████████████
████████
████████████████
30. Error States

Example:

Something went wrong.

We couldn't load your challenges.

Try Again

Never show raw Firebase/API errors to users.

31. Animations

Use subtle animations.

Good:

Card hover
XP progress
Badge unlock
Page transitions
Number counters
Challenge completion

Avoid:

Excessive bouncing
Constant moving backgrounds
Distracting animations

The product should feel premium, not like a game website for children.

32. Accessibility

Must include:

Good color contrast
Keyboard navigation
Semantic HTML
Alt text
Visible focus states
Proper form labels
Responsive text

Do not use color alone to communicate status.

For example:

🟢 Verified
🟡 Pending
🔴 Rejected

33. Component System

Reusable components:

Button
Card
Modal
Badge
Avatar
ProgressBar
ProgressRing
StatCard
ChallengeCard
BadgeCard
LeaderboardRow
ChartCard
Navbar
Sidebar
BottomNav
Toast
Modal
FileUploader
VerificationStatus

Claude should build these as reusable components rather than duplicating HTML across pages.

34. Design Rule for Claude

This is important.

Add this instruction to the UI specification:

Do not create a generic dashboard template. EcoQuest must have a distinct visual identity based on sustainability + technology + gamification.

Also:

Do not overuse green. Green should be an accent and brand color, while neutral backgrounds maintain readability.

And:

Do not use emojis as the primary visual design language. Use a consistent icon library such as Lucide React for interface icons.

That last point is important if we want the final website to look professional.

35. Recommended Icon Library

Use:

Lucide React

for:

Dashboard
Book
Trophy
Target
Leaf
Bar chart
User
Settings
Bell
Upload
Check
Clock
36. Mobile Student Experience

The student experience should prioritize:

Home
 ↓
Recommended Challenge
 ↓
Start
 ↓
Complete
 ↓
Upload Evidence
 ↓
Verification
 ↓
Reward

A student should be able to complete a challenge from a phone without navigating through complicated menus.

37. Final UI Architecture
                         ECOQUEST
                            │
          ┌─────────────────┼─────────────────┐
          ↓                 ↓                 ↓
       STUDENT           TEACHER           ADMIN
          │                 │                 │
      Dashboard        Dashboard         Dashboard
          │                 │                 │
      ┌───┼───┐         ┌───┼───┐        ┌───┼───┐
      ↓   ↓   ↓         ↓   ↓   ↓        ↓   ↓   ↓
    Learn Challenge    Create Review    Users Analytics
          │             │
          ↓             ↓
      Evidence      Verification
          │
          ↓
       Rewards
          │
     ┌────┼────┐
     ↓    ↓    ↓
    XP  Badges Impact
     │    │     │
     └────┼─────┘
          ↓
      Leaderboard
38. UI/UX Definition of Done

A screen is not finished until:

Desktop works
Mobile works
Loading state exists
Error state exists
Empty state exists where applicable
Forms validate correctly
Accessibility basics are handled
Components are reusable
Real backend data is used
No placeholder lorem ipsum remains
No fake functionality is presented as real