import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { isSupabaseConfigured } from './supabase/supabaseClient'
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
import Approvals from './pages/Approvals'
import LessonDetail from './pages/LessonDetail'

function LoadingScreen() {
  return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" /></div>
}

function SupabaseSetupRequired() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <section className="max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-green-700">EcoQuest setup</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Connect your Supabase project</h1>
        <p className="mt-3 text-slate-600">Login and all three portals use real Supabase data. Add the project URL and anon key to <code className="rounded bg-slate-100 px-1.5 py-0.5">apps/web/.env</code>, then restart the development server.</p>
        <pre className="mt-5 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100">VITE_SUPABASE_URL=https://your-project.supabase.co{`\n`}VITE_SUPABASE_ANON_KEY=your-anon-key</pre>
        <p className="mt-4 text-sm text-slate-500">Run <code>supabase_schema.sql</code> in the Supabase SQL Editor before registering users.</p>
      </section>
    </main>
  )
}

function dashboardFor(role) {
  return role === 'teacher' ? '/dashboard/teacher' : role === 'admin' ? '/dashboard/admin' : '/dashboard/student'
}

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, userRole, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!currentUser) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to={dashboardFor(userRole)} replace />
  return children
}

function LandingPage() {
  const { currentUser, userRole, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (currentUser) return <Navigate to={dashboardFor(userRole)} replace />
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl">🌿</div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-600">EcoQuest</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Turn learning into <span className="block text-green-600">environmental action.</span></h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">Learn, take challenges, verify your actions, and measure your impact.</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/register" className="rounded-md bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500">Start your eco journey</Link>
            <Link to="/login" className="text-sm font-semibold text-slate-900 hover:text-green-600">Sign in →</Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function App() {
  if (!isSupabaseConfigured) return <SupabaseSetupRequired />

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/teacher" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/approvals" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><Approvals /></ProtectedRoute>} />
            <Route path="/lessons" element={<ProtectedRoute allowedRoles={['student']}><Lessons /></ProtectedRoute>} />
            <Route path="/lessons/:id" element={<ProtectedRoute allowedRoles={['student']}><LessonDetail /></ProtectedRoute>} />
            <Route path="/challenges" element={<ProtectedRoute allowedRoles={['student']}><Challenges /></ProtectedRoute>} />
            <Route path="/challenges/:id" element={<ProtectedRoute allowedRoles={['student']}><ChallengeDetail /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}><Leaderboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
