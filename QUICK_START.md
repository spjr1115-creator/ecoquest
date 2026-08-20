# 🚀 EcoQuest - Quick Start Guide

Welcome to EcoQuest! This guide will get you up and running in minutes.

## ⚡ Quick Start (3 Steps)

### Step 1: Configure Firebase (5 minutes)

1. **Create Firebase Project**
   - Go to [console.firebase.google.com](https://console.firebase.google.com)
   - Click "Add project" → Name it "ecoquest-platform"
   - Follow the setup wizard

2. **Enable Services**
   - **Authentication**: Enable "Email/Password" sign-in
   - **Firestore**: Create database (choose test mode for now)
   - **Storage**: Enable storage (choose test mode for now)

3. **Get Credentials**
   - Go to Project Settings → Your apps → Add Web app
   - Copy the `firebaseConfig` object

### Step 2: Update Environment Variables (2 minutes)

1. Open `apps/web/.env` file
2. Replace the placeholder values with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 3: Run the Application (1 minute)

```bash
cd apps/web
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## 🎯 Test the Application

### Create Test Accounts

1. **Register as Student**: 
   - Email: `student@test.com`
   - Password: `test123456`
   - Role: Student

2. **Register as Teacher**:
   - Email: `teacher@test.com`
   - Password: `test123456`
   - Role: Teacher

3. **Register as Admin**:
   - Email: `admin@test.com`
   - Password: `test123456`
   - Role: Admin

### Test Features

**Student Account:**
- ✅ View dashboard with XP, level, streak
- ✅ Browse environmental lessons
- ✅ Complete a lesson and earn XP
- ✅ View challenges
- ✅ Submit evidence for a challenge
- ✅ Check leaderboard
- ✅ View profile and badges

**Teacher Account:**
- ✅ View teacher dashboard
- ✅ Review student submissions
- ✅ Approve/reject evidence
- ✅ View class analytics

**Admin Account:**
- ✅ View institution dashboard
- ✅ Check environmental impact metrics
- ✅ View analytics by category

## 🌱 Deploy to Production (Optional)

### Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### Initialize Firebase Hosting
```bash
cd apps/web
firebase init
```
- Select: Hosting
- Choose your existing project
- Public directory: `dist`
- Configure as single-page app: Yes

### Build and Deploy
```bash
npm run build
firebase deploy
```

Your app will be live at: `https://your-project.firebaseapp.com`

## 📚 Documentation

- **SETUP_GUIDE.md**: Detailed step-by-step setup instructions
- **DEPLOYMENT.md**: Complete deployment guide
- **PROJECT_SUMMARY.md**: Comprehensive project overview
- **README.md**: Project documentation and features
- **firebase.rules**: Security rules for Firebase

## 🔧 Common Issues

**"Firebase configuration required" warning**
- Solution: Update `.env` file with your Firebase credentials
- Make sure to restart the dev server after updating

**"Permission denied" errors**
- Solution: Apply the security rules from `firebase.rules` in Firebase Console
- Go to Firestore Database → Rules → Paste rules → Publish

**Build fails**
- Solution: Delete `node_modules` and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

**Deployment fails**
- Solution: Check Firebase CLI version and re-login
```bash
firebase logout
firebase login
firebase --version
```

## 🎨 Customization

### Add Your Branding
- Update `index.html` title and meta tags
- Modify color scheme in Tailwind CSS classes
- Add your logo in the Navbar component

### Add Sample Data
- Use the `src/utils/seedData.js` to populate your database
- Or manually add lessons/challenges in Firebase Console

### Configure Security Rules
- Review `firebase.rules` and adjust as needed
- Apply rules in Firebase Console for both Firestore and Storage

## 📊 Project Structure

```
EcoQuest/
├── apps/web/                 # Main application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Auth context
│   │   ├── firebase/        # Firebase config
│   │   ├── pages/           # All pages
│   │   └── utils/           # Utilities
│   ├── .env                 # Environment variables (configure this!)
│   └── package.json
├── firebase.rules          # Security rules
├── SETUP_GUIDE.md          # Detailed setup guide
├── DEPLOYMENT.md           # Deployment instructions
└── README.md              # Project documentation
```

## 🏆 What's Included

✅ **Complete Authentication System**
- Role-based access (Student, Teacher, Admin)
- Secure login/logout
- Profile management

✅ **Student Features**
- Interactive dashboard
- Environmental lessons
- Quiz system
- Challenge participation
- Evidence submission
- Badge collection
- Leaderboards

✅ **Teacher Features**
- Class dashboard
- Submission review
- Student monitoring
- Challenge creation

✅ **Admin Features**
- Institution analytics
- User management
- Impact tracking
- Comprehensive reports

✅ **Gamification**
- XP system
- Leveling
- Streaks
- Badges
- Leaderboards

✅ **Production Ready**
- Optimized build
- Security rules
- Deployment guides
- Error handling

## 🎓 Learning Resources

- **Firebase Documentation**: [firebase.google.com/docs](https://firebase.google.com/docs)
- **React Documentation**: [react.dev](https://react.dev)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Vite**: [vitejs.dev](https://vitejs.dev)

## 🤝 Support

For issues or questions:
1. Check the documentation files
2. Review Firebase Console for errors
3. Check browser console for JavaScript errors
4. Consult the troubleshooting section in SETUP_GUIDE.md

## 🌍 Ready to Make an Impact!

Your EcoQuest platform is now ready to:
- 📚 Educate students about environmental issues
- 🎯 Gamify environmental learning
- 🌱 Track real environmental impact
- 🏆 Create healthy competition
- 📊 Provide actionable insights

---

**Start your environmental education journey today! 🚀**