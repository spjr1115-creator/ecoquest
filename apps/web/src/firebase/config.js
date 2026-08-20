import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Validate Firebase config
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'appId']
const missingFields = requiredFields.filter(field => !firebaseConfig[field])

if (missingFields.length > 0) {
  console.error('Firebase configuration is incomplete. Missing fields:', missingFields)
  console.error('Please check your .env file and ensure all Firebase credentials are set.')
  console.error('Copy .env.example to .env and fill in your Firebase credentials.')
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Set auth persistence and debug mode for troubleshooting
auth.settings = {
  ...auth.settings,
  appVerificationDisabledForTesting: true // For development only
}

console.log('Firebase initialized with project:', firebaseConfig.projectId)

export { app, auth, db, storage }