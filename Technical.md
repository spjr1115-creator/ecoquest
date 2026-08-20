EcoQuest — Technical Specification v1.0

Project: EcoQuest
Type: Full-stack web application
Primary Goal: Gamified environmental education for schools and colleges
Architecture: React + Firebase + Python AI services

1. Technology Stack
Frontend
React.js
Vite
JavaScript / JSX
Tailwind CSS
Recharts
React Router
Backend
Firebase Authentication
Cloud Firestore
Firebase Cloud Storage
Firebase Cloud Functions
Firebase Hosting
AI/ML
Python
FastAPI
scikit-learn
OpenCV
Pretrained computer-vision model where required
Development
Git
GitHub
VS Code
ESLint
Prettier
Testing
Jest
React Testing Library
Pytest
2. High-Level Architecture
                         ECOQUEST
                            │
                            ▼
                 ┌────────────────────┐
                 │ React + Vite       │
                 │ Tailwind CSS       │
                 └─────────┬──────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
      Firebase Services             AI Services
             │                           │
     ┌───────┼────────┐             FastAPI
     │       │        │                 │
     ▼       ▼        ▼          ┌──────┴──────┐
    Auth  Firestore Storage       ▼             ▼
     │       │        │     Recommendation   Computer
     │       │        │        Engine         Vision
     └───────┼────────┘
             ▼
      Cloud Functions
             │
      ┌──────┼──────────┐
      ▼      ▼          ▼
     XP    Impact    Leaderboard
   Engine  Engine      Engine
             │
             ▼
        Analytics
3. User Roles

The system must support four roles.

Student

Can:

View lessons
Take quizzes
View challenges
Submit activities
Earn XP
Earn badges
View leaderboard
View impact
Receive recommendations
Teacher

Can:

Create challenges
Assign challenges
Review submissions
Approve/reject submissions
View students
View class analytics
Institution Admin

Can:

Manage institution
Manage users
Manage teachers
View institution analytics
Create institution-wide campaigns
View leaderboards
Super Admin

For platform-level management.

Can:

Manage institutions
Manage global content
Manage categories
Manage system configuration
Monitor platform-level analytics
4. Authentication Architecture

Use Firebase Authentication.

Authentication flow
User
 ↓
Login/Register
 ↓
Firebase Authentication
 ↓
Get authenticated user
 ↓
Retrieve user profile from Firestore
 ↓
Determine role
 ↓
Load appropriate dashboard
Role-based routing
/student/*       → Student
/teacher/*       → Teacher
/admin/*         → Institution Admin
/superadmin/*    → Super Admin

A user must never be able to access another role's dashboard simply by changing the URL.

Authorization must also be enforced through Firestore Security Rules / Cloud Functions, not only frontend route guards.

5. Firestore Database Architecture

Proposed collections:

users
institutions
classes
challenges
lessons
quizzes
quizAttempts
submissions
badges
userBadges
leaderboards
impactRecords
notifications
campaigns
activityCategories
6. Users Collection
users/{userId}


{
  uid,
  name,
  email,
  role,
  institutionId,
  classId,
  profileImage,
  xp,
  level,
  streak,
  impactScore,
  createdAt,
  updatedAt
}
Important

Students must not be allowed to directly modify:

xp
level
impactScore
streak

These must be updated through trusted backend logic.

7. Institutions
institutions/{institutionId}


{
  name,
  location,
  type,
  logo,
  createdAt,
  adminIds[]
}

Possible types:

School
College
University
8. Classes
classes/{classId}


{
  institutionId,
  name,
  department,
  year,
  section,
  teacherIds[],
  createdAt
}
9. Challenges
challenges/{challengeId}


{
  title,
  description,
  category,
  difficulty,
  instructions,
  evidenceType,
  verificationMethod,
  xpReward,
  impactMetric,
  impactValue,
  deadline,
  createdBy,
  institutionId,
  status,
  createdAt
}
Difficulty
EASY
MEDIUM
HARD
Verification methods
PHOTO
QR
TEACHER
AI_ASSISTED
COMBINATION
10. Challenge Submission
submissions/{submissionId}


{
  userId,
  challengeId,
  institutionId,
  evidenceUrl,
  description,
  location,
  submittedAt,
  status,
  verificationMethod,
  verifiedBy,
  verifiedAt,
  aiConfidence
}
Status
PENDING
APPROVED
REJECTED
REVIEW_REQUIRED
11. Verification Architecture
Student
   │
   ▼
Submit Evidence
   │
   ▼
Cloud Storage
   │
   ▼
Submission Created
   │
   ▼
Verification
   │
   ├───────────────┐
   ▼               ▼
Manual           AI-assisted
Review           Verification
   │               │
   └───────┬───────┘
           ▼
       Decision
           │
     ┌─────┴─────┐
     ▼           ▼
 Approved      Rejected
     │
     ▼
Gamification Engine
12. Gamification Engine

The frontend must never directly award XP.

Instead:

Verified Submission
        ↓
Cloud Function
        ↓
Calculate Reward
        ↓
Update XP
        ↓
Check Level
        ↓
Check Badge
        ↓
Update Leaderboard
Example
Challenge XP = 100


Verified
    ↓
+100 XP
    ↓
Check badge requirements
    ↓
Update leaderboard

XP values should be configurable rather than hardcoded throughout the application.

13. Level System

Example:

Level 1 → 0–499 XP
Level 2 → 500–999 XP
Level 3 → 1000–1999 XP
...

The exact progression should eventually be configurable through system settings.

14. Badge System

Badges should have configurable requirements.

badges/{badgeId}


{
  name,
  description,
  icon,
  requirementType,
  requirementValue
}

Examples:

FIRST_CHALLENGE
RECYCLING_HERO
WATER_WARRIOR
ECO_CHAMPION
STREAK_MASTER
15. Leaderboard Architecture

We should support:

Student leaderboard
institution
    ↓
class
    ↓
students
Institution leaderboard
institution A
institution B
institution C
Ranking metrics
XP
Verified actions
Impact score

Do not calculate large leaderboards entirely on the client.

Use backend aggregation / optimized queries.

16. Environmental Impact Engine

This needs to be separate from the gamification engine.

Verified Activity
       ↓
Activity Category
       ↓
Impact Metric
       ↓
Impact Record
       ↓
Aggregate
       ↓
Student / Class / Institution

Example:

Activity:
E-waste collection


Category:
E-WASTE


Impact Metric:
Items collected

We should store the raw activity record rather than only a final score.

That allows us to change our calculation methodology later without losing historical data.

17. AI Architecture

AI should be a separate service.

React
  ↓
Firebase
  ↓
Cloud Function / API
  ↓
FastAPI
  ↓
Python
  ├── Recommendation Engine
  └── Computer Vision

This keeps AI logic separate from the main application.

18. Recommendation Engine
Initial version

Start with a rule-based recommendation engine.

Inputs:

Student:
- completed challenges
- categories
- difficulty
- quiz performance
- activity frequency

Output:

Recommended challenges
Later

Use:

Python + scikit-learn

to build a recommendation model.

Potential approach:

Student profile
      +
Activity history
      +
Performance
      ↓
Feature generation
      ↓
Recommendation model
      ↓
Rank challenges
      ↓
Top recommendations
19. Computer Vision

Computer vision should initially support only specific, well-defined activities.

Example:

Waste classification
Image
 ↓
OpenCV preprocessing
 ↓
Vision model
 ↓
Prediction
 ↓
Confidence score

Example response:

Prediction: Plastic
Confidence: 0.91

If confidence is below the defined threshold:

AI
 ↓
REVIEW_REQUIRED
 ↓
Teacher

AI should assist verification, not automatically determine truth for every activity.

20. AI API

FastAPI endpoints could eventually include:

POST /recommendations
POST /verify-image
GET  /health

Example:

POST /recommendations


Input:
{
  "userId": "...",
  "history": [...]
}


Output:
{
  "recommendations": [...]
}
21. Frontend Structure

Recommended structure:

src/
│
├── assets/
│
├── components/
│   ├── common/
│   ├── dashboard/
│   ├── challenges/
│   ├── gamification/
│   └── charts/
│
├── pages/
│   ├── auth/
│   ├── student/
│   ├── teacher/
│   ├── admin/
│   └── superadmin/
│
├── layouts/
│
├── hooks/
│
├── services/
│   ├── firebase/
│   ├── challenges/
│   ├── submissions/
│   └── analytics/
│
├── context/
│
├── utils/
│
├── routes/
│
└── App.jsx
22. Backend Structure

Firebase Functions:

functions/
│
├── auth/
├── challenges/
├── submissions/
├── gamification/
├── leaderboard/
├── impact/
├── notifications/
└── analytics/

Each module should have a clear responsibility.

23. Security Architecture
Authentication

Firebase Authentication.

Authorization

Role-based Firestore rules.

Sensitive operations

Use Cloud Functions.

Sensitive fields include:

XP
Impact Score
Badge ownership
Leaderboard position
Verification status

Students must not write directly to these fields.

24. Storage Architecture

Firebase Storage:

/users/{userId}/profile
/submissions/{userId}/{submissionId}
/lessons/{lessonId}
/challenges/{challengeId}

Storage rules should ensure users cannot access unauthorized private submissions.

25. Notification System

Future architecture:

Event
 ↓
Cloud Function
 ↓
Notification
 ↓
Firestore
 ↓
Frontend

Examples:

New challenge
Verification result
Badge unlocked
Leaderboard change
Recommended challenge
26. Analytics Architecture

Raw events should be stored first.

User Activity
      ↓
Firestore
      ↓
Cloud Functions
      ↓
Aggregated Metrics
      ↓
Dashboard
Student analytics
XP
Challenges
Streak
Impact
Teacher analytics
Class participation
Completion
Pending verification
Institution analytics
Participation
Verified actions
Impact
Trends
27. UI Route Structure
/
├── /login
├── /register
│
├── /student
│   ├── /dashboard
│   ├── /learn
│   ├── /challenges
│   ├── /challenges/:id
│   ├── /submit/:id
│   ├── /leaderboard
│   ├── /badges
│   ├── /impact
│   └── /profile
│
├── /teacher
│   ├── /dashboard
│   ├── /students
│   ├── /challenges
│   ├── /submissions
│   └── /analytics
│
└── /admin
    ├── /dashboard
    ├── /users
    ├── /challenges
    ├── /campaigns
    └── /analytics
28. Development Phases

This is very important.

We should not ask Claude to build everything in one shot.

Phase 1 — Foundation
React/Vite setup
Tailwind
Firebase
Authentication
Routing
Role system
Firestore structure
Phase 2 — Student MVP
Dashboard
Lessons
Quizzes
Challenges
Submission
Phase 3 — Teacher System
Teacher dashboard
Challenge creation
Submission review
Verification
Phase 4 — Gamification
XP
Levels
Badges
Streaks
Leaderboards
Phase 5 — Impact
Impact records
Impact calculation
Student impact dashboard
Institution analytics
Phase 6 — AI
Recommendation engine
FastAPI
Python
AI integration
Phase 7 — Computer Vision
Image processing
Selected activity verification
Confidence scoring
Manual fallback
Phase 8 — Production
Security audit
Testing
Performance
Responsive design
Deployment
29. MVP Definition

The MVP is considered complete when a student can:

Register
 ↓
Login
 ↓
Learn
 ↓
Take Quiz
 ↓
Choose Challenge
 ↓
Complete Activity
 ↓
Submit Evidence
 ↓
Teacher Approves
 ↓
Earn XP
 ↓
Earn Badge
 ↓
See Leaderboard
 ↓
See Impact

And a teacher can:

Login
 ↓
Create Challenge
 ↓
See Submissions
 ↓
Approve / Reject
 ↓
See Student Progress

We should not move to advanced AI until this complete loop works.

30. Definition of Done

A feature is not considered complete merely because its UI exists.

For example, Leaderboard is complete only when:

Data comes from Firestore.
Ranking is calculated correctly.
Unauthorized users cannot modify rankings.
It updates after verified activities.
Loading/error states work.
Mobile layout works.
Tests exist for the ranking logic.

This rule should apply throughout the project.

31. Important Engineering Principles
1. No fake functionality

Don't build buttons that appear to work but don't actually perform the operation.

2. No unnecessary complexity

Don't add technologies simply because they sound impressive.

3. Security first

Never trust frontend values for XP, impact, verification or roles.

4. Modular architecture

AI should be replaceable without rewriting the application.

5. MVP first

Build the core product before advanced AI.

6. Real data

Avoid hardcoded dashboard statistics once backend functionality exists.

7. Responsive by default

The student interface must work properly on mobile screens.

32. Claude Development Rules

When we hand this specification to Claude, give it these rules:

EcoQuest must be developed incrementally.

Do not implement the entire project in one response.

Do not invent major features.

Do not replace the specified technology stack without explaining why.

Do not create fake AI functionality.

Do not hardcode production data.

Do not put security-sensitive calculations in the frontend.

Use Firebase Security Rules and Cloud Functions for trusted operations.

Keep AI services isolated from the main application.

Before each development phase, explain the files that will be created or modified.

After implementation, provide testing instructions.

Do not proceed to the next phase until the current phase is functional.