import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase/supabaseClient'
import { 
  Building, 
  Users, 
  TrendingUp, 
  Award,
  Activity,
  BarChart3,
  FileText,
  Settings,
  FilePlus,
  X,
  Download,
  Trash2,
  ChevronRight
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

export default function AdminDashboard() {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState({
    totalInstitutions: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalImpact: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal Visibility States
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUsersModal, setShowUsersModal] = useState(false)
  const [showInstModal, setShowInstModal] = useState(false)
  const [showReportsModal, setShowReportsModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // Form States
  const [createSuccess, setCreateSuccess] = useState('')
  const [newChallenge, setNewChallenge] = useState({
    title: '', category: 'Waste Management', xp: 100, impactValue: 10, difficulty: 'Medium', description: ''
  })
  
  const [allUsers, setAllUsers] = useState([])
  
  const [instSettings, setInstSettings] = useState({
    name: localStorage.getItem('inst_name') || 'EcoQuest Default Institution',
    contactEmail: localStorage.getItem('inst_email') || 'admin@ecoquest.org'
  })

  const [platSettings, setPlatSettings] = useState({
    allowSignups: localStorage.getItem('plat_signups') !== 'false',
    maintenanceMode: localStorage.getItem('plat_maintenance') === 'true'
  })

  useEffect(() => {
    async function fetchDashboardData() {
      if (!currentUser) return
      try {
        const { data: allUsersData } = await supabase.from('users').select('*')
        const usersList = allUsersData || []
        setAllUsers(usersList)
        
        const students = usersList.filter(u => u.role === 'student')
        const teachers = usersList.filter(u => u.role === 'teacher')
        const totalImpact = students.reduce((sum, s) => sum + (s.impact_score || 0), 0)

        const { data: activities } = await supabase
          .from('user_challenges')
          .select('*')
          .order('submitted_at', { ascending: false })
          .limit(5)

        setStats({
          totalInstitutions: 1,
          totalStudents: students.length,
          totalTeachers: teachers.length,
          totalImpact
        })

        setRecentActivity((activities || []).map(a => ({
          id: a.id,
          challengeTitle: a.challenge_id || 'Challenge',
          submittedAt: a.submitted_at,
          status: a.status
        })))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [currentUser])

  async function handleCreateChallenge(e) {
    e.preventDefault()
    if (!newChallenge.title.trim()) return
    try {
      const { error } = await supabase.from('challenges').insert({
        title: newChallenge.title,
        category: newChallenge.category,
        description: newChallenge.description,
        difficulty: newChallenge.difficulty,
        xp: Number(newChallenge.xp),
        impact_value: Number(newChallenge.impactValue),
        status: 'active'
      })
      if (error) console.warn('Error creating challenge:', error.message)
      else {
        setCreateSuccess(`Challenge "${newChallenge.title}" uploaded successfully! 🎉`)
        setTimeout(() => {
          setCreateSuccess('')
          setShowCreateModal(false)
          setNewChallenge({ title: '', category: 'Waste Management', xp: 100, impactValue: 10, difficulty: 'Medium', description: '' })
        }, 1800)
      }
    } catch (err) {
      console.error('Error creating challenge:', err)
    }
  }

  function saveInstSettings(e) {
    e.preventDefault()
    localStorage.setItem('inst_name', instSettings.name)
    localStorage.setItem('inst_email', instSettings.contactEmail)
    setShowInstModal(false)
  }

  function savePlatSettings(e) {
    e.preventDefault()
    localStorage.setItem('plat_signups', platSettings.allowSignups)
    localStorage.setItem('plat_maintenance', platSettings.maintenanceMode)
    setShowSettingsModal(false)
  }

  async function handleRoleChange(userId, newRole) {
    if (userId === currentUser?.id && newRole !== 'admin') {
      alert("You cannot revoke your own admin rights.");
      return;
    }

    try {
      const { error } = await supabase.rpc('update_user_role', {
        p_user_id: userId,
        p_new_role: newRole
      })

      if (error) {
        console.error('Error updating role:', error)
        alert('Failed to update role. Are you sure you ran the SQL function in Supabase?');
        return;
      }

      // Update local state
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    } catch (err) {
      console.error('Error:', err)
    }
  }

  function downloadReport() {
    const headers = 'Name,Email,Role,XP,Impact Score,Level\n'
    const rows = allUsers.map(u => `${u.name},${u.email},${u.role},${u.xp || 0},${u.impact_score || 0},${u.level || 1}`).join('\n')
    const csv = headers + rows
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `EcoQuest_Report_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    setShowReportsModal(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  // Analytics Data Prep
  const roleData = [
    { name: 'Students', count: stats.totalStudents },
    { name: 'Teachers', count: stats.totalTeachers },
    { name: 'Admins', count: allUsers.filter(u => u.role === 'admin').length }
  ]
  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b']

  // Mock Daily Activity Data
  const dailyActivityData = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    dailyActivityData.push({
      date: d.toLocaleDateString('en-US', { weekday: 'short' }),
      users: Math.floor(Math.random() * (stats.totalStudents + 5)) + 2 // random engagement
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Institution Dashboard</h1>
        <p className="mt-2 text-slate-600">Overview of your institution's environmental impact</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Building className="h-6 w-6 text-blue-500" />} label="Institutions" value={stats.totalInstitutions} color="blue" />
        <StatCard icon={<Users className="h-6 w-6 text-green-500" />} label="Total Students" value={stats.totalStudents} color="green" />
        <StatCard icon={<Award className="h-6 w-6 text-purple-500" />} label="Total Teachers" value={stats.totalTeachers} color="purple" />
        <StatCard icon={<TrendingUp className="h-6 w-6 text-orange-500" />} label="Total Impact Score" value={stats.totalImpact} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Analytics Dashboard */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-green-50 opacity-50"></div>
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 text-green-500 mr-2" />
              Platform Analytics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-56">
                <h4 className="text-sm font-semibold text-center mb-2 text-slate-500 uppercase tracking-wider">User Roles</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={roleData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="count">
                      {roleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-56">
                <h4 className="text-sm font-semibold text-center mb-2 text-slate-500 uppercase tracking-wider">Role Breakdown</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roleData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-8 h-64 border-t border-slate-100 pt-6">
              <h4 className="text-sm font-semibold text-center mb-4 text-slate-500 uppercase tracking-wider">Daily Active Users (7 Days)</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                  <Line type="monotone" dataKey="users" stroke="#22c55e" strokeWidth={3} dot={{r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 text-blue-500 mr-2" />
              Recent Activity
            </h2>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => <ActivityItem key={activity.id} activity={activity} />)}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
              <p className="text-sm text-slate-500 mt-1">Manage your platform features</p>
            </div>
            <div className="p-4 space-y-2">
              <div onClick={() => setShowCreateModal(true)}>
                <AdminAction icon={<FilePlus className="h-5 w-5 text-emerald-600" />} label="Upload Challenge" description="Create a new challenge" bg="bg-emerald-100" />
              </div>
              <div onClick={() => setShowUsersModal(true)}>
                <AdminAction icon={<Users className="h-5 w-5 text-blue-600" />} label="Manage Users" description="View and manage roles" bg="bg-blue-100" />
              </div>
              <div onClick={() => setShowInstModal(true)}>
                <AdminAction icon={<Building className="h-5 w-5 text-indigo-600" />} label="Institution Settings" description="Update institution info" bg="bg-indigo-100" />
              </div>
              <div onClick={() => setShowReportsModal(true)}>
                <AdminAction icon={<FileText className="h-5 w-5 text-orange-600" />} label="Generate Reports" description="Export data to CSV" bg="bg-orange-100" />
              </div>
              <div onClick={() => setShowSettingsModal(true)}>
                <AdminAction icon={<Settings className="h-5 w-5 text-slate-600" />} label="Platform Settings" description="Global app settings" bg="bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Upload New Challenge</h3>
            <p className="text-slate-600 text-sm mb-4">Create a new environmental challenge for the platform</p>
            {createSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-center font-medium my-4">{createSuccess}</div>
            ) : (
              <form onSubmit={handleCreateChallenge} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Title</label>
                  <input type="text" required value={newChallenge.title} onChange={e => setNewChallenge({ ...newChallenge, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Category</label>
                    <select value={newChallenge.category} onChange={e => setNewChallenge({ ...newChallenge, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                      <option>Waste Management</option><option>Water Conservation</option><option>Energy Conservation</option><option>Biodiversity</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Difficulty</label>
                    <select value={newChallenge.difficulty} onChange={e => setNewChallenge({ ...newChallenge, difficulty: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                      <option>Easy</option><option>Medium</option><option>Hard</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">XP Reward</label>
                    <input type="number" value={newChallenge.xp} onChange={e => setNewChallenge({ ...newChallenge, xp: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Impact Points</label>
                    <input type="number" value={newChallenge.impactValue} onChange={e => setNewChallenge({ ...newChallenge, impactValue: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Description</label>
                  <textarea rows={3} value={newChallenge.description} onChange={e => setNewChallenge({ ...newChallenge, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 bg-slate-100 rounded-xl font-medium text-slate-700 hover:bg-slate-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors">Upload</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Manage Users Modal */}
      {showUsersModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[80vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">Manage Users</h3>
              <button onClick={() => setShowUsersModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors"><X className="h-5 w-5 text-slate-400 hover:text-slate-600"/></button>
            </div>
            <div className="overflow-y-auto flex-1 pr-2">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 rounded-t-lg">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Current Role</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Change Role</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {allUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{u.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{u.email}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'teacher' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                        <select 
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          disabled={u.id === currentUser?.id}
                          className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Institution Settings Modal */}
      {showInstModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Institution Settings</h3>
            <form onSubmit={saveInstSettings} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Institution Name</label>
                <input type="text" value={instSettings.name} onChange={e => setInstSettings({...instSettings, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Contact Email</label>
                <input type="email" value={instSettings.contactEmail} onChange={e => setInstSettings({...instSettings, contactEmail: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowInstModal(false)} className="flex-1 py-2.5 bg-slate-100 rounded-xl font-medium text-slate-700 hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Reports Modal */}
      {showReportsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl relative text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4 shadow-inner">
              <Download className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Export Data</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">Download a complete CSV report of all users, their roles, XP, and impact scores.</p>
            <div className="flex space-x-3">
              <button onClick={() => setShowReportsModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-medium text-slate-700 hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={downloadReport} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors shadow-sm">Download</button>
            </div>
          </div>
        </div>
      )}

      {/* Platform Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Platform Settings</h3>
            <form onSubmit={savePlatSettings} className="space-y-6">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="block text-sm font-bold text-slate-900">Allow Signups</span>
                  <span className="text-xs text-slate-500">Enable new user registration</span>
                </div>
                <input type="checkbox" checked={platSettings.allowSignups} onChange={e => setPlatSettings({...platSettings, allowSignups: e.target.checked})} className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="block text-sm font-bold text-slate-900">Maintenance Mode</span>
                  <span className="text-xs text-slate-500">Disable platform access</span>
                </div>
                <input type="checkbox" checked={platSettings.maintenanceMode} onChange={e => setPlatSettings({...platSettings, maintenanceMode: e.target.checked})} className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer" />
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowSettingsModal(false)} className="flex-1 py-2.5 bg-slate-100 rounded-xl font-medium text-slate-700 hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100 text-blue-600',
    green: 'bg-green-50 border-green-100 text-green-600',
    purple: 'bg-purple-50 border-purple-100 text-purple-600',
    orange: 'bg-orange-50 border-orange-100 text-orange-600'
  }
  return (
    <div className={`${colorClasses[color]} rounded-2xl border p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold opacity-80 uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
        </div>
        <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
      </div>
    </div>
  )
}

function ActivityItem({ activity }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-300 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="p-2.5 bg-green-50 rounded-xl"><Activity className="h-5 w-5 text-green-600" /></div>
        <div>
          <p className="font-bold text-slate-900 text-sm">{activity.challengeTitle || 'Challenge'}</p>
          <p className="text-xs font-medium text-slate-500 mt-0.5">{new Date(activity.submittedAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</p>
        </div>
      </div>
      <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${activity.status === 'approved' ? 'bg-green-100 text-green-700' : activity.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
        {activity.status}
      </span>
    </div>
  )
}

function AdminAction({ icon, label, description, bg }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer group">
      <div className="flex items-center space-x-4">
        <div className={`p-3 ${bg} rounded-xl group-hover:scale-105 transition-transform`}>{icon}</div>
        <div>
          <p className="font-bold text-slate-900">{label}</p>
          <p className="text-xs font-medium text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
    </div>
  )
}