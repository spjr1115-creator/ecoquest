ECOQUEST — Product Requirements Document

Product Name: EcoQuest
Team: Team Neer
Problem Statement: SIH25009 — Gamified Environmental Education Platform for Schools and Colleges
Theme: Smart Education
Category: Software

The SIH problem statement identifies SIH25009 as a software problem under Smart Education.

1. Product Overview
1.1 Product Vision

EcoQuest is a gamified environmental education platform that transforms traditional environmental learning into interactive, practical and measurable environmental action.

Instead of only teaching students about sustainability through textbooks and quizzes, EcoQuest allows students to:

Learn → Challenge → Act → Verify → Earn → Impact

Students learn environmental concepts, participate in challenges, complete real-world eco-friendly activities, submit evidence, earn XP and badges, and track their environmental contribution.

Educational institutions receive dashboards to monitor participation, conduct competitions and understand their students' environmental engagement.

2. Problem Statement

Environmental education often focuses on awareness and theoretical knowledge, but students may have limited opportunities to convert that knowledge into consistent real-world action.

EcoQuest aims to bridge this gap by connecting:

Environmental Education

↓

Gamified Challenges

↓

Real-World Actions

↓

Verification

↓

Measurable Impact

The SIH problem itself is specifically framed around a gamified environmental education platform for schools and colleges.

3. Product Goals
Primary Goals
Make environmental education engaging.
Encourage students to perform real-world environmental activities.
Reward meaningful participation through gamification.
Track environmental activity and participation.
Personalize challenges based on student behaviour.
Provide institutions with sustainability analytics.
Create measurable environmental impact from educational activities.
Secondary Goals
Encourage healthy competition between students.
Encourage class/department/campus competitions.
Build long-term sustainable habits.
Create a scalable platform that can support multiple institutions.
4. Target Users

EcoQuest will have three primary user types.

4.1 Students

The primary users.

Students can:

Learn environmental topics.
Complete quizzes.
Participate in challenges.
Complete real-world activities.
Submit evidence.
Earn XP.
Earn badges.
Maintain streaks.
Compete on leaderboards.
Track their environmental impact.
Receive personalized challenges.
4.2 Teachers / Faculty

Teachers act as activity coordinators and moderators.

They can:

Create or assign challenges.
Review student submissions.
Verify activities.
Monitor class participation.
View student progress.
Organize competitions.
Provide feedback.
4.3 Institution Administrators

Administrators manage the institution-level ecosystem.

They can:

Manage students and teachers.
Create institution-wide challenges.
View sustainability analytics.
Monitor participation.
Manage leaderboards.
Compare classes/departments.
Generate reports.
5. Core User Journey

The central EcoQuest experience is:

                    STUDENT
                       ↓
                  Learn Topic
                       ↓
                Receive Challenge
                       ↓
                 Learn / Play
                       ↓
                Perform Eco-Action
                       ↓
                 Submit Evidence
                       ↓
                  Verification
                       ↓
              ┌────────┴────────┐
              ↓                 ↓
           Approved           Rejected
              ↓
          Earn XP/Badge
              ↓
       Environmental Impact
              ↓
       Dashboard / Leaderboard
              ↓
       Personalized Next Challenge

This creates a continuous learning loop rather than a one-time quiz experience.

6. Core Features
6.1 Student Authentication

Students should be able to register/login using:

Email/password
Institution-provided account
Future: Google authentication
Requirements
Secure authentication
Role-based access
Student profile
Institution association
7. Environmental Learning Module

Students should have access to structured environmental learning content.

Categories

Examples:

Waste Management
Recycling
Water Conservation
Energy Conservation
Climate Change
Biodiversity
Sustainable Transportation
E-Waste
Plastic Pollution
Sustainable Consumption
Content Types
Short lessons
Infographics
Videos
Quizzes
Interactive questions
Scenario-based questions

The objective is to keep learning short and actionable rather than turning EcoQuest into another conventional LMS.

8. Gamification Engine

This is one of the core differentiators.

XP

Students earn XP for:

Completing lessons
Completing quizzes
Completing challenges
Verified environmental actions
Maintaining streaks
Participating in campaigns

Example:

Lesson completed        +10 XP
Quiz completed          +20 XP
Challenge completed     +50 XP
Verified eco-action     +100 XP
7-day streak            +50 XP

These values are examples only and should be configurable by administrators.

9. Badges

Students can unlock badges based on achievements.

Examples:

🌱 Green Starter

Complete first environmental challenge.

♻️ Recycling Hero

Complete multiple recycling activities.

💧 Water Warrior

Complete water conservation challenges.

🌳 Eco Champion

Reach a defined environmental-impact milestone.

🔥 Sustainability Streak

Maintain a long activity streak.

10. Leaderboards

Leaderboards create healthy competition.

Levels

Individual

Student vs student

Class

Class vs class

Department

Department vs department

Institution

Institution vs institution

Ranking Metrics

We should eventually support:

XP
Verified actions
Impact score
Challenge completion

Importantly, XP should not be the only ranking metric.

Otherwise students may optimize for points rather than actual environmental impact.

11. Eco-Challenge System

Challenges are the heart of the platform.

Each challenge should contain:

Challenge Title
Description
Category
Difficulty
Instructions
Expected Evidence
XP Reward
Impact Value
Verification Method
Deadline
Example

Challenge: Plastic-Free Day

Objective: Avoid single-use plastic for one day.

Category: Waste Management

Difficulty: Medium

Evidence: Photo / declaration / event verification

Reward: 100 XP

Impact Metric: Plastic-reduction activity

12. Verification System

This is one of the most important technical challenges.

We should not claim that AI can verify every environmental action.

Instead, EcoQuest should use multi-layer verification.

Verification Methods
Level 1 — Evidence Submission

Student submits:

Photo
Short description
Timestamp
Optional location
Level 2 — QR Verification

For institution-organized activities:

Student attends event
        ↓
Scans event QR
        ↓
System records participation
Level 3 — Teacher Verification

Teacher reviews the evidence and approves/rejects it.

Level 4 — AI Assistance

For selected activities, computer vision can assist in evaluating uploaded evidence.

Example:

Waste Segregation Challenge

Student photo
      ↓
Computer Vision
      ↓
Object / category recognition
      ↓
Verification assistance

AI should initially be used only for well-defined, visually verifiable activities.

13. AI Personalization Engine

This is where EcoQuest becomes more than a normal gamification platform.

The system can analyze:

Completed challenges
Quiz performance
Difficulty preferences
Activity frequency
Environmental interests
Previous successes/failures

Then recommend the next challenge.

Example

A student performs well in:

Waste Management

but rarely participates in:

Water Conservation

The recommendation engine could suggest:

Water Warrior Challenge — Reduce water wastage for 3 days.

Initial implementation

We can start with a rule-based recommendation engine.

Later we can upgrade it to machine learning as sufficient user data becomes available.

This is important because we should not pretend that a complex ML model is necessary from day one.

14. Computer Vision Module

This should be an advanced module rather than a requirement for every challenge.

Potential use cases:

Waste Classification
Image
 ↓
Computer Vision
 ↓
Plastic / Paper / Metal / Organic
Recycling Verification

Determine whether submitted evidence appears consistent with the selected challenge.

Planting Activities

Potentially assist with image-based evidence.

The system should return a confidence score, rather than blindly accepting every AI prediction.

Example:

AI Verification
Confidence: 91%
       ↓
Auto-approve / Teacher review

Low-confidence submissions should go to manual review.

15. Environmental Impact Engine

This is potentially one of EcoQuest's strongest features.

Instead of only saying:

You earned 500 XP

EcoQuest should also say:

You completed 12 verified environmental actions.

The system can track activity-based impact metrics such as:

Waste-related actions
Water conservation activities
Energy-saving activities
E-waste collection
Tree-planting activities
Plastic reduction activities
16. Environmental Impact Score

Each verified activity can have a predefined impact value.

For example:

Verified Action
      ↓
Activity Type
      ↓
Standard Impact Metric
      ↓
Student Impact Score

The exact environmental calculations should be based on defined and defensible metrics, not arbitrary numbers.

This is something we should research carefully during development.

17. Student Dashboard

The dashboard should display:

Profile
Name
Institution
Level
Badge collection
Progress
XP
Level
Streak
Completed challenges
Impact
Verified actions
Impact score
Activity categories
Recommendations

Your next challenge

Competition
Current rank
Class rank
Institution rank
18. Teacher Dashboard

Teachers should see:

Total Students
       ↓
Active Students
       ↓
Challenges Completed
       ↓
Pending Verifications
       ↓
Class Performance
       ↓
Environmental Impact
Features
Student list
Challenge management
Submission review
Verification
Class leaderboard
Activity analytics
Reports
19. Institution Dashboard

Institution administrators get a high-level overview.

Metrics
Total students
Active participants
Total verified actions
Total challenges
Top-performing classes
Environmental activity categories
Institution Impact Score
Visualization

Examples:

Bar charts
Progress charts
Leaderboards
Category breakdowns
Monthly trends
20. Challenge Creation System

Teachers/admins should be able to create custom challenges.

Required fields
Title
Description
Category
Difficulty
Deadline
Evidence Type
Verification Method
XP
Impact Metric

This makes EcoQuest adaptable to different schools and colleges.

21. Notifications

The platform can notify students about:

New challenges
Challenge deadlines
Badge achievements
Leaderboard changes
Streak reminders
Teacher feedback
Verification results
Recommended challenges
22. Technical Architecture
Proposed architecture
                  ECOQUEST
                     │
          ┌──────────┴──────────┐
          ↓                     ↓
     Web Frontend           Mobile Future
      React.js                  App
          │
          ↓
      Firebase
   ┌──────┼────────┐
   ↓      ↓        ↓
 Auth  Firestore  Hosting
          │
          ↓
     Application
      Services
          │
     ┌────┴─────┐
     ↓          ↓
 Gamification  Analytics
     │
     ↓
   AI Layer
 ┌───┴───────────────┐
 ↓                   ↓
Recommendation   Computer Vision
 Engine             Assistance
23. Technology Stack
Frontend

React.js

Supporting technologies:

HTML
CSS
JavaScript
Backend

Firebase

Firebase Authentication
Cloud Firestore
Firebase Hosting
AI/ML

Python

Potential components:

Computer Vision
Recommendation Engine
Analytics

Custom:

Gamification engine
Environmental impact engine
Dashboard analytics
24. Database Structure

A possible Firestore structure:

users/
    userId
        name
        email
        role
        institutionId
        xp
        level
        impactScore


institutions/
    institutionId
        name
        location


challenges/
    challengeId
        title
        category
        difficulty
        xp
        impactValue


submissions/
    submissionId
        userId
        challengeId
        evidence
        status
        submittedAt
        verifiedAt


badges/
    badgeId
        name
        requirement


user_badges/
    userId
        badgeId
        earnedAt


impact_records/
    recordId
        userId
        activity
        impactValue
        date

This is a proposed schema, not something specified by the SIH problem statement.

25. Security Requirements

The platform should include:

Firebase Authentication
Role-based authorization
Secure Firestore rules
Protected teacher/admin functions
Submission ownership validation
Input validation
Rate limiting where necessary
Secure file storage
Minimal collection of personal data

Students should never be able to modify their own:

XP
Impact score
Verification status
Badges
Leaderboard position

These values should be controlled by backend logic.

26. Non-Functional Requirements
Performance
Fast dashboard loading
Responsive UI
Optimized image uploads
Scalability

The system should eventually support:

1 school → 100 schools → 1,000+ institutions

without redesigning the core architecture.

Availability

The platform should remain available during institutional campaigns and competitions.

Usability

The interface should be:

Mobile-friendly
Simple
Accessible
Easy for school students to understand
27. MVP

We should not attempt to build everything simultaneously.

Our first working MVP should contain:

Phase 1

✅ Student authentication
✅ Student profile
✅ Environmental lessons
✅ Quizzes
✅ Challenges
✅ XP
✅ Badges
✅ Leaderboard
✅ Evidence submission
✅ Teacher verification
✅ Basic impact score
✅ Student dashboard
✅ Teacher dashboard

This alone would already demonstrate the core concept.

28. Phase 2 — Intelligence

Then add:

AI Recommendation

Student activity → personalized challenges.

AI Verification

Computer vision for selected activities.

Advanced Analytics

Institution-level environmental dashboards.

29. Phase 3 — Large-Scale Platform

Eventually:

Mobile application
AI environmental mentor
Institution competitions
Inter-college competitions
Public environmental campaigns
Advanced ML recommendations
Advanced computer vision
API ecosystem
Government/NGO partnerships
Sustainability reporting
30. Success Metrics

We shouldn't measure success only through app downloads.

Engagement
Daily/weekly active students
Challenge completion rate
Learning completion rate
Retention
Environmental Participation
Verified eco-actions
Activities per student
Participation by category
Education
Quiz improvement
Learning completion
Knowledge retention
Institution
Active classes
Active institutions
Challenges conducted
Environmental
Activity-based impact metrics
Waste-related activities
Water-saving activities
Energy-saving activities
E-waste activities
31. Major Risks
Risk	Mitigation
Students lose interest	Gamification, streaks, competitions
Fake evidence	Multi-layer verification
AI mistakes	Confidence threshold + human review
Insufficient data	Start with rules and gradually introduce ML
Incorrect impact calculations	Standardized impact methodology
Excessive complexity	Modular development
Privacy concerns	Minimize data collection
Institutions don't adopt it	Provide teacher/admin tools
32. Product Differentiation

EcoQuest shouldn't position itself as:

“Another environmental quiz app.”

Its differentiation is:

Traditional Environmental Education

Learn → Test → Finish

EcoQuest

Learn → Challenge → Act → Verify → Earn → Measure → Improve

The important difference is that the learning loop ends in action and measurable participation, not just a quiz score.

33. Long-Term Vision

The ultimate vision is to create a digital sustainability ecosystem for educational institutions.

Students become participants.

Teachers become coordinators.

Institutions become sustainability hubs.

And EcoQuest becomes the platform connecting all three.

                  ECOQUEST
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
     STUDENTS      TEACHERS   INSTITUTIONS
        │            │            │
        └────────────┼────────────┘
                     ↓
             VERIFIED ACTIONS
                     ↓
          ENVIRONMENTAL IMPACT
34. Product North Star

If we need one sentence to guide the entire development:

EcoQuest turns environmental knowledge into verified, measurable action through gamification and AI-powered personalization.

And the product loop remains:

🌱 LEARN → 🎯 CHALLENGE → 🌍 ACT → ✓ VERIFY → 🏆 EARN → 📊 IMPACT