import React, { useEffect, useMemo, useState } from 'react';
import { Application, ReviewEvaluation, Scholarship } from '../../types';

type ReviewerWorkspaceScreenProps = {
  application: Application | null;
  scholarship: Scholarship | null;
  reviewerName: string;
  onSubmitReview: (applicationId: string, review: ReviewEvaluation) => void;
  onBack: () => void;
};

const ReviewerWorkspaceScreen: React.FC<ReviewerWorkspaceScreenProps> = ({
  application,
  scholarship,
  reviewerName,
  onSubmitReview,
  onBack,
}) => {
  const [reviewDraft, setReviewDraft] = useState<ReviewEvaluation | null>(null);

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
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Download
                  </a>
                </div>

                {doc.type === 'png' && (
                  <img src={doc.url} alt={doc.name} className="w-full h-56 object-contain bg-slate-50 rounded-xl border border-slate-100" />
                )}
                {doc.type === 'pdf' && (
                  <iframe
                    title={doc.name}
                    src={doc.url}
                    className="w-full h-56 rounded-xl border border-slate-100 bg-white"
                  />
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
              <div className="text-sm text-slate-400">No documents uploaded for this application.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewerWorkspaceScreen;
