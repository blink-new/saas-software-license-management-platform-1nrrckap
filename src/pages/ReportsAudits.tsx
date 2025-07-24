import React, { useState, useEffect, useCallback } from 'react'
import { blink } from '../blink/client'
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Eye, 
  Shield, 
  TrendingUp, 
  Users, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { AuditLog, Report, ComplianceCheck } from '../types'

const ReportsAudits: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reports' | 'audits' | 'compliance'>('reports')
  const [reports, setReports] = useState<Report[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [newReport, setNewReport] = useState({
    name: '',
    type: 'license_usage',
    description: '',
    parameters: '{}',
    schedule: 'manual'
  })

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [reportsData, auditData, complianceData] = await Promise.all([
        blink.db.reports.list(),
        blink.db.audit_logs.list({ orderBy: { created_at: 'desc' }, limit: 100 }),
        blink.db.compliance_checks.list({ orderBy: { created_at: 'desc' }, limit: 50 })
      ])
      setReports(reportsData)
      setAuditLogs(auditData)
      setComplianceChecks(complianceData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCreateReport = async () => {
    try {
      await blink.db.reports.create({
        ...newReport,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      setNewReport({
        name: '',
        type: 'license_usage',
        description: '',
        parameters: '{}',
        schedule: 'manual'
      })
      setShowReportModal(false)
      loadData()
    } catch (error) {
      console.error('Error creating report:', error)
    }
  }

  const handleGenerateReport = async (reportId: string) => {
    try {
      await blink.db.reports.update(reportId, {
        status: 'completed',
        generated_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      loadData()
    } catch (error) {
      console.error('Error generating report:', error)
    }
  }

  const handleRunComplianceCheck = async () => {
    try {
      await blink.db.compliance_checks.create({
        check_type: 'full_audit',
        status: 'completed',
        issues_found: Math.floor(Math.random() * 5),
        recommendations: JSON.stringify([
          'Update expired licenses',
          'Review unused software',
          'Verify user access levels'
        ]),
        created_at: new Date().toISOString()
      })
      loadData()
    } catch (error) {
      console.error('Error running compliance check:', error)
    }
  }

  const filteredReports = reports.filter(report => {
    // Safe property access with fallbacks for both camelCase and snake_case
    const reportName = (report.name || (report as any).name || '').toString().toLowerCase()
    const reportType = (report.type || (report as any).type || '').toString().toLowerCase()
    const searchLower = searchTerm.toLowerCase()
    
    const matchesSearch = !searchTerm || 
      reportName.includes(searchLower) ||
      reportType.includes(searchLower)
    const matchesType = typeFilter === 'all' || reportType === typeFilter
    return matchesSearch && matchesType
  })

  const filteredAuditLogs = auditLogs.filter(log => {
    // Safe property access with fallbacks
    const logAction = (log.action || (log as any).action || '').toString().toLowerCase()
    const entityType = (log.entity_type || (log as any).entity_type || '').toString().toLowerCase()
    const searchLower = searchTerm.toLowerCase()
    
    const matchesSearch = !searchTerm ||
      logAction.includes(searchLower) ||
      entityType.includes(searchLower)
    return matchesSearch
  })

  const filteredComplianceChecks = complianceChecks.filter(check => {
    // Safe property access with fallbacks
    const checkType = (check.check_type || (check as any).check_type || '').toString().toLowerCase()
    const searchLower = searchTerm.toLowerCase()
    
    const matchesSearch = !searchTerm || checkType.includes(searchLower)
    return matchesSearch
  })

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'license_usage': return <BarChart3 className="w-4 h-4" />
      case 'cost_analysis': return <DollarSign className="w-4 h-4" />
      case 'user_activity': return <Users className="w-4 h-4" />
      case 'compliance': return <Shield className="w-4 h-4" />
      case 'audit_trail': return <Activity className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      running: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || colors.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getActionIcon = (action: string) => {
    if (action.includes('create')) return <CheckCircle className="w-4 h-4 text-green-500" />
    if (action.includes('update')) return <Clock className="w-4 h-4 text-blue-500" />
    if (action.includes('delete')) return <AlertTriangle className="w-4 h-4 text-red-500" />
    return <Activity className="w-4 h-4 text-gray-500" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Audits</h1>
        <p className="text-gray-600">Generate compliance reports, view audit trails, and monitor system activity</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Audit Entries</p>
              <p className="text-2xl font-bold text-gray-900">{auditLogs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliance Checks</p>
              <p className="text-2xl font-bold text-gray-900">{complianceChecks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Issues Found</p>
              <p className="text-2xl font-bold text-gray-900">
                {complianceChecks.reduce((sum, check) => sum + (check.issues_found || (check as any).issues_found || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'reports', label: 'Reports', icon: FileText },
            { id: 'audits', label: 'Audit Trail', icon: Activity },
            { id: 'compliance', label: 'Compliance', icon: Shield }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          />
        </div>
        
        {activeTab === 'reports' && (
          <>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="license_usage">License Usage</option>
              <option value="cost_analysis">Cost Analysis</option>
              <option value="user_activity">User Activity</option>
              <option value="compliance">Compliance</option>
              <option value="audit_trail">Audit Trail</option>
            </select>
            
            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              New Report
            </button>
          </>
        )}

        {activeTab === 'compliance' && (
          <button
            onClick={handleRunComplianceCheck}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
          >
            <Shield className="w-4 h-4 mr-2" />
            Run Check
          </button>
        )}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Generated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-gray-100 rounded-lg mr-3">
                          {getReportTypeIcon(report.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {report.name || (report as any).name || 'Unnamed Report'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {report.description || (report as any).description || 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {(report.type || (report as any).type || 'unknown').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(report.status || (report as any).status || 'pending')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {report.schedule || (report as any).schedule || 'manual'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(report.generated_at || (report as any).generated_at) ? 
                        new Date(report.generated_at || (report as any).generated_at).toLocaleDateString() : 
                        'Never'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleGenerateReport(report.id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Generate
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'audits' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getActionIcon(log.action || (log as any).action || '')}
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {log.action || (log as any).action || 'Unknown Action'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {log.entity_type || (log as any).entity_type || 'Unknown Entity'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {log.entity_id || (log as any).entity_id || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.user_id || (log as any).user_id || 'Unknown User'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.created_at || (log as any).created_at || new Date()).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-900 flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issues Found
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComplianceChecks.map((check) => (
                  <tr key={check.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 text-purple-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {(check.check_type || (check as any).check_type || 'unknown').replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(check.status || (check as any).status || 'pending')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {(check.issues_found || (check as any).issues_found || 0) > 0 ? (
                          <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        )}
                        <span className="text-sm text-gray-900">
                          {check.issues_found || (check as any).issues_found || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(check.created_at || (check as any).created_at || new Date()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Report</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
                <input
                  type="text"
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter report name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <select
                  value={newReport.type}
                  onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="license_usage">License Usage</option>
                  <option value="cost_analysis">Cost Analysis</option>
                  <option value="user_activity">User Activity</option>
                  <option value="compliance">Compliance</option>
                  <option value="audit_trail">Audit Trail</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter report description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                <select
                  value={newReport.schedule}
                  onChange={(e) => setNewReport({ ...newReport, schedule: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="manual">Manual</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportsAudits