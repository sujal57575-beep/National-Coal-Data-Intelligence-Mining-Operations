'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  Bell, 
  User as UserIcon, 
  Search,
  Sparkles,
  LogOut,
  ChevronDown,
  UserPlus,
  LogIn
} from 'lucide-react';
import { UserProfile } from '../services/api';

interface NavbarProps {
  onSearchClick?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchClick,
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuthModal,
  onLogout
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Derive initials
  const initials = currentUser
    ? currentUser.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'G';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Govt Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-6 py-1.5 flex justify-between items-center tracking-wide">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-amber-400">GOVERNMENT OF INDIA</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-200">MINISTRY OF COAL</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-medium">COAL INDIA LIMITED (CIL)</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[11px]">RANCHI CENTRAL AI CLUSTER: ACTIVE</span>
          </div>
          <span className="text-slate-500">|</span>
          <div className="flex items-center space-x-1 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px]">RBAC LEVEL 4 (CLASSIFIED MINING DATA)</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Brand & Title */}
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-sky-700 via-sky-800 to-slate-900 flex items-center justify-center shadow-md border border-sky-600/30 text-white">
            <Building2 className="w-6 h-6 text-sky-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                CMPDI / CIL AI Data Intelligence Platform
              </h1>
              <span className="bg-sky-100 text-sky-800 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-sky-200">
                v2.4 Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Automated Geological, Exploration, Extraction & Production Intelligence System
            </p>
          </div>
        </div>

        {/* Global Action & Status Badges */}
        <div className="flex items-center space-x-4">
          {/* Quick AI Search Trigger */}
          <button
            onClick={() => setActiveTab('search')}
            className="hidden md:flex items-center space-x-2 bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs px-3.5 py-2 rounded-lg border border-slate-300 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search coalfields, reserves, boreholes...</span>
            <kbd className="bg-white px-1.5 py-0.5 rounded text-[10px] text-slate-400 border border-slate-200 font-mono shadow-xs">
              /
            </kbd>
          </button>

          {/* AI Status Badge */}
          <button 
            onClick={() => setActiveTab('ai_assistant')}
            className="flex items-center space-x-2 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200/80 text-sky-800 px-3 py-1.5 rounded-lg text-xs font-medium hover:border-sky-300 transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-spin-slow" />
            <span>AI Copilot Ready</span>
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
          </button>

          {/* Notification Indicator */}
          <div className="relative">
            <button 
              onClick={() => setActiveTab('parliamentary')}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
              title="Parliamentary Queries & Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500"></span>
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200"></div>

          {/* User Profile / Auth Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 pl-1 text-left hover:bg-slate-50 p-1.5 rounded-xl border border-transparent hover:border-slate-200 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-sky-900 text-sky-100 flex items-center justify-center font-bold text-xs ring-2 ring-sky-200">
                  {initials}
                </div>
                <div className="hidden lg:block">
                  <div className="text-xs font-semibold text-slate-800 flex items-center space-x-1">
                    <span>{currentUser.full_name}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium flex items-center space-x-1">
                    <span className="bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-mono text-[9px] font-bold">
                      {currentUser.role}
                    </span>
                    <span>• {currentUser.department}</span>
                  </div>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="font-bold text-slate-900">{currentUser.full_name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                    <div className="text-[10px] text-sky-700 font-semibold mt-1">
                      {currentUser.organization}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenAuthModal();
                      }}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center space-x-2 font-medium"
                    >
                      <UserPlus className="w-4 h-4 text-sky-600" />
                      <span>Switch Profile / Register</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-rose-700 hover:bg-rose-50 flex items-center space-x-2 font-medium border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
