# 🚀 Admin Dashboard Migration Package

## Complete File Package for New Admin Dashboard Project

This package contains all the files you need to create a dedicated Admin Dashboard project that aggregates data from multiple companies using your LicenseHub platform.

---

## 📋 Step-by-Step Migration Instructions

### 1. Create New Blink Project
1. Go to [blink.new](https://blink.new)
2. Create new project: "Admin Dashboard - Multi-Company Analytics"
3. Choose "Vite React TypeScript" stack
4. **IMPORTANT**: Use the SAME project ID for database sharing

### 2. Replace Default Files
Copy and replace these files in your new project:

---

## 📁 File 1: package.json Dependencies

```json
{
  "name": "admin-dashboard",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@blinkdotnew/sdk": "^0.17.3",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-aspect-ratio": "^1.0.3",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-collapsible": "^1.0.3",
    "@radix-ui/react-context-menu": "^2.1.5",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-hover-card": "^1.0.7",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-menubar": "^1.0.4",
    "@radix-ui/react-navigation-menu": "^1.1.4",
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
    "@radix-ui/react-toggle-group": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.263.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0",
    "recharts": "^2.8.0",
    "sonner": "^1.0.3",
    "tailwind-merge": "^1.14.0",
    "tailwindcss-animate": "^1.0.7"
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
    "vite": "^4.4.5"
  }
}
```

---

## 📁 File 2: src/blink/client.ts

```typescript
import { createClient } from '@blinkdotnew/sdk'

const blink = createClient({
  projectId: 'saas-software-license-management-platform-1nrrckap', // SAME PROJECT ID
  authRequired: true
})

console.log('Admin Dashboard Blink client ready for authentication')

export default blink
```

---

## 📁 File 3: src/App.tsx

```typescript
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import blink from './blink/client'
import AdminCenter from './pages/AdminCenter'
import { Toaster } from '@/components/ui/toaster'
import { toast } from '@/hooks/use-toast'

interface User {
  id: string
  email: string
  name?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      console.log('Auth state changed:', state)
      setUser(state.user)
      setLoading(state.isLoading)

      if (state.user && !state.isLoading) {
        try {
          // Create/update admin user in database
          await blink.db.adminUsers.upsert({
            id: state.user.id,
            name: state.user.name || state.user.email,
            email: state.user.email,
            role: 'admin',
            is_active: true,
            last_login: new Date().toISOString()
          }).catch(console.error)
        } catch (error) {
          console.error('Error creating admin user:', error)
        }
      }
    })

    return unsubscribe
  }, [])

  const handleSignIn = () => {
    try {
      blink.auth.login()
    } catch (error) {
      console.error('Sign in error:', error)
      toast({
        title: "Sign In Error",
        description: "Failed to sign in. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Admin Dashboard
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Multi-company data aggregation and analytics platform
            </p>
          </div>
          <div>
            <button
              onClick={handleSignIn}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In with Blink
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<AdminCenter />} />
          <Route path="/admin" element={<AdminCenter />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App
```

---

## 📁 File 4: Database Setup SQL

```sql
-- Run these SQL commands in your new Admin Dashboard project
-- (They should already exist if using the same project ID)

-- Organizations table
CREATE TABLE IF NOT EXISTS admin_organizations (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  company_domain TEXT,
  industry TEXT,
  company_size TEXT CHECK (company_size IN ('startup', 'sme', 'enterprise')),
  country TEXT,
  employees_count INTEGER,
  consent_given BOOLEAN DEFAULT FALSE,
  consent_date TEXT,
  anonymization_level TEXT DEFAULT 'partial',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- API Keys table
CREATE TABLE IF NOT EXISTS admin_api_keys (
  id TEXT PRIMARY KEY,
  key_name TEXT NOT NULL,
  api_key TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('lebonlogiciel', 'prospection_saas', 'internal')),
  permissions TEXT,
  rate_limit INTEGER DEFAULT 1000,
  created_by TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_used TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Market Intelligence table
CREATE TABLE IF NOT EXISTS admin_market_intelligence (
  id TEXT PRIMARY KEY,
  software_name TEXT NOT NULL,
  vendor TEXT,
  category TEXT,
  total_reviews INTEGER DEFAULT 0,
  average_rating REAL DEFAULT 0,
  market_share REAL DEFAULT 0,
  satisfaction_score REAL DEFAULT 0,
  renewal_rate REAL DEFAULT 0,
  price_range_min INTEGER,
  price_range_max INTEGER,
  last_updated TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Team Members table
CREATE TABLE IF NOT EXISTS admin_team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT CHECK (role IN ('super_admin', 'admin', 'analyst', 'viewer')),
  permissions TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_login TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Export Logs table
CREATE TABLE IF NOT EXISTS admin_export_logs (
  id TEXT PRIMARY KEY,
  export_type TEXT CHECK (export_type IN ('csv', 'excel', 'json', 'api')),
  data_type TEXT CHECK (data_type IN ('companies', 'users', 'reviews', 'licenses', 'aggregated')),
  platform TEXT CHECK (platform IN ('lebonlogiciel', 'prospection_saas', 'manual')),
  exported_by TEXT,
  record_count INTEGER DEFAULT 0,
  anonymized BOOLEAN DEFAULT FALSE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending'
);

-- BI Metrics table
CREATE TABLE IF NOT EXISTS admin_bi_metrics (
  id TEXT PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_type TEXT CHECK (metric_type IN ('revenue', 'usage', 'growth', 'satisfaction')),
  metric_value REAL NOT NULL,
  metric_unit TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- BI Dashboards table
CREATE TABLE IF NOT EXISTS admin_bi_dashboards (
  id TEXT PRIMARY KEY,
  dashboard_name TEXT NOT NULL,
  dashboard_type TEXT CHECK (dashboard_type IN ('revenue', 'usage', 'market', 'competitive')),
  widgets_config TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- API Endpoints table
CREATE TABLE IF NOT EXISTS admin_api_endpoints (
  id TEXT PRIMARY KEY,
  endpoint_name TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('lebonlogiciel', 'prospection_saas', 'internal')),
  method TEXT DEFAULT 'GET',
  endpoint_url TEXT NOT NULL,
  description TEXT,
  rate_limit INTEGER DEFAULT 1000,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Webhooks table
CREATE TABLE IF NOT EXISTS admin_webhooks (
  id TEXT PRIMARY KEY,
  webhook_name TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('lebonlogiciel', 'prospection_saas', 'internal')),
  webhook_url TEXT NOT NULL,
  events TEXT, -- JSON array of event types
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  last_triggered TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Competitive Intelligence table
CREATE TABLE IF NOT EXISTS admin_competitive_intelligence (
  id TEXT PRIMARY KEY,
  software_name TEXT NOT NULL,
  vendor TEXT,
  market_share REAL DEFAULT 0,
  growth_rate REAL DEFAULT 0,
  churn_rate REAL DEFAULT 0,
  average_deal_size INTEGER DEFAULT 0,
  competitor_analysis TEXT, -- JSON with advantages/weaknesses
  feature_comparison TEXT, -- JSON with feature scores
  pricing_intelligence TEXT, -- JSON with pricing data
  last_updated TEXT DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📁 File 5: Sample Data Population

```sql
-- Insert sample data for testing
-- Organizations
INSERT OR REPLACE INTO admin_organizations VALUES
('org_001', 'TechCorp Solutions', 'techcorp.com', 'Technology', 'enterprise', 'France', 250, TRUE, '2024-01-15', 'partial', '2024-01-15T10:00:00Z', TRUE),
('org_002', 'Marketing Plus', 'marketingplus.fr', 'Marketing', 'sme', 'France', 45, TRUE, '2024-02-01', 'full', '2024-02-01T09:30:00Z', TRUE),
('org_003', 'FinanceHub', 'financehub.com', 'Finance', 'enterprise', 'Germany', 180, TRUE, '2024-01-20', 'partial', '2024-01-20T14:15:00Z', TRUE),
('org_004', 'StartupInc', 'startupinc.io', 'Technology', 'startup', 'Spain', 12, FALSE, NULL, 'none', '2024-03-01T11:00:00Z', TRUE),
('org_005', 'HealthcarePro', 'healthcarepro.com', 'Healthcare', 'enterprise', 'Italy', 320, TRUE, '2024-01-10', 'partial', '2024-01-10T16:45:00Z', TRUE);

-- API Keys
INSERT OR REPLACE INTO admin_api_keys VALUES
('api_001', 'LeBonLogiciel Production', 'lebonlogiciel_live_sk_abc123def456ghi789', 'lebonlogiciel', '["read", "export"]', 5000, 'admin_001', '2024-01-15T10:00:00Z', '2024-03-15T14:30:00Z', TRUE),
('api_002', 'Prospection SaaS Main', 'prospection_live_sk_xyz789uvw456rst123', 'prospection_saas', '["read", "write", "export"]', 2000, 'admin_001', '2024-01-20T11:00:00Z', '2024-03-14T09:15:00Z', TRUE),
('api_003', 'Internal Analytics', 'internal_live_sk_mno345pqr678stu901', 'internal', '["admin", "export", "analytics"]', 10000, 'admin_001', '2024-02-01T09:00:00Z', '2024-03-15T16:20:00Z', TRUE);

-- Market Intelligence
INSERT OR REPLACE INTO admin_market_intelligence VALUES
('mi_001', 'Microsoft Office 365', 'Microsoft', 'Productivity', 156, 4.2, 45.2, 4.1, 0.89, 10, 25, '2024-03-15T12:00:00Z'),
('mi_002', 'Salesforce', 'Salesforce', 'CRM', 89, 3.8, 23.8, 3.9, 0.84, 50, 300, '2024-03-15T12:00:00Z'),
('mi_003', 'Slack', 'Slack Technologies', 'Communication', 134, 4.5, 18.9, 4.4, 0.92, 5, 15, '2024-03-15T12:00:00Z'),
('mi_004', 'Adobe Creative Suite', 'Adobe', 'Design', 67, 4.1, 67.0, 4.0, 0.87, 20, 80, '2024-03-15T12:00:00Z'),
('mi_005', 'Zoom', 'Zoom Video Communications', 'Communication', 201, 4.3, 31.2, 4.2, 0.91, 10, 20, '2024-03-15T12:00:00Z');

-- Team Members
INSERT OR REPLACE INTO admin_team_members VALUES
('admin_001', 'Admin User', 'admin@yourcompany.com', 'super_admin', '["all"]', '2024-01-01T00:00:00Z', '2024-03-15T08:00:00Z', TRUE),
('admin_002', 'Data Analyst', 'analyst@yourcompany.com', 'analyst', '["read", "export"]', '2024-01-15T00:00:00Z', '2024-03-14T16:30:00Z', TRUE),
('admin_003', 'Marketing Manager', 'marketing@yourcompany.com', 'viewer', '["read"]', '2024-02-01T00:00:00Z', '2024-03-13T10:15:00Z', TRUE);

-- BI Metrics
INSERT OR REPLACE INTO admin_bi_metrics VALUES
('bi_001', 'Total Revenue', 'revenue', 125000, 'EUR', '2024-03-15T12:00:00Z', '2024-03-15T12:00:00Z'),
('bi_002', 'Data Export Revenue', 'revenue', 35000, 'EUR', '2024-03-15T12:00:00Z', '2024-03-15T12:00:00Z'),
('bi_003', 'Active Organizations', 'usage', 47, 'count', '2024-03-15T12:00:00Z', '2024-03-15T12:00:00Z'),
('bi_004', 'API Calls', 'usage', 45000, 'per_month', '2024-03-15T12:00:00Z', '2024-03-15T12:00:00Z'),
('bi_005', 'Software Reviews Growth', 'growth', 23.5, 'percent', '2024-03-15T12:00:00Z', '2024-03-15T12:00:00Z'),
('bi_006', 'Average Satisfaction Score', 'satisfaction', 4.2, 'stars', '2024-03-15T12:00:00Z', '2024-03-15T12:00:00Z');

-- API Endpoints
INSERT OR REPLACE INTO admin_api_endpoints VALUES
('ep_001', 'Software Rankings', 'lebonlogiciel', 'GET', '/api/v1/software/rankings', 'Get software rankings for comparison site', 5000, TRUE, '2024-01-15T10:00:00Z'),
('ep_002', 'Company Search', 'prospection_saas', 'GET', '/api/v1/companies/search', 'Search companies by software usage', 10000, TRUE, '2024-01-15T10:00:00Z'),
('ep_003', 'Market Trends', 'lebonlogiciel', 'GET', '/api/v1/market/trends', 'Get market trend data', 2000, TRUE, '2024-01-15T10:00:00Z');

-- Webhooks
INSERT OR REPLACE INTO admin_webhooks VALUES
('wh_001', 'LeBonLogiciel Data Sync', 'lebonlogiciel', 'https://lebonlogiciel.com/api/webhooks/licensehub', '["new_review", "software_ranking_update"]', 1247, 23, TRUE, '2024-03-15T14:30:00Z', '2024-01-15T10:00:00Z'),
('wh_002', 'Prospection SaaS Leads', 'prospection_saas', 'https://prospection.yourcompany.com/api/webhooks/leads', '["new_company", "tech_stack_update"]', 892, 12, TRUE, '2024-03-15T11:20:00Z', '2024-01-20T11:00:00Z');

-- Competitive Intelligence
INSERT OR REPLACE INTO admin_competitive_intelligence VALUES
('ci_001', 'Microsoft Office 365', 'Microsoft', 45.2, 8.5, 12.3, 15000, '{"competitive_advantages": ["Enterprise integration", "Familiar interface"], "weaknesses": ["Complex pricing", "Feature overload"]}', '{"collaboration": 9, "security": 8, "mobile": 7, "ease_of_use": 6}', '{"avg_price_per_user": 12, "enterprise_discount": 25, "competitor_comparison": {"Google Workspace": 8, "Zoho": 5}}', '2024-03-15T12:00:00Z'),
('ci_002', 'Salesforce', 'Salesforce', 23.8, 12.1, 15.7, 75000, '{"competitive_advantages": ["Customization", "Ecosystem"], "weaknesses": ["Complexity", "High cost"]}', '{"customization": 10, "reporting": 9, "ease_of_use": 4, "mobile": 7}', '{"avg_price_per_user": 150, "enterprise_discount": 30, "competitor_comparison": {"HubSpot": 50, "Pipedrive": 25}}', '2024-03-15T12:00:00Z');
```

---

## 🎯 Key Benefits of This Architecture

### **Separation of Concerns**
- **Main LicenseHub**: Focuses on employee license management
- **Admin Dashboard**: Dedicated to multi-company analytics and data exports

### **Shared Database Access**
- Both projects use the same `projectId` for seamless data sharing
- Real-time data synchronization without complex APIs
- Consistent data across both platforms

### **Perfect for Your Business Model**
- **lebonlogiciel.com integration**: Anonymized data exports for your G2-style comparator
- **Prospection SaaS feeds**: Full company data for your Apollo-style platform
- **Business intelligence**: Comprehensive analytics for data-driven decisions

### **Scalable Architecture**
- Independent deployment and scaling
- Focused development conversations
- Clean codebase separation
- Professional admin interface

---

## 🚀 Next Steps

1. **Create the new Blink project** using this package
2. **Test database connectivity** - Verify you can access the same data
3. **Customize the interface** - Add your branding and specific requirements
4. **Set up API integrations** - Connect to lebonlogiciel.com and prospection SaaS
5. **Deploy independently** - Host the admin dashboard separately

This gives you a **world-class B2B data intelligence platform** that transforms your LicenseHub user base into valuable market insights for both your comparison website and prospection SaaS!

**Ready to build your dedicated Admin Dashboard?** 🎯