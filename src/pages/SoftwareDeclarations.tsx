import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Filter, Eye, CheckCircle, XCircle, Clock, FileText, User, Calendar, Building2, ChevronDown, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from '@/hooks/use-toast'
import { blink } from '@/blink/client'
import { useLanguage } from '@/hooks/useLanguage'
import type { SoftwareDeclaration, User } from '@/types'

export default function SoftwareDeclarations() {
  const { t } = useLanguage()
  const [declarations, setDeclarations] = useState<SoftwareDeclaration[]>([])
  const [filteredDeclarations, setFilteredDeclarations] = useState<SoftwareDeclaration[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [licenseTypeFilter, setLicenseTypeFilter] = useState('all')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedDeclaration, setSelectedDeclaration] = useState<SoftwareDeclaration | null>(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    softwareName: '',
    vendor: '',
    version: '',
    purpose: '',
    businessJustification: '',
    department: '',
    estimatedUsers: 1,
    licenseType: 'individual',
    urgency: 'medium'
  })

  const resetForm = () => {
    setFormData({
      softwareName: '',
      vendor: '',
      version: '',
      purpose: '',
      businessJustification: '',
      department: '',
      estimatedUsers: 1,
      licenseType: 'individual',
      urgency: 'medium'
    })
  }

  // Helper functions for filter options
  const getUniqueDepartments = () => {
    const departments = declarations.map(d => (d.department || '').toString().trim()).filter(Boolean)
    return [...new Set(departments)].sort()
  }

  const getUniqueUrgencyLevels = () => {
    const urgencyLevels = declarations.map(d => (d.urgency || '').toString().trim()).filter(Boolean)
    return [...new Set(urgencyLevels)].sort()
  }

  const getUniqueLicenseTypes = () => {
    const licenseTypes = declarations.map(d => (d.licenseType || d.license_type || '').toString().trim()).filter(Boolean)
    return [...new Set(licenseTypes)].sort()
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setDepartmentFilter('all')
    setUrgencyFilter('all')
    setLicenseTypeFilter('all')
  }

  const hasActiveFilters = () => {
    return searchTerm !== '' || statusFilter !== 'all' || departmentFilter !== 'all' || 
           urgencyFilter !== 'all' || licenseTypeFilter !== 'all'
  }

  // 80/20 Feature #3: Social Proof - Get review stats for software
  const getReviewStats = async (softwareName: string) => {
    try {
      // Get reviews from software_reviews table
      const reviews = await blink.db.softwareReviews.list({
        where: { softwareName: softwareName }
      })
      
      if (reviews.length === 0) return null
      
      const totalRating = reviews.reduce((sum, review) => sum + (review.overallRating || review.overall_rating || 0), 0)
      const averageRating = totalRating / reviews.length
      
      return {
        averageRating: averageRating.toFixed(1),
        reviewCount: reviews.length
      }
    } catch (error) {
      console.error('Error getting review stats:', error)
      return null
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const user = await blink.auth.me()
      setCurrentUser(user)

      // Load declarations
      const declarationsData = await blink.db.softwareDeclarations.list({
        orderBy: { createdAt: 'desc' }
      })
      setDeclarations(declarationsData)

      // Load users for admin view
      if (user.role === 'admin' || user.role === 'manager') {
        const usersData = await blink.db.users.list()
        setUsers(usersData)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load software declarations',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const filterDeclarations = useCallback(() => {
    let filtered = declarations

    // Filter by current user if not admin/manager
    if (currentUser && currentUser.role !== 'admin' && currentUser.role !== 'manager') {
      filtered = filtered.filter(d => d.userId === currentUser.id)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(d => {
        const softwareName = (d.softwareName || d.software_name || '').toString().toLowerCase()
        const vendor = (d.vendor || '').toString().toLowerCase()
        const department = (d.department || '').toString().toLowerCase()
        const userName = (d.userName || d.user_name || '').toString().toLowerCase()
        const searchLower = searchTerm.toLowerCase()
        
        return softwareName.includes(searchLower) ||
               vendor.includes(searchLower) ||
               department.includes(searchLower) ||
               userName.includes(searchLower)
      })
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(d => d.status === statusFilter)
    }

    // Department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(d => {
        const department = (d.department || '').toString().trim()
        return department === departmentFilter
      })
    }

    // Urgency filter
    if (urgencyFilter !== 'all') {
      filtered = filtered.filter(d => {
        const urgency = (d.urgency || '').toString().trim()
        return urgency === urgencyFilter
      })
    }

    // License type filter
    if (licenseTypeFilter !== 'all') {
      filtered = filtered.filter(d => {
        const licenseType = (d.licenseType || d.license_type || '').toString().trim()
        return licenseType === licenseTypeFilter
      })
    }

    setFilteredDeclarations(filtered)
  }, [declarations, searchTerm, statusFilter, departmentFilter, urgencyFilter, licenseTypeFilter, currentUser])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    try {
      const newDeclaration = {
        ...formData,
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.name,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await blink.db.softwareDeclarations.create(newDeclaration)
      
      toast({
        title: 'Success',
        description: 'Software declaration submitted successfully'
      })

      setIsAddDialogOpen(false)
      resetForm()
      loadData()
    } catch (error) {
      console.error('Error creating declaration:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit software declaration',
        variant: 'destructive'
      })
    }
  }

  // 80/20 Feature #1: Smart Review Prompts
  const scheduleReviewReminder = async (declaration: SoftwareDeclaration) => {
    try {
      // Mark that we've scheduled a reminder for this declaration
      await blink.db.softwareDeclarations.update(declaration.id, {
        reviewReminderSent: false // Will be set to true when reminder is actually sent
      })
      
      // In a real implementation, this would schedule an email/notification
      // For now, we'll just log it (in production, you'd integrate with your email service)
      console.log(`Review reminder scheduled for ${declaration.softwareName} to ${declaration.userEmail} in 2 weeks`)
      
      // Simulate scheduling a reminder (in production, use a job queue or cron job)
      setTimeout(() => {
        toast({
          title: '📧 Review Reminder',
          description: `Time to review ${declaration.softwareName}! How has your experience been?`,
        })
      }, 5000) // 5 seconds for demo (would be 2 weeks in production)
      
    } catch (error) {
      console.error('Error scheduling review reminder:', error)
    }
  }

  const handleStatusUpdate = async (declarationId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const declaration = declarations.find(d => d.id === declarationId)
      
      await blink.db.softwareDeclarations.update(declarationId, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        reviewedBy: currentUser?.id,
        reviewedAt: new Date().toISOString()
      })

      // 80/20 Feature #1: Schedule review reminder for approved declarations
      if (newStatus === 'approved' && declaration) {
        scheduleReviewReminder(declaration)
      }

      toast({
        title: 'Success',
        description: `Declaration ${newStatus} successfully`
      })

      loadData()
    } catch (error) {
      console.error('Error updating declaration:', error)
      toast({
        title: 'Error',
        description: 'Failed to update declaration status',
        variant: 'destructive'
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>
      case 'low':
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="secondary">{urgency}</Badge>
    }
  }

  // 80/20 Feature #3: Social Proof Component
  const SoftwareWithReviews = ({ softwareName, vendor }: { softwareName: string, vendor: string }) => {
    const [reviewStats, setReviewStats] = useState<{ averageRating: string, reviewCount: number } | null>(null)
    
    useEffect(() => {
      getReviewStats(softwareName).then(setReviewStats)
    }, [softwareName])

    return (
      <div>
        <div className="font-medium">{softwareName || 'N/A'}</div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">{vendor || 'N/A'}</div>
          {reviewStats && (
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <Star className="w-3 h-3 fill-current" />
              <span>{reviewStats.averageRating}</span>
              <span className="text-gray-400">({reviewStats.reviewCount} reviews)</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterDeclarations()
  }, [filterDeclarations])

  // Statistics
  const totalDeclarations = filteredDeclarations.length
  const pendingDeclarations = filteredDeclarations.filter(d => d.status === 'pending').length
  const approvedDeclarations = filteredDeclarations.filter(d => d.status === 'approved').length
  const rejectedDeclarations = filteredDeclarations.filter(d => d.status === 'rejected').length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading software declarations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Software Declarations</h1>
          <p className="text-gray-600">
            {currentUser?.role === 'admin' || currentUser?.role === 'manager' 
              ? 'Review and manage employee software declarations'
              : 'Declare software you use for business purposes'
            }
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Declaration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit Software Declaration</DialogTitle>
              <DialogDescription>
                Declare software you need for business purposes. All declarations require approval.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="softwareName">Software Name *</Label>
                  <Input
                    id="softwareName"
                    value={formData.softwareName}
                    onChange={(e) => setFormData({ ...formData, softwareName: e.target.value })}
                    placeholder="e.g., Adobe Photoshop"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="vendor">Vendor *</Label>
                  <Input
                    id="vendor"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    placeholder="e.g., Adobe Inc."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="e.g., 2024, v15.2"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g., Marketing, IT, Design"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="purpose">Purpose *</Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Describe how you will use this software..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="businessJustification">Business Justification *</Label>
                <Textarea
                  id="businessJustification"
                  value={formData.businessJustification}
                  onChange={(e) => setFormData({ ...formData, businessJustification: e.target.value })}
                  placeholder="Explain why this software is necessary for your work..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="estimatedUsers">Estimated Users</Label>
                  <Input
                    id="estimatedUsers"
                    type="number"
                    min="1"
                    value={formData.estimatedUsers}
                    onChange={(e) => setFormData({ ...formData, estimatedUsers: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label htmlFor="licenseType">License Type</Label>
                  <Select value={formData.licenseType} onValueChange={(value) => setFormData({ ...formData, licenseType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="urgency">Urgency</Label>
                  <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Submit Declaration
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Declarations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeclarations}</div>
            <p className="text-xs text-muted-foreground">All time submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingDeclarations}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedDeclarations}</div>
            <p className="text-xs text-muted-foreground">Successfully approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedDeclarations}</div>
            <p className="text-xs text-muted-foreground">Declined requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t('declarations.title')} - {t('common.filter')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Basic Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={t('declarations.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder={t('licenses.filterByStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('licenses.allStatuses')}</SelectItem>
                    <SelectItem value="pending">{t('declarations.pending')}</SelectItem>
                    <SelectItem value="approved">{t('declarations.approved')}</SelectItem>
                    <SelectItem value="rejected">{t('declarations.rejected')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="w-full sm:w-auto"
              >
                <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                {showAdvancedFilters ? t('declarations.hideAdvancedFilters') : t('declarations.showAdvancedFilters')}
              </Button>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('declarations.filterByDepartment')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('declarations.allDepartments')}</SelectItem>
                      {getUniqueDepartments().map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('declarations.filterByUrgency')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('declarations.allUrgencyLevels')}</SelectItem>
                      <SelectItem value="high">{t('declarations.urgencyHigh')}</SelectItem>
                      <SelectItem value="medium">{t('declarations.urgencyMedium')}</SelectItem>
                      <SelectItem value="low">{t('declarations.urgencyLow')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={licenseTypeFilter} onValueChange={setLicenseTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('declarations.filterByLicenseType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('declarations.allLicenseTypes')}</SelectItem>
                      <SelectItem value="individual">{t('declarations.licenseIndividual')}</SelectItem>
                      <SelectItem value="team">{t('declarations.licenseTeam')}</SelectItem>
                      <SelectItem value="enterprise">{t('declarations.licenseEnterprise')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Clear Filters Button */}
            {hasActiveFilters() && (
              <div className="flex justify-end pt-2">
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  {t('declarations.clearAllFilters')}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Declarations Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('declarations.title')}</CardTitle>
          <CardDescription>
            {hasActiveFilters() 
              ? t('declarations.showingResults').replace('{count}', filteredDeclarations.length.toString()).replace('{total}', declarations.length.toString())
              : `${filteredDeclarations.length} declaration${filteredDeclarations.length !== 1 ? 's' : ''} found`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Software</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeclarations.map((declaration) => (
                  <TableRow key={declaration.id}>
                    <TableCell>
                      {/* 80/20 Feature #3: Social Proof - Show review stats */}
                      <SoftwareWithReviews 
                        softwareName={declaration.softwareName || declaration.software_name || 'N/A'}
                        vendor={declaration.vendor || 'N/A'}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{declaration.userName || declaration.user_name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{declaration.userEmail || declaration.user_email || 'N/A'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span>{declaration.department || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(declaration.status)}</TableCell>
                    <TableCell>{getUrgencyBadge(declaration.urgency)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(declaration.createdAt || declaration.created_at || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedDeclaration(declaration)
                            setIsViewDialogOpen(true)
                          }}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && declaration.status === 'pending' && (
                            <>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(declaration.id, 'approved')}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(declaration.id, 'rejected')}>
                                <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredDeclarations.length === 0 && (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No declarations found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by submitting your first software declaration.'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Declaration Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Declaration Details</DialogTitle>
            <DialogDescription>
              Complete information about this software declaration
            </DialogDescription>
          </DialogHeader>
          {selectedDeclaration && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Software Name</Label>
                  <p className="mt-1">{selectedDeclaration.softwareName || selectedDeclaration.software_name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Vendor</Label>
                  <p className="mt-1">{selectedDeclaration.vendor || 'N/A'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Version</Label>
                  <p className="mt-1">{selectedDeclaration.version || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Department</Label>
                  <p className="mt-1">{selectedDeclaration.department || 'N/A'}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Purpose</Label>
                <p className="mt-1 text-sm">{selectedDeclaration.purpose || 'N/A'}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Business Justification</Label>
                <p className="mt-1 text-sm">{selectedDeclaration.businessJustification || selectedDeclaration.business_justification || 'N/A'}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Estimated Users</Label>
                  <p className="mt-1">{selectedDeclaration.estimatedUsers || selectedDeclaration.estimated_users || 1}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">License Type</Label>
                  <p className="mt-1 capitalize">{selectedDeclaration.licenseType || selectedDeclaration.license_type || 'individual'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Urgency</Label>
                  <p className="mt-1">{getUrgencyBadge(selectedDeclaration.urgency || 'medium')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <p className="mt-1">{getStatusBadge(selectedDeclaration.status)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Submitted</Label>
                  <p className="mt-1">{new Date(selectedDeclaration.createdAt || selectedDeclaration.created_at || Date.now()).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Submitted By</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedDeclaration.userName || selectedDeclaration.user_name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{selectedDeclaration.userEmail || selectedDeclaration.user_email || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && selectedDeclaration?.status === 'pending' && (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    if (selectedDeclaration) {
                      handleStatusUpdate(selectedDeclaration.id, 'rejected')
                      setIsViewDialogOpen(false)
                    }
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    if (selectedDeclaration) {
                      handleStatusUpdate(selectedDeclaration.id, 'approved')
                      setIsViewDialogOpen(false)
                    }
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}