import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Application } from '../../types';

type ReviewerDashboardProps = {
  reviewerName: string;
  applications: Application[];
};

const ReviewerDashboard: React.FC<ReviewerDashboardProps> = ({
  reviewerName,
  applications
}) => {
  const assignedApplications = useMemo(
    () => applications.filter(app => app.assignedReviewer === reviewerName),
    [applications, reviewerName]
  );

  const pendingCount = useMemo(() => {
    return assignedApplications.filter(app => {
      const reviewStatus = app.review?.status ?? 'Pending';
      const isFinalized = app.status === 'Awarded' || app.status === 'Rejected';
      return reviewStatus === 'Pending' && !isFinalized;
    }).length;
  }, [assignedApplications]);

  const completedToday = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return assignedApplications.filter(app => app.review?.submittedAt === today).length;
  }, [assignedApplications]);

  const averageScore = useMemo(() => {
    const submittedScores = assignedApplications
      .filter(app => app.review?.status === 'Submitted')
      .map(app => app.review?.overallScore || 0)
      .filter(score => score > 0);
    if (!submittedScores.length) {
      return '-';
    }
    const avg = submittedScores.reduce((sum, score) => sum + score, 0) / submittedScores.length;
    return avg.toFixed(1);
  }, [assignedApplications]);


  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Welcome, {reviewerName}</h3>
          <p className="text-slate-500 text-sm italic">Review applications assigned to you</p>
        </div>
        <div className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg">
          Reviewer Workspace
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Reviews</p>
          <p className="text-3xl font-black text-blue-600">{pendingCount}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Completed Today</p>
          <p className="text-3xl font-black text-emerald-600">{completedToday}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Avg. Score</p>
          <p className="text-3xl font-black text-orange-600">{averageScore}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="p-6 border-b border-slate-100 font-bold flex justify-between items-center">
          <span>Assigned Applications</span>
          <button className="text-xs text-blue-600 hover:underline">View Queue</button>
        </div>
        <div className="divide-y divide-slate-100">
          {assignedApplications.map(application => (
            <div key={application.id} className="px-6 py-4 flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{application.studentName}</p>
                <div className="text-xs text-slate-400 mt-2 flex flex-wrap gap-3">
                  <span>Status: {application.status}</span>
                  {application.submissionDate && <span>Submitted: {application.submissionDate}</span>}
                  <span>Review: {application.review?.status ?? 'Pending'}</span>
                </div>
              </div>
              <Link
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                to={`/review/${application.id}`}
              >
                {application.review?.status === 'Submitted' ? 'View Review' : 'Continue Review'}
              </Link>
            </div>
          ))}
          {assignedApplications.length === 0 && (
            <div className="p-8 text-slate-400 text-sm">
              No applications assigned yet. Check back after committee assignments.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ReviewerDashboard;
