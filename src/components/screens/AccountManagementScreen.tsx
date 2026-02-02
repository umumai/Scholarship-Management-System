import React, { useState } from 'react';
import { Role } from '../../types';

export type ManagedAccount = {
  id: string;
  name: string;
  email: string;
  role: Role.REVIEWER | Role.COMMITTEE;
  createdAt: string;
  status: 'Pending' | 'Active';
};

type AccountManagementScreenProps = {
  showTopPanel: boolean;
  topPanel: React.ReactNode;
  accounts: ManagedAccount[];
  onCreateAccount: (account: Omit<ManagedAccount, 'id'>) => void;
  onBack: () => void;
};

const AccountManagementScreen: React.FC<AccountManagementScreenProps> = ({
  showTopPanel,
  topPanel,
  accounts,
  onCreateAccount,
  onBack,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role.REVIEWER | Role.COMMITTEE>(Role.REVIEWER);

  const getNextId = () => {
    return 'Auto-generated';
  };

  const handleCreate = () => {
    if (!name.trim() || !email.trim()) {
      alert('Please enter a full name and email address.');
      return;
    }

    onCreateAccount({
      name: name.trim(),
      email: email.trim(),
      role,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
    });
    setName('');
    setEmail('');
    setRole(Role.REVIEWER);
    alert('Account created. An invitation email has been sent.');
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
            <h2 className="font-black text-xl text-slate-900">Account Management</h2>
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
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Create New Account</h3>
                <p className="text-sm text-slate-500">Reviewer and Committee accounts only</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">Role provisioning</span>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Dr. Maya Lewis"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="name@university.edu"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Assign Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.currentTarget.value as Role.REVIEWER | Role.COMMITTEE)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value={Role.REVIEWER}>Reviewer</option>
                  <option value={Role.COMMITTEE}>Scholarship Committee</option>
                </select>
                <p className="text-xs text-slate-400 mt-2">Auto-generated ID: {getNextId()}</p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setName('');
                  setEmail('');
                  setRole(Role.REVIEWER);
                }}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all"
              >
                Create Account
              </button>
            </div>
          </section>

          <section className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Provisioning Notes</h4>
              <ul className="text-xs text-slate-500 space-y-2">
                <li>Reviewer accounts receive evaluation permissions only.</li>
                <li>Committee accounts can finalize award decisions.</li>
                <li>Invitations expire after 7 days if not accepted.</li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Recently Created</h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {accounts.length} total
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {accounts.length === 0 ? (
                  <div className="px-6 py-10 text-center text-sm text-slate-400">
                    No accounts created yet.
                  </div>
                ) : (
                  accounts.map((account) => (
                    <div key={account.id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{account.name}</p>
                        <p className="text-xs text-slate-400">{account.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-600">{account.role}</p>
                        <p className="text-[10px] text-slate-400">ID: {account.id}</p>
                        <p className="text-[10px] text-slate-400">{account.status} · {account.createdAt}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AccountManagementScreen;
