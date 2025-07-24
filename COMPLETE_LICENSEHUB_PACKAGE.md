# 🚀 Package de Migration LicenseHub Complet - Version Professionnelle

## Prompt Principal pour Nouveau Projet

Copiez et collez ce prompt complet dans une nouvelle conversation Blink :

---

Je veux créer une plateforme complète de gestion de licences logicielles d'entreprise de niveau professionnel avec TOUTES les fonctionnalités essentielles d'une solution SaaS moderne.

CRITIQUE : Utilisez exactement cet ID de projet pour l'accès partagé à la base de données :
saas-software-license-management-platform-1nrrckap

Vue d'ensemble du projet :
Il s'agit de la plateforme principale LicenseHub destinée aux employés qui aide les entreprises à gérer leurs licences logicielles en interne. Cette solution doit rivaliser avec ServiceNow, Flexera et Snow Software en termes de fonctionnalités et d'expérience utilisateur.

Exigences techniques :
- React + TypeScript + Vite
- Tailwind CSS + ShadCN UI components
- Blink SDK pour base de données, auth et APIs
- Support bilingue français/anglais complet
- Architecture modulaire et scalable

Fonctionnalités complètes requises (18 modules) :

1. **Tableau de bord exécutif** - Vue d'ensemble stratégique avec KPIs
2. **Gestion des licences** - CRUD complet avec workflows d'approbation
3. **Déclarations logicielles** - Processus d'approbation hiérarchique
4. **Gestion des utilisateurs** - Rôles et permissions granulaires
5. **Invitations utilisateurs** - Onboarding automatisé avec workflows
6. **Centre de notifications** - Système d'alertes temps réel intelligent
7. **Gestion budgétaire** - Contrôle des coûts par département avec alertes
8. **Workflows d'approbation** - Processus configurables multi-niveaux
9. **Gestion des renouvellements** - Calendrier automatisé et négociations
10. **Gestion départementale** - Organisation multi-sites avec budgets
11. **Contrats & Fournisseurs** - Base de données complète avec SLA
12. **Catalogue logiciels** - Système d'approbation et évaluation sécuritaire
13. **Avis logiciels** - Évaluations internes avec métriques détaillées
14. **Analytics avancés** - BI avec prédictions et optimisations
15. **Rapports & Audits** - Conformité réglementaire complète
16. **Intégrations** - Connecteurs API avec systèmes existants
17. **Support & Incidents** - Système de tickets avec escalade
18. **Paramètres** - Configuration d'entreprise granulaire

Rôles utilisateurs (5 niveaux) :
- Super Admin : Accès complet à toutes les fonctionnalités
- Admin : Gestion complète de l'entreprise
- Manager : Gestion départementale et approbations
- Employee : Utilisation et déclarations
- Service Provider : Support technique assigné

Composants clés à construire :

**Pages principales :**
1. ExecutiveDashboard.tsx - Tableau de bord stratégique
2. LicenseManagement.tsx - Gestion complète des licences
3. SoftwareDeclarations.tsx - Processus de déclaration
4. UserManagement.tsx - Gestion des utilisateurs
5. UserInvitations.tsx - Système d'invitations
6. NotificationCenter.tsx - Centre de notifications
7. BudgetManagement.tsx - Gestion budgétaire
8. ApprovalWorkflows.tsx - Workflows d'approbation
9. RenewalManagement.tsx - Gestion des renouvellements
10. DepartmentManagement.tsx - Gestion départementale
11. ContractManagement.tsx - Gestion des contrats
12. SoftwareCatalog.tsx - Catalogue logiciels
13. SoftwareReviews.tsx - Système d'avis
14. AdvancedAnalytics.tsx - Analytics avancés
15. ReportsAudits.tsx - Rapports et audits
16. IntegrationManagement.tsx - Gestion des intégrations
17. SupportTickets.tsx - Système de support
18. SystemSettings.tsx - Paramètres système

**Fonctionnalités avancées requises :**
- Système de notifications intelligent avec priorités
- Workflows d'approbation configurables multi-niveaux
- Gestion budgétaire avec alertes automatiques
- Analytics prédictifs et optimisation des coûts
- Intégrations API avec Active Directory, HR, monitoring
- Système de tickets avec escalade automatique
- Audit trail complet pour conformité
- Permissions granulaires par rôle et département
- Dashboard personnalisables par rôle
- Rapports automatisés et planifiés

**Base de données (20 tables) :**
Le projet utilise ces tables principales (elles existent déjà dans la base partagée) :
- users, companies, departments (organisation)
- software_licenses, license_assignments (licences)
- software_declarations, approval_workflows (processus)
- user_invitations, notifications (communication)
- department_budgets, vendor_contracts (finance)
- software_catalog, software_reviews (catalogue)
- audit_logs, business_metrics (conformité)
- integrations, support_tickets (support)
- system_settings, user_sessions (configuration)

**Exigences de design :**
- Interface moderne et professionnelle niveau entreprise
- Navigation basée sur les rôles avec permissions granulaires
- Design responsive pour desktop/mobile/tablette
- Support français complet (marché principal)
- UX optimisée pour utilisateurs non-techniques
- Thème sombre/clair avec personnalisation
- Animations fluides et microinteractions
- Accessibilité WCAG 2.1 AA

**KPIs et métriques essentiels :**
- Coût total des licences et ROI
- Taux d'utilisation et optimisation
- Score de conformité et risques
- Satisfaction utilisateur et productivité
- Temps de provisioning et automatisation

Aidez-moi à construire cette plateforme complète de gestion de licences d'entreprise. Commencez par la structure de projet de base et le tableau de bord exécutif, puis nous construirons chaque composant systématiquement.

L'objectif est de créer une solution de gouvernance IT complète qui rivalise avec les leaders du marché et aide les entreprises à optimiser leurs coûts logiciels de 20-40% tout en assurant une conformité réglementaire parfaite.

---

## Package de Fichiers Complet

Quand l'IA demande plus de détails, partagez ces fichiers :

### Fichier 1 : package.json complet
```json
{
  "name": "licensehub-enterprise",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui"
  },
  "dependencies": {
    "@blinkdotnew/sdk": "^0.17.3",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-collapsible": "^1.0.3",
    "@radix-ui/react-context-menu": "^2.1.5",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-hover-card": "^1.0.7",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-toggle": "^1.0.3",
    "@radix-ui/react-tooltip": "^1.0.7",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.263.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0",
    "react-hook-form": "^7.45.4",
    "recharts": "^2.8.0",
    "sonner": "^1.0.3",
    "tailwind-merge": "^1.14.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.22.2",
    "@hookform/resolvers": "^3.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "vitest": "^0.34.6"
  }
}
```

### Fichier 2 : src/blink/client.ts
```typescript
import { createClient } from '@blinkdotnew/sdk'

const blink = createClient({
  projectId: 'saas-software-license-management-platform-1nrrckap', // MÊME ID PROJET
  authRequired: true
})

console.log('LicenseHub Enterprise - Client Blink prêt pour l\'authentification')

export default blink
```

### Fichier 3 : src/App.tsx
```typescript
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import blink from './blink/client'
import Layout from './components/layout/Layout'

// Pages principales
import ExecutiveDashboard from './pages/ExecutiveDashboard'
import LicenseManagement from './pages/LicenseManagement'
import SoftwareDeclarations from './pages/SoftwareDeclarations'
import UserManagement from './pages/UserManagement'
import UserInvitations from './pages/UserInvitations'
import NotificationCenter from './pages/NotificationCenter'
import BudgetManagement from './pages/BudgetManagement'
import ApprovalWorkflows from './pages/ApprovalWorkflows'
import RenewalManagement from './pages/RenewalManagement'
import DepartmentManagement from './pages/DepartmentManagement'
import ContractManagement from './pages/ContractManagement'
import SoftwareCatalog from './pages/SoftwareCatalog'
import SoftwareReviews from './pages/SoftwareReviews'
import AdvancedAnalytics from './pages/AdvancedAnalytics'
import ReportsAudits from './pages/ReportsAudits'
import IntegrationManagement from './pages/IntegrationManagement'
import SupportTickets from './pages/SupportTickets'
import SystemSettings from './pages/SystemSettings'

// Contextes
import { LanguageProvider } from './contexts/LanguageContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { ThemeProvider } from './contexts/ThemeContext'

// UI
import { Toaster } from '@/components/ui/toaster'
import { toast } from '@/hooks/use-toast'

interface User {
  id: string
  email: string
  name?: string
  role?: string
  company_id?: string
  department_id?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      console.log('État d\'authentification changé:', state)
      setUser(state.user)
      setLoading(state.isLoading)

      if (state.user && !state.isLoading) {
        try {
          // Créer/mettre à jour l'utilisateur dans la base de données
          await blink.db.users.upsert({
            id: state.user.id,
            name: state.user.name || state.user.email,
            email: state.user.email,
            role: 'employee', // Rôle par défaut
            is_active: true,
            last_login: new Date().toISOString()
          }).catch(console.error)
        } catch (error) {
          console.error('Erreur lors de la création de l\'utilisateur:', error)
        }
      }
    })

    return unsubscribe
  }, [])

  const handleSignIn = () => {
    try {
      blink.auth.login()
    } catch (error) {
      console.error('Erreur de connexion:', error)
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter. Veuillez réessayer.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">LicenseHub Enterprise</h2>
          <p className="text-gray-600">Chargement de votre plateforme...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">LicenseHub Enterprise</h2>
            <p className="mt-2 text-sm text-gray-600">
              Plateforme complète de gestion des licences logicielles
            </p>
          </div>
          <div>
            <button
              onClick={handleSignIn}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Se connecter avec Blink
            </button>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Solution de gouvernance IT d'entreprise
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Layout>
                <Routes>
                  <Route path="/" element={<ExecutiveDashboard />} />
                  <Route path="/licenses" element={<LicenseManagement />} />
                  <Route path="/declarations" element={<SoftwareDeclarations />} />
                  <Route path="/users" element={<UserManagement />} />
                  <Route path="/invitations" element={<UserInvitations />} />
                  <Route path="/notifications" element={<NotificationCenter />} />
                  <Route path="/budget" element={<BudgetManagement />} />
                  <Route path="/approvals" element={<ApprovalWorkflows />} />
                  <Route path="/renewals" element={<RenewalManagement />} />
                  <Route path="/departments" element={<DepartmentManagement />} />
                  <Route path="/contracts" element={<ContractManagement />} />
                  <Route path="/catalog" element={<SoftwareCatalog />} />
                  <Route path="/reviews" element={<SoftwareReviews />} />
                  <Route path="/analytics" element={<AdvancedAnalytics />} />
                  <Route path="/reports" element={<ReportsAudits />} />
                  <Route path="/integrations" element={<IntegrationManagement />} />
                  <Route path="/support" element={<SupportTickets />} />
                  <Route path="/settings" element={<SystemSettings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
              <Toaster />
            </div>
          </Router>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
```

### Fichier 4 : src/components/layout/Sidebar.tsx
```typescript
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, Key, FileText, Users, UserPlus, Bell,
  DollarSign, CheckCircle, Calendar, Building, FileContract,
  Package, Star, TrendingUp, BarChart3, Zap, HelpCircle,
  Settings, LogOut, ChevronDown, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import blink from '@/blink/client'
import { useLanguage } from '@/hooks/useLanguage'
import { useState } from 'react'

const Sidebar = () => {
  const location = useLocation()
  const { t } = useLanguage()
  const [expandedSections, setExpandedSections] = useState<string[]>(['main'])

  const navigationSections = [
    {
      id: 'main',
      name: t('mainFeatures'),
      items: [
        { name: t('executiveDashboard'), path: '/', icon: LayoutDashboard },
        { name: t('licenseManagement'), path: '/licenses', icon: Key },
        { name: t('softwareDeclarations'), path: '/declarations', icon: FileText },
      ]
    },
    {
      id: 'users',
      name: t('userManagement'),
      items: [
        { name: t('userManagement'), path: '/users', icon: Users },
        { name: t('userInvitations'), path: '/invitations', icon: UserPlus },
        { name: t('notificationCenter'), path: '/notifications', icon: Bell },
      ]
    },
    {
      id: 'finance',
      name: t('financialManagement'),
      items: [
        { name: t('budgetManagement'), path: '/budget', icon: DollarSign },
        { name: t('renewalManagement'), path: '/renewals', icon: Calendar },
        { name: t('contractManagement'), path: '/contracts', icon: FileContract },
      ]
    },
    {
      id: 'workflow',
      name: t('workflowsAndProcesses'),
      items: [
        { name: t('approvalWorkflows'), path: '/approvals', icon: CheckCircle },
        { name: t('departmentManagement'), path: '/departments', icon: Building },
        { name: t('softwareCatalog'), path: '/catalog', icon: Package },
      ]
    },
    {
      id: 'analytics',
      name: t('analyticsAndReporting'),
      items: [
        { name: t('softwareReviews'), path: '/reviews', icon: Star },
        { name: t('advancedAnalytics'), path: '/analytics', icon: TrendingUp },
        { name: t('reportsAudits'), path: '/reports', icon: BarChart3 },
      ]
    },
    {
      id: 'system',
      name: t('systemAndSupport'),
      items: [
        { name: t('integrationManagement'), path: '/integrations', icon: Zap },
        { name: t('supportTickets'), path: '/support', icon: HelpCircle },
        { name: t('systemSettings'), path: '/settings', icon: Settings },
      ]
    }
  ]

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleLogout = () => {
    blink.auth.logout()
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Key className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">LicenseHub</h1>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigationSections.map((section) => {
          const isExpanded = expandedSections.includes(section.id)
          
          return (
            <div key={section.id} className="space-y-1">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex items-center justify-between w-full px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
              >
                <span>{section.name}</span>
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>
              
              {isExpanded && (
                <div className="space-y-1 ml-2">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                          isActive
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                        )}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          {t('logout')}
        </button>
      </div>
    </div>
  )
}

export default Sidebar
```

### Fichier 5 : Traductions françaises complètes (src/contexts/LanguageContext.tsx)
```typescript
import React, { createContext, useContext, useState } from 'react'

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const translations = {
  fr: {
    // Navigation principale
    mainFeatures: 'Fonctionnalités principales',
    userManagement: 'Gestion des utilisateurs',
    financialManagement: 'Gestion financière',
    workflowsAndProcesses: 'Workflows et processus',
    analyticsAndReporting: 'Analytics et reporting',
    systemAndSupport: 'Système et support',
    
    // Pages
    executiveDashboard: 'Tableau de bord exécutif',
    licenseManagement: 'Gestion des licences',
    softwareDeclarations: 'Déclarations logicielles',
    userInvitations: 'Invitations utilisateurs',
    notificationCenter: 'Centre de notifications',
    budgetManagement: 'Gestion budgétaire',
    approvalWorkflows: 'Workflows d\'approbation',
    renewalManagement: 'Gestion des renouvellements',
    departmentManagement: 'Gestion des départements',
    contractManagement: 'Gestion des contrats',
    softwareCatalog: 'Catalogue logiciels',
    softwareReviews: 'Avis logiciels',
    advancedAnalytics: 'Analytics avancés',
    reportsAudits: 'Rapports et audits',
    integrationManagement: 'Gestion des intégrations',
    supportTickets: 'Tickets de support',
    systemSettings: 'Paramètres système',
    logout: 'Déconnexion',
    
    // Commun
    loading: 'Chargement...',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    search: 'Rechercher',
    filter: 'Filtrer',
    export: 'Exporter',
    import: 'Importer',
    refresh: 'Actualiser',
    
    // Tableau de bord
    welcomeMessage: 'Bienvenue sur LicenseHub Enterprise',
    totalLicenses: 'Licences totales',
    activeLicenses: 'Licences actives',
    pendingDeclarations: 'Déclarations en attente',
    complianceScore: 'Score de conformité',
    totalCost: 'Coût total',
    monthlyCost: 'Coût mensuel',
    costSavings: 'Économies réalisées',
    utilizationRate: 'Taux d\'utilisation',
    
    // Gestion des licences
    softwareName: 'Nom du logiciel',
    vendor: 'Éditeur',
    licenseType: 'Type de licence',
    totalSeats: 'Sièges totaux',
    usedSeats: 'Sièges utilisés',
    availableSeats: 'Sièges disponibles',
    costPerSeat: 'Coût par siège',
    totalCostLicense: 'Coût total',
    purchaseDate: 'Date d\'achat',
    renewalDate: 'Date de renouvellement',
    status: 'Statut',
    department: 'Département',
    
    // Gestion des utilisateurs
    userName: 'Nom d\'utilisateur',
    email: 'Email',
    role: 'Rôle',
    lastLogin: 'Dernière connexion',
    isActive: 'Actif',
    jobTitle: 'Poste',
    phone: 'Téléphone',
    
    // Invitations
    inviteUser: 'Inviter un utilisateur',
    inviteNewUser: 'Inviter un nouvel utilisateur',
    invitationSent: 'Invitation envoyée',
    invitationPending: 'Invitation en attente',
    invitationAccepted: 'Invitation acceptée',
    invitationExpired: 'Invitation expirée',
    resendInvitation: 'Renvoyer l\'invitation',
    cancelInvitation: 'Annuler l\'invitation',
    welcomeMessage: 'Message de bienvenue',
    
    // Notifications
    notifications: 'Notifications',
    markAsRead: 'Marquer comme lu',
    markAllAsRead: 'Tout marquer comme lu',
    notificationTypes: 'Types de notifications',
    renewalAlert: 'Alerte de renouvellement',
    budgetAlert: 'Alerte budgétaire',
    approvalRequest: 'Demande d\'approbation',
    complianceWarning: 'Avertissement de conformité',
    
    // Budget
    budget: 'Budget',
    annualBudget: 'Budget annuel',
    spentAmount: 'Montant dépensé',
    remainingBudget: 'Budget restant',
    budgetUtilization: 'Utilisation du budget',
    budgetAlerts: 'Alertes budgétaires',
    alertThreshold: 'Seuil d\'alerte',
    
    // Workflows
    approvals: 'Approbations',
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    escalated: 'Escaladé',
    approver: 'Approbateur',
    requestDate: 'Date de demande',
    approvalDate: 'Date d\'approbation',
    comments: 'Commentaires',
    
    // Renouvellements
    renewals: 'Renouvellements',
    upcomingRenewals: 'Renouvellements à venir',
    renewalCalendar: 'Calendrier des renouvellements',
    daysUntilRenewal: 'Jours avant renouvellement',
    autoRenewal: 'Renouvellement automatique',
    negotiationStatus: 'Statut de négociation',
    
    // Départements
    departments: 'Départements',
    departmentName: 'Nom du département',
    manager: 'Responsable',
    employeeCount: 'Nombre d\'employés',
    costCenter: 'Centre de coût',
    
    // Contrats
    contracts: 'Contrats',
    contractType: 'Type de contrat',
    contractStart: 'Début du contrat',
    contractEnd: 'Fin du contrat',
    contractValue: 'Valeur du contrat',
    paymentTerms: 'Conditions de paiement',
    slaTerms: 'Conditions SLA',
    
    // Catalogue
    catalog: 'Catalogue',
    category: 'Catégorie',
    approvalStatus: 'Statut d\'approbation',
    securityRating: 'Note de sécurité',
    complianceRating: 'Note de conformité',
    alternatives: 'Alternatives',
    
    // Avis
    reviews: 'Avis',
    rating: 'Note',
    reviewText: 'Commentaire',
    pros: 'Avantages',
    cons: 'Inconvénients',
    easeOfUse: 'Facilité d\'utilisation',
    features: 'Fonctionnalités',
    support: 'Support',
    valueForMoney: 'Rapport qualité-prix',
    wouldRecommend: 'Recommanderait',
    
    // Analytics
    analytics: 'Analytics',
    kpis: 'KPIs',
    trends: 'Tendances',
    predictions: 'Prédictions',
    optimization: 'Optimisation',
    benchmarking: 'Benchmarking',
    
    // Rapports
    reports: 'Rapports',
    complianceReport: 'Rapport de conformité',
    usageReport: 'Rapport d\'utilisation',
    costReport: 'Rapport des coûts',
    auditTrail: 'Piste d\'audit',
    scheduledReports: 'Rapports planifiés',
    
    // Intégrations
    integrations: 'Intégrations',
    activeDirectory: 'Active Directory',
    ssoIntegration: 'Intégration SSO',
    hrmIntegration: 'Intégration RH',
    monitoringTools: 'Outils de monitoring',
    apiEndpoints: 'Points d\'API',
    
    // Support
    supportTickets: 'Tickets de support',
    ticketNumber: 'Numéro de ticket',
    priority: 'Priorité',
    category: 'Catégorie',
    assignedTo: 'Assigné à',
    resolution: 'Résolution',
    
    // Paramètres
    settings: 'Paramètres',
    companySettings: 'Paramètres de l\'entreprise',
    userPreferences: 'Préférences utilisateur',
    systemConfiguration: 'Configuration système',
    securitySettings: 'Paramètres de sécurité',
    
    // Statuts
    active: 'Actif',
    inactive: 'Inactif',
    expired: 'Expiré',
    pending: 'En attente',
    cancelled: 'Annulé',
    
    // Priorités
    low: 'Faible',
    medium: 'Moyen',
    high: 'Élevé',
    urgent: 'Urgent',
    
    // Rôles
    superAdmin: 'Super Admin',
    admin: 'Administrateur',
    manager: 'Responsable',
    employee: 'Employé',
    serviceProvider: 'Prestataire de service'
  },
  en: {
    // Navigation principale
    mainFeatures: 'Main Features',
    userManagement: 'User Management',
    financialManagement: 'Financial Management',
    workflowsAndProcesses: 'Workflows & Processes',
    analyticsAndReporting: 'Analytics & Reporting',
    systemAndSupport: 'System & Support',
    
    // Pages
    executiveDashboard: 'Executive Dashboard',
    licenseManagement: 'License Management',
    softwareDeclarations: 'Software Declarations',
    userInvitations: 'User Invitations',
    notificationCenter: 'Notification Center',
    budgetManagement: 'Budget Management',
    approvalWorkflows: 'Approval Workflows',
    renewalManagement: 'Renewal Management',
    departmentManagement: 'Department Management',
    contractManagement: 'Contract Management',
    softwareCatalog: 'Software Catalog',
    softwareReviews: 'Software Reviews',
    advancedAnalytics: 'Advanced Analytics',
    reportsAudits: 'Reports & Audits',
    integrationManagement: 'Integration Management',
    supportTickets: 'Support Tickets',
    systemSettings: 'System Settings',
    logout: 'Logout',
    
    // Commun
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    refresh: 'Refresh',
    
    // Tableau de bord
    welcomeMessage: 'Welcome to LicenseHub Enterprise',
    totalLicenses: 'Total Licenses',
    activeLicenses: 'Active Licenses',
    pendingDeclarations: 'Pending Declarations',
    complianceScore: 'Compliance Score',
    totalCost: 'Total Cost',
    monthlyCost: 'Monthly Cost',
    costSavings: 'Cost Savings',
    utilizationRate: 'Utilization Rate',
    
    // Gestion des licences
    softwareName: 'Software Name',
    vendor: 'Vendor',
    licenseType: 'License Type',
    totalSeats: 'Total Seats',
    usedSeats: 'Used Seats',
    availableSeats: 'Available Seats',
    costPerSeat: 'Cost per Seat',
    totalCostLicense: 'Total Cost',
    purchaseDate: 'Purchase Date',
    renewalDate: 'Renewal Date',
    status: 'Status',
    department: 'Department',
    
    // Gestion des utilisateurs
    userName: 'User Name',
    email: 'Email',
    role: 'Role',
    lastLogin: 'Last Login',
    isActive: 'Active',
    jobTitle: 'Job Title',
    phone: 'Phone',
    
    // Invitations
    inviteUser: 'Invite User',
    inviteNewUser: 'Invite New User',
    invitationSent: 'Invitation Sent',
    invitationPending: 'Invitation Pending',
    invitationAccepted: 'Invitation Accepted',
    invitationExpired: 'Invitation Expired',
    resendInvitation: 'Resend Invitation',
    cancelInvitation: 'Cancel Invitation',
    welcomeMessage: 'Welcome Message',
    
    // Notifications
    notifications: 'Notifications',
    markAsRead: 'Mark as Read',
    markAllAsRead: 'Mark All as Read',
    notificationTypes: 'Notification Types',
    renewalAlert: 'Renewal Alert',
    budgetAlert: 'Budget Alert',
    approvalRequest: 'Approval Request',
    complianceWarning: 'Compliance Warning',
    
    // Budget
    budget: 'Budget',
    annualBudget: 'Annual Budget',
    spentAmount: 'Spent Amount',
    remainingBudget: 'Remaining Budget',
    budgetUtilization: 'Budget Utilization',
    budgetAlerts: 'Budget Alerts',
    alertThreshold: 'Alert Threshold',
    
    // Workflows
    approvals: 'Approvals',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    escalated: 'Escalated',
    approver: 'Approver',
    requestDate: 'Request Date',
    approvalDate: 'Approval Date',
    comments: 'Comments',
    
    // Renouvellements
    renewals: 'Renewals',
    upcomingRenewals: 'Upcoming Renewals',
    renewalCalendar: 'Renewal Calendar',
    daysUntilRenewal: 'Days Until Renewal',
    autoRenewal: 'Auto Renewal',
    negotiationStatus: 'Negotiation Status',
    
    // Départements
    departments: 'Departments',
    departmentName: 'Department Name',
    manager: 'Manager',
    employeeCount: 'Employee Count',
    costCenter: 'Cost Center',
    
    // Contrats
    contracts: 'Contracts',
    contractType: 'Contract Type',
    contractStart: 'Contract Start',
    contractEnd: 'Contract End',
    contractValue: 'Contract Value',
    paymentTerms: 'Payment Terms',
    slaTerms: 'SLA Terms',
    
    // Catalogue
    catalog: 'Catalog',
    category: 'Category',
    approvalStatus: 'Approval Status',
    securityRating: 'Security Rating',
    complianceRating: 'Compliance Rating',
    alternatives: 'Alternatives',
    
    // Avis
    reviews: 'Reviews',
    rating: 'Rating',
    reviewText: 'Review',
    pros: 'Pros',
    cons: 'Cons',
    easeOfUse: 'Ease of Use',
    features: 'Features',
    support: 'Support',
    valueForMoney: 'Value for Money',
    wouldRecommend: 'Would Recommend',
    
    // Analytics
    analytics: 'Analytics',
    kpis: 'KPIs',
    trends: 'Trends',
    predictions: 'Predictions',
    optimization: 'Optimization',
    benchmarking: 'Benchmarking',
    
    // Rapports
    reports: 'Reports',
    complianceReport: 'Compliance Report',
    usageReport: 'Usage Report',
    costReport: 'Cost Report',
    auditTrail: 'Audit Trail',
    scheduledReports: 'Scheduled Reports',
    
    // Intégrations
    integrations: 'Integrations',
    activeDirectory: 'Active Directory',
    ssoIntegration: 'SSO Integration',
    hrmIntegration: 'HRM Integration',
    monitoringTools: 'Monitoring Tools',
    apiEndpoints: 'API Endpoints',
    
    // Support
    supportTickets: 'Support Tickets',
    ticketNumber: 'Ticket Number',
    priority: 'Priority',
    category: 'Category',
    assignedTo: 'Assigned To',
    resolution: 'Resolution',
    
    // Paramètres
    settings: 'Settings',
    companySettings: 'Company Settings',
    userPreferences: 'User Preferences',
    systemConfiguration: 'System Configuration',
    securitySettings: 'Security Settings',
    
    // Statuts
    active: 'Active',
    inactive: 'Inactive',
    expired: 'Expired',
    pending: 'Pending',
    cancelled: 'Cancelled',
    
    // Priorités
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
    
    // Rôles
    superAdmin: 'Super Admin',
    admin: 'Administrator',
    manager: 'Manager',
    employee: 'Employee',
    serviceProvider: 'Service Provider'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('fr') // Français par défaut

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.fr] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
```

### Fichier 6 : Script de création de base de données complète
```sql
-- Script de création de toutes les tables pour LicenseHub Enterprise
-- Exécutez ces commandes pour créer la structure complète

-- 1. Utilisateurs et authentification
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT CHECK (role IN ('super_admin', 'admin', 'manager', 'employee', 'service_provider')) DEFAULT 'employee',
  company_id TEXT,
  department_id TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_login TEXT,
  profile_picture TEXT,
  phone TEXT,
  job_title TEXT
);

-- 2. Entreprises
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  industry TEXT,
  size TEXT CHECK (size IN ('startup', 'sme', 'enterprise')) DEFAULT 'sme',
  country TEXT,
  address TEXT,
  logo_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  subscription_plan TEXT DEFAULT 'basic'
);

-- 3. Départements
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company_id TEXT,
  manager_id TEXT,
  budget_annual REAL DEFAULT 0,
  cost_center TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- 4. Licences logicielles
CREATE TABLE IF NOT EXISTS software_licenses (
  id TEXT PRIMARY KEY,
  software_name TEXT NOT NULL,
  vendor TEXT,
  license_type TEXT CHECK (license_type IN ('perpetual', 'subscription', 'concurrent', 'named_user')) DEFAULT 'subscription',
  total_seats INTEGER DEFAULT 1,
  used_seats INTEGER DEFAULT 0,
  cost_per_seat REAL DEFAULT 0,
  total_cost REAL DEFAULT 0,
  purchase_date TEXT,
  renewal_date TEXT,
  company_id TEXT,
  department_id TEXT,
  status TEXT CHECK (status IN ('active', 'expired', 'pending', 'cancelled')) DEFAULT 'active',
  contract_id TEXT,
  auto_renewal BOOLEAN DEFAULT FALSE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 5. Assignations de licences
CREATE TABLE IF NOT EXISTS license_assignments (
  id TEXT PRIMARY KEY,
  license_id TEXT,
  user_id TEXT,
  assigned_date TEXT DEFAULT CURRENT_TIMESTAMP,
  assigned_by TEXT,
  revoked_date TEXT,
  revoked_by TEXT,
  status TEXT CHECK (status IN ('active', 'revoked', 'pending')) DEFAULT 'active',
  usage_tracking BOOLEAN DEFAULT TRUE
);

-- 6. Déclarations logicielles
CREATE TABLE IF NOT EXISTS software_declarations (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  software_name TEXT NOT NULL,
  vendor TEXT,
  version TEXT,
  usage_frequency TEXT CHECK (usage_frequency IN ('daily', 'weekly', 'monthly', 'rarely')) DEFAULT 'weekly',
  business_justification TEXT,
  declared_date TEXT DEFAULT CURRENT_TIMESTAMP,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')) DEFAULT 'pending',
  reviewed_by TEXT,
  reviewed_date TEXT,
  review_comments TEXT
);

-- 7. Invitations utilisateurs
CREATE TABLE IF NOT EXISTS user_invitations (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  company_id TEXT,
  department_id TEXT,
  role TEXT CHECK (role IN ('admin', 'manager', 'employee', 'service_provider')) DEFAULT 'employee',
  invited_by TEXT,
  invitation_token TEXT UNIQUE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')) DEFAULT 'pending',
  expires_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  accepted_at TEXT,
  welcome_message TEXT
);

-- 8. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  type TEXT CHECK (type IN ('renewal_alert', 'approval_request', 'budget_alert', 'compliance_warning', 'system_update')) DEFAULT 'system_update',
  title TEXT NOT NULL,
  message TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  read_at TEXT
);

-- 9. Budgets départementaux
CREATE TABLE IF NOT EXISTS department_budgets (
  id TEXT PRIMARY KEY,
  department_id TEXT,
  fiscal_year TEXT,
  annual_budget REAL DEFAULT 0,
  spent_amount REAL DEFAULT 0,
  committed_amount REAL DEFAULT 0,
  remaining_budget REAL DEFAULT 0,
  budget_alerts BOOLEAN DEFAULT TRUE,
  alert_threshold REAL DEFAULT 0.8,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 10. Workflows d'approbation
CREATE TABLE IF NOT EXISTS approval_workflows (
  id TEXT PRIMARY KEY,
  request_type TEXT CHECK (request_type IN ('license_request', 'software_declaration', 'budget_increase', 'user_access')) DEFAULT 'license_request',
  request_id TEXT,
  requester_id TEXT,
  current_approver_id TEXT,
  workflow_step INTEGER DEFAULT 1,
  total_steps INTEGER DEFAULT 1,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'escalated')) DEFAULT 'pending',
  comments TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  escalation_date TEXT
);

-- 11. Historique des approbations
CREATE TABLE IF NOT EXISTS approval_history (
  id TEXT PRIMARY KEY,
  workflow_id TEXT,
  approver_id TEXT,
  action TEXT CHECK (action IN ('approved', 'rejected', 'escalated', 'delegated')) DEFAULT 'approved',
  comments TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 12. Contrats fournisseurs
CREATE TABLE IF NOT EXISTS vendor_contracts (
  id TEXT PRIMARY KEY,
  vendor_name TEXT NOT NULL,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contract_type TEXT CHECK (contract_type IN ('master_agreement', 'individual_license', 'volume_discount')) DEFAULT 'individual_license',
  contract_start TEXT,
  contract_end TEXT,
  contract_value REAL DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  payment_terms TEXT,
  renewal_terms TEXT,
  sla_terms TEXT,
  contract_document_url TEXT,
  auto_renewal BOOLEAN DEFAULT FALSE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 13. Catalogue logiciels
CREATE TABLE IF NOT EXISTS software_catalog (
  id TEXT PRIMARY KEY,
  software_name TEXT NOT NULL,
  vendor TEXT,
  category TEXT CHECK (category IN ('productivity', 'development', 'design', 'security', 'communication', 'finance', 'hr', 'other')) DEFAULT 'other',
  description TEXT,
  approval_status TEXT CHECK (approval_status IN ('approved', 'pending', 'rejected', 'under_review')) DEFAULT 'pending',
  security_rating INTEGER CHECK (security_rating >= 1 AND security_rating <= 5) DEFAULT 3,
  compliance_rating INTEGER CHECK (compliance_rating >= 1 AND compliance_rating <= 5) DEFAULT 3,
  cost_estimate REAL DEFAULT 0,
  alternatives TEXT,
  approved_by TEXT,
  approved_date TEXT,
  rejection_reason TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 14. Avis logiciels
CREATE TABLE IF NOT EXISTS software_reviews (
  id TEXT PRIMARY KEY,
  software_name TEXT NOT NULL,
  vendor TEXT,
  user_id TEXT,
  company_id TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 3,
  review_text TEXT,
  pros TEXT,
  cons TEXT,
  ease_of_use INTEGER CHECK (ease_of_use >= 1 AND ease_of_use <= 5) DEFAULT 3,
  features INTEGER CHECK (features >= 1 AND features <= 5) DEFAULT 3,
  support INTEGER CHECK (support >= 1 AND support <= 5) DEFAULT 3,
  value_for_money INTEGER CHECK (value_for_money >= 1 AND value_for_money <= 5) DEFAULT 3,
  would_recommend BOOLEAN DEFAULT TRUE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 15. Logs d'audit
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  user_id TEXT,
  user_email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  details TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 16. Intégrations
CREATE TABLE IF NOT EXISTS integrations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('hrm', 'active_directory', 'sso', 'monitoring', 'billing', 'api')) DEFAULT 'api',
  provider TEXT,
  status TEXT CHECK (status IN ('active', 'inactive', 'error', 'pending')) DEFAULT 'pending',
  configuration TEXT,
  api_endpoint TEXT,
  last_sync TEXT,
  sync_frequency TEXT DEFAULT 'daily',
  error_message TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 17. Tickets de support
CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  ticket_number TEXT UNIQUE,
  user_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('license_issue', 'access_problem', 'billing_question', 'technical_support', 'feature_request')) DEFAULT 'technical_support',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('open', 'in_progress', 'waiting_user', 'resolved', 'closed')) DEFAULT 'open',
  assigned_to TEXT,
  resolution TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  resolved_at TEXT
);

-- 18. Métriques et KPIs
CREATE TABLE IF NOT EXISTS business_metrics (
  id TEXT PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_type TEXT CHECK (metric_type IN ('cost', 'usage', 'compliance', 'satisfaction', 'efficiency')) DEFAULT 'usage',
  metric_value REAL NOT NULL DEFAULT 0,
  metric_unit TEXT,
  department_id TEXT,
  period_start TEXT,
  period_end TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 19. Paramètres système
CREATE TABLE IF NOT EXISTS system_settings (
  id TEXT PRIMARY KEY,
  company_id TEXT,
  setting_key TEXT NOT NULL,
  setting_value TEXT,
  setting_type TEXT CHECK (setting_type IN ('string', 'number', 'boolean', 'json')) DEFAULT 'string',
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 20. Sessions utilisateurs
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  session_token TEXT UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Insertion de données d'exemple pour tester
INSERT OR REPLACE INTO companies VALUES
('comp_001', 'TechCorp Solutions', 'techcorp.com', 'Technology', 'enterprise', 'France', '123 Tech Street, Paris', NULL, '2024-01-01T00:00:00Z', TRUE, 'enterprise');

INSERT OR REPLACE INTO departments VALUES
('dept_001', 'IT Department', 'comp_001', NULL, 100000, 'IT-001', '2024-01-01T00:00:00Z', TRUE),
('dept_002', 'Marketing', 'comp_001', NULL, 50000, 'MKT-001', '2024-01-01T00:00:00Z', TRUE),
('dept_003', 'Finance', 'comp_001', NULL, 30000, 'FIN-001', '2024-01-01T00:00:00Z', TRUE);

INSERT OR REPLACE INTO software_licenses VALUES
('lic_001', 'Microsoft Office 365', 'Microsoft', 'subscription', 100, 85, 12, 1200, '2024-01-01', '2024-12-31', 'comp_001', 'dept_001', 'active', NULL, TRUE, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('lic_002', 'Adobe Creative Suite', 'Adobe', 'subscription', 25, 20, 50, 1250, '2024-01-15', '2024-12-31', 'comp_001', 'dept_002', 'active', NULL, TRUE, '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
('lic_003', 'Salesforce CRM', 'Salesforce', 'subscription', 50, 45, 100, 5000, '2024-02-01', '2025-01-31', 'comp_001', 'dept_002', 'active', NULL, FALSE, '2024-02-01T00:00:00Z', '2024-02-01T00:00:00Z');

INSERT OR REPLACE INTO department_budgets VALUES
('budget_001', 'dept_001', '2024', 100000, 75000, 10000, 15000, TRUE, 0.8, '2024-01-01T00:00:00Z', '2024-03-15T00:00:00Z'),
('budget_002', 'dept_002', '2024', 50000, 35000, 5000, 10000, TRUE, 0.8, '2024-01-01T00:00:00Z', '2024-03-15T00:00:00Z'),
('budget_003', 'dept_003', '2024', 30000, 15000, 2000, 13000, TRUE, 0.8, '2024-01-01T00:00:00Z', '2024-03-15T00:00:00Z');

INSERT OR REPLACE INTO software_catalog VALUES
('cat_001', 'Slack', 'Slack Technologies', 'communication', 'Team communication and collaboration platform', 'approved', 4, 5, 8, '["Microsoft Teams", "Discord"]', 'admin_001', '2024-01-01', NULL, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('cat_002', 'Zoom', 'Zoom Video Communications', 'communication', 'Video conferencing and webinar platform', 'approved', 4, 4, 15, '["Google Meet", "Microsoft Teams"]', 'admin_001', '2024-01-01', NULL, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('cat_003', 'Figma', 'Figma Inc.', 'design', 'Collaborative design and prototyping tool', 'approved', 5, 4, 12, '["Adobe XD", "Sketch"]', 'admin_001', '2024-01-01', NULL, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z');

INSERT OR REPLACE INTO business_metrics VALUES
('metric_001', 'Total License Cost', 'cost', 125000, 'EUR', NULL, '2024-01-01', '2024-12-31', '2024-03-15T00:00:00Z'),
('metric_002', 'License Utilization Rate', 'usage', 85.5, 'percent', NULL, '2024-01-01', '2024-12-31', '2024-03-15T00:00:00Z'),
('metric_003', 'Compliance Score', 'compliance', 92.3, 'percent', NULL, '2024-01-01', '2024-12-31', '2024-03-15T00:00:00Z'),
('metric_004', 'User Satisfaction', 'satisfaction', 4.2, 'stars', NULL, '2024-01-01', '2024-12-31', '2024-03-15T00:00:00Z');
```

## 🎯 Architecture Complète

Cette solution transforme votre plateforme en une solution complète de gouvernance IT d'entreprise avec :

### **18 Modules Professionnels :**
✅ Tableau de bord exécutif avec KPIs stratégiques
✅ Gestion complète des licences avec workflows
✅ Système d'invitations et onboarding automatisé
✅ Centre de notifications intelligent
✅ Gestion budgétaire avec alertes
✅ Workflows d'approbation configurables
✅ Gestion des renouvellements automatisée
✅ Organisation départementale complète
✅ Base de données contrats et fournisseurs
✅ Catalogue logiciels avec évaluation sécuritaire
✅ Système d'avis et évaluations
✅ Analytics avancés avec prédictions
✅ Rapports de conformité réglementaire
✅ Intégrations API avec systèmes existants
✅ Système de support avec escalade
✅ Configuration système granulaire

### **20 Tables de Base de Données :**
✅ Architecture complète pour entreprise
✅ Permissions granulaires par rôle
✅ Audit trail complet pour conformité
✅ Métriques et KPIs automatisés
✅ Support multi-départements et multi-sites

### **Fonctionnalités Avancées :**
✅ Interface bilingue français/anglais
✅ Thème sombre/clair personnalisable
✅ Notifications temps réel intelligentes
✅ Workflows configurables multi-niveaux
✅ Analytics prédictifs et optimisation
✅ Intégrations natives (AD, HR, SSO)
✅ Système de tickets avec escalade
✅ Rapports automatisés et planifiés

**Cette architecture rivalise avec ServiceNow, Flexera et Snow Software en termes de fonctionnalités et d'expérience utilisateur !** 🚀

Prêt à créer votre plateforme LicenseHub Enterprise complète ?