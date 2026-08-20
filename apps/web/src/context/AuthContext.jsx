/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabase/supabaseClient'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user || null
        setCurrentUser(user)

        if (user) {
          const { data: userDoc } = await supabase
            .from('users')
            .select('role, is_blocked')
            .eq('id', user.id)
            .maybeSingle()
          
          if (userDoc?.is_blocked) {
            await supabase.auth.signOut()
            setCurrentUser(null)
            setUserRole(null)
          } else {
            if (userDoc?.role) {
              setUserRole(userDoc.role)
            } else if (user.user_metadata?.role) {
              setUserRole(user.user_metadata.role)
            }
          }
        } else {
          setUserRole(null)
        }
      } catch (err) {
        console.error('Error getting initial session:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user || null
      setCurrentUser(user)

      if (user) {
        const { data: userDoc } = await supabase
          .from('users')
          .select('role, is_blocked')
          .eq('id', user.id)
          .maybeSingle()

        if (userDoc?.is_blocked) {
          await supabase.auth.signOut()
          setCurrentUser(null)
          setUserRole(null)
        } else {
          if (userDoc?.role) {
            setUserRole(userDoc.role)
          } else if (user.user_metadata?.role) {
            setUserRole(user.user_metadata.role)
          }
        }
      } else {
        setUserRole(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function register(email, password, name, role, institutionId) {
    console.log('Attempting registration with Supabase:', { email, name, role })

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          institutionId
        }
      }
    })

    if (authError) {
      console.error('Supabase Auth signUp error:', authError)
      throw authError
    }

    const user = authData?.user
    if (user) {
      // Upsert profile in 'users' table
      const { error: dbError } = await supabase.from('users').upsert({
        id: user.id,
        email,
        name,
        role,
        institution_id: institutionId,
        xp: 0,
        level: 1,
        impact_score: 0,
        streak: 0,
        badges: []
      })

      if (dbError) {
        console.error('Error creating user record in Supabase DB:', dbError)
        throw dbError
      }

      setUserRole(role)
      setCurrentUser(user)
    }

    return { user, role }
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Supabase login error:', error)
      throw error
    }

    if (data.user) {
      const { data: userDoc } = await supabase
        .from('users')
        .select('role, is_blocked')
        .eq('id', data.user.id)
        .maybeSingle()

      if (userDoc?.is_blocked) {
        await supabase.auth.signOut()
        throw new Error('Your account has been blocked or deleted by an administrator.')
      }

      if (userDoc?.role) {
        setUserRole(userDoc.role)
      } else if (data.user.user_metadata?.role) {
        setUserRole(data.user.user_metadata.role)
      }
    }

    return data
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setCurrentUser(null)
    setUserRole(null)
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
