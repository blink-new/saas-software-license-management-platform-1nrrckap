import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '@blinkdotnew/sdk'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  Star, 
  Plus, 
  Search, 
  Filter, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  TrendingUp,
  Users,
  Award,
  ChevronDown,
  Calendar,
  User,
  Building
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

const blink = createClient({
  projectId: 'saas-software-license-management-platform-1nrrckap',
  authRequired: true
})

interface SoftwareReview {
  id: string
  softwareName: string
  vendor: string
  userId: string
  userName: string
  userDepartment: string
  overallRating: number
  easeOfUseRating: number
  featuresRating: number
  performanceRating: number
  valueRating: number
  reviewTitle: string
  reviewText: string
  pros: string
  cons: string
  wouldRecommend: boolean
  isAnonymous: boolean
  usageDuration: string
  createdAt: string
  updatedAt: string
}

interface ReviewStats {
  totalReviews: number
  averageRating: number
  recommendationRate: number
  ratingDistribution: { [key: number]: number }
}

const SoftwareReviews: React.FC = () => {
  const { t } = useLanguage()
  const [reviews, setReviews] = useState<SoftwareReview[]>([])
  const [filteredReviews, setFilteredReviews] = useState<SoftwareReview[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSoftware, setSelectedSoftware] = useState('all')
  const [selectedRating, setSelectedRating] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Form state for new review
  const [newReview, setNewReview] = useState({
    softwareName: '',
    vendor: '',
    overallRating: 5,
    easeOfUseRating: 5,
    featuresRating: 5,
    performanceRating: 5,
    valueRating: 5,
    reviewTitle: '',
    reviewText: '',
    pros: '',
    cons: '',
    wouldRecommend: true,
    isAnonymous: false,
    usageDuration: '1-6 months'
  })

  const loadCurrentUser = async () => {
    try {
      const user = await blink.auth.me()
      setCurrentUser(user)
    } catch (error) {
      console.error('Error loading current user:', error)
    }
  }

  const loadReviews = async () => {
    try {
      setLoading(true)
      const data = await blink.db.softwareReviews.list({
        orderBy: { createdAt: 'desc' }
      })
      setReviews(data || [])
    } catch (error) {
      console.error('Error loading reviews:', error)
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const filterReviews = useCallback(() => {
    let filtered = reviews

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(review =>
        (review.softwareName || review.software_name || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        (review.vendor || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        (review.reviewTitle || review.review_title || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        (review.userDepartment || review.user_department || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Software filter
    if (selectedSoftware !== 'all') {
      filtered = filtered.filter(review => 
        (review.softwareName || review.software_name || '').toString() === selectedSoftware
      )
    }

    // Rating filter
    if (selectedRating !== 'all') {
      const rating = parseInt(selectedRating)
      filtered = filtered.filter(review => 
        Number(review.overallRating || review.overall_rating || 0) >= rating
      )
    }

    // Department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(review => 
        (review.userDepartment || review.user_department || '').toString() === selectedDepartment
      )
    }

    setFilteredReviews(filtered)
  }, [reviews, searchTerm, selectedSoftware, selectedRating, selectedDepartment])

  const getUniqueSoftware = () => {
    const software = reviews.map(review => review.softwareName || review.software_name || 'Unknown')
    return [...new Set(software)].filter(s => s && s.trim() !== '').sort()
  }

  const getUniqueDepartments = () => {
    const departments = reviews.map(review => review.userDepartment || review.user_department || 'Unknown')
    return [...new Set(departments)].filter(d => d && d.trim() !== '').sort()
  }

  const calculateReviewStats = (): ReviewStats => {
    if (filteredReviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        recommendationRate: 0,
        ratingDistribution: {}
      }
    }

    const totalReviews = filteredReviews.length
    const totalRating = filteredReviews.reduce((sum, review) => 
      sum + Number(review.overallRating || review.overall_rating || 0), 0
    )
    const averageRating = totalRating / totalReviews

    const recommendations = filteredReviews.filter(review => 
      Number(review.wouldRecommend || review.would_recommend || 0) > 0
    ).length
    const recommendationRate = (recommendations / totalReviews) * 100

    const ratingDistribution: { [key: number]: number } = {}
    for (let i = 1; i <= 5; i++) {
      ratingDistribution[i] = filteredReviews.filter(review => 
        Number(review.overallRating || review.overall_rating || 0) === i
      ).length
    }

    return {
      totalReviews,
      averageRating,
      recommendationRate,
      ratingDistribution
    }
  }

  const handleSubmitReview = async () => {
    try {
      if (!currentUser) {
        toast.error('Please log in to submit a review')
        return
      }

      if (!newReview.softwareName.trim() || !newReview.reviewTitle.trim()) {
        toast.error('Please fill in all required fields')
        return
      }

      const reviewData = {
        id: `rev_${Date.now()}`,
        softwareName: newReview.softwareName,
        vendor: newReview.vendor,
        userId: currentUser.id,
        userName: newReview.isAnonymous ? 'Anonymous' : (currentUser.displayName || currentUser.email),
        userDepartment: currentUser.department || 'Unknown',
        overallRating: newReview.overallRating,
        easeOfUseRating: newReview.easeOfUseRating,
        featuresRating: newReview.featuresRating,
        performanceRating: newReview.performanceRating,
        valueRating: newReview.valueRating,
        reviewTitle: newReview.reviewTitle,
        reviewText: newReview.reviewText,
        pros: newReview.pros,
        cons: newReview.cons,
        wouldRecommend: newReview.wouldRecommend,
        isAnonymous: newReview.isAnonymous,
        usageDuration: newReview.usageDuration,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await blink.db.softwareReviews.create(reviewData)
      
      toast.success('Review submitted successfully!')
      setIsAddDialogOpen(false)
      setNewReview({
        softwareName: '',
        vendor: '',
        overallRating: 5,
        easeOfUseRating: 5,
        featuresRating: 5,
        performanceRating: 5,
        valueRating: 5,
        reviewTitle: '',
        reviewText: '',
        pros: '',
        cons: '',
        wouldRecommend: true,
        isAnonymous: false,
        usageDuration: '1-6 months'
      })
      loadReviews()
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review')
    }
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedSoftware('all')
    setSelectedRating('all')
    setSelectedDepartment('all')
  }

  const hasActiveFilters = searchTerm || selectedSoftware !== 'all' || selectedRating !== 'all' || selectedDepartment !== 'all'

  useEffect(() => {
    loadReviews()
    loadCurrentUser()
  }, [])

  useEffect(() => {
    filterReviews()
  }, [filterReviews])

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClass = size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6'
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const renderRatingInput = (label: string, value: number, onChange: (value: number) => void) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">{value}/5</span>
      </div>
    </div>
  )

  const stats = calculateReviewStats()

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Software Reviews</h1>
          <p className="text-gray-600 mt-1">Share and discover software experiences from your colleagues</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Write Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Write New Review</DialogTitle>
              <DialogDescription>
                Share your experience with software to help your colleagues make informed decisions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="softwareName">Software Name *</Label>
                  <Input
                    id="softwareName"
                    value={newReview.softwareName}
                    onChange={(e) => setNewReview({ ...newReview, softwareName: e.target.value })}
                    placeholder="Enter software name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Input
                    id="vendor"
                    value={newReview.vendor}
                    onChange={(e) => setNewReview({ ...newReview, vendor: e.target.value })}
                    placeholder="Enter vendor name"
                  />
                </div>
              </div>

              {/* Usage Duration */}
              <div className="space-y-2">
                <Label>Usage Duration</Label>
                <Select value={newReview.usageDuration} onValueChange={(value) => setNewReview({ ...newReview, usageDuration: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Less than 1 month">Less than 1 month</SelectItem>
                    <SelectItem value="1-6 months">1-6 months</SelectItem>
                    <SelectItem value="6+ months">6+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ratings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ratings</h3>
                <div className="grid grid-cols-1 gap-4">
                  {renderRatingInput('Overall Rating', newReview.overallRating, (value) => setNewReview({ ...newReview, overallRating: value }))}
                  {renderRatingInput('Ease of Use', newReview.easeOfUseRating, (value) => setNewReview({ ...newReview, easeOfUseRating: value }))}
                  {renderRatingInput('Features', newReview.featuresRating, (value) => setNewReview({ ...newReview, featuresRating: value }))}
                  {renderRatingInput('Performance', newReview.performanceRating, (value) => setNewReview({ ...newReview, performanceRating: value }))}
                  {renderRatingInput('Value for Money', newReview.valueRating, (value) => setNewReview({ ...newReview, valueRating: value }))}
                </div>
              </div>

              {/* Review Content */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reviewTitle">Review Title *</Label>
                  <Input
                    id="reviewTitle"
                    value={newReview.reviewTitle}
                    onChange={(e) => setNewReview({ ...newReview, reviewTitle: e.target.value })}
                    placeholder="Enter a brief title for your review"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewText">Review Text</Label>
                  <Textarea
                    id="reviewText"
                    value={newReview.reviewText}
                    onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                    placeholder="Share your detailed experience with this software"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pros">Pros</Label>
                    <Textarea
                      id="pros"
                      value={newReview.pros}
                      onChange={(e) => setNewReview({ ...newReview, pros: e.target.value })}
                      placeholder="What did you like about this software?"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cons">Cons</Label>
                    <Textarea
                      id="cons"
                      value={newReview.cons}
                      onChange={(e) => setNewReview({ ...newReview, cons: e.target.value })}
                      placeholder="What could be improved?"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Recommendation and Privacy */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="wouldRecommend"
                    checked={newReview.wouldRecommend}
                    onCheckedChange={(checked) => setNewReview({ ...newReview, wouldRecommend: checked })}
                  />
                  <Label htmlFor="wouldRecommend">I would recommend this software to colleagues</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isAnonymous"
                    checked={newReview.isAnonymous}
                    onCheckedChange={(checked) => setNewReview({ ...newReview, isAnonymous: checked })}
                  />
                  <Label htmlFor="isAnonymous">Submit anonymously</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReview} className="bg-blue-600 hover:bg-blue-700">
                Submit Review
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}/5</div>
            <div className="mt-1">
              {renderStars(Math.round(stats.averageRating), 'sm')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommendation Rate</CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recommendationRate.toFixed(0)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Software</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getUniqueSoftware().length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Basic Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search reviews by software, vendor, title, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedSoftware} onValueChange={setSelectedSoftware}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Software" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Software</SelectItem>
                  {getUniqueSoftware().map((software) => (
                    <SelectItem key={software} value={software}>
                      {software}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="w-full sm:w-auto"
              >
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label>Minimum Rating</Label>
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Ratings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="5">5 stars only</SelectItem>
                      <SelectItem value="4">4+ stars</SelectItem>
                      <SelectItem value="3">3+ stars</SelectItem>
                      <SelectItem value="2">2+ stars</SelectItem>
                      <SelectItem value="1">1+ stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {getUniqueDepartments().map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearAllFilters} className="w-full">
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Results Count */}
            {hasActiveFilters && (
              <div className="text-sm text-gray-600">
                Showing {filteredReviews.length} of {reviews.length} reviews
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No reviews found
                </h3>
                <p className="text-gray-600">
                  {hasActiveFilters ? 'Try adjusting your filters to see more reviews.' : 'Be the first to write a review!'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {review.softwareName || review.software_name}
                        </h3>
                        {(review.vendor || '').trim() && (
                          <Badge variant="outline" className="text-xs">
                            {review.vendor}
                          </Badge>
                        )}
                      </div>
                      <h4 className="text-md font-medium text-gray-800 mb-2">
                        {review.reviewTitle || review.review_title}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {Number(review.isAnonymous || review.is_anonymous || 0) > 0 
                                ? 'A' 
                                : (review.userName || review.user_name || 'U').charAt(0).toUpperCase()
                              }
                            </AvatarFallback>
                          </Avatar>
                          <span>
                            {Number(review.isAnonymous || review.is_anonymous || 0) > 0 
                              ? 'Anonymous' 
                              : (review.userName || review.user_name || 'Unknown')
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          <span>{review.userDepartment || review.user_department || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(review.createdAt || review.created_at || '').toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(Number(review.overallRating || review.overall_rating || 0), 'md')}
                        <span className="text-lg font-semibold">
                          {Number(review.overallRating || review.overall_rating || 0)}/5
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        {Number(review.wouldRecommend || review.would_recommend || 0) > 0 ? (
                          <>
                            <ThumbsUp className="h-4 w-4 text-green-600" />
                            <span className="text-green-600">Recommends</span>
                          </>
                        ) : (
                          <>
                            <ThumbsDown className="h-4 w-4 text-red-600" />
                            <span className="text-red-600">Does not recommend</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Ratings */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 bg-gray-50 rounded-lg px-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Ease of Use</div>
                      <div className="flex items-center justify-center gap-1">
                        {renderStars(Number(review.easeOfUseRating || review.ease_of_use_rating || 0), 'sm')}
                        <span className="text-sm font-medium ml-1">
                          {Number(review.easeOfUseRating || review.ease_of_use_rating || 0)}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Features</div>
                      <div className="flex items-center justify-center gap-1">
                        {renderStars(Number(review.featuresRating || review.features_rating || 0), 'sm')}
                        <span className="text-sm font-medium ml-1">
                          {Number(review.featuresRating || review.features_rating || 0)}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Performance</div>
                      <div className="flex items-center justify-center gap-1">
                        {renderStars(Number(review.performanceRating || review.performance_rating || 0), 'sm')}
                        <span className="text-sm font-medium ml-1">
                          {Number(review.performanceRating || review.performance_rating || 0)}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Value</div>
                      <div className="flex items-center justify-center gap-1">
                        {renderStars(Number(review.valueRating || review.value_rating || 0), 'sm')}
                        <span className="text-sm font-medium ml-1">
                          {Number(review.valueRating || review.value_rating || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  {(review.reviewText || review.review_text || '').trim() && (
                    <div className="space-y-2">
                      <p className="text-gray-700 leading-relaxed">
                        {review.reviewText || review.review_text}
                      </p>
                    </div>
                  )}

                  {/* Pros and Cons */}
                  {((review.pros || '').trim() || (review.cons || '').trim()) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(review.pros || '').trim() && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-green-700 flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4" />
                            Pros
                          </h5>
                          <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
                            {review.pros}
                          </p>
                        </div>
                      )}
                      {(review.cons || '').trim() && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-red-700 flex items-center gap-2">
                            <ThumbsDown className="h-4 w-4" />
                            Cons
                          </h5>
                          <p className="text-sm text-gray-700 bg-red-50 p-3 rounded-lg">
                            {review.cons}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Usage Duration */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>
                      Used for {review.usageDuration || review.usage_duration || 'Unknown'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default SoftwareReviews