# EcoQuest Setup Guide - Step-by-Step Instructions

This guide will walk you through setting up and deploying the EcoQuest platform from scratch.

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [ ] Node.js installed (v18 or higher)
- [ ] npm or yarn installed
- [ ] A Google account (for Firebase)
- [ ] Basic command line knowledge

## 🚀 Step 1: Firebase Project Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `ecoquest-platform` (or your preferred name)
4. Accept Firebase terms and click **"Continue"**
5. Enable Google Analytics (optional) - click **"Continue"** or **"Not now"**
6. Wait for project creation (usually takes 1-2 minutes)
7. Click **"Continue"** when project is ready

### 1.2 Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Select **"Sign-in method"** tab
4. Enable **"Email/Password"**:
   - Click on "Email/Password"
   - Toggle **"Enable"** to ON
   - Click **"Save"**
5. (Optional) Enable **"Google"**:
   - Click on "Google"
   - Toggle **"Enable"** to ON
   - Add a project support email
   - Click **"Save"**

### 1.3 Create Firestore Database

1. Go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development) or **"Start in production mode"**
4. Select a location (choose closest to your users)
5. Click **"Create"**
6. Wait for database creation

### 1.4 Enable Storage

1. Go to **Build** → **Storage**
2. Click **"Get started"**
3. Select **"Start in test mode"** (for development)
4. Select the same location as your Firestore database
5. Click **"Done"**
6. Wait for storage to be enabled

### 1.5 Get Firebase Configuration

1. Go to **Project Settings** (gear icon near "Project Overview")
2. Scroll down to **"Your apps"** section
3. Click **"Web"** icon (</>)
4. Enter app name: `EcoQuest Web`
5. **Don't** check "Firebase Hosting" (we'll set this up separately)
6. Click **"Register app"**
7. Copy the **firebaseConfig** object (it looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "ecoquest-platform.firebaseapp.com",
  projectId: "ecoquest-platform",
  storageBucket: "ecoquest-platform.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
}
```

## 🔧 Step 2: Configure Environment Variables

### 2.1 Update .env File

1. Navigate to the project directory:
   ```bash
   cd "C:\Users\ACER\OneDrive\Project\SIH\EcoQuest\apps\web"
   ```

2. Open the `.env` file in a text editor

3. Replace the placeholder values with your actual Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Example:
```env
VITE_FIREBASE_API_KEY=AIzaSyDabc123xyz
VITE_FIREBASE_AUTH_DOMAIN=ecoquest-platform.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ecoquest-platform
VITE_FIREBASE_STORAGE_BUCKET=ecoquest-platform.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

4. Save the `.env` file

## 🔐 Step 3: Apply Security Rules

### 3.1 Firestore Security Rules

1. Go to **Build** → **Firestore Database** → **Rules** tab
2. Delete the existing rules
3. Copy the rules from the `firebase.rules` file in your project root
4. Paste the rules into the Firebase Console
5. Click **"Publish"**

### 3.2 Storage Security Rules

1. Go to **Build** → **Storage** → **Rules** tab
2. Copy the storage rules from the `firebase.rules` file (bottom section)
3. Paste the rules into the Firebase Console
4. Click **"Publish"**

## 🧪 Step 4: Test Locally

### 4.1 Install Dependencies (if not already done)

```bash
cd "C:\Users\ACER\OneDrive\Project\SIH\EcoQuest\apps\web"
npm install
```

### 4.2 Run Development Server

```bash
npm run dev
```

### 4.3 Test the Application

1. Open your browser and go to `http://localhost:5173`
2. **Test Registration**:
   - Click "Get Started"
   - Register as a Student
   - Register as a Teacher
   - Register as an Admin
3. **Test Login**:
   - Logout and login with different accounts
   - Verify role-based access
4. **Test Student Features**:
   - View dashboard
   - Browse lessons
   - Complete a lesson
   - View challenges
   - Submit evidence for a challenge
5. **Test Teacher Features**:
   - Login as teacher
   - View pending submissions
   - Approve/reject submissions
6. **Test Admin Features**:
   - Login as admin
   - View institution dashboard
   - Check analytics

## 🚀 Step 5: Deploy to Firebase Hosting

### 5.1 Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 5.2 Login to Firebase

```bash
firebase login
```

This will open a browser window for authentication.

### 5.3 Initialize Firebase in Project

```bash
cd "C:\Users\ACER\OneDrive\Project\SIH\EcoQuest\apps\web"
firebase init
```

When prompted:
1. **Are you ready to proceed?** Yes
2. **Which Firebase features do you want to set up?**
   - Select: **Hosting: Configure files for Firebase Hosting**
   - (Press Space to select, Enter to continue)
3. **Please select an option:**
   - Select: **Use an existing project**
4. **Select a default Firebase project for this directory:**
   - Choose your `ecoquest-platform` project
5. **What do you want to use as your public directory?**
   - Enter: `dist`
6. **Configure as a single-page app?**
   - Select: **Yes**
7. **Set up automatic builds with GitHub?**
   - Select: **No** (for now)

### 5.4 Build for Production

```bash
npm run build
```

### 5.5 Deploy

```bash
firebase deploy
```

This will:
- Upload your files to Firebase
- Provide you with a URL like: `https://ecoquest-platform.firebaseapp.com`

## 🌱 Step 6: Seed Database (Optional)

### 6.1 Add Sample Data

You can add sample lessons and challenges through the Firebase Console:

1. Go to **Firestore Database**
2. Click **"Start collection"**
3. Create collection: `lessons`
4. Add documents using the sample data from `src/utils/seedData.js`

Or use the Firebase Console UI to manually add sample data.

## ✅ Step 7: Post-Deployment Verification

### 7.1 Test Live Application

1. Visit your deployed URL
2. Test all features again in the live environment
3. Verify authentication works
4. Check that database operations work
5. Test file uploads (if applicable)

### 7.2 Monitor Firebase Console

1. Check **Authentication** → **Users** to see registered users
2. Check **Firestore Database** to see data
3. Check **Storage** to see uploaded files
4. Check **Analytics** (if enabled) for usage stats

## 🎉 Step 8: Congratulations!

Your EcoQuest platform is now live! Here's what you've accomplished:

- ✅ Firebase project configured
- ✅ Authentication enabled
- ✅ Database and storage set up
- ✅ Security rules applied
- ✅ Application deployed
- ✅ Ready for users

## 📚 Next Steps

### For Production Use:

1. **Enable Email Verification** in Firebase Auth
2. **Set up Custom Domain** in Firebase Hosting
3. **Configure Analytics** for user insights
4. **Set up Error Monitoring** (Crashlytics)
5. **Implement Rate Limiting** for API calls
6. **Regular Backups** of Firestore data
7. **Monitor Usage** and optimize costs

### For Development:

1. **Add More Sample Data** to populate the database
2. **Customize UI** to match your branding
3. **Add More Features** from the PRD
4. **Implement AI Features** (recommendation engine, computer vision)
5. **Mobile App Development** (React Native)

## 🔧 Troubleshooting

### Common Issues:

**"Firebase: No Firebase App '[DEFAULT]' has been created"**
- Check your `.env` file
- Ensure all Firebase config values are correct
- Restart your dev server

**"Permission denied" errors**
- Check Firestore security rules
- Verify user authentication
- Check user roles in database

**Build fails**
- Clear node_modules: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`
- Check for Node.js version compatibility

**Deployment fails**
- Check Firebase CLI version: `firebase --version`
- Re-login: `firebase logout && firebase login`
- Check your internet connection

## 📞 Support

If you encounter issues:
1. Check Firebase Console for error messages
2. Review browser console for JavaScript errors
3. Check the README.md and DEPLOYMENT.md files
4. Consult Firebase documentation

---

**Your EcoQuest platform is now ready to make an environmental impact! 🌍**