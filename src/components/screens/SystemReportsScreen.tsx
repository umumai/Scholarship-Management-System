import React, { useMemo, useState } from 'react';
import { Application, Role, Scholarship } from '../../types';
import { SystemLogEntry } from './SystemLogsScreen';

type ReportType = 'applications' | 'scholarships' | 'activity' | 'audit';
type DateRange = '7d' | '30d' | '90d' | 'ytd' | 'all';

type SystemReportsScreenProps = {
  showTopPanel: boolean;
  topPanel: React.ReactNode;
  scholarships: Scholarship[];
  applications: Application[];
  logs: SystemLogEntry[];
  onBack: () => void;
};

const statusOrder: Application['status'][] = ['Draft', 'Submitted', 'Under Review', 'Awarded', 'Rejected'];
const roleOrder: Role[] = [Role.STUDENT, Role.REVIEWER, Role.COMMITTEE, Role.ADMIN];

const parseDateValue = (value?: string) => {
  if (!value) {
    return null;
  }
  if (value.includes(' ')) {
    return new Date(value.replace(' ', 'T'));
  }
  return new Date(value);
};

const SystemReportsScreen: React.FC<SystemReportsScreenProps> = ({
  showTopPanel,
  topPanel,
  scholarships,
  applications,
  logs,
  onBack,
}) => {
  const [reportType, setReportType] = useState<ReportType>('applications');
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string | null>(null);

  const rangeStart = useMemo(() => {
    if (dateRange === 'all') {
      return null;
    }
    const now = new Date();
    const start = new Date(now);
    if (dateRange === '7d') {
      start.setDate(now.getDate() - 7);
    } else if (dateRange === '30d') {
      start.setDate(now.getDate() - 30);
    } else if (dateRange === '90d') {
      start.setDate(now.getDate() - 90);
    } else {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
    }
    return start;
  }, [dateRange]);

  const isInRange = (date: Date | null) => {
    if (!rangeStart || !date || Number.isNaN(date.getTime())) {
      return true;
    }
    return date >= rangeStart;
  };

  const filteredApplications = useMemo(() => {
    return applications.filter(app => isInRange(parseDateValue(app.submissionDate)));
  }, [applications, rangeStart]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => isInRange(parseDateValue(log.timestamp)));
  }, [logs, rangeStart]);

  const applicationStatusCounts = useMemo(() => {
    return statusOrder.reduce((acc, status) => {
      acc[status] = filteredApplications.filter(app => app.status === status).length;
      return acc;
    }, {} as Record<Application['status'], number>);
  }, [filteredApplications]);

  const applicationsByScholarship = useMemo(() => {
    return scholarships.map(scholarship => {
      const count = filteredApplications.filter(app => app.scholarshipId === scholarship.id).length;
      return {
        id: scholarship.id,
        name: scholarship.name,
        deadline: scholarship.deadline || 'TBD',
        amount: scholarship.amount,
        applicants: count,
      };
    });
  }, [filteredApplications, scholarships]);

  const activityByRole = useMemo(() => {
    return roleOrder.map(role => ({
      role,
      total: filteredLogs.filter(log => log.actorRole === role).length,
      success: filteredLogs.filter(log => log.actorRole === role && log.status === 'Success').length,
      failed: filteredLogs.filter(log => log.actorRole === role && log.status === 'Failed').length,
    }));
  }, [filteredLogs]);

  const logStatusCounts = useMemo(() => {
    return {
      success: filteredLogs.filter(log => log.status === 'Success').length,
      failed: filteredLogs.filter(log => log.status === 'Failed').length,
    };
  }, [filteredLogs]);

  const scholarshipStatusCounts = useMemo(() => {
    const today = new Date();
    return scholarships.reduce(
      (acc, scholarship) => {
        if (!scholarship.deadline) {
          acc.draft += 1;
          return acc;
        }
        const deadlineDate = new Date(`${scholarship.deadline}T23:59:59`);
        if (deadlineDate >= today) {
          acc.open += 1;
        } else {
          acc.closed += 1;
        }
        return acc;
      },
      { open: 0, closed: 0, draft: 0 }
    );
  }, [scholarships]);

  const handleGenerate = () => {
    setLastGeneratedAt(new Date().toLocaleString());
  };

  const handleExport = (format: 'CSV' | 'PDF') => {
    alert(`Prototype export: ${format} generated for ${reportType} report.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {showTopPanel && topPanel}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Administrator Tools</p>
            <h2 className="font-black text-xl text-slate-900">System Reports</h2>
          </div>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50"
        >
          Back to Dashboard
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-[1.3fr_200px_160px] gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.currentTarget.value as ReportType)}
                className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="applications">Applications Summary</option>
                <option value="scholarships">Scholarship Performance</option>
                <option value="activity">User Activity Summary</option>
                <option value="audit">Audit Export</option>
              </select>
              <p className="text-xs text-slate-400 mt-2">Choose the insight you want to generate.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.currentTarget.value as DateRange)}
                className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="ytd">Year to date</option>
                <option value="all">All time</option>
              </select>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={handleGenerate}
                className="px-5 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all w-full"
              >
                Generate
              </button>
            </div>
          </div>

          {lastGeneratedAt && (
            <p className="text-xs text-slate-400 font-semibold">
              Generated at: {lastGeneratedAt}
            </p>
          )}

          {reportType === 'applications' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Applications</p>
                  <p className="text-3xl font-black text-blue-600">{filteredApplications.length}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Submitted</p>
                  <p className="text-3xl font-black text-emerald-600">{applicationStatusCounts.Submitted}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Awarded</p>
                  <p className="text-3xl font-black text-amber-600">{applicationStatusCounts.Awarded}</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Status Breakdown</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {filteredApplications.length} total
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {statusOrder.map(status => (
                    <div key={status} className="px-6 py-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700">{status}</p>
                      <span className="text-sm font-bold text-slate-900">{applicationStatusCounts[status]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {reportType === 'scholarships' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Open Scholarships</p>
                  <p className="text-3xl font-black text-emerald-600">{scholarshipStatusCounts.open}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Closed Scholarships</p>
                  <p className="text-3xl font-black text-slate-600">{scholarshipStatusCounts.closed}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Draft</p>
                  <p className="text-3xl font-black text-amber-600">{scholarshipStatusCounts.draft}</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Applications by Scholarship</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {applicationsByScholarship.length} scholarships
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {applicationsByScholarship.map(item => (
                    <div key={item.id} className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-400">Deadline: {item.deadline}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">{item.applicants} applicants</p>
                        <p className="text-xs text-slate-400">{item.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {reportType === 'activity' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Actions</p>
                  <p className="text-3xl font-black text-blue-600">{filteredLogs.length}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Success vs Failed</p>
                  <p className="text-3xl font-black text-slate-900">
                    {logStatusCounts.success} / {logStatusCounts.failed}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Activity by Role</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {activityByRole.reduce((total, row) => total + row.total, 0)} actions
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {activityByRole.map(row => (
                    <div key={row.role} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{row.role}</p>
                        <p className="text-xs text-slate-400">Success {row.success} · Failed {row.failed}</p>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{row.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {reportType === 'audit' && (
            <>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Audit Snapshot</h3>
                  <p className="text-xs text-slate-400">Exportable log snapshot for compliance reviews.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleExport('CSV')}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => handleExport('PDF')}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50"
                  >
                    Export PDF
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Audit Log Snapshot</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {filteredLogs.length} records
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {filteredLogs.length === 0 ? (
                    <div className="px-6 py-12 text-center text-sm text-slate-400">
                      No log entries in the selected range.
                    </div>
                  ) : (
                    filteredLogs.map(log => (
                      <div key={log.id} className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="text-xs text-slate-400 font-semibold">{log.timestamp}</p>
                          <p className="text-sm font-bold text-slate-900">
                            {log.actorName} <span className="text-slate-400 font-semibold">({log.actorRole})</span>
                          </p>
                          <p className="text-sm text-slate-600">{log.action} · {log.target}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          log.status === 'Success'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-red-50 text-red-600'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemReportsScreen;
