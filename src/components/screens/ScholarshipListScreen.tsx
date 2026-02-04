import React from 'react';
import { Role, Scholarship } from '../../types';

type ScholarshipListScreenProps = {
  showTopPanel: boolean;
  topPanel: React.ReactNode;
  selectedRole: Role | null;
  searchDraft: string;
  onSearchDraftChange: (value: string) => void;
  onSearchSubmit: () => void;
  filteredScholarships: Scholarship[];
  onStartApplication: (scholarship: Scholarship) => void;
  onCreateScholarship: () => void;
  onEditScholarship: (scholarship: Scholarship) => void;
  onDeleteScholarship: (scholarship: Scholarship) => void;
  hasApplications: (scholarshipId: string) => boolean;
};

const ScholarshipListScreen: React.FC<ScholarshipListScreenProps> = ({
  showTopPanel,
  topPanel,
  selectedRole,
  searchDraft,
  onSearchDraftChange,
  onSearchSubmit,
  filteredScholarships,
  onStartApplication,
  onCreateScholarship,
  onEditScholarship,
  onDeleteScholarship,
  hasApplications,
}) => (
  <div className="min-h-screen flex flex-col bg-slate-50">
    {showTopPanel && topPanel}
    <div className="flex-1 flex flex-col p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Scholarships</h2>
          <p className="text-slate-500">Search and explore available opportunities for all roles</p>
        </div>
        {selectedRole === Role.ADMIN && (
          <button
            onClick={onCreateScholarship}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg"
          >
            Create New
          </button>
        )}
      </div>

      <form
        className="relative mb-8"
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit();
        }}
      >
        <input
          type="text"
          placeholder="Search by name, criteria or description..."
          className="w-full pl-12 pr-28 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
          value={searchDraft}
          onChange={(e) => onSearchDraftChange(e.currentTarget.value)}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredScholarships.map(s => (
          <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col hover:border-blue-200 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{s.name}</h3>
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">{s.amount}</span>
            </div>
            <p className="text-slate-500 text-sm mb-6 flex-1">{s.description}</p>

            <div className="mb-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Criteria (Managed by Admin)</p>
              <div className="flex flex-wrap gap-2">
                {s.criteria.map((c, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-medium text-slate-600">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
              <span className="text-xs text-slate-400 font-medium italic">Deadline: {s.deadline}</span>
              {selectedRole === Role.STUDENT ? (
                <button
                  onClick={() => onStartApplication(s)}
                  disabled={hasApplications(s.id)}
                  className={`px-6 py-2 rounded-xl font-bold text-sm shadow-md transition-all ${
                    hasApplications(s.id)
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                  }`}
                >
                  {hasApplications(s.id) ? 'Applied' : 'Apply Now'}
                </button>
              ) : selectedRole === Role.ADMIN ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditScholarship(s)}
                    className="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteScholarship(s)}
                    disabled={hasApplications(s.id)}
                    className={`px-4 py-2 border rounded-lg text-xs font-bold transition-colors ${
                      hasApplications(s.id)
                        ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                        : 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ))}
        {filteredScholarships.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">No scholarships found matching "{searchDraft}"</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default ScholarshipListScreen;
