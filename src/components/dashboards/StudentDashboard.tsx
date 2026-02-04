import React from 'react';
import { Application, Role, Scholarship } from '../../types';

type StudentDashboardProps = {
  userName: string;
  selectedRole: Role | null;
  applications: Application[];
  scholarships: Scholarship[];
  activeScholarships: Scholarship[];
  onFindScholarships: () => void;
};

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  userName,
  selectedRole,
  applications,
  scholarships,
  activeScholarships,
  onFindScholarships,
}) => {
  const firstName = userName.split(' ')[0];
  const decisionUpdates = applications.filter(app => app.status === 'Awarded' || app.status === 'Rejected');
  const statusBadgeStyles: Record<Application['status'], string> = {
    Draft: 'bg-slate-100 text-slate-600',
    Submitted: 'bg-blue-50 text-blue-600',
    'Under Review': 'bg-amber-50 text-amber-700',
    Awarded: 'bg-emerald-50 text-emerald-700',
    Rejected: 'bg-rose-50 text-rose-700',
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Hello, {firstName}</h3>
          <p className="text-slate-500 text-sm italic">Portal Role: {selectedRole}</p>
        </div>
        <button
          onClick={onFindScholarships}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          Find New Scholarships
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">My Applications</p>
          <p className="text-3xl font-black text-blue-600">{applications.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Listings</p>
          <p className="text-3xl font-black text-emerald-600">{activeScholarships.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Next Deadline</p>
          <p className="text-3xl font-black text-orange-600">14 Days</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 font-bold flex justify-between items-center">
          <span>Decision Updates</span>
          <span className="text-xs text-slate-400">{decisionUpdates.length} updates</span>
        </div>
        <div className="divide-y divide-slate-100">
          {decisionUpdates.map(app => (
            <div key={app.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {scholarships.find(s => s.id === app.scholarshipId)?.name}
                </p>
                <p className="text-xs text-slate-400">Application {app.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadgeStyles[app.status]}`}>
                {app.status}
              </span>
            </div>
          ))}
          {decisionUpdates.length === 0 && (
            <div className="px-6 py-6 text-sm text-slate-400">
              No committee decisions yet. Check back after reviews are submitted.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 font-bold flex justify-between items-center">
          <span>Recent System Activity</span>
          <button className="text-xs text-blue-600 hover:underline">Full Report</button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            <tr>
              <th className="px-6 py-4">Scholarship</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {applications.map(app => (
              <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">
                  {scholarships.find(s => s.id === app.scholarshipId)?.name}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${statusBadgeStyles[app.status]}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-slate-400">{app.submissionDate}</td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
                  No active applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDashboard;
