import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { 
  Users, 
  Settings, 
  Activity, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Play, 
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  UserPlus,
  UserMinus,
  RefreshCw,
  Zap,
  AlertTriangle,
  TrendingUp
} from 'lucide-react'
import { blink } from '@/blink/client'
import { HRMIntegration, AutomationRule, HRMEvent } from '@/types'

export default function HRMIntegrationPage() {
  const [integrations, setIntegrations] = useState<HRMIntegration[]>([])
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([])
  const [hrmEvents, setHrmEvents] = useState<HRMEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingIntegration, setIsAddingIntegration] = useState(false)
  const [isAddingRule, setIsAddingRule] = useState(false)
  const [editingIntegration, setEditingIntegration] = useState<HRMIntegration | null>(null)
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [newIntegration, setNewIntegration] = useState({
    name: '',
    type: 'workday',
    apiEndpoint: '',
    apiKey: '',
    isActive: true,
    syncFrequency: 'daily',
    lastSync: null,
    config: {}
  })

  const [newRule, setNewRule] = useState({
    name: '',
    trigger: 'employee_hired',
    conditions: '',
    actions: '',
    isActive: true,
    priority: 'medium'
  })

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [integrationsData, rulesData, eventsData] = await Promise.all([
        blink.db.hrmIntegrations.list(),
        blink.db.automationRules.list(),
        blink.db.hrmEvents.list({ orderBy: { createdAt: 'desc' }, limit: 50 })
      ])
      setIntegrations(integrationsData)
      setAutomationRules(rulesData)
      setHrmEvents(eventsData)
    } catch (error) {
      console.error('Error loading HRM data:', error)
      toast.error('Failed to load HRM integration data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAddIntegration = async () => {
    try {
      const integration = await blink.db.hrmIntegrations.create({
        ...newIntegration,
        id: `hrm_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      setIntegrations([...integrations, integration])
      setNewIntegration({
        name: '',
        type: 'workday',
        apiEndpoint: '',
        apiKey: '',
        isActive: true,
        syncFrequency: 'daily',
        lastSync: null,
        config: {}
      })
      setIsAddingIntegration(false)
      toast.success('HRM integration added successfully')
    } catch (error) {
      console.error('Error adding integration:', error)
      toast.error('Failed to add HRM integration')
    }
  }

  const handleEditIntegration = async () => {
    if (!editingIntegration) return
    try {
      await blink.db.hrmIntegrations.update(editingIntegration.id, {
        ...editingIntegration,
        updatedAt: new Date().toISOString()
      })
      setIntegrations(integrations.map(i => i.id === editingIntegration.id ? editingIntegration : i))
      setEditingIntegration(null)
      toast.success('HRM integration updated successfully')
    } catch (error) {
      console.error('Error updating integration:', error)
      toast.error('Failed to update HRM integration')
    }
  }

  const handleDeleteIntegration = async (id: string) => {
    try {
      await blink.db.hrmIntegrations.delete(id)
      setIntegrations(integrations.filter(i => i.id !== id))
      toast.success('HRM integration deleted successfully')
    } catch (error) {
      console.error('Error deleting integration:', error)
      toast.error('Failed to delete HRM integration')
    }
  }

  const handleToggleIntegration = async (id: string, isActive: boolean) => {
    try {
      await blink.db.hrmIntegrations.update(id, { isActive, updatedAt: new Date().toISOString() })
      setIntegrations(integrations.map(i => i.id === id ? { ...i, isActive } : i))
      toast.success(`Integration ${isActive ? 'activated' : 'deactivated'} successfully`)
    } catch (error) {
      console.error('Error toggling integration:', error)
      toast.error('Failed to toggle integration status')
    }
  }

  const handleAddRule = async () => {
    try {
      const rule = await blink.db.automationRules.create({
        ...newRule,
        id: `rule_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      setAutomationRules([...automationRules, rule])
      setNewRule({
        name: '',
        trigger: 'employee_hired',
        conditions: '',
        actions: '',
        isActive: true,
        priority: 'medium'
      })
      setIsAddingRule(false)
      toast.success('Automation rule added successfully')
    } catch (error) {
      console.error('Error adding rule:', error)
      toast.error('Failed to add automation rule')
    }
  }

  const handleEditRule = async () => {
    if (!editingRule) return
    try {
      await blink.db.automationRules.update(editingRule.id, {
        ...editingRule,
        updatedAt: new Date().toISOString()
      })
      setAutomationRules(automationRules.map(r => r.id === editingRule.id ? editingRule : r))
      setEditingRule(null)
      toast.success('Automation rule updated successfully')
    } catch (error) {
      console.error('Error updating rule:', error)
      toast.error('Failed to update automation rule')
    }
  }

  const handleDeleteRule = async (id: string) => {
    try {
      await blink.db.automationRules.delete(id)
      setAutomationRules(automationRules.filter(r => r.id !== id))
      toast.success('Automation rule deleted successfully')
    } catch (error) {
      console.error('Error deleting rule:', error)
      toast.error('Failed to delete automation rule')
    }
  }

  const handleToggleRule = async (id: string, isActive: boolean) => {
    try {
      await blink.db.automationRules.update(id, { isActive, updatedAt: new Date().toISOString() })
      setAutomationRules(automationRules.map(r => r.id === id ? { ...r, isActive } : r))
      toast.success(`Rule ${isActive ? 'activated' : 'deactivated'} successfully`)
    } catch (error) {
      console.error('Error toggling rule:', error)
      toast.error('Failed to toggle rule status')
    }
  }

  const handleSyncIntegration = async (id: string) => {
    try {
      // Simulate sync process
      await blink.db.hrmIntegrations.update(id, { 
        lastSync: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      setIntegrations(integrations.map(i => i.id === id ? { ...i, lastSync: new Date().toISOString() } : i))
      toast.success('Integration synced successfully')
    } catch (error) {
      console.error('Error syncing integration:', error)
      toast.error('Failed to sync integration')
    }
  }

  const filteredEvents = hrmEvents.filter(event => {
    const matchesSearch = event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.employeeName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Processed</Badge>
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>
      case 'low':
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getIntegrationTypeBadge = (type: string) => {
    switch (type) {
      case 'workday':
        return <Badge className="bg-blue-100 text-blue-800">Workday</Badge>
      case 'bamboohr':
        return <Badge className="bg-green-100 text-green-800">BambooHR</Badge>
      case 'adp':
        return <Badge className="bg-purple-100 text-purple-800">ADP</Badge>
      case 'successfactors':
        return <Badge className="bg-orange-100 text-orange-800">SuccessFactors</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HRM Integration</h1>
          <p className="text-gray-600 mt-1">Automate license management with HR systems</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.filter(i => i.isActive).length}</div>
            <p className="text-xs text-muted-foreground">
              of {integrations.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automation Rules</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automationRules.filter(r => r.isActive).length}</div>
            <p className="text-xs text-muted-foreground">
              active rules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hrmEvents.filter(e => new Date(e.createdAt).toDateString() === new Date().toDateString()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              processed events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hrmEvents.length > 0 ? Math.round((hrmEvents.filter(e => e.status === 'processed').length / hrmEvents.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              event success rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="integrations">HRM Integrations</TabsTrigger>
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="events">Event History</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>HRM System Integrations</CardTitle>
                  <CardDescription>Connect and manage your HR systems for automated license management</CardDescription>
                </div>
                <Dialog open={isAddingIntegration} onOpenChange={setIsAddingIntegration}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Integration
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add HRM Integration</DialogTitle>
                      <DialogDescription>Connect a new HR system to automate license management</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Integration Name</Label>
                        <Input
                          id="name"
                          value={newIntegration.name}
                          onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                          placeholder="e.g., Company Workday"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">HRM System Type</Label>
                        <Select value={newIntegration.type} onValueChange={(value) => setNewIntegration({ ...newIntegration, type: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="workday">Workday</SelectItem>
                            <SelectItem value="bamboohr">BambooHR</SelectItem>
                            <SelectItem value="adp">ADP</SelectItem>
                            <SelectItem value="successfactors">SAP SuccessFactors</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="apiEndpoint">API Endpoint</Label>
                        <Input
                          id="apiEndpoint"
                          value={newIntegration.apiEndpoint}
                          onChange={(e) => setNewIntegration({ ...newIntegration, apiEndpoint: e.target.value })}
                          placeholder="https://api.workday.com/v1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="apiKey">API Key</Label>
                        <Input
                          id="apiKey"
                          type="password"
                          value={newIntegration.apiKey}
                          onChange={(e) => setNewIntegration({ ...newIntegration, apiKey: e.target.value })}
                          placeholder="Enter API key"
                        />
                      </div>
                      <div>
                        <Label htmlFor="syncFrequency">Sync Frequency</Label>
                        <Select value={newIntegration.syncFrequency} onValueChange={(value) => setNewIntegration({ ...newIntegration, syncFrequency: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="realtime">Real-time</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isActive"
                          checked={newIntegration.isActive}
                          onCheckedChange={(checked) => setNewIntegration({ ...newIntegration, isActive: checked })}
                        />
                        <Label htmlFor="isActive">Active</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingIntegration(false)}>Cancel</Button>
                      <Button onClick={handleAddIntegration}>Add Integration</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {integrations.map((integration) => (
                    <TableRow key={integration.id}>
                      <TableCell className="font-medium">{integration.name}</TableCell>
                      <TableCell>{getIntegrationTypeBadge(integration.type)}</TableCell>
                      <TableCell>
                        {integration.isActive ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Pause className="w-3 h-3 mr-1" />Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {integration.lastSync ? new Date(integration.lastSync).toLocaleString() : 'Never'}
                      </TableCell>
                      <TableCell className="capitalize">{integration.syncFrequency}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingIntegration(integration)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSyncIntegration(integration.id)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Sync Now
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleIntegration(integration.id, !integration.isActive)}>
                              {integration.isActive ? (
                                <>
                                  <Pause className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Play className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteIntegration(integration.id)}
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
                  {integrations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No HRM integrations configured. Add your first integration to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Automation Rules</CardTitle>
                  <CardDescription>Define rules to automatically assign or revoke licenses based on HR events</CardDescription>
                </div>
                <Dialog open={isAddingRule} onOpenChange={setIsAddingRule}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Rule
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Automation Rule</DialogTitle>
                      <DialogDescription>Create a rule to automate license management based on HR events</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="ruleName">Rule Name</Label>
                        <Input
                          id="ruleName"
                          value={newRule.name}
                          onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                          placeholder="e.g., Auto-assign Office 365 to new hires"
                        />
                      </div>
                      <div>
                        <Label htmlFor="trigger">Trigger Event</Label>
                        <Select value={newRule.trigger} onValueChange={(value) => setNewRule({ ...newRule, trigger: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="employee_hired">Employee Hired</SelectItem>
                            <SelectItem value="employee_terminated">Employee Terminated</SelectItem>
                            <SelectItem value="department_changed">Department Changed</SelectItem>
                            <SelectItem value="role_changed">Role Changed</SelectItem>
                            <SelectItem value="location_changed">Location Changed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="conditions">Conditions (JSON)</Label>
                        <Textarea
                          id="conditions"
                          value={newRule.conditions}
                          onChange={(e) => setNewRule({ ...newRule, conditions: e.target.value })}
                          placeholder='{"department": "Engineering", "role": "Developer"}'
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="actions">Actions (JSON)</Label>
                        <Textarea
                          id="actions"
                          value={newRule.actions}
                          onChange={(e) => setNewRule({ ...newRule, actions: e.target.value })}
                          placeholder='{"assign_licenses": ["office365", "github"], "notify_admin": true}'
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={newRule.priority} onValueChange={(value) => setNewRule({ ...newRule, priority: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="ruleActive"
                          checked={newRule.isActive}
                          onCheckedChange={(checked) => setNewRule({ ...newRule, isActive: checked })}
                        />
                        <Label htmlFor="ruleActive">Active</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingRule(false)}>Cancel</Button>
                      <Button onClick={handleAddRule}>Add Rule</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {automationRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell className="capitalize">{rule.trigger.replace('_', ' ')}</TableCell>
                      <TableCell>{getPriorityBadge(rule.priority)}</TableCell>
                      <TableCell>
                        {rule.isActive ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Pause className="w-3 h-3 mr-1" />Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{new Date(rule.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingRule(rule)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleRule(rule.id, !rule.isActive)}>
                              {rule.isActive ? (
                                <>
                                  <Pause className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Play className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteRule(rule.id)}
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
                  {automationRules.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No automation rules configured. Add your first rule to automate license management.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>HRM Event History</CardTitle>
                  <CardDescription>Track all HR events and their processing status</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions Taken</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {event.eventType === 'employee_hired' && <UserPlus className="w-4 h-4 mr-2 text-green-600" />}
                          {event.eventType === 'employee_terminated' && <UserMinus className="w-4 h-4 mr-2 text-red-600" />}
                          {event.eventType === 'department_changed' && <Building className="w-4 h-4 mr-2 text-blue-600" />}
                          <span className="capitalize">{event.eventType.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{event.employeeName}</TableCell>
                      <TableCell>{event.department}</TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {event.actionsPerformed ? JSON.parse(event.actionsPerformed).join(', ') : 'None'}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(event.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {filteredEvents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No events found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Integration Dialog */}
      <Dialog open={!!editingIntegration} onOpenChange={() => setEditingIntegration(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit HRM Integration</DialogTitle>
            <DialogDescription>Update integration settings</DialogDescription>
          </DialogHeader>
          {editingIntegration && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName">Integration Name</Label>
                <Input
                  id="editName"
                  value={editingIntegration.name}
                  onChange={(e) => setEditingIntegration({ ...editingIntegration, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editApiEndpoint">API Endpoint</Label>
                <Input
                  id="editApiEndpoint"
                  value={editingIntegration.apiEndpoint}
                  onChange={(e) => setEditingIntegration({ ...editingIntegration, apiEndpoint: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editSyncFrequency">Sync Frequency</Label>
                <Select 
                  value={editingIntegration.syncFrequency} 
                  onValueChange={(value) => setEditingIntegration({ ...editingIntegration, syncFrequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="editActive"
                  checked={editingIntegration.isActive}
                  onCheckedChange={(checked) => setEditingIntegration({ ...editingIntegration, isActive: checked })}
                />
                <Label htmlFor="editActive">Active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingIntegration(null)}>Cancel</Button>
            <Button onClick={handleEditIntegration}>Update Integration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Rule Dialog */}
      <Dialog open={!!editingRule} onOpenChange={() => setEditingRule(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Automation Rule</DialogTitle>
            <DialogDescription>Update rule configuration</DialogDescription>
          </DialogHeader>
          {editingRule && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editRuleName">Rule Name</Label>
                <Input
                  id="editRuleName"
                  value={editingRule.name}
                  onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editTrigger">Trigger Event</Label>
                <Select 
                  value={editingRule.trigger} 
                  onValueChange={(value) => setEditingRule({ ...editingRule, trigger: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee_hired">Employee Hired</SelectItem>
                    <SelectItem value="employee_terminated">Employee Terminated</SelectItem>
                    <SelectItem value="department_changed">Department Changed</SelectItem>
                    <SelectItem value="role_changed">Role Changed</SelectItem>
                    <SelectItem value="location_changed">Location Changed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editConditions">Conditions (JSON)</Label>
                <Textarea
                  id="editConditions"
                  value={editingRule.conditions}
                  onChange={(e) => setEditingRule({ ...editingRule, conditions: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="editActions">Actions (JSON)</Label>
                <Textarea
                  id="editActions"
                  value={editingRule.actions}
                  onChange={(e) => setEditingRule({ ...editingRule, actions: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="editPriority">Priority</Label>
                <Select 
                  value={editingRule.priority} 
                  onValueChange={(value) => setEditingRule({ ...editingRule, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="editRuleActive"
                  checked={editingRule.isActive}
                  onCheckedChange={(checked) => setEditingRule({ ...editingRule, isActive: checked })}
                />
                <Label htmlFor="editRuleActive">Active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRule(null)}>Cancel</Button>
            <Button onClick={handleEditRule}>Update Rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}