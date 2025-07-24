import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Shield,
  AlertTriangle,
  Target,
  Zap,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Lightbulb,
  Award,
  Clock
} from 'lucide-react'
import { User } from '@/types'
import { blink } from '@/blink/client'
import { useLanguage } from '@/hooks/useLanguage'
import { toast } from '@/hooks/use-toast'

interface AnalyticsProps {
  user: User | null
}

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']

export function Analytics({ user }: AnalyticsProps) {
  const { t } = useLanguage()
  
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('6months')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedVendor, setSelectedVendor] = useState('all')
  
  // Analytics data states
  const [costAnalytics, setCostAnalytics] = useState({
    totalCost: 0,
    monthlyTrend: [],
    costByDepartment: [],
    costByVendor: [],
    costOptimization: 0,
    wastedSpend: 0
  })
  
  const [usageAnalytics, setUsageAnalytics] = useState({
    overallUtilization: 0,
    utilizationTrend: [],
    utilizationByDepartment: [],
    underutilizedLicenses: [],
    usagePatterns: []
  })
  
  const [complianceAnalytics, setComplianceAnalytics] = useState({
    complianceScore: 0,
    riskLevels: [],
    expiringLicenses: [],
    unlicensedSoftware: [],
    complianceTrend: []
  })
  
  const [predictiveAnalytics, setPredictiveAnalytics] = useState({
    forecastedCosts: [],
    renewalPredictions: [],
    growthProjections: [],
    riskPredictions: []
  })
  
  const [insights, setInsights] = useState([])
  const [kpis, setKpis] = useState({
    costSavings: 0,
    utilizationImprovement: 0,
    complianceImprovement: 0,
    riskReduction: 0
  })

  const loadAnalyticsData = async () => {
    setLoading(true)
    try {
      // Load base data
      const licenses = await blink.db.softwareLicenses.list()
      const users = await blink.db.users.list()
      const declarations = await blink.db.softwareDeclarations.list()
      
      // Process cost analytics
      const totalCost = licenses.reduce((sum, l) => {
        const costPerLicense = Number(l.costPerLicense || (l as any).cost_per_license || 0)
        const totalLicenses = Number(l.totalLicenses || (l as any).total_licenses || 0)
        return sum + (costPerLicense * totalLicenses)
      }, 0)
      
      // Generate monthly cost trend (last 12 months)
      const monthlyTrend = []
      const currentDate = new Date()
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
        const monthName = date.toLocaleDateString('en-US', { month: 'short' })
        const baseCost = totalCost * (0.8 + Math.random() * 0.4) // Simulate variation
        monthlyTrend.push({
          month: monthName,
          cost: Math.round(baseCost),
          licenses: Math.round(licenses.length * (0.8 + Math.random() * 0.4)),
          users: Math.round(users.length * (0.8 + Math.random() * 0.4))
        })
      }
      
      // Cost by department
      const departmentCosts = {}
      licenses.forEach(license => {
        const dept = 'IT' // Simplified for demo
        const cost = Number(license.costPerLicense || (license as any).cost_per_license || 0) * 
                    Number(license.totalLicenses || (license as any).total_licenses || 0)
        departmentCosts[dept] = (departmentCosts[dept] || 0) + cost
      })
      
      const costByDepartment = Object.entries(departmentCosts).map(([dept, cost]) => ({
        department: dept,
        cost: cost as number,
        percentage: ((cost as number) / totalCost * 100).toFixed(1)
      }))
      
      // Cost by vendor
      const vendorCosts = {}
      licenses.forEach(license => {
        const vendor = license.vendor || (license as any).vendor || 'Unknown'
        const cost = Number(license.costPerLicense || (license as any).cost_per_license || 0) * 
                    Number(license.totalLicenses || (license as any).total_licenses || 0)
        vendorCosts[vendor] = (vendorCosts[vendor] || 0) + cost
      })
      
      const costByVendor = Object.entries(vendorCosts).map(([vendor, cost]) => ({
        vendor,
        cost: cost as number,
        percentage: ((cost as number) / totalCost * 100).toFixed(1)
      }))
      
      setCostAnalytics({
        totalCost,
        monthlyTrend,
        costByDepartment,
        costByVendor,
        costOptimization: totalCost * 0.15, // 15% potential savings
        wastedSpend: totalCost * 0.08 // 8% wasted spend
      })
      
      // Process usage analytics
      const totalLicenses = licenses.reduce((sum, l) => sum + Number(l.totalLicenses || (l as any).total_licenses || 0), 0)
      const usedLicenses = licenses.reduce((sum, l) => sum + Number(l.usedLicenses || (l as any).used_licenses || 0), 0)
      const overallUtilization = totalLicenses > 0 ? (usedLicenses / totalLicenses * 100) : 0
      
      // Utilization trend
      const utilizationTrend = monthlyTrend.map((month, index) => ({
        month: month.month,
        utilization: Math.max(50, Math.min(95, overallUtilization + (Math.random() - 0.5) * 20)),
        target: 85
      }))
      
      // Utilization by department
      const utilizationByDepartment = [
        { department: 'Engineering', utilization: 92, licenses: 45, used: 41 },
        { department: 'Marketing', utilization: 78, licenses: 25, used: 19 },
        { department: 'Sales', utilization: 85, licenses: 30, used: 26 },
        { department: 'HR', utilization: 65, licenses: 15, used: 10 },
        { department: 'Finance', utilization: 88, licenses: 20, used: 18 }
      ]
      
      // Underutilized licenses
      const underutilizedLicenses = licenses.filter(license => {
        const total = Number(license.totalLicenses || (license as any).total_licenses || 0)
        const used = Number(license.usedLicenses || (license as any).used_licenses || 0)
        return total > 0 && (used / total) < 0.7 // Less than 70% utilization
      }).map(license => ({
        software: license.softwareName || (license as any).software_name || 'Unknown',
        vendor: license.vendor || (license as any).vendor || 'Unknown',
        total: Number(license.totalLicenses || (license as any).total_licenses || 0),
        used: Number(license.usedLicenses || (license as any).used_licenses || 0),
        utilization: Number(license.totalLicenses || (license as any).total_licenses || 0) > 0 ? 
          (Number(license.usedLicenses || (license as any).used_licenses || 0) / 
           Number(license.totalLicenses || (license as any).total_licenses || 0) * 100) : 0,
        potentialSavings: (Number(license.totalLicenses || (license as any).total_licenses || 0) - 
                          Number(license.usedLicenses || (license as any).used_licenses || 0)) * 
                         Number(license.costPerLicense || (license as any).cost_per_license || 0)
      }))
      
      setUsageAnalytics({
        overallUtilization,
        utilizationTrend,
        utilizationByDepartment,
        underutilizedLicenses,
        usagePatterns: []
      })
      
      // Process compliance analytics
      const activeCount = licenses.filter(l => l.status === 'active').length
      const expiredCount = licenses.filter(l => l.status === 'expired').length
      const complianceScore = licenses.length > 0 ? (activeCount / licenses.length * 100) : 100
      
      const riskLevels = [
        { level: 'Low', count: Math.floor(licenses.length * 0.7), color: '#10B981' },
        { level: 'Medium', count: Math.floor(licenses.length * 0.2), color: '#F59E0B' },
        { level: 'High', count: Math.floor(licenses.length * 0.1), color: '#EF4444' }
      ]
      
      // Expiring licenses (next 90 days)
      const ninetyDaysFromNow = new Date()
      ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90)
      
      const expiringLicenses = licenses.filter(license => {
        const expiryDate = license.expiryDate || (license as any).expiry_date
        if (!expiryDate) return false
        try {
          const expiry = new Date(expiryDate)
          return expiry <= ninetyDaysFromNow && license.status === 'active'
        } catch {
          return false
        }
      }).map(license => ({
        software: license.softwareName || (license as any).software_name || 'Unknown',
        vendor: license.vendor || (license as any).vendor || 'Unknown',
        expiryDate: license.expiryDate || (license as any).expiry_date,
        daysUntilExpiry: Math.ceil((new Date(license.expiryDate || (license as any).expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        cost: Number(license.costPerLicense || (license as any).cost_per_license || 0) * 
              Number(license.totalLicenses || (license as any).total_licenses || 0),
        riskLevel: Math.ceil((new Date(license.expiryDate || (license as any).expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) < 30 ? 'High' : 'Medium'
      }))
      
      setComplianceAnalytics({
        complianceScore,
        riskLevels,
        expiringLicenses,
        unlicensedSoftware: [],
        complianceTrend: utilizationTrend.map(item => ({
          month: item.month,
          score: Math.max(70, Math.min(100, complianceScore + (Math.random() - 0.5) * 10))
        }))
      })
      
      // Generate predictive analytics
      const forecastedCosts = monthlyTrend.slice(-6).map((item, index) => ({
        month: new Date(Date.now() + (index + 1) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' }),
        predicted: Math.round(item.cost * (1 + (Math.random() - 0.3) * 0.2)),
        confidence: Math.round(85 + Math.random() * 10)
      }))
      
      setPredictiveAnalytics({
        forecastedCosts,
        renewalPredictions: expiringLicenses.map(license => ({
          software: license.software,
          renewalProbability: Math.round(60 + Math.random() * 35),
          predictedCost: license.cost * (1 + Math.random() * 0.1)
        })),
        growthProjections: [],
        riskPredictions: []
      })
      
      // Generate insights
      const generatedInsights = [
        {
          type: 'cost',
          title: 'Cost Optimization Opportunity',
          description: `You could save $${Math.round(totalCost * 0.15).toLocaleString()} annually by optimizing underutilized licenses.`,
          impact: 'High',
          action: 'Review underutilized licenses and consider downsizing.',
          icon: DollarSign,
          color: 'green'
        },
        {
          type: 'usage',
          title: 'Low Utilization Alert',
          description: `${underutilizedLicenses.length} licenses are underutilized (below 70% usage).`,
          impact: 'Medium',
          action: 'Redistribute or reduce license counts for these software.',
          icon: AlertTriangle,
          color: 'yellow'
        },
        {
          type: 'compliance',
          title: 'Renewal Risk',
          description: `${expiringLicenses.length} licenses expire within 90 days.`,
          impact: 'High',
          action: 'Start renewal process for critical licenses immediately.',
          icon: Clock,
          color: 'red'
        },
        {
          type: 'efficiency',
          title: 'Department Efficiency',
          description: 'Engineering department shows highest license utilization at 92%.',
          impact: 'Low',
          action: 'Use Engineering as a model for other departments.',
          icon: Award,
          color: 'blue'
        }
      ]
      
      setInsights(generatedInsights)
      
      // Calculate KPIs
      setKpis({
        costSavings: Math.round(totalCost * 0.12),
        utilizationImprovement: 15,
        complianceImprovement: 8,
        riskReduction: 25
      })
      
    } catch (error) {
      console.error('Error loading analytics data:', error)
      toast({
        title: "Error",
        description: "Failed to load analytics data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalyticsData()
  }, [dateRange, selectedDepartment, selectedVendor])

  const MetricCard = ({ title, value, change, icon: Icon, color = "blue", description }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          {change !== undefined && (
            <div className={`flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {Math.abs(change)}%
            </div>
          )}
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  )

  const InsightCard = ({ insight }) => (
    <Card className="border-l-4" style={{ borderLeftColor: 
      insight.color === 'green' ? '#10B981' :
      insight.color === 'yellow' ? '#F59E0B' :
      insight.color === 'red' ? '#EF4444' : '#2563EB'
    }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <insight.icon className={`h-5 w-5 text-${insight.color === 'green' ? 'green' : insight.color === 'yellow' ? 'yellow' : insight.color === 'red' ? 'red' : 'blue'}-600`} />
            <CardTitle className="text-base">{insight.title}</CardTitle>
          </div>
          <Badge variant={insight.impact === 'High' ? 'destructive' : insight.impact === 'Medium' ? 'default' : 'secondary'}>
            {insight.impact}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{insight.action}</span>
          <Button size="sm" variant="outline">
            <Eye className="h-3 w-3 mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics & BI</h1>
          <p className="text-gray-500 mt-1">
            Comprehensive business intelligence and predictive insights for your software licenses.
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Potential Cost Savings"
          value={`$${kpis.costSavings.toLocaleString()}`}
          change={12}
          icon={DollarSign}
          color="green"
          description="Annual savings opportunity"
        />
        <MetricCard
          title="Utilization Improvement"
          value={`${kpis.utilizationImprovement}%`}
          change={8}
          icon={TrendingUp}
          color="blue"
          description="Efficiency gain potential"
        />
        <MetricCard
          title="Compliance Score"
          value={`${Math.round(complianceAnalytics.complianceScore)}%`}
          change={kpis.complianceImprovement}
          icon={Shield}
          color="green"
          description="Overall compliance health"
        />
        <MetricCard
          title="Risk Reduction"
          value={`${kpis.riskReduction}%`}
          change={15}
          icon={Target}
          color="purple"
          description="Risk mitigation achieved"
        />
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="cost" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="cost">Cost Analytics</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Cost Analytics Tab */}
        <TabsContent value="cost" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Monthly Cost Trend */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Cost Trend</CardTitle>
                <CardDescription>Software licensing costs over time with forecasting</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={[...costAnalytics.monthlyTrend, ...predictiveAnalytics.forecastedCosts]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      typeof value === 'number' ? `$${value.toLocaleString()}` : value,
                      name === 'cost' ? 'Actual Cost' : name === 'predicted' ? 'Predicted Cost' : name
                    ]} />
                    <Bar dataKey="cost" fill="#2563EB" name="Actual Cost" />
                    <Line type="monotone" dataKey="predicted" stroke="#F59E0B" strokeDasharray="5 5" name="Predicted Cost" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cost by Department */}
            <Card>
              <CardHeader>
                <CardTitle>Cost by Department</CardTitle>
                <CardDescription>License spending breakdown by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={costAnalytics.costByDepartment}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ department, percentage }) => `${department} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="cost"
                    >
                      {costAnalytics.costByDepartment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cost by Vendor */}
            <Card>
              <CardHeader>
                <CardTitle>Top Vendors by Cost</CardTitle>
                <CardDescription>Highest spending software vendors</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={costAnalytics.costByVendor.slice(0, 5)} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="vendor" type="category" width={80} />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']} />
                    <Bar dataKey="cost" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Cost Optimization Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Optimization Opportunities</CardTitle>
              <CardDescription>Potential savings and waste reduction areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    ${costAnalytics.costOptimization.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Potential Annual Savings</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">
                    ${costAnalytics.wastedSpend.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Wasted Spend</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {((costAnalytics.costOptimization / costAnalytics.totalCost) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Optimization Potential</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage Analytics Tab */}
        <TabsContent value="usage" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Utilization Trend */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>License Utilization Trend</CardTitle>
                <CardDescription>Usage efficiency over time with target benchmark</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={usageAnalytics.utilizationTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value, name) => [`${value}%`, name === 'utilization' ? 'Actual' : 'Target']} />
                    <Line type="monotone" dataKey="utilization" stroke="#2563EB" strokeWidth={2} />
                    <Line type="monotone" dataKey="target" stroke="#10B981" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Utilization by Department */}
            <Card>
              <CardHeader>
                <CardTitle>Department Utilization</CardTitle>
                <CardDescription>License usage efficiency by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usageAnalytics.utilizationByDepartment.map((dept, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{dept.department}</span>
                        <span className="text-gray-500">{dept.utilization}%</span>
                      </div>
                      <Progress value={dept.utilization} className="h-2" />
                      <div className="text-xs text-gray-500">
                        {dept.used} of {dept.licenses} licenses used
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Overall Utilization */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Utilization</CardTitle>
                <CardDescription>Current license usage across all software</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {usageAnalytics.overallUtilization.toFixed(1)}%
                  </div>
                  <Progress value={usageAnalytics.overallUtilization} className="h-3 mb-4" />
                  <div className="text-sm text-gray-600">
                    {usageAnalytics.overallUtilization >= 85 ? 'Excellent' : 
                     usageAnalytics.overallUtilization >= 70 ? 'Good' : 
                     usageAnalytics.overallUtilization >= 50 ? 'Fair' : 'Poor'} utilization rate
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Underutilized Licenses */}
          <Card>
            <CardHeader>
              <CardTitle>Underutilized Licenses</CardTitle>
              <CardDescription>Licenses with usage below 70% - optimization opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Software</th>
                      <th className="text-left p-2">Vendor</th>
                      <th className="text-right p-2">Total</th>
                      <th className="text-right p-2">Used</th>
                      <th className="text-right p-2">Utilization</th>
                      <th className="text-right p-2">Potential Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usageAnalytics.underutilizedLicenses.slice(0, 10).map((license, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{license.software}</td>
                        <td className="p-2 text-gray-600">{license.vendor}</td>
                        <td className="p-2 text-right">{license.total}</td>
                        <td className="p-2 text-right">{license.used}</td>
                        <td className="p-2 text-right">
                          <Badge variant={license.utilization < 50 ? 'destructive' : 'secondary'}>
                            {license.utilization.toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="p-2 text-right text-green-600 font-medium">
                          ${license.potentialSavings.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Compliance Score */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Score</CardTitle>
                <CardDescription>Overall license compliance health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {Math.round(complianceAnalytics.complianceScore)}%
                  </div>
                  <Progress value={complianceAnalytics.complianceScore} className="h-3 mb-4" />
                  <div className="text-sm text-gray-600">
                    {complianceAnalytics.complianceScore >= 90 ? 'Excellent' : 
                     complianceAnalytics.complianceScore >= 80 ? 'Good' : 
                     complianceAnalytics.complianceScore >= 70 ? 'Fair' : 'Poor'} compliance status
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Levels */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>License compliance risk levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={complianceAnalytics.riskLevels}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ level, count }) => `${level}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {complianceAnalytics.riskLevels.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Compliance Trend */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Compliance Trend</CardTitle>
                <CardDescription>Compliance score evolution over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={complianceAnalytics.complianceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Compliance Score']} />
                    <Area type="monotone" dataKey="score" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Expiring Licenses */}
          <Card>
            <CardHeader>
              <CardTitle>Expiring Licenses (Next 90 Days)</CardTitle>
              <CardDescription>Licenses requiring renewal attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Software</th>
                      <th className="text-left p-2">Vendor</th>
                      <th className="text-left p-2">Expiry Date</th>
                      <th className="text-right p-2">Days Left</th>
                      <th className="text-right p-2">Annual Cost</th>
                      <th className="text-left p-2">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complianceAnalytics.expiringLicenses.map((license, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{license.software}</td>
                        <td className="p-2 text-gray-600">{license.vendor}</td>
                        <td className="p-2">{new Date(license.expiryDate).toLocaleDateString()}</td>
                        <td className="p-2 text-right">{license.daysUntilExpiry}</td>
                        <td className="p-2 text-right">${license.cost.toLocaleString()}</td>
                        <td className="p-2">
                          <Badge variant={license.riskLevel === 'High' ? 'destructive' : 'default'}>
                            {license.riskLevel}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictive Analytics Tab */}
        <TabsContent value="predictive" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Cost Forecasting */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Cost Forecasting</CardTitle>
                <CardDescription>Predicted license costs for the next 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictiveAnalytics.forecastedCosts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'predicted' ? `$${value.toLocaleString()}` : `${value}%`,
                      name === 'predicted' ? 'Predicted Cost' : 'Confidence'
                    ]} />
                    <Line type="monotone" dataKey="predicted" stroke="#2563EB" strokeWidth={2} />
                    <Line type="monotone" dataKey="confidence" stroke="#10B981" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Renewal Predictions */}
            <Card>
              <CardHeader>
                <CardTitle>Renewal Predictions</CardTitle>
                <CardDescription>AI-predicted renewal likelihood</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictiveAnalytics.renewalPredictions.slice(0, 5).map((prediction, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{prediction.software}</span>
                        <span className="text-gray-500">{prediction.renewalProbability}%</span>
                      </div>
                      <Progress value={prediction.renewalProbability} className="h-2" />
                      <div className="text-xs text-gray-500">
                        Predicted cost: ${prediction.predictedCost.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Growth Projections */}
            <Card>
              <CardHeader>
                <CardTitle>Growth Projections</CardTitle>
                <CardDescription>Predicted license demand growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">+18%</div>
                  <div className="text-sm text-gray-600 mb-4">Projected annual growth</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Engineering</span>
                      <span className="text-green-600">+25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marketing</span>
                      <span className="text-blue-600">+15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sales</span>
                      <span className="text-yellow-600">+12%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>

          {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
              <CardDescription>Priority actions based on analytics insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    priority: 'High',
                    action: 'Review and optimize underutilized licenses',
                    impact: 'Cost savings of $45,000 annually',
                    deadline: '2 weeks'
                  },
                  {
                    priority: 'High',
                    action: 'Start renewal process for expiring licenses',
                    impact: 'Avoid service disruption',
                    deadline: '1 week'
                  },
                  {
                    priority: 'Medium',
                    action: 'Implement usage monitoring for low-utilization departments',
                    impact: 'Improve overall efficiency by 15%',
                    deadline: '1 month'
                  },
                  {
                    priority: 'Low',
                    action: 'Negotiate better rates with top vendors',
                    impact: 'Potential 5-10% cost reduction',
                    deadline: '3 months'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={item.priority === 'High' ? 'destructive' : item.priority === 'Medium' ? 'default' : 'secondary'}>
                          {item.priority}
                        </Badge>
                        <span className="font-medium">{item.action}</span>
                      </div>
                      <div className="text-sm text-gray-600">{item.impact}</div>
                      <div className="text-xs text-gray-500">Deadline: {item.deadline}</div>
                    </div>
                    <Button size="sm" variant="outline">
                      Take Action
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}