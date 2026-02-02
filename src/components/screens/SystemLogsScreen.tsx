import React, { useMemo, useState } from 'react';
import { Role } from '../../types';

export type SystemLogEntry = {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: Role;
  action: string;
  target: string;
  status: 'Success' | 'Failed';
  notes?: string;
};

type SystemLogsScreenProps = {
  showTopPanel: boolean;
  topPanel: React.ReactNode;
  logs: SystemLogEntry[];
  onBack: () => void;
};

const SystemLogsScreen: React.FC<SystemLogsScreenProps> = ({
  showTopPanel,
  topPanel,
  logs,
  onBack,
}) => {
  const [roleFilter, setRoleFilter] = useState<Role | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Success' | 'Failed'>('All');
  const [query, setQuery] = useState('');

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (roleFilter !== 'All' && log.actorRole !== roleFilter) {
        return false;
      }
      if (statusFilter !== 'All' && log.status !== statusFilter) {
        return false;
      }
      if (!query.trim()) {
        return true;
      }
      const lowered = query.toLowerCase();
      return (
        log.actorName.toLowerCase().includes(lowered) ||
        log.action.toLowerCase().includes(lowered) ||
        log.target.toLowerCase().includes(lowered)
      );
    });
  }, [logs, query, roleFilter, statusFilter]);

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
            <h2 className="font-black text-xl text-slate-900">System Logs & Activities</h2>
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
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-[1fr_200px_160px] gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Search</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                placeholder="Search by user, action, or target..."
                className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.currentTarget.value as Role | 'All')}
                className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="All">All</option>
                <option value={Role.STUDENT}>Student</option>
                <option value={Role.REVIEWER}>Reviewer</option>
                <option value={Role.COMMITTEE}>Scholarship Committee</option>
                <option value={Role.ADMIN}>Administrator</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.currentTarget.value as 'All' | 'Success' | 'Failed')}
                className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="All">All</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Activity Timeline</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {filteredLogs.length} records
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-slate-400">
                  No log entries match your filters.
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
                      {log.notes && <p className="text-xs text-slate-400 mt-1">{log.notes}</p>}
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
        </div>
      </div>
    </div>
  );
};

export default SystemLogsScreen;
