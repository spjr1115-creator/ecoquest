import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Lessons from './pages/Lessons'
import Challenges from './pages/Challenges'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import ChallengeDetail from './pages/ChallengeDetail'
import LessonDetail from './pages/LessonDetail'

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  return !!(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    import.meta.env.VITE_FIREBASE_APP_ID
  )
}

function ConfigWarning() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-yellow-100 mb-6">
          <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Firebase Configuration Required</h2>
        <div className="text-left bg-slate-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-slate-700 mb-3">To run EcoQuest, you need to configure Firebase:</p>
          <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
            <li>Create a Firebase project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">console.firebase.google.com</a></li>
            <li>Enable Authentication (Email/Password)</li>
            <li>Create Firestore Database</li>
            <li>Enable Storage</li>
            <li>Copy your Firebase credentials</li>
            <li>Update the <code className="bg-slate-200 px-1 py-0.5 rounded">.env</code> file with your credentials</li>
          </ol>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          See <code className="bg-slate-100 px-1 py-0.5 rounded">SETUP_GUIDE.md</code> for detailed instructions.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <strong>Quick Start:</strong> Copy <code className="bg-green-100 px-1 py-0.5 rounded">.env.example</code> to <code className="bg-green-100 px-1 py-0.5 rounded">.env</code> and fill in your Firebase credentials.
          </p>
        </div>
      </div>
    </div>
  )
}

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, userRole, loading } = useAuth()
  console.log("AUTH DEBUG:", {
  uid: currentUser?.uid,
  userRole,
  loading
})

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />
  }

  return children
}

function App() {
  if (!isFirebaseConfigured()) {
    return <ConfigWarning />
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route 
              path="/dashboard/student" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dashboard/teacher" 
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dashboard/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/lessons" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Lessons />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/lessons/:id" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <LessonDetail />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/challenges" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Challenges />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/challenges/:id" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ChallengeDetail />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/leaderboard" 
              element={
                <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                  <Leaderboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-600">
            EcoQuest
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Turn Learning Into
            <span className="block text-green-600">
              Environmental Action.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">
            Learn. Take challenges. Make an impact.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/register"
              className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="text-sm font-semibold leading-6 text-slate-900 hover:text-green-600"
            >
              Sign in <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App