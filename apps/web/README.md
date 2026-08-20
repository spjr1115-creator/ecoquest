# EcoQuest - Gamified Environmental Education Platform

EcoQuest is a gamified environmental education platform that transforms traditional environmental learning into interactive, practical, and measurable environmental action.

## 🌱 Features

### For Students
- **Environmental Learning**: Access structured lessons on various environmental topics
- **Interactive Quizzes**: Test knowledge and earn XP
- **Eco-Challenges**: Complete real-world environmental activities
- **Gamification**: Earn XP, badges, and maintain streaks
- **Leaderboards**: Compete with classmates and other institutions
- **Impact Tracking**: See your environmental contribution in real-time
- **Personalized Recommendations**: Get AI-powered challenge suggestions

### For Teachers
- **Challenge Management**: Create and assign custom challenges
- **Submission Review**: Verify student evidence submissions
- **Class Analytics**: Monitor participation and progress
- **Leaderboard Management**: Organize class competitions

### For Administrators
- **Institution Dashboard**: High-level overview of environmental impact
- **User Management**: Manage students and teachers
- **Analytics**: Comprehensive sustainability reports
- **Multi-institution Support**: Scale across multiple schools/colleges

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EcoQuest/apps/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create Firestore Database
   - Enable Storage (for evidence uploads)
   - Copy your Firebase config

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Firebase credentials:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 Technology Stack

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Recharts** - Data visualization

### Backend
- **Firebase** - Backend-as-a-Service
  - Authentication - User management
  - Firestore - NoSQL database
  - Storage - File uploads
  - Hosting - Web hosting

### AI/ML (Future)
- **Python** - AI services
  - Recommendation Engine
  - Computer Vision
  - Analytics

## 🗂️ Project Structure

```
apps/web/
├── src/
│   ├── components/          # Reusable components
│   │   └── Navbar.jsx
│   ├── context/            # React context
│   │   └── AuthContext.jsx
│   ├── firebase/           # Firebase configuration
│   │   └── config.js
│   ├── pages/              # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── TeacherDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── Lessons.jsx
│   │   ├── LessonDetail.jsx
│   │   ├── Challenges.jsx
│   │   ├── ChallengeDetail.jsx
│   │   ├── Leaderboard.jsx
│   │   └── Profile.jsx
│   ├── utils/              # Utility functions
│   │   └── seedData.js
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── .env.example           # Environment variables template
├── package.json            # Dependencies
└── vite.config.js         # Vite configuration
```

## 🔐 Firebase Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Challenges collection
    match /challenges/{challengeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.resource.data.role in ['teacher', 'admin']);
    }
    
    // Submissions collection
    match /submissions/{submissionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (request.resource.data.role in ['teacher', 'admin']);
    }
    
    // Lessons collection
    match /lessons/{lessonId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.resource.data.role in ['teacher', 'admin']);
    }
  }
}
```

## 🎯 Core Features Implementation

### Authentication
- Email/password registration and login
- Role-based access control (Student, Teacher, Admin)
- Session management with Firebase Auth

### Gamification Engine
- **XP System**: Points for lessons, quizzes, challenges, and verified actions
- **Leveling**: Level progression based on XP
- **Badges**: Achievement-based rewards
- **Streaks**: Daily activity tracking
- **Leaderboards**: Multiple ranking categories

### Challenge System
- Challenge creation and management
- Evidence submission with photo upload
- Multi-layer verification (Evidence, QR, Teacher, AI)
- Deadline management
- Impact value calculation

### Environmental Impact Tracking
- Activity-based impact metrics
- Category-wise impact breakdown
- Institution-level aggregation
- Visual impact dashboards

## 📊 Database Schema

### Users Collection
```javascript
{
  name: string,
  email: string,
  role: 'student' | 'teacher' | 'admin',
  institutionId: string,
  xp: number,
  level: number,
  impactScore: number,
  streak: number,
  badges: array,
  createdAt: timestamp
}
```

### Challenges Collection
```javascript
{
  title: string,
  category: string,
  description: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  xp: number,
  impactValue: number,
  deadline: timestamp,
  instructions: string,
  status: 'active' | 'completed',
  participants: number
}
```

### Submissions Collection
```javascript
{
  userId: string,
  challengeId: string,
  challengeTitle: string,
  evidence: string,
  imageUrl: string,
  status: 'pending' | 'approved' | 'rejected',
  submittedAt: timestamp,
  verifiedAt: timestamp,
  xpReward: number,
  impactValue: number
}
```

### Lessons Collection
```javascript
{
  title: string,
  category: string,
  description: string,
  duration: string,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
  xp: number,
  content: string
}
```

## 🚀 Deployment

### Firebase Hosting
1. Build the project:
   ```bash
   npm run build
   ```

2. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

3. Initialize Firebase:
   ```bash
   firebase login
   firebase init hosting
   ```

4. Deploy:
   ```bash
   firebase deploy
   ```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Role-based dashboard access
- [ ] Lesson completion and XP awarding
- [ ] Challenge participation and evidence submission
- [ ] Teacher verification workflow
- [ ] Leaderboard display and updates
- [ ] Profile management
- [ ] Responsive design on mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of the Smart India Hackathon (SIH25009).

## 🙏 Acknowledgments

- Smart India Hackathon 2024
- Team Neer
- Firebase for the excellent backend services
- The open-source community

## 📧 Contact

For questions or support, please contact the development team.

---

**Built with ❤️ for the environment**