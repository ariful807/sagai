import React, { useState } from 'react';
import {
  X, Database, Copy, Check, Shield, Users, Settings, Save,
  RefreshCw, Key, Link as LinkIcon, Trash2, UserPlus, Image as ImageIcon,
  CheckCircle, AlertCircle, HelpCircle, ExternalLink, Code, Lock, Eye, EyeOff, LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CODE_GS_SCRIPT, testGoogleSheetsConnection } from '../services/googleSheetsService';
import { UserRole } from '../types';

export const AdminPanel: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    settings,
    updateSettings,
    users,
    deleteUser,
    updateUserRole,
    currentUser,
    syncWithGoogleSheets,
  } = useApp();

  const currentAdminPassword = settings.adminPassword || '180665';

  // Authentication State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'sheets' | 'appscript' | 'users' | 'branding' | 'security'>('sheets');
  const [appsScriptUrl, setAppsScriptUrl] = useState(settings.appsScriptUrl || '');
  const [sheetId, setSheetId] = useState(settings.sheetId || '');
  const [appName, setAppName] = useState(settings.appName || 'sagai');
  const [appIcon, setAppIcon] = useState(settings.appIconUrl || '');

  const [isCopied, setIsCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password Change Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{ success: boolean; message: string } | null>(null);

  if (!isAdminOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === currentAdminPassword) {
      setIsUnlocked(true);
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিয়ে আবার চেষ্টা করুন।');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_GS_SCRIPT);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      appsScriptUrl: appsScriptUrl.trim(),
      sheetId: sheetId.trim(),
      appName: appName.trim(),
      appIconUrl: appIcon.trim() || undefined,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeStatus(null);

    if (!oldPassword.trim()) {
      setPasswordChangeStatus({ success: false, message: 'বর্তমান পাসওয়ার্ড প্রবেশ করান।' });
      return;
    }

    if (oldPassword.trim() !== currentAdminPassword) {
      setPasswordChangeStatus({ success: false, message: 'বর্তমান পাসওয়ার্ডটি সঠিক নয়।' });
      return;
    }

    if (!newPassword.trim()) {
      setPasswordChangeStatus({ success: false, message: 'নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' });
      return;
    }

    if (newPassword.length < 4) {
      setPasswordChangeStatus({ success: false, message: 'নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordChangeStatus({ success: false, message: 'নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না।' });
      return;
    }

    updateSettings({
      adminPassword: newPassword.trim(),
    });

    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordChangeStatus({
      success: true,
      message: 'এডমিন পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! পরবর্তী লগইনে নতুন পাসওয়ার্ড ব্যবহার করুন।'
    });
  };

  const handleResetToDefaultPassword = () => {
    if (confirm('আপনি কি নিশ্চিতভাবে এডমিন পাসওয়ার্ড ডিফল্ট (180665)-এ রিসেট করতে চান?')) {
      updateSettings({
        adminPassword: '180665',
      });
      setPasswordChangeStatus({
        success: true,
        message: 'এডমিন পাসওয়ার্ড রিসেট করে 180665 করা হয়েছে।'
      });
    }
  };

  const handleTestConnection = async () => {
    if (!appsScriptUrl) {
      setTestResult({
        success: false,
        message: 'অনুগ্রহ করে প্রথমে Google Apps Script Web App URL টি দিন।'
      });
      return;
    }
    setIsTesting(true);
    setTestResult(null);

    const res = await testGoogleSheetsConnection(appsScriptUrl);
    setIsTesting(false);
    setTestResult(res);
  };

  // 1. Lock Screen (When password is not yet entered)
  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className={`bg-white dark:bg-[#242526] w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 dark:border-[#393a3b] overflow-hidden transition-all ${isShaking ? 'animate-bounce' : ''}`}>

          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center relative">
            <button
              onClick={() => setIsAdminOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xs rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner ring-2 ring-white/30">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-black tracking-tight">এডমিন ভেরিফিকেশন</h2>
            <p className="text-xs text-blue-100 mt-1">প্যানেলে প্রবেশ করতে এডমিন পাসওয়ার্ড দিন</p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleUnlock} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-[#1877f2]" />
                <span>এডমিন পাসওয়ার্ড (Admin Password)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="পাসওয়ার্ড লিখুন..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  autoFocus
                  className="w-full text-sm p-3.5 pr-11 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-hidden focus:border-[#1877f2] font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl text-xs text-gray-600 dark:text-gray-300">
              <span className="font-bold text-[#1877f2]">💡 হিন্ট:</span> ডিফল্ট পাসওয়ার্ড <strong className="font-mono text-gray-900 dark:text-white font-bold bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">180665</strong> (প্যানেলের ভেতর গিয়ে পরে পরিবর্তন করতে পারবেন)।
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdminOpen(false)}
                className="flex-1 py-3 bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-[#4e4f50] text-gray-700 dark:text-gray-200 font-bold rounded-xl text-sm transition-all cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-[#1877f2] hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Lock className="w-4 h-4" />
                <span>আনলক করুন</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 2. Unlocked Admin Panel
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-[#242526] w-full max-w-3xl h-[88vh] max-h-[750px] rounded-3xl shadow-2xl border border-gray-200 dark:border-[#393a3b] overflow-hidden flex flex-col">

        {/* Admin Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">{settings.appName || 'sagai'} এডমিন কন্ট্রোল প্যানেল</h2>
              <p className="text-xs text-blue-100">Google Sheets ডাটাবেস ও সিস্টেম কনফিগারেশন</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsUnlocked(false);
                setPasswordInput('');
              }}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="প্যানেল পুনরায় লক করুন"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">লক করুন</span>
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-[#393a3b] bg-gray-50 dark:bg-[#1a1b1c] px-3 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sheets')}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === 'sheets'
                ? 'bg-white dark:bg-[#242526] text-[#1877f2] border-t-2 border-[#1877f2] shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Google Sheets কনফিগ</span>
          </button>

          <button
            onClick={() => setActiveTab('appscript')}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === 'appscript'
                ? 'bg-white dark:bg-[#242526] text-[#1877f2] border-t-2 border-[#1877f2] shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Apps Script (Code.gs) কোড</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === 'users'
                ? 'bg-white dark:bg-[#242526] text-[#1877f2] border-t-2 border-[#1877f2] shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>ইউজার ম্যানেজমেন্ট ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === 'branding'
                ? 'bg-white dark:bg-[#242526] text-[#1877f2] border-t-2 border-[#1877f2] shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>অ্যাপ আইকন ও ব্রান্ডিং</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white dark:bg-[#242526] text-[#1877f2] border-t-2 border-[#1877f2] shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>সিকিউরিটি ও পাসওয়ার্ড</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white dark:bg-[#242526]">

          {/* 1. Google Sheets Configuration */}
          {activeTab === 'sheets' && (
            <form onSubmit={handleSaveSettings} className="space-y-5 max-w-2xl mx-auto">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-[#1877f2] font-bold text-sm">
                  <HelpCircle className="w-4 h-4" />
                  <span>Google Sheets ডাটাবেস কীভাবে সেটআপ করবেন?</span>
                </div>
                <ol className="list-decimal list-inside text-xs text-gray-700 dark:text-gray-300 space-y-1 leading-relaxed">
                  <li>একটি নতুন <strong>Google Sheet</strong> তৈরি করুন।</li>
                  <li>শীটের মেনু থেকে <strong>Extensions &gt; Apps Script</strong> এ যান।</li>
                  <li>পাশের ট্যাব থেকে <strong>Code.gs</strong> কপি করে সেখানে পেস্ট করুন।</li>
                  <li><strong>Deploy &gt; New deployment</strong> &gt; 'Web app' নির্বাচন করুন।</li>
                  <li><strong>Who has access: Anyone</strong> দিয়ে Deploy চাপুন এবং Web App URL টি নিচের বক্সে পেস্ট করুন।</li>
                </ol>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <LinkIcon className="w-4 h-4 text-[#1877f2]" />
                  <span>Google Apps Script Web App URL *</span>
                </label>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  value={appsScriptUrl}
                  onChange={(e) => setAppsScriptUrl(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-hidden focus:border-[#1877f2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-[#1877f2]" />
                  <span>Google Sheet ID বা Spreadsheet URL (ঐচ্ছিক)</span>
                </label>
                <input
                  type="text"
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  value={sheetId}
                  onChange={(e) => setSheetId(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-hidden focus:border-[#1877f2]"
                />
              </div>

              {testResult && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  testResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {testResult.success ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                  <span>{testResult.message}</span>
                </div>
              )}

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>কনফিগারেশন সফলভাবে সেভ হয়েছে!</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#1877f2] hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>কনফিগারেশন সেভ করুন</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || !appsScriptUrl}
                  className="px-5 py-3 bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 text-gray-800 dark:text-gray-200 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>কানেকশন টেস্ট করুন</span>
                </button>
              </div>
            </form>
          )}

          {/* 2. Apps Script (Code.gs) Viewer & One-Click Copy */}
          {activeTab === 'appscript' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    Google Apps Script (Code.gs) কোড
                  </h3>
                  <p className="text-xs text-gray-500">
                    নিচের কোডটি এক ক্লিকে কপি করে আপনার Google Sheet এর Apps Script এ পেস্ট করুন
                  </p>
                </div>

                <button
                  onClick={handleCopyCode}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#1877f2] hover:bg-blue-600 text-white'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>কোড কপি করুন (Code.gs)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code display block */}
              <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-[#0d1117]">
                <div className="px-4 py-2 bg-[#161b22] border-b border-gray-800 flex items-center justify-between text-xs text-gray-400">
                  <span className="font-mono">Code.gs</span>
                  <span className="text-[11px]">JavaScript (Apps Script)</span>
                </div>
                <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[380px] leading-relaxed select-all">
                  {CODE_GS_SCRIPT}
                </pre>
              </div>
            </div>
          )}

          {/* 3. User Management */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  নিবন্ধিত ব্যবহারকারী ও পারমিশন কন্ট্রোল
                </h3>
                <span className="text-xs text-gray-500">মোট {users.length} জন ইউজার</span>
              </div>

              <div className="overflow-x-auto border border-gray-200 dark:border-[#393a3b] rounded-2xl">
                <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
                  <thead className="bg-gray-50 dark:bg-[#1a1b1c] border-b border-gray-200 dark:border-[#393a3b] text-gray-900 dark:text-white">
                    <tr>
                      <th className="p-3">ব্যবহারকারী</th>
                      <th className="p-3">ইউজারনেম</th>
                      <th className="p-3">রোল</th>
                      <th className="p-3">যোগদান</th>
                      <th className="p-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#393a3b]">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-[#3a3b3c]/50">
                        <td className="p-3 flex items-center gap-2.5">
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white block">{user.name}</span>
                            <span className="text-[10px] text-gray-500">{user.email}</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-[11px]">@{user.username}</td>
                        <td className="p-3">
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                            className="bg-gray-100 dark:bg-[#3a3b3c] border border-gray-300 dark:border-gray-600 rounded-lg p-1 text-[11px] font-bold text-gray-800 dark:text-gray-200"
                            disabled={user.id === currentUser.id}
                          >
                            <option value="user">ইউজার (User)</option>
                            <option value="moderator">মডারেটর (Moderator)</option>
                            <option value="admin">এডমিন (Admin)</option>
                          </select>
                        </td>
                        <td className="p-3 text-gray-500">{user.joinedDate}</td>
                        <td className="p-3 text-right">
                          {user.id !== currentUser.id && (
                            <button
                              onClick={() => {
                                if (confirm(`আপনি কি নিশ্চিতভাবে ${user.name} কে রিমুভ করতে চান?`)) {
                                  deleteUser(user.id);
                                }
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                              title="ইউজার রিমুভ করুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Branding & App Icon Updates */}
          {activeTab === 'branding' && (
            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl mx-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  অ্যাপের নাম (App Name)
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  অ্যাপ আইকন (Icon URL)
                </label>
                <input
                  type="url"
                  placeholder="https://... (ছবির সরাসরি লিংক)"
                  value={appIcon}
                  onChange={(e) => setAppIcon(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-hidden"
                />
              </div>

              {/* Icon Preview */}
              <div className="p-4 bg-gray-50 dark:bg-[#1a1b1c] rounded-2xl flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1877f2] to-blue-700 flex items-center justify-center text-white font-black text-2xl shadow-md overflow-hidden ring-2 ring-blue-400">
                  {appIcon ? (
                    <img src={appIcon} alt="App Icon" className="w-full h-full object-cover" />
                  ) : (
                    appName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">{appName}</h4>
                  <p className="text-xs text-gray-500">আইকন ও ব্র্যান্ডিং প্রিভিউ</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1877f2] hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>ব্র্যান্ডিং আপডেট করুন</span>
              </button>
            </form>
          )}

          {/* 5. Security & Password Change */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-[#1877f2] font-bold text-sm">
                  <Shield className="w-4 h-4" />
                  <span>এডমিন পাসওয়ার্ড পরিবর্তন ও সুরক্ষা</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  এডমিন প্যানেলে শুধুমাত্র অনুমোদিত ব্যক্তি প্রবেশ নিশ্চিত করতে শক্তিশালী পাসওয়ার্ড সেট করুন। বর্তমান ডিফল্ট পাসওয়ার্ড: <span className="font-mono font-bold text-gray-900 dark:text-white">180665</span>
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-gray-500" />
                    <span>বর্তমান পাসওয়ার্ড (Current Password) *</span>
                  </label>
                  <input
                    type="password"
                    placeholder="বর্তমান পাসওয়ার্ড লিখুন..."
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-hidden focus:border-[#1877f2] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-[#1877f2]" />
                      <span>নতুন পাসওয়ার্ড (New Password) *</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-[11px] text-[#1877f2] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showNewPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}</span>
                    </button>
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="নতুন শক্তিশালী পাসওয়ার্ড দিন..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-hidden focus:border-[#1877f2] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm New Password) *</span>
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="আবার নতুন পাসওয়ার্ড লিখুন..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-hidden focus:border-[#1877f2] font-mono"
                  />
                </div>

                {passwordChangeStatus && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    passwordChangeStatus.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                  }`}>
                    {passwordChangeStatus.success ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{passwordChangeStatus.message}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#1877f2] hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>পাসওয়ার্ড আপডেট করুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToDefaultPassword}
                    className="px-4 py-3 bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-[#4e4f50] text-gray-700 dark:text-gray-300 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>ডিফল্ট পাসওয়ার্ড (180665) রিসেট</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
