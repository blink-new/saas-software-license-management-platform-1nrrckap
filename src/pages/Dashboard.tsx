import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import {
  Shield,
  Users,
  FileText,
  AlertTriangle,
  TrendingUp,
  Calendar,
  DollarSign,
  Activity,
  MousePointer
} from 'lucide-react'
import { User } from '@/types'
import { blink } from '@/blink/client'
import { useLanguage } from '@/hooks/useLanguage'

interface DashboardProps {
  user: User | null
}

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export function Dashboard({ user }: DashboardProps) {
  const navigate = useNavigate()
  const { t } = useLanguage()
  
  const [stats, setStats] = useState({
    totalLicenses: 0,
    activeLicenses: 0,
    totalUsers: 0,
    pendingDeclarations: 0,
    expiringLicenses: 0,
    totalCost: 0
  })

  const [licenseData, setLicenseData] = useState([])
  const [usageData, setUsageData] = useState([])
  const [costTrend, setCostTrend] = useState([])

  // Navigation handlers
  const handleNavigateToLicenses = (filter?: string) => {
    navigate('/licenses', { state: { filter } })
  }

  const handleNavigateToUsers = () => {
    navigate('/users')
  }

  const handleNavigateToDeclarations = (filter?: string) => {
    navigate('/declarations', { state: { filter } })
  }

  const handleNavigateToReports = () => {
    navigate('/reports')
  }

  const handleNavigateToSettings = () => {
    navigate('/settings')
  }

  const loadDashboardData = async () => {
    try {
      // Load licenses
      const licenses = await blink.db.softwareLicenses.list()
      const users = await blink.db.users.list()
      const declarations = await blink.db.softwareDeclarations.list({
        where: { status: 'pending' }
      })

      // Calculate stats
      const totalLicenses = licenses.length
      const activeLicenses = licenses.filter(l => l.status === 'active').length
      const totalUsers = users.length
      const pendingDeclarations = declarations.length

      // Calculate expiring licenses (within 30 days)
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      
      const expiringLicenses = licenses.filter(l => {
        const expiryDate = l.expiryDate || (l as any).expiry_date
        if (!expiryDate) return false
        try {
          const expiry = new Date(expiryDate)
          return expiry <= thirtyDaysFromNow && l.status === 'active'
        } catch (error) {
          return false
        }
      }).length

      // Calculate total cost
      const totalCost = licenses.reduce((sum, l) => {
        const costPerLicense = Number(l.costPerLicense || (l as any).cost_per_license || 0)
        const totalLicenses = Number(l.totalLicenses || (l as any).total_licenses || 0)
        return sum + (costPerLicense * totalLicenses)
      }, 0)

      setStats({
        totalLicenses,
        activeLicenses,
        totalUsers,
        pendingDeclarations,
        expiringLicenses,
        totalCost
      })

      // Prepare chart data
      const licensesByVendor = licenses.reduce((acc, license) => {
        const vendor = license.vendor || (license as any).vendor || 'Unknown'
        const totalLicenses = Number(license.totalLicenses || (license as any).total_licenses || 0)
        acc[vendor] = (acc[vendor] || 0) + totalLicenses
        return acc
      }, {} as Record<string, number>)

      const chartData = Object.entries(licensesByVendor).map(([vendor, count]) => ({
        vendor,
        licenses: count
      }))

      setLicenseData(chartData)

      // Usage data for pie chart
      const usageStats = [
        { name: 'Used', value: licenses.reduce((sum, l) => sum + Number(l.usedLicenses || (l as any).used_licenses || 0), 0) },
        { name: 'Available', value: licenses.reduce((sum, l) => {
          const total = Number(l.totalLicenses || (l as any).total_licenses || 0)
          const used = Number(l.usedLicenses || (l as any).used_licenses || 0)
          return sum + (total - used)
        }, 0) }
      ]
      setUsageData(usageStats)

      // Mock cost trend data
      const mockCostTrend = [
        { month: 'Jan', cost: 45000 },
        { month: 'Feb', cost: 47000 },
        { month: 'Mar', cost: 49000 },
        { month: 'Apr', cost: 52000 },
        { month: 'May', cost: 48000 },
        { month: 'Jun', cost: totalCost }
      ]
      setCostTrend(mockCostTrend)

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])



  const StatCard = ({ title, value, description, icon: Icon, trend, color = "blue", onClick }) => {
    const getIconColorClass = (color: string) => {
      switch (color) {
        case 'blue': return 'text-blue-600 group-hover:text-blue-700'
        case 'green': return 'text-green-600 group-hover:text-green-700'
        case 'yellow': return 'text-yellow-600 group-hover:text-yellow-700'
        case 'red': return 'text-red-600 group-hover:text-red-700'
        default: return 'text-blue-600 group-hover:text-blue-700'
      }
    }

    return (
      <Card 
        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 group"
        onClick={onClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium group-hover:text-blue-600 transition-colors">
            {title}
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Icon className={`h-4 w-4 ${getIconColorClass(color)} transition-colors`} />
            <MousePointer className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold group-hover:text-blue-600 transition-colors">{value}</div>
          <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
            {description}
            {trend && (
              <span className={`ml-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.fullName.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 mt-1">
            Here's what's happening with your software licenses today.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => handleNavigateToReports()}
            className="hover:bg-blue-50 hover:border-blue-200 transition-colors"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {t('generateReport') || "Generate Report"}
          </Button>
          <Button
            onClick={() => handleNavigateToLicenses()}
            className="hover:bg-blue-600 transition-colors"
          >
            <Shield className="mr-2 h-4 w-4" />
            {t('addLicense') || "Add License"}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('totalLicenses') || "Total Licenses"}
          value={stats.totalLicenses.toLocaleString()}
          description={t('activeSoftwareLicenses') || "Active software licenses"}
          icon={Shield}
          trend={5.2}
          color="blue"
          onClick={() => handleNavigateToLicenses()}
        />
        <StatCard
          title={t('activeUsers') || "Active Users"}
          value={stats.totalUsers.toLocaleString()}
          description={t('licensedUsers') || "Licensed users"}
          icon={Users}
          trend={2.1}
          color="green"
          onClick={() => handleNavigateToUsers()}
        />
        <StatCard
          title={t('pendingDeclarations') || "Pending Declarations"}
          value={stats.pendingDeclarations.toLocaleString()}
          description={t('awaitingReview') || "Awaiting review"}
          icon={FileText}
          color="yellow"
          onClick={() => handleNavigateToDeclarations('pending')}
        />
        <StatCard
          title={t('expiringSoon') || "Expiring Soon"}
          value={stats.expiringLicenses.toLocaleString()}
          description={t('within30Days') || "Within 30 days"}
          icon={AlertTriangle}
          color="red"
          onClick={() => handleNavigateToLicenses('expiring')}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* License Distribution */}
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 group">
          <CardHeader onClick={() => handleNavigateToLicenses()}>
            <CardTitle className="group-hover:text-blue-600 transition-colors flex items-center justify-between">
              {t('licenseDistributionByVendor') || "License Distribution by Vendor"}
              <MousePointer className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardTitle>
            <CardDescription>
              {t('numberOfLicensesPerVendor') || "Number of licenses per software vendor"}
            </CardDescription>
          </CardHeader>
          <CardContent onClick={() => handleNavigateToLicenses()}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={licenseData}
                onClick={(data) => {
                  if (data && data.activeLabel) {
                    handleNavigateToLicenses(data.activeLabel)
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vendor" />
                <YAxis />
                <Tooltip 
                  cursor={{ fill: 'rgba(37, 99, 235, 0.1)' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-medium">{`${label}: ${payload[0].value} licenses`}</p>
                          <p className="text-xs text-gray-500">Click to filter by vendor</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar 
                  dataKey="licenses" 
                  fill="#2563EB" 
                  className="hover:fill-blue-700 cursor-pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* License Usage */}
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 group">
          <CardHeader onClick={() => handleNavigateToLicenses()}>
            <CardTitle className="group-hover:text-blue-600 transition-colors flex items-center justify-between">
              {t('licenseUsageOverview') || "License Usage Overview"}
              <MousePointer className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardTitle>
            <CardDescription>
              {t('currentUtilizationOfLicenses') || "Current utilization of available licenses"}
            </CardDescription>
          </CardHeader>
          <CardContent onClick={() => handleNavigateToLicenses()}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={usageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={() => handleNavigateToLicenses()}
                >
                  {usageData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-medium">{`${payload[0].name}: ${payload[0].value} licenses`}</p>
                          <p className="text-xs text-gray-500">Click to view license details</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Cost Trend */}
        <Card className="md:col-span-2 cursor-pointer hover:shadow-lg transition-all duration-200 group">
          <CardHeader onClick={() => handleNavigateToReports()}>
            <CardTitle className="group-hover:text-blue-600 transition-colors flex items-center justify-between">
              {t('licenseCostTrend') || "License Cost Trend"}
              <MousePointer className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardTitle>
            <CardDescription>
              {t('monthlySoftwareLicensingCosts') || "Monthly software licensing costs over time"}
            </CardDescription>
          </CardHeader>
          <CardContent onClick={() => handleNavigateToReports()}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart 
                data={costTrend}
                onClick={() => handleNavigateToReports()}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value.toLocaleString()}`, 'Cost']}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-medium">{`${label}: ${payload[0].value.toLocaleString()}`}</p>
                          <p className="text-xs text-gray-500">Click to view detailed cost reports</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cost" 
                  stroke="#2563EB" 
                  strokeWidth={2}
                  className="hover:stroke-blue-700 cursor-pointer"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('quickActions') || "Quick Actions"}</CardTitle>
            <CardDescription>
              {t('commonTasksAndShortcuts') || "Common tasks and shortcuts"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-blue-50 hover:border-blue-200 transition-colors"
              onClick={() => handleNavigateToLicenses()}
            >
              <Shield className="mr-2 h-4 w-4" />
              {t('addNewLicense') || "Add New License"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-green-50 hover:border-green-200 transition-colors"
              onClick={() => handleNavigateToUsers()}
            >
              <Users className="mr-2 h-4 w-4" />
              {t('assignLicense') || "Assign License"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-yellow-50 hover:border-yellow-200 transition-colors"
              onClick={() => handleNavigateToDeclarations()}
            >
              <FileText className="mr-2 h-4 w-4" />
              {t('reviewDeclarations') || "Review Declarations"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-purple-50 hover:border-purple-200 transition-colors"
              onClick={() => handleNavigateToReports()}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              {t('generateReport') || "Generate Report"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg" onClick={() => handleNavigateToReports()}>
          <CardTitle className="flex items-center justify-between hover:text-blue-600 transition-colors">
            {t('recentActivity') || "Recent Activity"}
            <MousePointer className="h-4 w-4 text-gray-400 opacity-0 hover:opacity-100 transition-opacity" />
          </CardTitle>
          <CardDescription>
            {t('latestLicenseManagementActivities') || "Latest license management activities"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: t('licenseAssigned') || 'License assigned',
                details: 'Adobe Creative Suite assigned to John Doe (Marketing)',
                time: '2 hours ago',
                type: 'success',
                route: '/licenses'
              },
              {
                action: t('declarationSubmitted') || 'Declaration submitted',
                details: 'Sarah Wilson declared usage of Slack Premium',
                time: '4 hours ago',
                type: 'info',
                route: '/declarations'
              },
              {
                action: t('licenseExpiring') || 'License expiring',
                details: 'Microsoft Office 365 expires in 15 days',
                time: '6 hours ago',
                type: 'warning',
                route: '/licenses'
              },
              {
                action: t('newUserAdded') || 'New user added',
                details: 'Mike Johnson added to Development team',
                time: '1 day ago',
                type: 'info',
                route: '/users'
              }
            ].map((activity, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:shadow-sm group"
                onClick={() => navigate(activity.route)}
              >
                <div className={`h-2 w-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium group-hover:text-blue-600 transition-colors">{activity.action}</p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">{activity.details}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">{activity.time}</span>
                  <MousePointer className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full hover:bg-blue-50 hover:border-blue-200 transition-colors"
              onClick={() => handleNavigateToReports()}
            >
              <Activity className="mr-2 h-4 w-4" />
              {t('viewAllActivity') || "View All Activity"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}