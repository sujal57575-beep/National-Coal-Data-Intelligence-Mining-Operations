'use client';

import React, { useState } from 'react';
import { 
  Landmark, 
  ShieldCheck, 
  Lock, 
  Bell, 
  User as UserIcon, 
  Search,
  Zap,
  LogOut,
  ChevronDown,
  UserPlus,
  LogIn,
  Globe,
  Signal,
  Fingerprint
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
    <header className="sticky top-0 z-40">
      {/* Top Govt Bar - Sleek Dark Gradient */}
      <div className="bg-dark-mesh text-slate-300 text-xs px-6 py-2 flex justify-between items-center tracking-wide border-b border-slate-800/50">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Landmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-amber-400 tracking-wider text-[11px]">GOVERNMENT OF INDIA</span>
          </div>
          <span className="text-slate-600">•</span>
          <span className="text-slate-200 font-medium text-[11px]">MINISTRY OF COAL</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 font-medium text-[11px]">COAL INDIA LIMITED (CIL)</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[10px] tracking-wide">RANCHI AI CLUSTER: ACTIVE</span>
          </div>
          <span className="text-slate-700">|</span>
          {/* On-Premise Privacy Shield Badge */}
          <div className="flex items-center space-x-1.5 bg-amber-950/40 border border-amber-700/40 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] font-mono font-bold text-amber-300 tracking-wide">ON-PREM • NO CLOUD</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center space-x-1 text-slate-400">
            <Fingerprint className="w-3 h-3 text-violet-400" />
            <span className="text-[10px] font-mono">RBAC L4 • CLASSIFIED</span>
          </div>
        </div>
      </div>

      {/* Main Header - Glassmorphism */}
      <div className="glass border-b border-slate-200/50 px-6 py-3 flex items-center justify-between">
        {/* Brand & Title */}
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/30 text-white animate-tilt-card">
            <Landmark className="w-5 h-5 text-white drop-shadow-sm" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
                CMPDI / CIL <span className="gradient-text">AI Data Intelligence</span>
              </h1>
              <span className="bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-sm">
                v2.4 Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Geological, Exploration, Extraction & Production Intelligence System
            </p>
          </div>
        </div>

        {/* Global Action & Status Badges */}
        <div className="flex items-center space-x-3">
          {/* Quick AI Search Trigger */}
          <button
            onClick={() => setActiveTab('search')}
            className="hidden md:flex items-center space-x-2 glass-card text-slate-500 text-xs px-4 py-2 rounded-xl hover:shadow-md transition-all group"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            <span className="group-hover:text-slate-700 transition-colors">Search coalfields, reserves...</span>
            <kbd className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-400 border border-slate-200 font-mono shadow-xs">
              /
            </kbd>
          </button>

          {/* AI Status Badge */}
          <button 
            onClick={() => setActiveTab('ai_assistant')}
            className="flex items-center space-x-2 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200/80 text-violet-700 px-3 py-1.5 rounded-xl text-xs font-semibold hover:border-violet-300 hover:shadow-md transition-all card-lift"
          >
            <Zap className="w-3.5 h-3.5 text-violet-500 animate-pulse" />
            <span>AI Copilot</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
          </button>

          {/* Notification Indicator */}
          <div className="relative">
            <button 
              onClick={() => setActiveTab('parliamentary')}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 glass-card hover:shadow-md transition-all"
              title="Parliamentary Queries & Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white shadow-sm"></span>
            </button>
          </div>

          <div className="h-7 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent"></div>

          {/* User Profile / Auth Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 pl-1 text-left hover:bg-slate-50/80 p-1.5 rounded-xl border border-transparent hover:border-slate-200/60 transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-xs ring-2 ring-emerald-200 shadow-md shadow-emerald-500/10">
                  {initials}
                </div>
                <div className="hidden lg:block">
                  <div className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                    <span>{currentUser.full_name}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium flex items-center space-x-1 mt-0.5">
                    <span className="bg-emerald-100 text-emerald-700 px-1.5 py-px rounded font-mono text-[9px] font-bold">
                      {currentUser.role}
                    </span>
                    <span>• {currentUser.department}</span>
                  </div>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 glass-card rounded-2xl shadow-2xl py-2 z-50 text-xs animate-scale-in">
                  <div className="px-4 py-3 border-b border-slate-100/80">
                    <div className="font-bold text-slate-900">{currentUser.full_name}</div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{currentUser.email}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                      {currentUser.organization}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenAuthModal();
                      }}
                      className="w-full px-4 py-2.5 text-left text-slate-700 hover:bg-emerald-50/60 flex items-center space-x-2 font-medium transition-colors"
                    >
                      <UserPlus className="w-4 h-4 text-emerald-600" />
                      <span>Switch Profile / Register</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2.5 text-left text-rose-700 hover:bg-rose-50 flex items-center space-x-2 font-medium border-t border-slate-100/60 transition-colors"
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
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition-all card-lift"
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
