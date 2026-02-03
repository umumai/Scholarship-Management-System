import React, { useState } from 'react';
import { Scholarship } from '../../types';

type ScholarshipEditorScreenProps = {
  showTopPanel: boolean;
  topPanel: React.ReactNode;
  mode: 'create' | 'edit';
  initialDraft: Scholarship;
  onSave: (draft: Scholarship) => void;
  onBack: () => void;
};

const ScholarshipEditorScreen: React.FC<ScholarshipEditorScreenProps> = ({
  showTopPanel,
  topPanel,
  mode,
  initialDraft,
  onSave,
  onBack,
}) => {
  const [draft, setDraft] = useState<Scholarship>(initialDraft);
  const [criteriaText, setCriteriaText] = useState(initialDraft.criteria.join(', '));

  const updateDraft = (field: keyof Scholarship, value: string | string[]) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const trimmedName = draft.name.trim();
    if (!trimmedName) {
      alert('Please enter a scholarship name.');
      return;
    }
    const criteria = criteriaText
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    onSave({
      ...draft,
      name: trimmedName,
      amount: draft.amount.trim() || 'RM0',
      deadline: draft.deadline.trim(),
      description: draft.description.trim(),
      criteria: criteria.length ? criteria : ['To be announced'],
    });
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
            <h2 className="font-black text-xl text-slate-900">
              {mode === 'create' ? 'Create Scholarship' : 'Edit Scholarship'}
            </h2>
          </div>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50"
        >
          Back to List
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Scholarship Details</h3>
                <p className="text-sm text-slate-500">Fill in all information for this scholarship offer.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                {mode === 'create' ? 'New' : 'Update'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Scholarship Title</label>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => updateDraft('name', e.currentTarget.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Global Merit Scholarship 2024"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Award Amount</label>
                <input
                  type="text"
                  value={draft.amount}
                  onChange={(e) => updateDraft('amount', e.currentTarget.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="RM10,000"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Deadline</label>
                <input
                  type="date"
                  value={draft.deadline}
                  onChange={(e) => updateDraft('deadline', e.currentTarget.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Description</label>
                <textarea
                  value={draft.description}
                  onChange={(e) => updateDraft('description', e.currentTarget.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Brief summary of this scholarship."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Eligibility Criteria</label>
                <textarea
                  value={criteriaText}
                  onChange={(e) => setCriteriaText(e.currentTarget.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="GPA > 3.5, Leadership activities, Community service"
                />
                <p className="text-xs text-slate-400 mt-2">Separate each criterion with a comma.</p>
              </div>
            </div>

            <div className="pt-6 border-t flex flex-wrap items-center justify-end gap-4">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
              >
                {mode === 'create' ? 'Create Scholarship' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipEditorScreen;
