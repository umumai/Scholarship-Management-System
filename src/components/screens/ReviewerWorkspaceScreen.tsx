import React, { useEffect, useMemo, useState } from 'react';
import { Application, ReviewEvaluation, Scholarship } from '../../types';

type ReviewerWorkspaceScreenProps = {
  application: Application | null;
  scholarship: Scholarship | null;
  reviewerName: string;
  onSubmitReview: (applicationId: string, review: ReviewEvaluation) => void;
  onRequestDocuments?: (applicationId: string, missingDocuments: string[], reason: string) => void;
  onBack: () => void;
};

const ReviewerWorkspaceScreen: React.FC<ReviewerWorkspaceScreenProps> = ({
  application,
  scholarship,
  reviewerName,
  onSubmitReview,
  onRequestDocuments,
  onBack,
}) => {
  const [reviewDraft, setReviewDraft] = useState<ReviewEvaluation | null>(null);
  const [showDocumentRequestModal, setShowDocumentRequestModal] = useState(false);
  const [selectedMissingDocs, setSelectedMissingDocs] = useState<string[]>([]);
  const [documentRequestReason, setDocumentRequestReason] = useState('');

  useEffect(() => {
    if (!application) {
      setReviewDraft(null);
      return;
    }
    const criteriaList = scholarship?.criteria ?? [];
    const existingReview = application.review;
    const scores = criteriaList.map(criteria => {
      const matched = existingReview?.scores.find(score => score.criteria === criteria);
      return {
        criteria,
        score: matched?.score ?? 0,
      };
    });
    setReviewDraft({
      status: existingReview?.status ?? 'Pending',
      reviewerName: existingReview?.reviewerName ?? reviewerName,
      scores,
      overallScore: existingReview?.overallScore ?? 0,
      comments: existingReview?.comments ?? '',
      submittedAt: existingReview?.submittedAt,
      updatedAt: existingReview?.updatedAt,
    });
  }, [application, scholarship, reviewerName]);

  const draftAverage = useMemo(() => {
    if (!reviewDraft || reviewDraft.scores.length === 0) {
      return 0;
    }
    const validScores = reviewDraft.scores.map(score => score.score).filter(score => score > 0);
    if (!validScores.length) {
      return 0;
    }
    const avg = validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
    return Number(avg.toFixed(1));
  }, [reviewDraft]);

  const canEdit = useMemo(() => {
    if (!application || !reviewDraft) {
      return false;
    }
    const isFinalized = application.status === 'Awarded' || application.status === 'Rejected';
    return reviewDraft.status === 'Pending' && !isFinalized;
  }, [application, reviewDraft]);

  const canSubmit = useMemo(() => {
    if (!reviewDraft || !canEdit) {
      return false;
    }
    return reviewDraft.scores.length > 0 && reviewDraft.scores.every(score => score.score >= 1 && score.score <= 10);
  }, [reviewDraft, canEdit]);

  const updateScore = (criteria: string, value: number) => {
    if (!reviewDraft) {
      return;
    }
    setReviewDraft(prev => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        scores: prev.scores.map(score => score.criteria === criteria ? { ...score, score: value } : score),
        updatedAt: new Date().toISOString().split('T')[0],
      };
    });
  };

  const updateComments = (value: string) => {
    if (!reviewDraft) {
      return;
    }
    setReviewDraft(prev => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        comments: value,
        updatedAt: new Date().toISOString().split('T')[0],
      };
    });
  };

  const handleSubmit = () => {
    if (!application || !reviewDraft || !canSubmit) {
      return;
    }
    const timestamp = new Date().toISOString().split('T')[0];
    const nextReview: ReviewEvaluation = {
      ...reviewDraft,
      reviewerName,
      overallScore: draftAverage,
      status: 'Submitted',
      submittedAt: reviewDraft.submittedAt ?? timestamp,
      updatedAt: timestamp,
    };
    onSubmitReview(application.id, nextReview);
    setReviewDraft(nextReview);
  };

  if (!application) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reviewer Workspace</p>
            <h2 className="font-black text-xl text-slate-900">Application not found</h2>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50"
          >
            Back to Dashboard
          </button>
        </header>
        <div className="p-8 text-slate-500 text-sm">We could not locate this application.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reviewer Workspace</p>
          <h2 className="font-black text-xl text-slate-900">{application.studentName}</h2>
          <p className="text-xs text-slate-400 mt-1">
            Scholarship: {scholarship?.name || 'Unknown'} · Status: {application.status}
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50"
        >
          Back to Dashboard
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Review Evaluation</p>
              <p className="text-sm text-slate-500 mt-2">
                Reviewer: {reviewDraft?.reviewerName || reviewerName}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                Review: {reviewDraft?.status ?? 'Pending'}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                Overall: {draftAverage || '-'}
              </span>
            </div>
          </div>

          {!canEdit && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 text-amber-700 text-sm">
              Review edits are locked because this application is finalized or the review has been submitted.
            </div>
          )}

          <div className="space-y-4">
            {(reviewDraft?.scores || []).length === 0 && (
              <p className="text-sm text-slate-400">No rubric criteria available for this scholarship.</p>
            )}
            {(reviewDraft?.scores || []).map(score => (
              <div key={score.criteria} className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700">{score.criteria}</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={score.score || ''}
                    disabled={!canEdit}
                    onChange={(event) => updateScore(score.criteria, Number(event.currentTarget.value))}
                    className="w-24 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="1-10"
                  />
                  <span className="text-xs text-slate-400">/10</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Comments</label>
            <textarea
              value={reviewDraft?.comments || ''}
              onChange={(event) => updateComments(event.currentTarget.value)}
              disabled={!canEdit}
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Summarize strengths, weaknesses, and recommendation."
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              {reviewDraft?.submittedAt ? `Submitted: ${reviewDraft.submittedAt}` : 'Not submitted yet.'}
            </div>
            <div className="flex gap-3">
              {canEdit && (
                <button
                  className="px-6 py-3 rounded-xl text-xs font-bold transition-all bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                  onClick={() => setShowDocumentRequestModal(true)}
                >
                  Request Missing Documents
                </button>
              )}
              <button
                className={`px-6 py-3 rounded-xl text-xs font-bold transition-all ${
                  canSubmit ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Applicant Documents</p>
              <p className="text-sm text-slate-500 mt-1">Review submitted files before scoring.</p>
            </div>
            <span className="text-xs text-slate-400">{application.documents?.length || 0} files</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(application.documents || []).map(doc => (
              <div key={doc.id} className="border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{doc.name}</p>
                    <p className="text-xs text-slate-400 uppercase">{doc.type}</p>
                  </div>
                  <a
                    href={doc.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    View/Download
                  </a>
                </div>

                {doc.type === 'png' && (
                  <img src={doc.url} alt={doc.name} className="w-full h-56 object-contain bg-slate-50 rounded-xl border border-slate-100" />
                )}
                {doc.type === 'pdf' && (
                  <div className="w-full h-56 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-slate-500">PDF Document</p>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                        Open in new tab
                      </a>
                    </div>
                  </div>
                )}
                {doc.type === 'docx' && (
                  <div className="w-full h-56 rounded-xl border border-slate-100 bg-slate-50 flex flex-col items-center justify-center text-center gap-3">
                    {doc.previewUrl ? (
                      <img src={doc.previewUrl} alt={`${doc.name} preview`} className="w-20 h-20 object-contain" />
                    ) : (
                      <div className="w-16 h-16 bg-slate-200 rounded-lg" />
                    )}
                    <p className="text-xs text-slate-500">Mock DOCX preview</p>
                  </div>
                )}
              </div>
            ))}
            {(application.documents || []).length === 0 && (
              <div className="col-span-2 text-center py-8 text-sm text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="font-semibold text-slate-500">No documents uploaded</p>
                <p className="text-xs mt-1">The applicant has not uploaded any documents for this application.</p>
                <p className="text-xs mt-2 text-amber-600">Consider using "Request Missing Documents" if documents are required.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDocumentRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full max-h-96 overflow-y-auto p-8 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Request Missing Documents</h3>
              <p className="text-sm text-slate-500 mt-2">Select the documents needed from the applicant and provide a reason.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Documents Needed</label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-slate-200 rounded-xl p-3">
                {['Transcript', 'Proof of Enrollment', 'Medical Certificate', 'CGPA Verification', 'Recommendation Letter', 'Financial Documents', 'ID Copy', 'Essay'].map(docType => (
                  <label key={docType} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedMissingDocs.includes(docType)}
                      onChange={(e) => {
                        if (e.currentTarget.checked) {
                          setSelectedMissingDocs(prev => [...prev, docType]);
                        } else {
                          setSelectedMissingDocs(prev => prev.filter(doc => doc !== docType));
                        }
                      }}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{docType}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Reason for Request</label>
              <textarea
                value={documentRequestReason}
                onChange={(e) => setDocumentRequestReason(e.currentTarget.value)}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Explain why these documents are needed and what should be included..."
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDocumentRequestModal(false);
                  setSelectedMissingDocs([]);
                  setDocumentRequestReason('');
                }}
                className="px-6 py-3 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (application && onRequestDocuments) {
                    onRequestDocuments(application.id, selectedMissingDocs, documentRequestReason);
                    setShowDocumentRequestModal(false);
                    setSelectedMissingDocs([]);
                    setDocumentRequestReason('');
                  }
                }}
                className="px-6 py-3 rounded-xl text-sm font-bold bg-amber-600 text-white hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedMissingDocs.length === 0 || !documentRequestReason.trim()}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewerWorkspaceScreen;
