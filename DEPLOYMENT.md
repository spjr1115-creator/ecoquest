# EcoQuest Deployment Guide

This guide will help you deploy the EcoQuest platform to production.

## 🚀 Quick Start Deployment

### Option 1: Firebase Hosting (Recommended)

#### Prerequisites
- Firebase account
- Firebase CLI installed
- Built application files

#### Steps

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project**
   ```bash
   cd apps/web
   firebase init
   ```
   
   Select the following options:
   - Hosting: Configure for Firebase Hosting
   - Use an existing project: Select your Firebase project
   - What do you want to use as your public directory? `dist`
   - Configure as a single-page app? Yes
   - Set up automatic builds with GitHub? No

4. **Build the application**
   ```bash
   npm run build
   ```

5. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

Your app will be live at `https://your-project.firebaseapp.com`

### Option 2: Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd apps/web
   vercel
   ```

3. **Follow the prompts** to configure your deployment

### Option 3: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**
   ```bash
   cd apps/web
   netlify deploy --prod
   ```

## 🔧 Firebase Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Follow the setup wizard

### 2. Enable Required Services

#### Authentication
- Go to Authentication → Sign-in method
- Enable "Email/Password"
- Enable "Google" (optional)

#### Firestore Database
- Go to Firestore Database
- Click "Create database"
- Choose production mode or test mode
- Select a location

#### Storage
- Go to Storage
- Click "Get started"
- Choose security rules (use the provided rules)
- Select a location

### 3. Configure Security Rules

Copy the security rules from `firebase.rules` and apply them in your Firebase Console:

1. Go to Firestore Database → Rules
2. Paste the rules from `firebase.rules`
3. Click "Publish"

1. Go to Storage → Rules
2. Paste the storage rules from `firebase.rules`
3. Click "Publish"

### 4. Get Firebase Configuration

1. Go to Project Settings → General → Your apps
2. Select Web app
3. Copy the configuration object
4. Update your `.env` file with these values

## 🌱 Database Seeding

To populate your database with sample data:

1. **Create a seed script**
   ```javascript
   // apps/web/src/seed.js
   import { seedDatabase } from './utils/seedData'
   seedDatabase()
   ```

2. **Run the seed script**
   ```bash
   node -r esbuild-register src/seed.js
   ```

Or manually add data through Firebase Console.

## 📊 Environment Variables

Create a `.env` file in the `apps/web` directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🔍 Pre-Deployment Checklist

- [ ] Firebase project created and configured
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Storage enabled
- [ ] Security rules applied
- [ ] Environment variables configured
- [ ] Application builds successfully (`npm run build`)
- [ ] Test user accounts created
- [ ] Sample data seeded
- [ ] Responsive design tested
- [ ] All features tested manually

## 🧪 Testing Before Deployment

### Manual Testing

1. **Authentication Flow**
   - Register as student
   - Register as teacher
   - Register as admin
   - Login/logout functionality
   - Role-based access control

2. **Student Features**
   - View dashboard
   - Browse lessons
   - Complete lesson
   - Take quiz
   - View challenges
   - Submit evidence
   - View profile
   - Check leaderboard

3. **Teacher Features**
   - View dashboard
   - Review submissions
   - Approve/reject evidence
   - View student progress

4. **Admin Features**
   - View institution dashboard
   - Manage users
   - View analytics

### Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚨 Troubleshooting

### Build Errors

**Issue**: Build fails with module errors
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Firebase configuration errors
```bash
# Solution: Verify .env file exists and has correct values
cat .env
```

### Deployment Errors

**Issue**: Firebase deployment fails
```bash
# Solution: Check Firebase CLI version and re-login
firebase logout
firebase login
firebase --version
```

**Issue**: CORS errors in production
```bash
# Solution: Configure CORS in Firebase Console
# Firebase Console → Storage → Rules
```

### Runtime Errors

**Issue**: Authentication fails
- Check Firebase Auth configuration
- Verify email/password is enabled
- Check browser console for specific errors

**Issue**: Database read/write fails
- Verify Firestore security rules
- Check user roles in database
- Ensure user is authenticated

## 📈 Post-Deployment

### Monitoring

1. **Firebase Console**
   - Monitor Authentication usage
   - Check Firestore reads/writes
   - Track Storage usage
   - View Analytics

2. **Performance**
   - Monitor page load times
   - Check API response times
   - Track user engagement

### Maintenance

1. **Regular Backups**
   - Export Firestore data regularly
   - Backup important configurations

2. **Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Test before deploying updates

3. **User Support**
   - Set up feedback mechanism
   - Monitor user issues
   - Update documentation

## 🔐 Security Best Practices

1. **API Keys**
   - Never commit `.env` files
   - Use environment variables
   - Rotate keys periodically

2. **Authentication**
   - Enable email verification
   - Implement rate limiting
   - Monitor suspicious activity

3. **Database**
   - Use strict security rules
   - Validate all inputs
   - Implement proper indexing

4. **Storage**
   - Limit file sizes
   - Validate file types
   - Use signed URLs for sensitive data

## 📞 Support

For issues or questions:
- Check Firebase documentation
- Review project README
- Check GitHub issues
- Contact development team

---

**Happy Deploying! 🚀**