import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Users, Calendar, DollarSign, X, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from 'lucide-react'
import { blink } from '../blink/client'
import { SoftwareLicense, User } from '../types'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Textarea } from '../components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog'
import { toast } from '../hooks/use-toast'
import { format } from 'date-fns'
import { useLanguage } from '../hooks/useLanguage'

export default function LicenseManagement() {
  const { t } = useLanguage()
  const [licenses, setLicenses] = useState<SoftwareLicense[]>([])
  const [filteredLicenses, setFilteredLicenses] = useState<SoftwareLicense[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [vendorFilter, setVendorFilter] = useState('all')
  const [licenseTypeFilter, setLicenseTypeFilter] = useState('all')
  const [costRangeFilter, setCostRangeFilter] = useState('all')
  const [expiryFilter, setExpiryFilter] = useState('all')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedLicense, setSelectedLicense] = useState<SoftwareLicense | null>(null)
  const [user, setUser] = useState<User | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    softwareName: '',
    vendor: '',
    licenseType: 'subscription',
    totalLicenses: '',
    usedLicenses: '',
    costPerLicense: '',
    purchaseDate: '',
    expiryDate: '',
    description: '',
    status: 'active'
  })

  const loadLicenses = async () => {
    try {
      setLoading(true)
      const data = await blink.db.softwareLicenses.list({
        orderBy: { createdAt: 'desc' }
      })
      setLicenses(data)
    } catch (error) {
      console.error('Error loading licenses:', error)
      toast({
        title: "Error",
        description: "Failed to load licenses",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filterLicenses = React.useCallback(() => {
    let filtered = licenses

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(license => {
        // Handle both camelCase and snake_case field names with null checks
        const softwareName = license.softwareName || (license as any).software_name || ''
        const vendor = license.vendor || (license as any).vendor || ''
        
        // Add null/undefined checks before calling toLowerCase
        const searchLower = searchTerm.toString().toLowerCase()
        const softwareNameLower = softwareName ? softwareName.toString().toLowerCase() : ''
        const vendorLower = vendor ? vendor.toString().toLowerCase() : ''
        
        return softwareNameLower.includes(searchLower) ||
               vendorLower.includes(searchLower)
      })
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(license => license.status === statusFilter)
    }

    // Vendor filter
    if (vendorFilter !== 'all') {
      filtered = filtered.filter(license => {
        const vendor = license.vendor || (license as any).vendor || ''
        // Add null/undefined check before calling toLowerCase
        if (!vendor || !vendorFilter) return false
        return vendor.toString().toLowerCase() === vendorFilter.toString().toLowerCase()
      })
    }

    // License type filter
    if (licenseTypeFilter !== 'all') {
      filtered = filtered.filter(license => {
        const licenseType = license.licenseType || (license as any).license_type || ''
        // Add null/undefined check
        if (!licenseType || !licenseTypeFilter) return false
        return licenseType.toString() === licenseTypeFilter.toString()
      })
    }

    // Cost range filter
    if (costRangeFilter !== 'all') {
      filtered = filtered.filter(license => {
        const costValue = license.costPerLicense || (license as any).cost_per_license || 0
        const cost = Number(costValue)
        // Add safety check for NaN
        if (isNaN(cost)) return false
        
        switch (costRangeFilter) {
          case 'free':
            return cost === 0
          case 'low':
            return cost > 0 && cost <= 50
          case 'medium':
            return cost > 50 && cost <= 200
          case 'high':
            return cost > 200 && cost <= 500
          case 'enterprise':
            return cost > 500
          default:
            return true
        }
      })
    }

    // Expiry filter
    if (expiryFilter !== 'all') {
      const now = new Date()
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
      
      filtered = filtered.filter(license => {
        const expiryDate = license.expiryDate || (license as any).expiry_date
        if (!expiryDate) return expiryFilter === 'no-expiry'
        
        const expiry = new Date(expiryDate)
        // Add safety check for invalid dates
        if (isNaN(expiry.getTime())) return false
        
        switch (expiryFilter) {
          case 'expired':
            return expiry < now
          case 'expiring-soon':
            return expiry >= now && expiry <= thirtyDaysFromNow
          case 'expiring-3months':
            return expiry >= now && expiry <= ninetyDaysFromNow
          case 'active':
            return expiry > ninetyDaysFromNow
          case 'no-expiry':
            return !expiryDate
          default:
            return true
        }
      })
    }

    setFilteredLicenses(filtered)
  }, [licenses, searchTerm, statusFilter, vendorFilter, licenseTypeFilter, costRangeFilter, expiryFilter])

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (state.user) {
        loadLicenses()
      }
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    filterLicenses()
  }, [filterLicenses])

  const resetForm = () => {
    setFormData({
      softwareName: '',
      vendor: '',
      licenseType: 'subscription',
      totalLicenses: '',
      usedLicenses: '',
      costPerLicense: '',
      purchaseDate: '',
      expiryDate: '',
      description: '',
      status: 'active'
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    try {
      const licenseData = {
        softwareName: formData.softwareName,
        vendor: formData.vendor,
        licenseType: formData.licenseType,
        totalLicenses: parseInt(formData.totalLicenses),
        usedLicenses: parseInt(formData.usedLicenses),
        costPerLicense: parseFloat(formData.costPerLicense),
        purchaseDate: formData.purchaseDate,
        expiryDate: formData.expiryDate,
        description: formData.description,
        status: formData.status,
        createdBy: user.id,
        createdAt: new Date().toISOString()
      }

      if (selectedLicense) {
        // Update existing license
        await blink.db.softwareLicenses.update(selectedLicense.id, licenseData)
        toast({
          title: "Success",
          description: "License updated successfully"
        })
        setIsEditDialogOpen(false)
      } else {
        // Create new license
        await blink.db.softwareLicenses.create(licenseData)
        toast({
          title: "Success",
          description: "License created successfully"
        })
        setIsAddDialogOpen(false)
      }

      resetForm()
      setSelectedLicense(null)
      loadLicenses()
    } catch (error) {
      console.error('Error saving license:', error)
      toast({
        title: "Error",
        description: "Failed to save license",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (license: SoftwareLicense) => {
    setSelectedLicense(license)
    setFormData({
      softwareName: license.softwareName || (license as any).software_name || '',
      vendor: license.vendor || (license as any).vendor || '',
      licenseType: license.licenseType || (license as any).license_type || 'subscription',
      totalLicenses: String(license.totalLicenses || (license as any).total_licenses || 0),
      usedLicenses: String(license.usedLicenses || (license as any).used_licenses || 0),
      costPerLicense: String(license.costPerLicense || (license as any).cost_per_license || 0),
      purchaseDate: license.purchaseDate || (license as any).purchase_date || '',
      expiryDate: license.expiryDate || (license as any).expiry_date || '',
      description: license.description || (license as any).description || '',
      status: license.status || 'active'
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (licenseId: string) => {
    try {
      await blink.db.softwareLicenses.delete(licenseId)
      toast({
        title: "Success",
        description: "License deleted successfully"
      })
      loadLicenses()
    } catch (error) {
      console.error('Error deleting license:', error)
      toast({
        title: "Error",
        description: "Failed to delete license",
        variant: "destructive"
      })
    }
  }

  // 80/20 Feature #2: One-Click Quick Reviews
  const handleQuickReview = async (licenseId: string, reviewType: 'positive' | 'negative') => {
    try {
      const license = licenses.find(l => l.id === licenseId)
      if (!license) return

      // Update quick review counts
      const currentPositive = Number(license.quickReviewPositive || (license as any).quick_review_positive || 0)
      const currentNegative = Number(license.quickReviewNegative || (license as any).quick_review_negative || 0)
      const currentTotal = Number(license.totalQuickReviews || (license as any).total_quick_reviews || 0)

      const updates = {
        quickReviewPositive: reviewType === 'positive' ? currentPositive + 1 : currentPositive,
        quickReviewNegative: reviewType === 'negative' ? currentNegative + 1 : currentNegative,
        totalQuickReviews: currentTotal + 1
      }

      await blink.db.softwareLicenses.update(licenseId, updates)

      // Show success message
      toast({
        title: reviewType === 'positive' ? '👍 Thanks for the feedback!' : '👎 Feedback noted',
        description: `Your quick review for ${license.softwareName || (license as any).software_name} has been recorded.`,
      })

      // Reload licenses to show updated counts
      loadLicenses()
    } catch (error) {
      console.error('Error submitting quick review:', error)
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      expired: 'destructive',
      expiring: 'secondary'
    } as const
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getUsageColor = (used: number, total: number) => {
    const percentage = (used / total) * 100
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  // Get unique vendors from licenses
  const getUniqueVendors = () => {
    const vendors = licenses.map(license => {
      const vendor = license.vendor || (license as any).vendor || ''
      return vendor ? vendor.toString().trim() : ''
    }).filter(vendor => vendor && vendor.length > 0)
    return [...new Set(vendors)].sort()
  }

  // Get unique license types from licenses
  const getUniqueLicenseTypes = () => {
    const types = licenses.map(license => {
      const licenseType = license.licenseType || (license as any).license_type || ''
      return licenseType ? licenseType.toString().trim() : ''
    }).filter(type => type && type.length > 0)
    return [...new Set(types)].sort()
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setVendorFilter('all')
    setLicenseTypeFilter('all')
    setCostRangeFilter('all')
    setExpiryFilter('all')
  }

  // Check if any filters are active
  const hasActiveFilters = () => {
    return searchTerm !== '' || 
           statusFilter !== 'all' || 
           vendorFilter !== 'all' || 
           licenseTypeFilter !== 'all' || 
           costRangeFilter !== 'all' || 
           expiryFilter !== 'all'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('licenses.title')}</h1>
          <p className="text-gray-600 mt-1">{t('licenses.subtitle')}</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              {t('licenses.addLicense')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('licenses.addLicense')}</DialogTitle>
              <DialogDescription>
                {t('licenses.subtitle')}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="softwareName">{t('licenses.softwareName')} *</Label>
                  <Input
                    id="softwareName"
                    value={formData.softwareName}
                    onChange={(e) => setFormData({...formData, softwareName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="vendor">{t('licenses.vendor')} *</Label>
                  <Input
                    id="vendor"
                    value={formData.vendor}
                    onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="licenseType">{t('licenses.licenseType')}</Label>
                  <Select value={formData.licenseType} onValueChange={(value) => setFormData({...formData, licenseType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subscription">Subscription</SelectItem>
                      <SelectItem value="perpetual">Perpetual</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">{t('common.status')}</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('common.active')}</SelectItem>
                      <SelectItem value="expired">{t('common.expired')}</SelectItem>
                      <SelectItem value="expiring">{t('common.expiring')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="totalLicenses">{t('licenses.totalLicenses')} *</Label>
                  <Input
                    id="totalLicenses"
                    type="number"
                    value={formData.totalLicenses}
                    onChange={(e) => setFormData({...formData, totalLicenses: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="usedLicenses">{t('licenses.usedLicenses')} *</Label>
                  <Input
                    id="usedLicenses"
                    type="number"
                    value={formData.usedLicenses}
                    onChange={(e) => setFormData({...formData, usedLicenses: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="costPerLicense">{t('licenses.costPerLicense')} ($)</Label>
                  <Input
                    id="costPerLicense"
                    type="number"
                    step="0.01"
                    value={formData.costPerLicense}
                    onChange={(e) => setFormData({...formData, costPerLicense: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">{t('licenses.expiryDate')}</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit">{t('common.create')}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Basic Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('licenses.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t('licenses.filterByStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('licenses.allStatuses')}</SelectItem>
                  <SelectItem value="active">{t('common.active')}</SelectItem>
                  <SelectItem value="expired">{t('common.expired')}</SelectItem>
                  <SelectItem value="expiring">{t('common.expiring')}</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="w-full sm:w-auto"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showAdvancedFilters ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    {t('licenses.hideAdvancedFilters')}
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    {t('licenses.showAdvancedFilters')}
                  </>
                )}
              </Button>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Vendor Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">{t('licenses.filterByVendor')}</Label>
                    <Select value={vendorFilter} onValueChange={setVendorFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('licenses.allVendors')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('licenses.allVendors')}</SelectItem>
                        {getUniqueVendors().map((vendor) => (
                          <SelectItem key={vendor} value={vendor}>
                            {vendor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* License Type Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">{t('licenses.filterByLicenseType')}</Label>
                    <Select value={licenseTypeFilter} onValueChange={setLicenseTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('licenses.allLicenseTypes')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('licenses.allLicenseTypes')}</SelectItem>
                        {getUniqueLicenseTypes().map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cost Range Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">{t('licenses.filterByCost')}</Label>
                    <Select value={costRangeFilter} onValueChange={setCostRangeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('licenses.allCostRanges')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('licenses.allCostRanges')}</SelectItem>
                        <SelectItem value="free">{t('licenses.costFree')}</SelectItem>
                        <SelectItem value="low">{t('licenses.costLow')}</SelectItem>
                        <SelectItem value="medium">{t('licenses.costMedium')}</SelectItem>
                        <SelectItem value="high">{t('licenses.costHigh')}</SelectItem>
                        <SelectItem value="enterprise">{t('licenses.costEnterprise')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Expiry Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">{t('licenses.filterByExpiry')}</Label>
                    <Select value={expiryFilter} onValueChange={setExpiryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('licenses.allExpiryRanges')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('licenses.allExpiryRanges')}</SelectItem>
                        <SelectItem value="expired">{t('licenses.expiryExpired')}</SelectItem>
                        <SelectItem value="expiring-soon">{t('licenses.expiryExpiringSoon')}</SelectItem>
                        <SelectItem value="expiring-3months">{t('licenses.expiryExpiring3Months')}</SelectItem>
                        <SelectItem value="active">{t('licenses.expiryActive')}</SelectItem>
                        <SelectItem value="no-expiry">{t('licenses.expiryNoExpiry')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters() && (
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm" onClick={clearAllFilters}>
                      <X className="h-4 w-4 mr-2" />
                      {t('licenses.clearAllFilters')}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* License Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('licenses.title')} ({filteredLicenses.length}
            {filteredLicenses.length !== licenses.length && ` of ${licenses.length}`})
          </CardTitle>
          <CardDescription>
            {t('licenses.subtitle')}
            {hasActiveFilters() && (
              <span className="ml-2 text-blue-600 font-medium">
                • {t('licenses.advancedFilters')} {t('common.active').toLowerCase()}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('licenses.softwareName')}</TableHead>
                  <TableHead>{t('licenses.vendor')}</TableHead>
                  <TableHead>{t('licenses.licenseType')}</TableHead>
                  <TableHead>{t('licenses.usage')}</TableHead>
                  <TableHead>{t('licenses.cost')}</TableHead>
                  <TableHead>{t('licenses.expiryDate')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead className="text-center">Quick Review</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLicenses.map((license) => (
                  <TableRow key={license.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {license.softwareName || (license as any).software_name || 'N/A'}
                        </div>
                        {(license.description || (license as any).description) && (
                          <div className="text-sm text-gray-500 truncate max-w-48">
                            {license.description || (license as any).description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{license.vendor || (license as any).vendor || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {license.licenseType || (license as any).license_type || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className={getUsageColor(
                          Number(license.usedLicenses || (license as any).used_licenses || 0), 
                          Number(license.totalLicenses || (license as any).total_licenses || 0)
                        )}>
                          {license.usedLicenses || (license as any).used_licenses || 0}/
                          {license.totalLicenses || (license as any).total_licenses || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span>${Number(license.costPerLicense || (license as any).cost_per_license || 0).toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {(license.expiryDate || (license as any).expiry_date) ? 
                            format(new Date(license.expiryDate || (license as any).expiry_date), 'MMM dd, yyyy') : 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(license.status)}
                    </TableCell>
                    <TableCell>
                      {/* 80/20 Feature #2: One-Click Quick Reviews */}
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                          onClick={() => handleQuickReview(license.id, 'positive')}
                          title="Quick positive review"
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-500 min-w-[20px] text-center">
                          {Number(license.quickReviewPositive || (license as any).quick_review_positive || 0)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleQuickReview(license.id, 'negative')}
                          title="Quick negative review"
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-500 min-w-[20px] text-center">
                          {Number(license.quickReviewNegative || (license as any).quick_review_negative || 0)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(license)}>
                            <Edit className="h-4 w-4 mr-2" />
                            {t('common.edit')}
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t('common.delete')}
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('licenses.deleteLicense')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('licenses.confirmDelete')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(license.id)}>
                                  {t('common.delete')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredLicenses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No licenses found</div>
              <p className="text-sm text-gray-400">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first software license'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('licenses.editLicense')}</DialogTitle>
            <DialogDescription>
              {t('licenses.subtitle')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-softwareName">Software Name *</Label>
                <Input
                  id="edit-softwareName"
                  value={formData.softwareName}
                  onChange={(e) => setFormData({...formData, softwareName: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-vendor">Vendor *</Label>
                <Input
                  id="edit-vendor"
                  value={formData.vendor}
                  onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-licenseType">License Type</Label>
                <Select value={formData.licenseType} onValueChange={(value) => setFormData({...formData, licenseType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="perpetual">Perpetual</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="expiring">Expiring Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-totalLicenses">Total Licenses *</Label>
                <Input
                  id="edit-totalLicenses"
                  type="number"
                  value={formData.totalLicenses}
                  onChange={(e) => setFormData({...formData, totalLicenses: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-usedLicenses">Used Licenses *</Label>
                <Input
                  id="edit-usedLicenses"
                  type="number"
                  value={formData.usedLicenses}
                  onChange={(e) => setFormData({...formData, usedLicenses: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-costPerLicense">Cost per License ($)</Label>
                <Input
                  id="edit-costPerLicense"
                  type="number"
                  step="0.01"
                  value={formData.costPerLicense}
                  onChange={(e) => setFormData({...formData, costPerLicense: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-purchaseDate">Purchase Date</Label>
                <Input
                  id="edit-purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-expiryDate">Expiry Date</Label>
                <Input
                  id="edit-expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">{t('common.update')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}