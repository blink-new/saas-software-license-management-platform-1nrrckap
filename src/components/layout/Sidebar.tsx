import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  Shield,
  FileText,
  Users,
  BarChart3,
  Bell,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Building2,
  Zap,
  UserPlus,
  TrendingUp,
  MessageSquare
} from 'lucide-react'
import { User } from '@/types'
import { useLanguage } from '@/hooks/useLanguage'

interface SidebarProps {
  user: User | null
  collapsed: boolean
  onToggleCollapse: () => void
}

const navigationItems = [
  {
    titleKey: 'nav.dashboard',
    href: '/',
    icon: LayoutDashboard,
    roles: ['admin', 'employee', 'service_provider']
  },
  {
    titleKey: 'nav.licenses',
    href: '/licenses',
    icon: Shield,
    roles: ['admin', 'service_provider']
  },
  {
    titleKey: 'nav.declarations',
    href: '/declarations',
    icon: FileText,
    roles: ['admin', 'employee']
  },
  {
    titleKey: 'nav.users',
    href: '/users',
    icon: Users,
    roles: ['admin']
  },
  {
    titleKey: 'nav.invitations',
    href: '/invitations',
    icon: UserPlus,
    roles: ['admin']
  },
  {
    titleKey: 'nav.hrm',
    href: '/hrm',
    icon: Zap,
    roles: ['admin']
  },
  {
    titleKey: 'nav.analytics',
    href: '/analytics',
    icon: TrendingUp,
    roles: ['admin', 'service_provider']
  },
  {
    titleKey: 'nav.reviews',
    href: '/reviews',
    icon: MessageSquare,
    roles: ['admin', 'employee', 'service_provider']
  },
  {
    titleKey: 'nav.reports',
    href: '/reports',
    icon: BarChart3,
    roles: ['admin', 'service_provider']
  },
  {
    titleKey: 'nav.notifications',
    href: '/notifications',
    icon: Bell,
    roles: ['admin', 'employee', 'service_provider']
  },
  {
    titleKey: 'nav.settings',
    href: '/settings',
    icon: Settings,
    roles: ['admin', 'employee', 'service_provider']
  },
  {
    titleKey: 'nav.adminCenter',
    href: '/admin',
    icon: Shield,
    roles: ['admin']
  },
  {
    titleKey: 'nav.support',
    href: '/support',
    icon: HelpCircle,
    roles: ['admin', 'employee', 'service_provider']
  }
]

export function Sidebar({ user, collapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation()
  const { t } = useLanguage()

  const filteredItems = navigationItems.filter(item =>
    user?.role && item.roles.includes(user.role)
  )

  return (
    <div className={cn(
      "relative flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">LicenseHub</h1>
              <p className="text-xs text-gray-500">Enterprise Platform</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-gray-200">
          {!collapsed ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
              {user.department && (
                <p className="text-xs text-gray-400">{user.department}</p>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                {!collapsed && t(item.titleKey)}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* Footer */}
      <div className="p-4">
        {!collapsed && (
          <div className="text-xs text-gray-400 text-center">
            © 2024 LicenseHub
          </div>
        )}
      </div>
    </div>
  )
}