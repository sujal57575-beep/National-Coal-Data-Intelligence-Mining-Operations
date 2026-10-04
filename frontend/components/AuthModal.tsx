'use client';

import React, { useState } from 'react';
import {
  Lock,
  User as UserIcon,
  Mail,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { loginUser, signupUser, UserProfile } from '../services/api';
import { CIL_SUBSIDIARY_PRODUCTION } from '../services/realCoalData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Login form state
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('Admin@123');

  // Signup form state
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupSubsidiary, setSignupSubsidiary] = useState('sub-cmpdi');
  const [signupDepartment, setSignupDepartment] = useState('Geology & Exploration');
  const [signupRole, setSignupRole] = useState('ANALYST');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await loginUser({
        username: loginUsername.trim(),
        password: loginPassword
      });
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupUsername || !signupEmail || !signupPassword || !signupFullName) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await signupUser({
        username: signupUsername.trim(),
        email: signupEmail.trim(),
        full_name: signupFullName.trim(),
        password: signupPassword,
        subsidiary_id: signupSubsidiary,
        department: signupDepartment,
        role: signupRole
      });
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (uname: string, pwd: string = 'Admin@123') => {
    setLoginUsername(uname);
    setLoginPassword(pwd);
    setTimeout(async () => {
      setLoading(true);
      try {
        const res = await loginUser({ username: uname, password: pwd });
        onSuccess(res.user);
        onClose();
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-sky-950 to-slate-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg text-sm"
          >
            ✕
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                GOVERNMENT OF INDIA • MINISTRY OF COAL
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">
                CMPDI / CIL AI Data Intelligence Platform
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            Secure Role-Based Access Control (RBAC Level 4 Classified Node)
          </p>

          {/* Toggle Tabs */}
          <div className="flex bg-slate-900/80 p-1 rounded-xl mt-4 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('login'); setErrorMsg(null); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                activeTab === 'login'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In to Existing Account
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setErrorMsg(null); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                activeTab === 'signup'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create New Verified Profile
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Username or Officer ID
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="e.g. admin or mining_analyst"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter security password"
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Authenticating Officer...</span>
                ) : (
                  <>
                    <span>Verify Credentials & Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Profile Selection */}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Instant Demo Officer Sign-In:</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin')}
                    className="p-2 border border-slate-200 rounded-xl text-left hover:border-sky-400 hover:bg-sky-50/50 transition-all"
                  >
                    <div className="font-bold text-slate-800 text-[11px]">Dr. Rajeshwar Sharma</div>
                    <div className="text-[10px] text-sky-700 font-semibold">Super Admin • Ranchi HQ</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('mining_analyst')}
                    className="p-2 border border-slate-200 rounded-xl text-left hover:border-sky-400 hover:bg-sky-50/50 transition-all"
                  >
                    <div className="font-bold text-slate-800 text-[11px]">Pooja Banerjee</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Analyst • CCL Ranchi</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('doc_officer')}
                    className="p-2 border border-slate-200 rounded-xl text-left hover:border-sky-400 hover:bg-sky-50/50 transition-all"
                  >
                    <div className="font-bold text-slate-800 text-[11px]">Sanjay Verma</div>
                    <div className="text-[10px] text-indigo-700 font-semibold">Doc Officer • SECL</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('director_geology')}
                    className="p-2 border border-slate-200 rounded-xl text-left hover:border-sky-400 hover:bg-sky-50/50 transition-all"
                  >
                    <div className="font-bold text-slate-800 text-[11px]">Shri Amitabh Roy</div>
                    <div className="text-[10px] text-amber-700 font-semibold">Approver • MoC Advisor</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: SIGN UP */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Officer Full Name
                </label>
                <input
                  type="text"
                  required
                  value={signupFullName}
                  onChange={(e) => setSignupFullName(e.target.value)}
                  placeholder="e.g. Dr. Anil Kumar Verma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    placeholder="e.g. anil_verma"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="officer@cmpdi.co.in"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Create secure access key"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Subsidiary / Agency
                  </label>
                  <select
                    value={signupSubsidiary}
                    onChange={(e) => setSignupSubsidiary(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
                  >
                    <option value="sub-cmpdi">CMPDI Ranchi (HQ)</option>
                    <option value="sub-mcl">MCL (Mahanadi)</option>
                    <option value="sub-secl">SECL (Bilaspur)</option>
                    <option value="sub-ncl">NCL (Singrauli)</option>
                    <option value="sub-ccl">CCL (Ranchi)</option>
                    <option value="sub-bccl">BCCL (Dhanbad)</option>
                    <option value="sub-wcl">WCL (Nagpur)</option>
                    <option value="sub-ecl">ECL (Sanctoria)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Designated Role
                  </label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
                  >
                    <option value="ANALYST">ANALYST (Mining/Geology)</option>
                    <option value="REVIEWER">REVIEWER (Technical Audit)</option>
                    <option value="DOCUMENT_OFFICER">DOCUMENT_OFFICER</option>
                    <option value="APPROVER">APPROVER (Executive)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Department
                </label>
                <select
                  value={signupDepartment}
                  onChange={(e) => setSignupDepartment(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
                >
                  <option value="Geology & Exploration">Geology & Exploration</option>
                  <option value="Production & Planning">Production & Planning</option>
                  <option value="Mining Operations">Mining Operations</option>
                  <option value="Safety & DGMS Compliance">Safety & DGMS Compliance</option>
                  <option value="Documentation & Archives">Documentation & Archives</option>
                  <option value="Executive Directorate">Executive Directorate</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 mt-2"
              >
                {loading ? (
                  <span>Registering Profile...</span>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Create &amp; Authorize Account</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
