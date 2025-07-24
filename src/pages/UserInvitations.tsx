import React, { useState, useEffect, useCallback } from 'react'
import { blink } from '../blink/client'
import { UserInvitation } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Badge } from '../components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu'
import { Textarea } from '../components/ui/textarea'
import { toast } from '../hooks/use-toast'
import { 
  Users, 
  UserPlus, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MoreHorizontal, 
  Send, 
  Copy, 
  Trash2,
  RefreshCw,
  Shield,
  Building,
  User,
  Wrench
} from 'lucide-react'

const UserInvitations: React.FC = () => {
  const [invitations, setInvitations] = useState<UserInvitation[]>([])
  const [filteredInvitations, setFilteredInvitations] = useState<UserInvitation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showBulkInviteDialog, setShowBulkInviteDialog] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Single invite form
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'employee' as const,
    department: '',
    position: ''
  })

  // Bulk invite form
  const [bulkInviteForm, setBulkInviteForm] = useState({
    emails: '',
    role: 'employee' as const,
    department: '',
    position: '',
    message: ''
  })

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const user = await blink.auth.me()
      setCurrentUser(user)

      const invitationsData = await blink.db.userInvitations.list({
        orderBy: { createdAt: 'desc' }
      })
      setInvitations(invitationsData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load invitations',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filterInvitations = useCallback(() => {
    let filtered = invitations

    if (searchTerm) {
      filtered = filtered.filter(invitation =>
        invitation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invitation.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invitation.position?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(invitation => invitation.status === statusFilter)
    }

    setFilteredInvitations(filtered)
  }, [invitations, searchTerm, statusFilter])

  useEffect(() => {
    filterInvitations()
  }, [filterInvitations])

  const generateInvitationToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  const handleSingleInvite = async () => {
    if (!inviteForm.email || !currentUser) return

    try {
      const invitationToken = generateInvitationToken()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

      await blink.db.userInvitations.create({
        id: `inv_${Date.now()}`,
        email: inviteForm.email,
        role: inviteForm.role,
        department: inviteForm.department,
        position: inviteForm.position,
        invitedBy: currentUser.id,
        invitedByName: currentUser.name || currentUser.email,
        status: 'pending',
        invitationToken,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      toast({
        title: 'Invitation Sent',
        description: `Invitation sent to ${inviteForm.email}`
      })

      setInviteForm({ email: '', role: 'employee', department: '', position: '' })
      setShowInviteDialog(false)
      loadData()
    } catch (error) {
      console.error('Error sending invitation:', error)
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive'
      })
    }
  }

  const handleBulkInvite = async () => {
    if (!bulkInviteForm.emails || !currentUser) return

    try {
      const emails = bulkInviteForm.emails
        .split(/[,\n]/)
        .map(email => email.trim())
        .filter(email => email && email.includes('@'))

      if (emails.length === 0) {
        toast({
          title: 'Error',
          description: 'Please enter valid email addresses',
          variant: 'destructive'
        })
        return
      }

      for (const email of emails) {
        const invitationToken = generateInvitationToken()
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7)

        await blink.db.userInvitations.create({
          id: `inv_${Date.now()}_${Math.random().toString(36).substring(2)}`,
          email,
          role: bulkInviteForm.role,
          department: bulkInviteForm.department,
          position: bulkInviteForm.position,
          invitedBy: currentUser.id,
          invitedByName: currentUser.name || currentUser.email,
          status: 'pending',
          invitationToken,
          expiresAt: expiresAt.toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }

      toast({
        title: 'Bulk Invitations Sent',
        description: `${emails.length} invitations sent successfully`
      })

      setBulkInviteForm({ emails: '', role: 'employee', department: '', position: '', message: '' })
      setShowBulkInviteDialog(false)
      loadData()
    } catch (error) {
      console.error('Error sending bulk invitations:', error)
      toast({
        title: 'Error',
        description: 'Failed to send bulk invitations',
        variant: 'destructive'
      })
    }
  }

  const handleResendInvitation = async (invitation: UserInvitation) => {
    try {
      const newExpiresAt = new Date()
      newExpiresAt.setDate(newExpiresAt.getDate() + 7)

      await blink.db.userInvitations.update(invitation.id, {
        status: 'pending',
        expiresAt: newExpiresAt.toISOString(),
        updatedAt: new Date().toISOString()
      })

      toast({
        title: 'Invitation Resent',
        description: `Invitation resent to ${invitation.email}`
      })

      loadData()
    } catch (error) {
      console.error('Error resending invitation:', error)
      toast({
        title: 'Error',
        description: 'Failed to resend invitation',
        variant: 'destructive'
      })
    }
  }

  const handleCancelInvitation = async (invitation: UserInvitation) => {
    try {
      await blink.db.userInvitations.update(invitation.id, {
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      })

      toast({
        title: 'Invitation Cancelled',
        description: `Invitation to ${invitation.email} has been cancelled`
      })

      loadData()
    } catch (error) {
      console.error('Error cancelling invitation:', error)
      toast({
        title: 'Error',
        description: 'Failed to cancel invitation',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteInvitation = async (invitation: UserInvitation) => {
    try {
      await blink.db.userInvitations.delete(invitation.id)

      toast({
        title: 'Invitation Deleted',
        description: `Invitation to ${invitation.email} has been deleted`
      })

      loadData()
    } catch (error) {
      console.error('Error deleting invitation:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete invitation',
        variant: 'destructive'
      })
    }
  }

  const copyInvitationLink = (invitation: UserInvitation) => {
    const inviteUrl = `${window.location.origin}/invite/${invitation.invitationToken}`
    navigator.clipboard.writeText(inviteUrl)
    toast({
      title: 'Link Copied',
      description: 'Invitation link copied to clipboard'
    })
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />
      case 'manager': return <Building className="h-4 w-4" />
      case 'service_provider': return <Wrench className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'manager': return 'bg-blue-100 text-blue-800'
      case 'service_provider': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'expired': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'accepted': return <CheckCircle className="h-4 w-4" />
      case 'expired': return <XCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const stats = {
    total: invitations.length,
    pending: invitations.filter(inv => inv.status === 'pending').length,
    accepted: invitations.filter(inv => inv.status === 'accepted').length,
    expired: invitations.filter(inv => inv.status === 'expired').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading invitations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Invitations</h1>
          <p className="text-gray-600">Invite colleagues to join your organization</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showBulkInviteDialog} onOpenChange={setShowBulkInviteDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Bulk Invite
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Bulk Invite Users</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bulk-emails">Email Addresses</Label>
                  <Textarea
                    id="bulk-emails"
                    placeholder="Enter email addresses separated by commas or new lines"
                    value={bulkInviteForm.emails}
                    onChange={(e) => setBulkInviteForm({ ...bulkInviteForm, emails: e.target.value })}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="bulk-role">Role</Label>
                  <Select value={bulkInviteForm.role} onValueChange={(value: any) => setBulkInviteForm({ ...bulkInviteForm, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="service_provider">Service Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bulk-department">Department</Label>
                  <Input
                    id="bulk-department"
                    value={bulkInviteForm.department}
                    onChange={(e) => setBulkInviteForm({ ...bulkInviteForm, department: e.target.value })}
                    placeholder="e.g., Engineering, Marketing"
                  />
                </div>
                <div>
                  <Label htmlFor="bulk-position">Position</Label>
                  <Input
                    id="bulk-position"
                    value={bulkInviteForm.position}
                    onChange={(e) => setBulkInviteForm({ ...bulkInviteForm, position: e.target.value })}
                    placeholder="e.g., Software Engineer, Manager"
                  />
                </div>
                <div>
                  <Label htmlFor="bulk-message">Custom Message (Optional)</Label>
                  <Textarea
                    id="bulk-message"
                    value={bulkInviteForm.message}
                    onChange={(e) => setBulkInviteForm({ ...bulkInviteForm, message: e.target.value })}
                    placeholder="Add a personal message to the invitation"
                    rows={3}
                  />
                </div>
                <Button onClick={handleBulkInvite} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Bulk Invitations
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Invite New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    placeholder="colleague@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={inviteForm.role} onValueChange={(value: any) => setInviteForm({ ...inviteForm, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="service_provider">Service Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={inviteForm.department}
                    onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
                    placeholder="e.g., Engineering, Marketing"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={inviteForm.position}
                    onChange={(e) => setInviteForm({ ...inviteForm, position: e.target.value })}
                    placeholder="e.g., Software Engineer, Manager"
                  />
                </div>
                <Button onClick={handleSingleInvite} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invitations</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by email, department, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invitations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invitations ({filteredInvitations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invited By</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell className="font-medium">{invitation.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(invitation.role)}>
                      {getRoleIcon(invitation.role)}
                      <span className="ml-1 capitalize">{invitation.role.replace('_', ' ')}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{invitation.department || '-'}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(invitation.status)}>
                      {getStatusIcon(invitation.status)}
                      <span className="ml-1 capitalize">{invitation.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{invitation.invitedByName}</TableCell>
                  <TableCell>{new Date(invitation.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(invitation.expiresAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => copyInvitationLink(invitation)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Link
                        </DropdownMenuItem>
                        {invitation.status === 'pending' && (
                          <DropdownMenuItem onClick={() => handleResendInvitation(invitation)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Resend
                          </DropdownMenuItem>
                        )}
                        {invitation.status === 'pending' && (
                          <DropdownMenuItem onClick={() => handleCancelInvitation(invitation)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDeleteInvitation(invitation)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredInvitations.length === 0 && (
            <div className="text-center py-8">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No invitations found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by inviting your first colleague.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default UserInvitations