import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Dashboard } from '@/pages/Dashboard'
import LicenseManagement from '@/pages/LicenseManagement'
import UserManagement from '@/pages/UserManagement'
import SoftwareDeclarations from '@/pages/SoftwareDeclarations'
import HRMIntegration from '@/pages/HRMIntegration'
import Settings from '@/pages/Settings'
import ReportsAudits from '@/pages/ReportsAudits'
import UserInvitations from '@/pages/UserInvitations'
import { Analytics } from '@/pages/Analytics'
import SoftwareReviews from '@/pages/SoftwareReviews'
import AdminCenter from '@/pages/AdminCenter'
import { User } from '@/types'
import { blink } from '@/blink/client'
import { Toaster } from '@/components/ui/toaster'
import { LanguageProvider } from '@/contexts/LanguageContext.tsx'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const createOrUpdateUser = async (userData: User) => {
    try {
      console.log('Creating/updating user:', userData)
      
      // Check if user exists
      const existingUsers = await blink.db.users.list({
        where: { id: userData.id }
      })

      console.log('Existing users found:', existingUsers.length)

      if (existingUsers.length === 0) {
        // Create new user
        const newUser = await blink.db.users.create({
          id: userData.id,
          email: userData.email,
          fullName: userData.fullName,
          role: userData.role,
          department: userData.department,
          position: userData.position,
          status: userData.status
        })
        console.log('New user created:', newUser)
      }
    } catch (error) {
      console.error('Error creating/updating user:', error)
      // Don't block authentication if user creation fails
    }
  }

  useEffect(() => {
    console.log('Setting up auth state listener...')
    
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      console.log('Auth state changed:', {
        isLoading: state.isLoading,
        isAuthenticated: state.isAuthenticated,
        user: state.user ? { id: state.user.id, email: state.user.email } : null
      })
      
      setLoading(state.isLoading)
      
      if (state.user) {
        // Transform the auth user to our User type
        const userData: User = {
          id: state.user.id,
          email: state.user.email,
          name: state.user.displayName || state.user.email.split('@')[0],
          fullName: state.user.displayName || state.user.email,
          role: 'admin',
          department: 'IT',
          position: 'System Administrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        console.log('Setting user data:', userData)
        setUser(userData)
        
        // Create or update user in database (non-blocking)
        createOrUpdateUser(userData).catch(console.error)
      } else {
        console.log('No user found, setting user to null')
        setUser(null)
      }
    })

    return unsubscribe
  }, [])



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading LicenseHub...</p>
          <p className="mt-2 text-sm text-gray-500">Initializing authentication...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-8">
            <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">LicenseHub</h1>
            <p className="text-gray-600 mt-2">Enterprise Software License Management</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Please sign in to access your license management dashboard
            </p>
            <button
              onClick={() => {
                console.log('Sign In button clicked')
                try {
                  blink.auth.login()
                } catch (error) {
                  console.error('Login error:', error)
                }
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign In with Blink
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Layout user={user} />}>
              <Route index element={<Dashboard user={user} />} />
              <Route path="/licenses" element={<LicenseManagement />} />
              <Route path="/declarations" element={<SoftwareDeclarations />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/invitations" element={<UserInvitations />} />
              <Route path="/hrm" element={<HRMIntegration />} />
              <Route path="/analytics" element={<Analytics user={user} />} />
              <Route path="/reviews" element={<SoftwareReviews />} />
              <Route path="/reports" element={<ReportsAudits />} />
              <Route path="/admin" element={<AdminCenter />} />
              <Route path="/notifications" element={<div className="p-8 text-center text-gray-500">Notifications - Coming Soon</div>} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/support" element={<div className="p-8 text-center text-gray-500">Support - Coming Soon</div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
          <Toaster />
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App