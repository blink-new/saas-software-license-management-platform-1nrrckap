import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '@blinkdotnew/sdk'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'
import { 
  Building2, 
  Users, 
  Database, 
  Download, 
  Key, 
  TrendingUp, 
  BarChart3, 
  FileText, 
  Globe, 
  Shield, 
  Calendar,
  Eye,
  Settings,
  Plus,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Copy,
  Trash2,
  Edit
} from 'lucide-react'

const blink = createClient({
  projectId: 'saas-software-license-management-platform-1nrrckap',
  authRequired: true
})

interface Company {
  id: string
  name: string
  domain?: string
  industry?: string
  size?: 'startup' | 'sme' | 'enterprise'
  country?: string
  employees_count?: number
  consent_given?: boolean
  consent_date?: string
  created_at?: string
  is_active?: boolean
}

interface AdminUser {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'analyst' | 'viewer'
  permissions?: string
  created_at?: string
  last_login?: string
  is_active?: boolean
}

interface ApiKey {
  id: string
  key_name: string
  api_key: string
  platform: 'lebonlogiciel' | 'prospection_saas' | 'internal'
  permissions?: string
  rate_limit?: number
  created_by?: string
  created_at?: string
  last_used?: string
  is_active?: boolean
}

interface MarketIntelligence {
  id: string
  software_name: string
  vendor?: string
  category?: string
  total_reviews?: number
  average_rating?: number
  market_share?: number
  satisfaction_score?: number
  renewal_rate?: number
  price_range_min?: number
  price_range_max?: number
  last_updated?: string
}

interface ExportLog {
  id: string
  export_type: 'csv' | 'excel' | 'json' | 'api'
  data_type: 'companies' | 'users' | 'reviews' | 'licenses' | 'aggregated'
  platform?: 'lebonlogiciel' | 'prospection_saas' | 'manual'
  exported_by?: string
  record_count?: number
  anonymized?: boolean
  created_at?: string
  status?: 'pending' | 'completed' | 'failed'
}

export default function AdminCenter() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [marketIntelligence, setMarketIntelligence] = useState<MarketIntelligence[]>([])
  const [exportLogs, setExportLogs] = useState<ExportLog[]>([])
  const [apiEndpoints, setApiEndpoints] = useState<any[]>([])
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [competitiveIntelligence, setCompetitiveIntelligence] = useState<any[]>([])
  const [biMetrics, setBiMetrics] = useState<any[]>([])
  const [biDashboards, setBiDashboards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all')
  const [selectedSize, setSelectedSize] = useState<string>('all')

  // Statistics
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalUsers: 0,
    totalReviews: 0,
    totalLicenses: 0,
    avgSatisfaction: 0,
    marketCoverage: 0
  })

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Load all admin center data
      const [
        companiesData,
        adminUsersData,
        apiKeysData,
        marketIntelligenceData,
        exportLogsData,
        apiEndpointsData,
        webhooksData,
        competitiveIntelligenceData,
        biMetricsData,
        biDashboardsData,
        usersData,
        reviewsData,
        licensesData
      ] = await Promise.all([
        blink.db.companies.list(),
        blink.db.adminUsers.list(),
        blink.db.apiKeys.list(),
        blink.db.marketIntelligence.list(),
        blink.db.exportLogs.list({ orderBy: { created_at: 'desc' }, limit: 50 }),
        blink.db.apiEndpoints.list(),
        blink.db.webhooks.list(),
        blink.db.competitiveIntelligence.list(),
        blink.db.biMetrics.list(),
        blink.db.biDashboards.list(),
        blink.db.users.list(),
        blink.db.softwareReviews.list(),
        blink.db.softwareLicenses.list()
      ])

      setCompanies(companiesData)
      setAdminUsers(adminUsersData)
      setApiKeys(apiKeysData)
      setMarketIntelligence(marketIntelligenceData)
      setExportLogs(exportLogsData)
      setApiEndpoints(apiEndpointsData)
      setWebhooks(webhooksData)
      setCompetitiveIntelligence(competitiveIntelligenceData)
      setBiMetrics(biMetricsData)
      setBiDashboards(biDashboardsData)

      // Calculate statistics
      const avgRating = reviewsData.length > 0 
        ? reviewsData.reduce((sum, review) => sum + (Number(review.overallRating || review.overall_rating) || 0), 0) / reviewsData.length
        : 0

      setStats({
        totalCompanies: companiesData.length,
        totalUsers: usersData.length,
        totalReviews: reviewsData.length,
        totalLicenses: licensesData.length,
        avgSatisfaction: avgRating,
        marketCoverage: marketIntelligenceData.length
      })

    } catch (error) {
      console.error('Error loading admin center data:', error)
      toast({
        title: "Error",
        description: "Failed to load admin center data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleExportData = async (dataType: string, format: string, platform: string, anonymize: boolean = false) => {
    try {
      const exportId = `export_${Date.now()}`
      
      // Create export log
      await blink.db.exportLogs.create({
        id: exportId,
        export_type: format,
        data_type: dataType,
        platform: platform === 'manual' ? 'manual' : platform,
        exported_by: 'admin_001', // Current user
        anonymized: anonymize,
        status: 'pending'
      })

      // Simulate export process
      let exportData: any = {}
      let recordCount = 0

      switch (dataType) {
        case 'companies': {
          const companiesExport = companies.map(company => ({
            ...(anonymize ? {
              company_id: company.id,
              industry: company.industry,
              size: company.size,
              country: company.country,
              employees_count: company.employees_count
            } : company)
          }))
          exportData = { companies: companiesExport }
          recordCount = companiesExport.length
          break
        }

        case 'reviews': {
          const reviewsData = await blink.db.softwareReviews.list()
          const reviewsExport = reviewsData.map(review => ({
            software_name: review.softwareName || review.software_name,
            vendor: review.vendor,
            overall_rating: review.overallRating || review.overall_rating,
            review_text: review.reviewText || review.review_text,
            pros: review.pros,
            cons: review.cons,
            ...(anonymize ? {
              user_department: review.userDepartment || review.user_department,
              user_role: 'anonymized'
            } : {
              user_name: review.userName || review.user_name,
              user_email: review.userEmail || review.user_email,
              user_department: review.userDepartment || review.user_department
            }),
            created_at: review.createdAt || review.created_at
          }))
          exportData = { reviews: reviewsExport }
          recordCount = reviewsExport.length
          break
        }

        case 'aggregated': {
          exportData = {
            market_intelligence: marketIntelligence,
            statistics: stats,
            software_rankings: marketIntelligence
              .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
              .slice(0, 50)
          }
          recordCount = marketIntelligence.length
          break
        }
      }

      // Update export log
      await blink.db.exportLogs.update(exportId, {
        record_count: recordCount,
        status: 'completed',
        completed_at: new Date().toISOString()
      })

      // Generate download (simulate)
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${dataType}_export_${format}_${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: `${dataType} data exported successfully (${recordCount} records)`
      })

      loadData() // Refresh export logs

    } catch (error) {
      console.error('Error exporting data:', error)
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive"
      })
    }
  }

  const handleGenerateApiKey = async (keyName: string, platform: string, permissions: string[]) => {
    try {
      const apiKey = `${platform}_live_sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      
      await blink.db.apiKeys.create({
        id: `api_${Date.now()}`,
        key_name: keyName,
        api_key: apiKey,
        platform: platform as 'lebonlogiciel' | 'prospection_saas' | 'internal',
        permissions: JSON.stringify(permissions),
        rate_limit: platform === 'lebonlogiciel' ? 5000 : 2000,
        created_by: 'admin_001',
        is_active: true
      })

      toast({
        title: "API Key Generated",
        description: `New API key created for ${platform}`
      })

      loadData()
    } catch (error) {
      console.error('Error generating API key:', error)
      toast({
        title: "Error",
        description: "Failed to generate API key",
        variant: "destructive"
      })
    }
  }

  const filteredCompanies = companies.filter(company => {
    // Safe property access with fallbacks for both camelCase and snake_case
    const companyName = (company.name || (company as any).company_name || '').toString().toLowerCase()
    const companyDomain = (company.domain || (company as any).company_domain || '').toString().toLowerCase()
    const searchLower = searchTerm.toLowerCase()
    
    const matchesSearch = !searchTerm || 
      companyName.includes(searchLower) ||
      companyDomain.includes(searchLower)
    
    const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry
    const matchesSize = selectedSize === 'all' || company.size === selectedSize
    
    return matchesSearch && matchesIndustry && matchesSize
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading Admin Center...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Center</h1>
          <p className="text-gray-600">Multi-company data aggregation and export management</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Across all companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">Software reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Licenses</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLicenses}</div>
            <p className="text-xs text-muted-foreground">Managed licenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSatisfaction.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Average rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.marketCoverage}</div>
            <p className="text-xs text-muted-foreground">Software tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="companies" className="space-y-4">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="exports">Data Exports</TabsTrigger>
          <TabsTrigger value="api">API Management</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="intelligence">Market Intel</TabsTrigger>
          <TabsTrigger value="competitive">Competitive</TabsTrigger>
          <TabsTrigger value="bi-analytics">BI Analytics</TabsTrigger>
          <TabsTrigger value="team">Team Access</TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
        </TabsList>

        {/* Companies Tab */}
        <TabsContent value="companies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Management</CardTitle>
              <CardDescription>Manage companies using your LicenseHub platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Input
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Company Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="sme">SME</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Companies Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Consent</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{company.name}</div>
                            <div className="text-sm text-gray-500">{company.domain}</div>
                          </div>
                        </TableCell>
                        <TableCell>{company.industry}</TableCell>
                        <TableCell>
                          <Badge variant={
                            company.size === 'enterprise' ? 'default' :
                            company.size === 'sme' ? 'secondary' : 'outline'
                          }>
                            {company.size?.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{company.employees_count}</TableCell>
                        <TableCell>
                          <Badge variant={company.consent_given ? 'default' : 'destructive'}>
                            {company.consent_given ? 'Given' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Exports Tab */}
        <TabsContent value="exports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Export Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Data Export Center</CardTitle>
                <CardDescription>Export data for lebonlogiciel.com and prospection SaaS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* LeBonLogiciel Export */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">LeBonLogiciel.com</h3>
                    <Badge variant="secondary">Anonymized</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Export anonymized data for your software comparison website</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleExportData('reviews', 'json', 'lebonlogiciel', true)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Reviews JSON
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleExportData('aggregated', 'json', 'lebonlogiciel', true)}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Market Data
                    </Button>
                  </div>
                </div>

                {/* Prospection SaaS Export */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold">Prospection SaaS</h3>
                    <Badge variant="destructive">Full Data</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Export complete company data for prospection platform</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => handleExportData('companies', 'json', 'prospection_saas', false)}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      Companies
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleExportData('users', 'excel', 'prospection_saas', false)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Users Excel
                    </Button>
                  </div>
                </div>

                {/* Manual Export */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold">Manual Export</h3>
                  </div>
                  <p className="text-sm text-gray-600">Custom data exports for analysis</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleExportData('reviews', 'csv', 'manual', false)}
                    >
                      All Reviews CSV
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleExportData('companies', 'excel', 'manual', false)}
                    >
                      Companies Excel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Exports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Exports</CardTitle>
                <CardDescription>Export history and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exportLogs.slice(0, 10).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{log.data_type} ({log.export_type})</div>
                        <div className="text-sm text-gray-500">
                          {log.platform} • {log.record_count} records
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          log.status === 'completed' ? 'default' :
                          log.status === 'failed' ? 'destructive' : 'secondary'
                        }>
                          {log.status}
                        </Badge>
                        {log.anonymized && <Badge variant="outline">Anonymized</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API Management Tab */}
        <TabsContent value="api" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Keys */}
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage API access for external platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{apiKey.key_name || (apiKey as any).key_name || 'Unnamed Key'}</h3>
                      <Badge variant={
                        (apiKey.platform || (apiKey as any).platform) === 'lebonlogiciel' ? 'default' :
                        (apiKey.platform || (apiKey as any).platform) === 'prospection_saas' ? 'secondary' : 'outline'
                      }>
                        {apiKey.platform || (apiKey as any).platform || 'unknown'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {(apiKey.api_key || (apiKey as any).api_key || 'No key available').substring(0, 20)}...
                      </code>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-gray-500">
                      Rate limit: {apiKey.rate_limit || (apiKey as any).rate_limit || 'N/A'}/hour • Created: {new Date(apiKey.created_at || (apiKey as any).created_at || '').toLocaleDateString()}
                    </div>
                  </div>
                ))}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Generate New API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Generate New API Key</DialogTitle>
                      <DialogDescription>Create a new API key for platform integration</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="keyName">Key Name</Label>
                        <Input id="keyName" placeholder="e.g., LeBonLogiciel Production" />
                      </div>
                      <div>
                        <Label htmlFor="platform">Platform</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lebonlogiciel">LeBonLogiciel.com</SelectItem>
                            <SelectItem value="prospection_saas">Prospection SaaS</SelectItem>
                            <SelectItem value="internal">Internal Use</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full">Generate API Key</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* API Endpoints */}
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>Real-time endpoints for platform integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {apiEndpoints.map((endpoint) => (
                    <div key={endpoint.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{endpoint.name || (endpoint as any).name || 'Unnamed Endpoint'}</div>
                        <Badge variant={
                          (endpoint.platform || (endpoint as any).platform) === 'lebonlogiciel' ? 'default' :
                          (endpoint.platform || (endpoint as any).platform) === 'prospection_saas' ? 'secondary' : 'outline'
                        }>
                          {endpoint.platform || (endpoint as any).platform || 'unknown'}
                        </Badge>
                      </div>
                      <code className="text-sm text-gray-600">
                        {endpoint.method || (endpoint as any).method || 'GET'} {endpoint.endpoint_url || (endpoint as any).endpoint_url || '/api/unknown'}
                      </code>
                      <div className="text-sm text-gray-500 mt-1">
                        {endpoint.description || (endpoint as any).description || 'No description'} • Rate limit: {endpoint.rate_limit || (endpoint as any).rate_limit || 'N/A'}/hour
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={(endpoint.is_active || (endpoint as any).is_active) ? 'default' : 'destructive'}>
                          {(endpoint.is_active || (endpoint as any).is_active) ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View API Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Webhook Management */}
            <Card>
              <CardHeader>
                <CardTitle>Webhook Management</CardTitle>
                <CardDescription>Real-time data sync with external platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{webhook.name || (webhook as any).name || 'Unnamed Webhook'}</h3>
                      <Badge variant={
                        (webhook.platform || (webhook as any).platform) === 'lebonlogiciel' ? 'default' :
                        (webhook.platform || (webhook as any).platform) === 'prospection_saas' ? 'secondary' : 'outline'
                      }>
                        {webhook.platform || (webhook as any).platform || 'unknown'}
                      </Badge>
                    </div>
                    
                    <div className="text-sm">
                      <div className="font-medium text-gray-700">Endpoint:</div>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">
                        {webhook.url || (webhook as any).url || 'No URL configured'}
                      </code>
                    </div>
                    
                    <div className="text-sm">
                      <div className="font-medium text-gray-700">Events:</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {JSON.parse((webhook.events || (webhook as any).events) || '[]').map((event: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-green-600 font-medium">{webhook.success_count || (webhook as any).success_count || 0}</span>
                          <span className="text-gray-500"> success</span>
                        </div>
                        <div>
                          <span className="text-red-600 font-medium">{webhook.failure_count || (webhook as any).failure_count || 0}</span>
                          <span className="text-gray-500"> failed</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={(webhook.is_active || (webhook as any).is_active) ? 'default' : 'destructive'}>
                          {(webhook.is_active || (webhook as any).is_active) ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {(webhook.last_triggered || (webhook as any).last_triggered) && (
                      <div className="text-xs text-gray-500">
                        Last triggered: {new Date(webhook.last_triggered || (webhook as any).last_triggered).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Webhook
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Webhook</DialogTitle>
                      <DialogDescription>Set up real-time data sync with external platform</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="webhookName">Webhook Name</Label>
                        <Input id="webhookName" placeholder="e.g., LeBonLogiciel Data Sync" />
                      </div>
                      <div>
                        <Label htmlFor="webhookUrl">Endpoint URL</Label>
                        <Input id="webhookUrl" placeholder="https://your-platform.com/api/webhooks" />
                      </div>
                      <div>
                        <Label htmlFor="webhookPlatform">Platform</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lebonlogiciel">LeBonLogiciel.com</SelectItem>
                            <SelectItem value="prospection_saas">Prospection SaaS</SelectItem>
                            <SelectItem value="internal">Internal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full">Create Webhook</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Webhook Events */}
            <Card>
              <CardHeader>
                <CardTitle>Webhook Events</CardTitle>
                <CardDescription>Available events for webhook subscriptions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <div className="font-medium text-blue-600">LeBonLogiciel.com Events</div>
                    <div className="space-y-1 mt-2">
                      <div className="text-sm"><code>new_review</code> - New software review submitted</div>
                      <div className="text-sm"><code>software_ranking_update</code> - Software rankings changed</div>
                      <div className="text-sm"><code>market_trend_change</code> - Market trends updated</div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="font-medium text-green-600">Prospection SaaS Events</div>
                    <div className="space-y-1 mt-2">
                      <div className="text-sm"><code>new_company</code> - New company added</div>
                      <div className="text-sm"><code>tech_stack_update</code> - Company tech stack changed</div>
                      <div className="text-sm"><code>renewal_opportunity</code> - License renewal detected</div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="font-medium text-gray-600">Internal Events</div>
                    <div className="space-y-1 mt-2">
                      <div className="text-sm"><code>export_completed</code> - Data export finished</div>
                      <div className="text-sm"><code>api_usage_alert</code> - API rate limit reached</div>
                      <div className="text-sm"><code>compliance_update</code> - Compliance status changed</div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Webhook Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Market Intelligence Tab */}
        <TabsContent value="intelligence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Intelligence</CardTitle>
              <CardDescription>Software market insights and competitive analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Software</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Reviews</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Market Share</TableHead>
                      <TableHead>Renewal Rate</TableHead>
                      <TableHead>Price Range</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketIntelligence.map((software) => (
                      <TableRow key={software.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{software.software_name}</div>
                            <div className="text-sm text-gray-500">{software.vendor}</div>
                          </div>
                        </TableCell>
                        <TableCell>{software.category}</TableCell>
                        <TableCell>{software.total_reviews}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>{software.average_rating?.toFixed(1)}</span>
                            <span className="text-yellow-500">★</span>
                          </div>
                        </TableCell>
                        <TableCell>{software.market_share?.toFixed(1)}%</TableCell>
                        <TableCell>{((software.renewal_rate || 0) * 100).toFixed(0)}%</TableCell>
                        <TableCell>
                          €{software.price_range_min} - €{software.price_range_max}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitive Intelligence Tab */}
        <TabsContent value="competitive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Intelligence</CardTitle>
              <CardDescription>Advanced competitive analysis and market positioning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Software</TableHead>
                      <TableHead>Market Share</TableHead>
                      <TableHead>Growth Rate</TableHead>
                      <TableHead>Churn Rate</TableHead>
                      <TableHead>Avg Deal Size</TableHead>
                      <TableHead>Competitive Position</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {competitiveIntelligence.map((software) => (
                      <TableRow key={software.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{software.software_name}</div>
                            <div className="text-sm text-gray-500">{software.vendor}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{software.market_share?.toFixed(1)}%</span>
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-blue-500 rounded-full" 
                                style={{ width: `${Math.min(software.market_share || 0, 100)}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            (software.growth_rate || 0) > 10 ? 'default' :
                            (software.growth_rate || 0) > 0 ? 'secondary' : 'destructive'
                          }>
                            {software.growth_rate > 0 ? '+' : ''}{software.growth_rate?.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            (software.churn_rate || 0) < 10 ? 'default' :
                            (software.churn_rate || 0) < 20 ? 'secondary' : 'destructive'
                          }>
                            {software.churn_rate?.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          €{(software.average_deal_size || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {software.competitor_analysis && JSON.parse(software.competitor_analysis).competitive_advantages?.slice(0, 2).map((advantage: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {advantage}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>{software.software_name} - Competitive Analysis</DialogTitle>
                                <DialogDescription>Detailed competitive intelligence and market positioning</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Market Metrics */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="text-center p-3 border rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{software.market_share?.toFixed(1)}%</div>
                                    <div className="text-sm text-gray-500">Market Share</div>
                                  </div>
                                  <div className="text-center p-3 border rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">+{software.growth_rate?.toFixed(1)}%</div>
                                    <div className="text-sm text-gray-500">Growth Rate</div>
                                  </div>
                                  <div className="text-center p-3 border rounded-lg">
                                    <div className="text-2xl font-bold text-red-600">{software.churn_rate?.toFixed(1)}%</div>
                                    <div className="text-sm text-gray-500">Churn Rate</div>
                                  </div>
                                  <div className="text-center p-3 border rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">€{(software.average_deal_size || 0).toLocaleString()}</div>
                                    <div className="text-sm text-gray-500">Avg Deal Size</div>
                                  </div>
                                </div>

                                {/* Competitive Analysis */}
                                {software.competitor_analysis && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border rounded-lg p-4">
                                      <h3 className="font-semibold text-green-600 mb-2">Competitive Advantages</h3>
                                      <ul className="space-y-1">
                                        {JSON.parse(software.competitor_analysis).competitive_advantages?.map((advantage: string, index: number) => (
                                          <li key={index} className="text-sm flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                                            {advantage}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="border rounded-lg p-4">
                                      <h3 className="font-semibold text-red-600 mb-2">Weaknesses</h3>
                                      <ul className="space-y-1">
                                        {JSON.parse(software.competitor_analysis).weaknesses?.map((weakness: string, index: number) => (
                                          <li key={index} className="text-sm flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                                            {weakness}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                )}

                                {/* Feature Comparison */}
                                {software.feature_comparison && (
                                  <div className="border rounded-lg p-4">
                                    <h3 className="font-semibold mb-3">Feature Comparison</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                      {Object.entries(JSON.parse(software.feature_comparison)).map(([feature, score]) => (
                                        <div key={feature} className="text-center">
                                          <div className="text-lg font-bold">{score}/10</div>
                                          <div className="text-sm text-gray-500 capitalize">{feature.replace('_', ' ')}</div>
                                          <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                                            <div 
                                              className="h-2 bg-blue-500 rounded-full" 
                                              style={{ width: `${(score as number) * 10}%` }}
                                            />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Pricing Intelligence */}
                                {software.pricing_intelligence && (
                                  <div className="border rounded-lg p-4">
                                    <h3 className="font-semibold mb-3">Pricing Intelligence</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <div className="text-xl font-bold">€{JSON.parse(software.pricing_intelligence).avg_price_per_user}</div>
                                        <div className="text-sm text-gray-600">Avg Price/User</div>
                                      </div>
                                      <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <div className="text-xl font-bold">{JSON.parse(software.pricing_intelligence).enterprise_discount}%</div>
                                        <div className="text-sm text-gray-600">Enterprise Discount</div>
                                      </div>
                                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                                        <div className="text-sm font-medium">Competitor Pricing</div>
                                        <div className="space-y-1 mt-1">
                                          {Object.entries(JSON.parse(software.pricing_intelligence).competitor_comparison || {}).map(([competitor, price]) => (
                                            <div key={competitor} className="text-xs">
                                              {competitor}: €{price}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BI Analytics Tab */}
        <TabsContent value="bi-analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BI Dashboards */}
            <Card>
              <CardHeader>
                <CardTitle>BI Dashboards</CardTitle>
                <CardDescription>Business intelligence dashboards for data-driven insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {biDashboards.map((dashboard) => (
                  <div key={dashboard.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{dashboard.dashboard_name || dashboard.dashboard_name}</h3>
                      <Badge variant={
                        dashboard.dashboard_type === 'revenue' ? 'default' :
                        dashboard.dashboard_type === 'usage' ? 'secondary' :
                        dashboard.dashboard_type === 'market' ? 'outline' : 'destructive'
                      }>
                        {dashboard.dashboard_type}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {dashboard.dashboard_type === 'revenue' && 'Revenue analytics, forecasting, and financial insights'}
                      {dashboard.dashboard_type === 'usage' && 'Platform usage, API calls, and user engagement metrics'}
                      {dashboard.dashboard_type === 'market' && 'Market intelligence, software trends, and competitive analysis'}
                      {dashboard.dashboard_type === 'competitive' && 'Competitive positioning, feature gaps, and market opportunities'}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Created by {dashboard.created_by} • {new Date(dashboard.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Dashboard
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create BI Dashboard</DialogTitle>
                      <DialogDescription>Set up a new business intelligence dashboard</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="dashboardName">Dashboard Name</Label>
                        <Input id="dashboardName" placeholder="e.g., Revenue Analytics Q1 2024" />
                      </div>
                      <div>
                        <Label htmlFor="dashboardType">Dashboard Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select dashboard type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="revenue">Revenue Analytics</SelectItem>
                            <SelectItem value="usage">Usage Analytics</SelectItem>
                            <SelectItem value="market">Market Intelligence</SelectItem>
                            <SelectItem value="competitive">Competitive Analysis</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="widgets">Widgets Configuration</Label>
                        <Textarea 
                          id="widgets" 
                          placeholder='{"widgets": ["revenue_trend", "top_customers", "growth_metrics"]}'
                          rows={3}
                        />
                      </div>
                      <Button className="w-full">Create Dashboard</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* BI Metrics Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Key BI Metrics</CardTitle>
                <CardDescription>Real-time business intelligence metrics and KPIs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Revenue Metrics */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-600">Revenue Metrics</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {biMetrics.filter(metric => metric.metric_type === 'revenue').map((metric) => (
                      <div key={metric.id} className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          €{(metric.metric_value || 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">{metric.metric_name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Usage Metrics */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-600">Usage Metrics</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {biMetrics.filter(metric => metric.metric_type === 'usage').map((metric) => (
                      <div key={metric.id} className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {metric.metric_name.includes('API') ? 
                            (metric.metric_value || 0).toLocaleString() : 
                            Math.round(metric.metric_value || 0)
                          }
                          {metric.metric_name.includes('Usage') && '%'}
                        </div>
                        <div className="text-sm text-gray-500">{metric.metric_name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Growth Metrics */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-600">Growth Metrics</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {biMetrics.filter(metric => metric.metric_type === 'growth').map((metric) => (
                      <div key={metric.id} className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          +{(metric.metric_value || 0).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500">{metric.metric_name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Satisfaction Metrics */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-yellow-600" />
                    <h3 className="font-semibold text-yellow-600">Satisfaction Metrics</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {biMetrics.filter(metric => metric.metric_type === 'satisfaction').map((metric) => (
                      <div key={metric.id} className="text-center">
                        <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                          {(metric.metric_value || 0).toFixed(1)}
                          <span className="text-yellow-500">★</span>
                        </div>
                        <div className="text-sm text-gray-500">{metric.metric_name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced BI Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Financial performance and revenue insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Revenue</span>
                    <span className="text-lg font-bold text-green-600">
                      €{biMetrics.find(m => m.metric_name === 'Total Revenue')?.metric_value?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                  <div className="text-xs text-gray-500">75% of annual target</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Data Export Revenue</span>
                    <span className="text-lg font-bold text-blue-600">
                      €{biMetrics.find(m => m.metric_name === 'Data Export Revenue')?.metric_value?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: '45%' }} />
                  </div>
                  <div className="text-xs text-gray-500">45% of total revenue</div>
                </div>

                <div className="border-t pt-3">
                  <div className="text-sm font-medium mb-2">Revenue by Category</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Communication Tools</span>
                      <span className="font-medium">€28,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Productivity Software</span>
                      <span className="font-medium">€35,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Design Tools</span>
                      <span className="font-medium">€22,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>lebonlogiciel.com and prospection SaaS metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-600">lebonlogiciel.com</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="font-medium">API Calls</div>
                      <div className="text-gray-500">45,000/month</div>
                    </div>
                    <div>
                      <div className="font-medium">Data Exports</div>
                      <div className="text-gray-500">1,250/month</div>
                    </div>
                    <div>
                      <div className="font-medium">Revenue</div>
                      <div className="text-green-600 font-medium">€75,000</div>
                    </div>
                    <div>
                      <div className="font-medium">Growth</div>
                      <div className="text-green-600 font-medium">+18.5%</div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-600">Prospection SaaS</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="font-medium">Companies</div>
                      <div className="text-gray-500">2,850 tracked</div>
                    </div>
                    <div>
                      <div className="font-medium">Leads</div>
                      <div className="text-gray-500">8,500/month</div>
                    </div>
                    <div>
                      <div className="font-medium">Revenue</div>
                      <div className="text-green-600 font-medium">€50,000</div>
                    </div>
                    <div>
                      <div className="font-medium">Growth</div>
                      <div className="text-green-600 font-medium">+25.2%</div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="text-sm font-medium mb-2">Platform Comparison</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Users</span>
                      <span className="font-medium">12,500</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Active</span>
                      <span className="font-medium">8,750</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Conversion Rate</span>
                      <span className="font-medium">15.2%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Intelligence */}
            <Card>
              <CardHeader>
                <CardTitle>Market Intelligence</CardTitle>
                <CardDescription>Software market trends and competitive insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="text-sm font-medium">Top Growing Software Categories</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">AI/ML Tools</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: '85%' }} />
                        </div>
                        <span className="text-sm font-medium text-green-600">+85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Collaboration</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-blue-500 rounded-full" style={{ width: '45%' }} />
                        </div>
                        <span className="text-sm font-medium text-blue-600">+45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Security</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-purple-500 rounded-full" style={{ width: '32%' }} />
                        </div>
                        <span className="text-sm font-medium text-purple-600">+32%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="text-sm font-medium mb-2">Market Opportunities</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Enterprise AI adoption growing 85%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>Remote work tools demand +45%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span>Cybersecurity investments +32%</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="text-sm font-medium mb-2">Competitive Insights</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>• Microsoft leads productivity (45.2% market share)</div>
                    <div>• Salesforce dominates CRM (23.8% share)</div>
                    <div>• Slack growing fastest in communication (+15.3%)</div>
                    <div>• Adobe maintains design leadership (67% share)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* BI Export and Actions */}
          <Card>
            <CardHeader>
              <CardTitle>BI Data Export & Actions</CardTitle>
              <CardDescription>Export business intelligence data and configure automated reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">BI Reports</h3>
                  </div>
                  <p className="text-sm text-gray-600">Export comprehensive BI reports with all metrics and insights</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleExportData('bi_metrics', 'excel', 'manual', false)}>
                      <Download className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleExportData('bi_metrics', 'json', 'manual', false)}>
                      JSON
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold">Revenue Analytics</h3>
                  </div>
                  <p className="text-sm text-gray-600">Financial performance data for both platforms</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleExportData('revenue_analytics', 'excel', 'manual', false)}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline">
                      Schedule
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold">Market Intelligence</h3>
                  </div>
                  <p className="text-sm text-gray-600">Competitive analysis and market trend data</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleExportData('market_intelligence', 'json', 'manual', false)}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline">
                      API Feed
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Automated BI Reports</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Report
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Weekly Revenue Report</div>
                      <div className="text-sm text-gray-500">Every Monday at 9:00 AM • Excel format</div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Monthly Market Intelligence</div>
                      <div className="text-sm text-gray-500">1st of each month • JSON API feed</div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Quarterly Competitive Analysis</div>
                      <div className="text-sm text-gray-500">Every 3 months • PDF report</div>
                    </div>
                    <Badge variant="secondary">Scheduled</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Access Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Access Management</CardTitle>
              <CardDescription>Manage admin center access and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        user.role === 'super_admin' ? 'default' :
                        user.role === 'admin' ? 'secondary' :
                        user.role === 'analyst' ? 'outline' : 'destructive'
                      }>
                        {user.role.replace('_', ' ')}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Team Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>Complete audit trail of all admin center activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exportLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">
                        {log.export_type.toUpperCase()} export of {log.data_type}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(log.created_at || '').toLocaleString()} • {log.record_count} records
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{log.platform}</Badge>
                      <Badge variant={
                        log.status === 'completed' ? 'default' :
                        log.status === 'failed' ? 'destructive' : 'secondary'
                      }>
                        {log.status}
                      </Badge>
                    </div>
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