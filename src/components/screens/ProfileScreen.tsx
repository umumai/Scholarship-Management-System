import React from 'react';
import { Role } from '../../types';

type ProfileDraft = {
  name: string;
  email: string;
  phone: string;
  dept: string;
};

type PasswordDraft = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ProfileScreenProps = {
  showTopPanel: boolean;
  topPanel: React.ReactNode;
  userName: string;
  userId: string;
  selectedRole: Role | null;
  profileDraft: ProfileDraft;
  passwordDraft: PasswordDraft;
  onProfileFieldChange: (field: keyof ProfileDraft, value: string) => void;
  onPasswordFieldChange: (field: keyof PasswordDraft, value: string) => void;
  onPasswordSave: () => void;
  onDiscard: () => void;
  onSave: () => void;
  onBack: () => void;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  showTopPanel,
  topPanel,
  userName,
  userId,
  selectedRole,
  profileDraft,
  passwordDraft,
  onProfileFieldChange,
  onPasswordFieldChange,
  onPasswordSave,
  onDiscard,
  onSave,
  onBack,
}) => (
  <div className="min-h-screen flex flex-col bg-slate-50">
    {showTopPanel && topPanel}
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <span className="font-black text-xl text-slate-900">Profile Management</span>
      </div>
    </header>

    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 space-y-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-3xl font-bold text-slate-300 border-4 border-white shadow-sm ring-1 ring-slate-100">
              {userName.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{userName}</h3>
              <p className="text-slate-400 text-sm uppercase font-bold tracking-widest">
                {selectedRole}
                {userId ? ` · ${userId}` : ''}
              </p>
              <button type="button" className="text-blue-600 text-xs font-bold mt-2 hover:underline">
                Change Photo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Full Name</label>
              <input
                type="text"
                value={profileDraft.name}
                onChange={e => onProfileFieldChange('name', e.target.value)}
                autoComplete="off"
                className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
              <input
                type="email"
                value={profileDraft.email}
                onChange={e => onProfileFieldChange('email', e.target.value)}
                autoComplete="off"
                className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Contact Number</label>
              <input
                type="text"
                value={profileDraft.phone}
                autoComplete="off"
                onChange={e => onProfileFieldChange('phone', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Home Adress</label>
              <input
                type="text"
                value={profileDraft.dept}
                autoComplete="off"
                onChange={e => onProfileFieldChange('dept', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="border-t pt-8">
            <h4 className="text-lg font-bold text-slate-900 mb-4">Change Password</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordDraft.currentPassword}
                  autoComplete="off"
                  onChange={e => onPasswordFieldChange('currentPassword', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">New Password</label>
                <input
                  type="password"
                  autoComplete="off"
                  value={passwordDraft.newPassword}
                  onChange={e => onPasswordFieldChange('newPassword', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Create a new password"
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Confirm New Password</label>
                <input
                  type="password"
                  autoComplete="off"
                  value={passwordDraft.confirmPassword}
                  onChange={e => onPasswordFieldChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Repeat new password"
                />
              </div>
              <div className="col-span-2 md:col-span-1 flex items-end">
                <button
                  type="button"
                  onClick={onPasswordSave}
                  className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t flex flex-wrap items-center justify-end gap-4">
            <button
              type="button"
              onClick={onDiscard}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={onSave}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileScreen;
