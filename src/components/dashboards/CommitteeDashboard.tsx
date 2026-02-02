import React, { useMemo, useState, useEffect } from 'react';
import { Application, Scholarship } from '../../types';

type CommitteeDashboardProps = {
  committeeName: string;
  scholarships: Scholarship[];
  applications: Application[];
  reviewers: string[];
  onAssignReviewer: (applicationId: string, reviewerName: string) => void;
  onDecision: (applicationId: string, decision: 'Awarded' | 'Rejected') => void;
};

const CommitteeDashboard: React.FC<CommitteeDashboardProps> = ({
  committeeName,
  scholarships,
  applications,
  reviewers,
  onAssignReviewer,
  onDecision
}) => {
  const [selectedScholarshipId, setSelectedScholarshipId] = useState(scholarships[0]?.id ?? '');
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedScholarshipId && scholarships.length > 0) {
      setSelectedScholarshipId(scholarships[0].id);
    }
  }, [selectedScholarshipId, scholarships]);

  const selectedScholarship = useMemo(() => {
    return scholarships.find(scholarship => scholarship.id === selectedScholarshipId) || null;
  }, [scholarships, selectedScholarshipId]);

  const scholarshipApplications = useMemo(() => {
    if (!selectedScholarshipId) {
      return [];
    }
    return applications.filter(application => application.scholarshipId === selectedScholarshipId);
  }, [applications, selectedScholarshipId]);

  const assignedCount = applications.filter(app => app.assignedReviewer).length;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Greetings, {committeeName}</h3>
          <p className="text-slate-500 text-sm italic">Committee decision overview</p>
        </div>
        <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-blue-700 transition-all">
          Review Shortlist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Shortlisted</p>
          <p className="text-3xl font-black text-blue-600">{applications.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Assigned to Reviewers</p>
          <p className="text-3xl font-black text-emerald-600">{assignedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Assignment</p>
          <p className="text-3xl font-black text-orange-600">{applications.length - assignedCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 font-bold">Scholarships</div>
          <div className="divide-y divide-slate-100">
            {scholarships.map(scholarship => (
              <button
                key={scholarship.id}
                onClick={() => setSelectedScholarshipId(scholarship.id)}
                className={`w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors ${
                  selectedScholarshipId === scholarship.id ? 'bg-blue-50' : ''
                }`}
              >
                <p className="font-semibold text-slate-900">{scholarship.name}</p>
                <p className="text-xs text-slate-400 mt-1">{scholarship.deadline}</p>
              </button>
            ))}
            {scholarships.length === 0 && (
              <div className="p-6 text-sm text-slate-400">No scholarships available.</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scholarship Details</p>
                <h4 className="text-2xl font-black text-slate-900 mt-2">
                  {selectedScholarship?.name || 'Select a scholarship'}
                </h4>
                <p className="text-slate-500 text-sm mt-2 max-w-2xl">
                  {selectedScholarship?.description || 'Choose a scholarship to review its details and applications.'}
                </p>
              </div>
              {selectedScholarship && (
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</p>
                  <p className="text-lg font-black text-emerald-600">{selectedScholarship.amount}</p>
                  <p className="text-xs text-slate-400 mt-2">Deadline: {selectedScholarship.deadline}</p>
                </div>
              )}
            </div>
            {selectedScholarship && (
              <div className="mt-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Criteria</p>
                <div className="flex flex-wrap gap-2">
                  {selectedScholarship.criteria.map(criteria => (
                    <span key={criteria} className="px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full">
                      {criteria}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 font-bold flex justify-between items-center">
              <span>Student Applications</span>
              <span className="text-xs text-slate-400">{scholarshipApplications.length} total</span>
            </div>
            <div className="divide-y divide-slate-100">
              {scholarshipApplications.map(application => {
                const reviewStatus = application.review?.status ?? 'Pending';
                const reviewScore = application.review?.overallScore ? application.review.overallScore.toFixed(1) : '-';
                const reviewSummary = application.review?.submittedAt
                  ? `${application.review.reviewerName} · ${application.review.submittedAt}`
                  : 'Not submitted';
                const isExpanded = expandedReviewId === application.id;
                const isFinal = application.status === 'Awarded' || application.status === 'Rejected';
                const canDecide = application.status === 'Under Review' && reviewStatus === 'Submitted';

                return (
                  <div key={application.id} className="px-6 py-4 space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{application.studentName}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-400 mt-2">
                          <span>Status: {application.status}</span>
                          {application.submissionDate && <span>Submitted: {application.submissionDate}</span>}
                          <span>
                            Reviewer: {application.assignedReviewer ? application.assignedReviewer : 'Unassigned'}
                          </span>
                          <span>Review: {reviewStatus}</span>
                          <span>Overall: {reviewScore}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          className="px-3 py-2 border border-slate-200 rounded-xl text-sm"
                          value={application.assignedReviewer || ''}
                          onChange={event => onAssignReviewer(application.id, event.target.value)}
                        >
                          <option value="">Assign reviewer</option>
                          {reviewers.map(reviewer => (
                            <option key={reviewer} value={reviewer}>
                              {reviewer}
                            </option>
                          ))}
                        </select>
                        {!isFinal && (
                          <>
                            <button
                              className={`px-4 py-2 rounded-xl text-xs font-bold ${
                                canDecide ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                              onClick={() => onDecision(application.id, 'Awarded')}
                              disabled={!canDecide}
                            >
                              Approve
                            </button>
                            <button
                              className={`px-4 py-2 rounded-xl text-xs font-bold ${
                                canDecide ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                              onClick={() => onDecision(application.id, 'Rejected')}
                              disabled={!canDecide}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {isFinal && (
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            application.status === 'Awarded'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {application.status}
                          </span>
                        )}
                        <button
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                        >
                          View Details
                        </button>
                        <button
                          className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                          onClick={() => setExpandedReviewId(isExpanded ? null : application.id)}
                        >
                          {isExpanded ? 'Hide Review' : 'View Review'}
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400">
                      Review Summary: {reviewSummary}
                    </div>
                    {!canDecide && !isFinal && (
                      <div className="text-[11px] text-slate-400">
                        Decision is available after a submitted review.
                      </div>
                    )}

                    {isExpanded && (
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3 text-sm">
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                          <span>Reviewer: {application.review?.reviewerName || 'Pending assignment'}</span>
                          <span>Status: {reviewStatus}</span>
                          <span>Submitted: {application.review?.submittedAt || '-'}</span>
                        </div>
                        <div className="space-y-2">
                          {(application.review?.scores || []).length === 0 && (
                            <p className="text-slate-400 text-xs">No rubric scores submitted yet.</p>
                          )}
                          {(application.review?.scores || []).map(score => (
                            <div key={score.criteria} className="flex items-center justify-between text-sm text-slate-700">
                              <span>{score.criteria}</span>
                              <span className="font-semibold">{score.score}/10</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Comments</p>
                          <p className="text-sm text-slate-600">
                            {application.review?.comments ? application.review.comments : 'No comments submitted.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {selectedScholarship && scholarshipApplications.length === 0 && (
                <div className="p-8 text-slate-400 text-sm">
                  No applications yet for this scholarship.
                </div>
              )}
              {!selectedScholarship && (
                <div className="p-8 text-slate-400 text-sm">
                  Select a scholarship to view student applications.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeDashboard;
