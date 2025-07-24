export interface User {
  id: string
  email: string
  name: string
  fullName: string
  role: 'admin' | 'manager' | 'employee' | 'service_provider'
  department?: string
  position?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface SoftwareLicense {
  id: string
  softwareName: string
  vendor: string
  licenseType: string
  totalLicenses: number
  usedLicenses: number
  costPerLicense?: number
  purchaseDate?: string
  expiryDate?: string
  status: 'active' | 'expired' | 'expiring'
  description?: string
  createdBy?: string
  createdAt: string
  updatedAt: string
}

export interface LicenseAssignment {
  id: string
  licenseId: string
  userId: string
  assignedBy: string
  assignedDate: string
  status: 'active' | 'revoked'
  notes?: string
}

export interface SoftwareDeclaration {
  id: string
  userId: string
  userEmail: string
  userName: string
  softwareName: string
  vendor: string
  version?: string
  purpose: string
  businessJustification: string
  department: string
  estimatedUsers: number
  licenseType: string
  urgency: string
  status: 'pending' | 'approved' | 'rejected'
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ServiceProviderAssignment {
  id: string
  licenseId: string
  serviceProviderId: string
  assignedBy: string
  assignedDate: string
  status: 'active' | 'inactive'
  responsibilities?: string
}

export interface AuditLog {
  id: string
  user_id: string
  action: string
  entity_type: string
  entity_id?: string
  old_values?: string
  new_values?: string
  ip_address?: string
  created_at: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  readStatus: number
  createdAt: string
}

export interface HRMIntegration {
  id: string
  name: string
  type: string
  apiEndpoint: string
  apiKey: string
  isActive: boolean
  syncFrequency: string
  lastSync: string | null
  config: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface AutomationRule {
  id: string
  name: string
  trigger: string
  conditions: string
  actions: string
  isActive: boolean
  priority: string
  createdAt: string
  updatedAt: string
}

export interface HRMEvent {
  id: string
  eventType: string
  employeeId?: string
  employeeName?: string
  department?: string
  eventData: string
  status: string
  actionsPerformed?: string
  errorMessage?: string
  createdAt: string
  processedAt?: string
}

export interface SystemSettings {
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

export interface NotificationSettings {
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

export interface SecuritySettings {
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

export interface Report {
  id: string
  name: string
  type: string
  description: string
  parameters: string
  schedule: string
  status: string
  generated_at?: string
  created_at: string
  updated_at: string
}

export interface ComplianceCheck {
  id: string
  check_type: string
  status: string
  issues_found?: number
  recommendations?: string
  created_at: string
}

export interface UserInvitation {
  id: string
  email: string
  role: 'admin' | 'manager' | 'employee' | 'service_provider'
  department?: string
  position?: string
  invitedBy: string
  invitedByName: string
  status: 'pending' | 'accepted' | 'expired' | 'cancelled'
  invitationToken: string
  expiresAt: string
  acceptedAt?: string
  createdAt: string
  updatedAt: string
}