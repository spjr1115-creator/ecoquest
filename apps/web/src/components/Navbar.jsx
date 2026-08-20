import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Leaf, LogOut, User, Trophy, BookOpen, Target } from 'lucide-react'

export default function Navbar() {
  const { currentUser, userRole, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xl font-bold text-slate-900">EcoQuest</span>
            </Link>
          </div>

          {currentUser && (
            <div className="flex items-center space-x-4">
              {userRole === 'student' && (
                <>
                  <Link
                    to="/dashboard/student"
                    className="flex items-center space-x-1 text-slate-600 hover:text-green-600 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                  <Link
                    to="/lessons"
                    className="flex items-center space-x-1 text-slate-600 hover:text-green-600 transition-colors"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span className="hidden sm:inline">Lessons</span>
                  </Link>
                  <Link
                    to="/challenges"
                    className="flex items-center space-x-1 text-slate-600 hover:text-green-600 transition-colors"
                  >
                    <Target className="h-5 w-5" />
                    <span className="hidden sm:inline">Challenges</span>
                  </Link>
                  <Link
                    to="/leaderboard"
                    className="flex items-center space-x-1 text-slate-600 hover:text-green-600 transition-colors"
                  >
                    <Trophy className="h-5 w-5" />
                    <span className="hidden sm:inline">Leaderboard</span>
                  </Link>
                </>
              )}

              {userRole === 'teacher' && (
                <Link
                  to="/dashboard/teacher"
                  className="flex items-center space-x-1 text-slate-600 hover:text-green-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}

              {userRole === 'admin' && (
                <Link
                  to="/dashboard/admin"
                  className="flex items-center space-x-1 text-slate-600 hover:text-green-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center space-x-1 text-slate-600 hover:text-green-600 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-green-600">
                    {currentUser.user_metadata?.name?.[0] || currentUser.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-slate-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}

          {!currentUser && (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-900 hover:text-green-600 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}