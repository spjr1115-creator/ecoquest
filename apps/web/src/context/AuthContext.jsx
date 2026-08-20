import { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      
      if (user) {
        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role)
        }
      } else {
        setUserRole(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  async function register(email, password, name, role, institutionId) {
    console.log('Attempting registration with:', { email, name, role })
    
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      console.log('User created successfully:', user.uid)
      
      await updateProfile(user, { displayName: name })
      console.log('Profile updated')
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role,
        institutionId,
        xp: 0,
        level: 1,
        impactScore: 0,
        streak: 0,
        badges: [],
        createdAt: new Date().toISOString()
      })
      console.log('User document created in Firestore')
      
      return user
    } catch (error) {
      console.error('Registration error details:', {
        code: error.code,
        message: error.message,
        customData: error.customData
      })
      throw error
    }
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return signOut(auth)
  }

  const value = {
    currentUser,
    userRole,
    loading,
    register,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}