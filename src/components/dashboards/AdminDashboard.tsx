import React from 'react';
import { Application, Scholarship } from '../../types';

type AdminDashboardProps = {
  adminName: string;
  scholarships: Scholarship[];
  applications: Application[];
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminName, scholarships, applications }) => {
  const committeeAssignments: Record<string, string> = {
    '1': 'Scholarship Committee A',
    '2': 'Scholarship Committee B',
    '3': 'Scholarship Committee C',
  };
  const getScholarshipStatus = (deadline: string) => {
    if (!deadline) {
      return 'Draft';
    }
    const today = new Date();
    const deadlineDate = new Date(`${deadline}T23:59:59`);
    return deadlineDate >= today ? 'Open' : 'Closed';
  };

  const getApplicantCount = (scholarshipId: string) => {
    return applications.filter(app => app.scholarshipId === scholarshipId).length;
  };
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Welcome, {adminName}</h3>
          <p className="text-slate-500 text-sm italic">System administration overview</p>
        </div>
        <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all">
          Create Scholarship
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Scholarships</p>
          <p className="text-3xl font-black text-blue-600">{scholarships.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Applications</p>
          <p className="text-3xl font-black text-emerald-600">{applications.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Users Managed</p>
          <p className="text-3xl font-black text-orange-600">0</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 font-bold flex justify-between items-center">
          <span>Administration Tasks</span>
          <button className="text-xs text-blue-600 hover:underline">View All</button>
        </div>
        <div className="p-6 space-y-4">
          {scholarships.length === 0 ? (
            <div className="p-6 text-slate-400 text-sm">
              Administrative actions and system alerts will appear here.
            </div>
          ) : (
            scholarships.map((scholarship) => {
              const status = getScholarshipStatus(scholarship.deadline);
              const applicantCount = getApplicantCount(scholarship.id);
              const committee = committeeAssignments[scholarship.id] || 'Scholarship Committee';
              return (
                <div key={scholarship.id} className="border border-slate-100 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{scholarship.name}</p>
                    <p className="text-xs text-slate-400 mt-1">Committee: {committee}</p>
                    <p className="text-xs text-slate-400 mt-1">Applicants: {applicantCount}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      status === 'Open'
                        ? 'bg-emerald-50 text-emerald-600'
                        : status === 'Closed'
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-amber-50 text-amber-600'
                    }`}>
                      {status}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">Deadline: {scholarship.deadline || 'TBD'}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
