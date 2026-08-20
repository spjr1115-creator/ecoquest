import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Leaf, Mail, Lock, User, Building, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    institutionId: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register, currentUser, userRole } = useAuth()
  const navigate = useNavigate()

  const getDashboardPath = (role) => {
    if (role === 'teacher') return '/dashboard/teacher'
    if (role === 'admin') return '/dashboard/admin'
    return '/dashboard/student'
  }

  const getPasswordStrength = (password) => {
    if (!password) return { label: '', color: 'bg-slate-200', textColor: 'text-slate-500', width: '0%' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score < 2) return { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500', width: '33%' };
    if (score < 4) return { label: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-600', width: '66%' };
    return { label: 'Strong', color: 'bg-green-500', textColor: 'text-green-600', width: '100%' };
  }


  if (currentUser) {
    navigate(getDashboardPath(userRole), { replace: true })
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { role } = await register(
        formData.email,
        formData.password,
        formData.name,
        formData.role,
        formData.institutionId
      )
      navigate(getDashboardPath(role || formData.role), { replace: true })
    } catch (error) {
      let errorMessage = 'Failed to create account. Please try again.'

      if (error.message?.includes('User already registered')) {
        errorMessage = 'An account with this email already exists.'
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = 'Password should be at least 6 characters.'
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.'
      } else if (error.message?.includes('Signup is disabled')) {
        errorMessage = 'Registration is currently disabled. Please contact support.'
      } else if (error.message) {
        errorMessage = error.message
      }

      setError(errorMessage)
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Visual/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-700 to-teal-900 justify-center items-center">
        {/* Decorative background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-white blur-3xl mix-blend-overlay"></div>
          <div className="absolute bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-300 blur-3xl mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-12">
          <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20 mb-8 shadow-2xl">
            <Leaf className="h-20 w-20 text-white drop-shadow-md" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-sm">
            Join the <br/>Eco Movement
          </h1>
          <p className="text-emerald-100 text-lg max-w-md font-medium">
            Create an account to start tracking your environmental impact and competing with peers.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16 h-screen overflow-y-auto">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
          
          <div className="text-center lg:text-left mt-8">
            <div className="lg:hidden mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-green-100 mb-6">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-slate-500 font-medium">
              Join EcoQuest and start making an impact
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-100 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-bold text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-green-600">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1.5">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-green-600">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="role" className="block text-sm font-bold text-slate-700 mb-1.5">
                    I am a
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all sm:text-sm"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="institutionId" className="block text-sm font-bold text-slate-700 mb-1.5">
                    Institution ID
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-green-600">
                      <Building className="h-5 w-5 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                    </div>
                    <input
                      id="institutionId"
                      name="institutionId"
                      type="text"
                      value={formData.institutionId}
                      onChange={handleChange}
                      className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all sm:text-sm"
                      placeholder="School ID"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-green-600">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
                {formData.password && (
                  <div className="mt-2 animate-in fade-in slide-in-from-top-1">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-semibold text-slate-500">Password strength</span>
                      <span className={`text-xs font-bold ${getPasswordStrength(formData.password).textColor}`}>
                        {getPasswordStrength(formData.password).label}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ease-out ${getPasswordStrength(formData.password).color}`} 
                        style={{ width: getPasswordStrength(formData.password).width }}
                      ></div>
                    </div>
                    {getPasswordStrength(formData.password).label !== 'Strong' && (
                      <ul className="text-[11px] text-slate-500 mt-2.5 space-y-1.5">
                        <li className="flex items-center gap-2">
                           <div className={`h-1.5 w-1.5 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                           At least 8 characters
                        </li>
                        <li className="flex items-center gap-2">
                           <div className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                           Uppercase & lowercase letters
                        </li>
                        <li className="flex items-center gap-2">
                           <div className={`h-1.5 w-1.5 rounded-full ${/\d/.test(formData.password) && /[^A-Za-z0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                           Numbers & symbols
                        </li>
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-green-600">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Create account
                    <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </span>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-green-600 hover:text-green-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
