import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import { blink } from '@/blink/client'
import { useLanguage } from '@/hooks/useLanguage'
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database, 
  Mail, 
  Key,
  Globe,
  Clock,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react'

interface SystemSettings {
  id: string
  organizationName: string
  organizationLogo: string
  timezone: string
  dateFormat: string
  currency: string
  language: string
  theme: string
  autoBackup: boolean
  backupFrequency: string
  maintenanceMode: boolean
  debugMode: boolean
  createdAt: string
  updatedAt: string
}

interface NotificationSettings {
  id: string
  userId: string
  emailNotifications: boolean
  licenseExpiry: boolean
  newDeclarations: boolean
  userChanges: boolean
  systemAlerts: boolean
  weeklyReports: boolean
  reminderDays: number
  createdAt: string
  updatedAt: string
}

interface SecuritySettings {
  id: string
  passwordPolicy: string
  sessionTimeout: number
  twoFactorRequired: boolean
  ipWhitelist: string
  auditLogging: boolean
  dataRetention: number
  encryptionEnabled: boolean
  createdAt: string
  updatedAt: string
}

interface IntegrationSettings {
  id: string
  name: string
  type: string
  endpoint: string
  apiKey: string
  isActive: boolean
  lastSync: string
  syncFrequency: string
  createdAt: string
  updatedAt: string
}

export default function Settings() {
  const { language, setLanguage, t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null)
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null)
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null)
  const [integrationSettings, setIntegrationSettings] = useState<IntegrationSettings[]>([])
  const [showApiKeys, setShowApiKeys] = useState<{[key: string]: boolean}>({})

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Load system settings
      const systemData = await blink.db.systemSettings.list({ limit: 1 })
      if (systemData.length > 0) {
        setSystemSettings(systemData[0])
      } else {
        // Create default system settings
        const defaultSystem = await blink.db.systemSettings.create({
          organizationName: 'LicenseHub Enterprise',
          organizationLogo: '',
          timezone: 'UTC',
          dateFormat: 'MM/DD/YYYY',
          currency: 'USD',
          language: 'en',
          theme: 'light',
          autoBackup: true,
          backupFrequency: 'daily',
          maintenanceMode: false,
          debugMode: false
        })
        setSystemSettings(defaultSystem)
      }

      // Load notification settings for current user
      const notificationData = await blink.db.notificationSettings.list({ 
        where: { userId: user?.id },
        limit: 1 
      })
      if (notificationData.length > 0) {
        setNotificationSettings(notificationData[0])
      } else {
        // Create default notification settings
        const defaultNotification = await blink.db.notificationSettings.create({
          userId: user?.id,
          emailNotifications: true,
          licenseExpiry: true,
          newDeclarations: true,
          userChanges: false,
          systemAlerts: true,
          weeklyReports: false,
          reminderDays: 30
        })
        setNotificationSettings(defaultNotification)
      }

      // Load security settings
      const securityData = await blink.db.securitySettings.list({ limit: 1 })
      if (securityData.length > 0) {
        setSecuritySettings(securityData[0])
      } else {
        // Create default security settings
        const defaultSecurity = await blink.db.securitySettings.create({
          passwordPolicy: 'strong',
          sessionTimeout: 480,
          twoFactorRequired: false,
          ipWhitelist: '',
          auditLogging: true,
          dataRetention: 365,
          encryptionEnabled: true
        })
        setSecuritySettings(defaultSecurity)
      }

      // Load integration settings
      const integrationData = await blink.db.integrationSettings.list()
      setIntegrationSettings(integrationData)

    } catch (error) {
      console.error('Error loading settings:', error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user, loadData])

  const saveSystemSettings = async () => {
    if (!systemSettings) return
    
    try {
      setSaving(true)
      await blink.db.systemSettings.update(systemSettings.id, {
        organizationName: systemSettings.organizationName,
        organizationLogo: systemSettings.organizationLogo,
        timezone: systemSettings.timezone,
        dateFormat: systemSettings.dateFormat,
        currency: systemSettings.currency,
        language: systemSettings.language,
        theme: systemSettings.theme,
        autoBackup: systemSettings.autoBackup,
        backupFrequency: systemSettings.backupFrequency,
        maintenanceMode: systemSettings.maintenanceMode,
        debugMode: systemSettings.debugMode
      })
      
      toast({
        title: "Success",
        description: "System settings saved successfully"
      })
    } catch (error) {
      console.error('Error saving system settings:', error)
      toast({
        title: "Error",
        description: "Failed to save system settings",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const saveNotificationSettings = async () => {
    if (!notificationSettings) return
    
    try {
      setSaving(true)
      await blink.db.notificationSettings.update(notificationSettings.id, {
        emailNotifications: notificationSettings.emailNotifications,
        licenseExpiry: notificationSettings.licenseExpiry,
        newDeclarations: notificationSettings.newDeclarations,
        userChanges: notificationSettings.userChanges,
        systemAlerts: notificationSettings.systemAlerts,
        weeklyReports: notificationSettings.weeklyReports,
        reminderDays: notificationSettings.reminderDays
      })
      
      toast({
        title: "Success",
        description: "Notification settings saved successfully"
      })
    } catch (error) {
      console.error('Error saving notification settings:', error)
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const saveSecuritySettings = async () => {
    if (!securitySettings) return
    
    try {
      setSaving(true)
      await blink.db.securitySettings.update(securitySettings.id, {
        passwordPolicy: securitySettings.passwordPolicy,
        sessionTimeout: securitySettings.sessionTimeout,
        twoFactorRequired: securitySettings.twoFactorRequired,
        ipWhitelist: securitySettings.ipWhitelist,
        auditLogging: securitySettings.auditLogging,
        dataRetention: securitySettings.dataRetention,
        encryptionEnabled: securitySettings.encryptionEnabled
      })
      
      toast({
        title: "Success",
        description: "Security settings saved successfully"
      })
    } catch (error) {
      console.error('Error saving security settings:', error)
      toast({
        title: "Error",
        description: "Failed to save security settings",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const toggleApiKeyVisibility = (integrationId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId]
    }))
  }

  const testIntegration = async (integration: IntegrationSettings) => {
    try {
      toast({
        title: "Testing Integration",
        description: `Testing connection to ${integration.name}...`
      })
      
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Success",
        description: `${integration.name} integration test successful`
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to test ${integration.name} integration`,
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('settings.title')}</h1>
          <p className="text-gray-600 mt-1">{t('settings.subtitle')}</p>
        </div>
      </div>

      <Tabs defaultValue="system" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="system" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            {t('settings.system')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t('settings.notifications')}
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t('settings.security')}
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {t('settings.integrations')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Organization Settings
              </CardTitle>
              <CardDescription>
                Configure your organization's basic information and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">{t('settings.organizationName')}</Label>
                  <Input
                    id="orgName"
                    value={systemSettings?.organizationName || ''}
                    onChange={(e) => setSystemSettings(prev => prev ? {...prev, organizationName: e.target.value} : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgLogo">Organization Logo URL</Label>
                  <Input
                    id="orgLogo"
                    value={systemSettings?.organizationLogo || ''}
                    onChange={(e) => setSystemSettings(prev => prev ? {...prev, organizationLogo: e.target.value} : null)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">{t('settings.language')}</Label>
                  <Select
                    value={language}
                    onValueChange={async (value) => {
                      await setLanguage(value)
                      setSystemSettings(prev => prev ? {...prev, language: value} : null)
                      toast({
                        title: t('settings.languageChanged'),
                        description: value === 'fr' ? 'L\'interface sera mise à jour avec la nouvelle langue.' : 'The interface will update with the new language.'
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                      <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                      <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                      <SelectItem value="pt">🇵🇹 Português</SelectItem>
                      <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                      <SelectItem value="zh">🇨🇳 中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">{t('settings.timezone')}</Label>
                  <Select
                    value={systemSettings?.timezone || 'UTC'}
                    onValueChange={(value) => setSystemSettings(prev => prev ? {...prev, timezone: value} : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Europe/Berlin">Berlin</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">{t('settings.dateFormat')}</Label>
                  <Select
                    value={systemSettings?.dateFormat || 'MM/DD/YYYY'}
                    onValueChange={(value) => setSystemSettings(prev => prev ? {...prev, dateFormat: value} : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (EU)</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                      <SelectItem value="DD.MM.YYYY">DD.MM.YYYY (DE)</SelectItem>
                      <SelectItem value="DD/MM/YY">DD/MM/YY (Short)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">{t('settings.currency')}</Label>
                  <Select
                    value={systemSettings?.currency || 'USD'}
                    onValueChange={(value) => setSystemSettings(prev => prev ? {...prev, currency: value} : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                      <SelectItem value="CHF">CHF (Fr.)</SelectItem>
                      <SelectItem value="AUD">AUD (A$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">System Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Backup</Label>
                      <p className="text-sm text-gray-500">Automatically backup system data</p>
                    </div>
                    <Switch
                      checked={systemSettings?.autoBackup || false}
                      onCheckedChange={(checked) => setSystemSettings(prev => prev ? {...prev, autoBackup: checked} : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backupFreq">Backup Frequency</Label>
                    <Select
                      value={systemSettings?.backupFrequency || 'daily'}
                      onValueChange={(value) => setSystemSettings(prev => prev ? {...prev, backupFrequency: value} : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-gray-500">Restrict access for maintenance</p>
                    </div>
                    <Switch
                      checked={systemSettings?.maintenanceMode || false}
                      onCheckedChange={(checked) => setSystemSettings(prev => prev ? {...prev, maintenanceMode: checked} : null)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Debug Mode</Label>
                      <p className="text-sm text-gray-500">Enable detailed logging</p>
                    </div>
                    <Switch
                      checked={systemSettings?.debugMode || false}
                      onCheckedChange={(checked) => setSystemSettings(prev => prev ? {...prev, debugMode: checked} : null)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={saveSystemSettings} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? (language === 'fr' ? 'Enregistrement...' : 'Saving...') : t('settings.saveSettings')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings?.emailNotifications || false}
                    onCheckedChange={(checked) => setNotificationSettings(prev => prev ? {...prev, emailNotifications: checked} : null)}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Notification Types</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>License Expiry Alerts</Label>
                      <p className="text-sm text-gray-500">Get notified when licenses are about to expire</p>
                    </div>
                    <Switch
                      checked={notificationSettings?.licenseExpiry || false}
                      onCheckedChange={(checked) => setNotificationSettings(prev => prev ? {...prev, licenseExpiry: checked} : null)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Software Declarations</Label>
                      <p className="text-sm text-gray-500">Get notified when employees submit new declarations</p>
                    </div>
                    <Switch
                      checked={notificationSettings?.newDeclarations || false}
                      onCheckedChange={(checked) => setNotificationSettings(prev => prev ? {...prev, newDeclarations: checked} : null)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>User Changes</Label>
                      <p className="text-sm text-gray-500">Get notified when user accounts are modified</p>
                    </div>
                    <Switch
                      checked={notificationSettings?.userChanges || false}
                      onCheckedChange={(checked) => setNotificationSettings(prev => prev ? {...prev, userChanges: checked} : null)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Alerts</Label>
                      <p className="text-sm text-gray-500">Get notified about system issues and updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings?.systemAlerts || false}
                      onCheckedChange={(checked) => setNotificationSettings(prev => prev ? {...prev, systemAlerts: checked} : null)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-gray-500">Receive weekly summary reports</p>
                    </div>
                    <Switch
                      checked={notificationSettings?.weeklyReports || false}
                      onCheckedChange={(checked) => setNotificationSettings(prev => prev ? {...prev, weeklyReports: checked} : null)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="reminderDays">License Expiry Reminder (Days)</Label>
                  <Input
                    id="reminderDays"
                    type="number"
                    min="1"
                    max="365"
                    value={notificationSettings?.reminderDays || 30}
                    onChange={(e) => setNotificationSettings(prev => prev ? {...prev, reminderDays: parseInt(e.target.value)} : null)}
                  />
                  <p className="text-sm text-gray-500">How many days before expiry to send reminders</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={saveNotificationSettings} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Notification Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Configuration
              </CardTitle>
              <CardDescription>
                Manage security policies and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="passwordPolicy">Password Policy</Label>
                    <Select
                      value={securitySettings?.passwordPolicy || 'strong'}
                      onValueChange={(value) => setSecuritySettings(prev => prev ? {...prev, passwordPolicy: value} : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                        <SelectItem value="strong">Strong (8+ chars, mixed case, numbers)</SelectItem>
                        <SelectItem value="complex">Complex (12+ chars, symbols required)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="15"
                      max="1440"
                      value={securitySettings?.sessionTimeout || 480}
                      onChange={(e) => setSecuritySettings(prev => prev ? {...prev, sessionTimeout: parseInt(e.target.value)} : null)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dataRetention">Data Retention (days)</Label>
                    <Input
                      id="dataRetention"
                      type="number"
                      min="30"
                      max="2555"
                      value={securitySettings?.dataRetention || 365}
                      onChange={(e) => setSecuritySettings(prev => prev ? {...prev, dataRetention: parseInt(e.target.value)} : null)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Require 2FA for all users</p>
                    </div>
                    <Switch
                      checked={securitySettings?.twoFactorRequired || false}
                      onCheckedChange={(checked) => setSecuritySettings(prev => prev ? {...prev, twoFactorRequired: checked} : null)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Audit Logging</Label>
                      <p className="text-sm text-gray-500">Log all user actions</p>
                    </div>
                    <Switch
                      checked={securitySettings?.auditLogging || false}
                      onCheckedChange={(checked) => setSecuritySettings(prev => prev ? {...prev, auditLogging: checked} : null)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Encryption</Label>
                      <p className="text-sm text-gray-500">Encrypt sensitive data at rest</p>
                    </div>
                    <Switch
                      checked={securitySettings?.encryptionEnabled || false}
                      onCheckedChange={(checked) => setSecuritySettings(prev => prev ? {...prev, encryptionEnabled: checked} : null)}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                <Textarea
                  id="ipWhitelist"
                  value={securitySettings?.ipWhitelist || ''}
                  onChange={(e) => setSecuritySettings(prev => prev ? {...prev, ipWhitelist: e.target.value} : null)}
                  placeholder="192.168.1.0/24&#10;10.0.0.0/8&#10;172.16.0.0/12"
                  rows={4}
                />
                <p className="text-sm text-gray-500">Enter IP addresses or CIDR blocks, one per line. Leave empty to allow all IPs.</p>
              </div>

              <div className="flex justify-end">
                <Button onClick={saveSecuritySettings} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Security Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                External Integrations
              </CardTitle>
              <CardDescription>
                Manage connections to external systems and services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrationSettings.length === 0 ? (
                  <div className="text-center py-8">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No integrations configured</p>
                    <p className="text-sm text-gray-400">Add integrations from the HRM Integration page</p>
                  </div>
                ) : (
                  integrationSettings.map((integration) => (
                    <div key={integration.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Globe className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{integration.name}</h4>
                            <p className="text-sm text-gray-500">{integration.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={integration.isActive ? "default" : "secondary"}>
                            {integration.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => testIntegration(integration)}
                          >
                            Test
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-xs text-gray-500">Endpoint</Label>
                          <p className="font-mono text-xs bg-gray-50 p-2 rounded">{integration.endpoint}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">API Key</Label>
                          <div className="flex items-center gap-2">
                            <p className="font-mono text-xs bg-gray-50 p-2 rounded flex-1">
                              {showApiKeys[integration.id] ? integration.apiKey : '••••••••••••••••'}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleApiKeyVisibility(integration.id)}
                            >
                              {showApiKeys[integration.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Last Sync</Label>
                          <p className="text-xs">{integration.lastSync ? new Date(integration.lastSync).toLocaleString() : 'Never'}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Sync Frequency</Label>
                          <p className="text-xs capitalize">{integration.syncFrequency}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}