'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { DashboardTab } from '../components/DashboardTab';
import { DocumentsTab } from '../components/DocumentsTab';
import { ExtractionStudioTab } from '../components/ExtractionStudioTab';
import { AIAssistantTab } from '../components/AIAssistantTab';
import { SearchTab } from '../components/SearchTab';
import { ParliamentaryTab } from '../components/ParliamentaryTab';
import { ReportsTab } from '../components/ReportsTab';
import { AnalyticsTab } from '../components/AnalyticsTab';
import { AuditTab } from '../components/AuditTab';
import { GeoMapTab } from '../components/GeoMapTab';
import { AuthModal } from '../components/AuthModal';
import { getSavedUser, logoutUser, UserProfile } from '../services/api';
import { CheckCircle2, UserCheck, ShieldCheck, Fingerprint, X } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedDocId, setSelectedDocId] = useState<string>('doc-002');

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authBannerMsg, setAuthBannerMsg] = useState<string | null>(null);

  useEffect(() => {
    // Load persisted user or default to verified Super Admin
    const saved = getSavedUser();
    if (saved) {
      setCurrentUser(saved);
    } else {
      const defaultAdmin: UserProfile = {
        id: 'usr-admin',
        username: 'admin',
        full_name: 'Dr. Rajeshwar Sharma',
        email: 'admin@cmpdi.co.in',
        role: 'SUPER_ADMIN',
        department: 'Executive Directorate',
        organization: 'Coal India Limited / CMPDI',
        subsidiary_name: 'CMPDI Ranchi HQ',
        is_active: true
      };
      setCurrentUser(defaultAdmin);
    }
  }, []);

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setAuthBannerMsg(`Authenticated as ${user.full_name} (${user.role} • ${user.department})`);
    setTimeout(() => setAuthBannerMsg(null), 4500);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setAuthBannerMsg('You have successfully signed out of the secure node.');
    setTimeout(() => setAuthBannerMsg(null), 3500);
  };

  return (
    <div className="min-h-screen bg-mesh-gradient flex flex-col font-sans">
      {/* Top Navigation Bar with GOI & CMPDI branding */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSearchClick={() => setActiveTab('search')}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Auth Banner Notification */}
      {authBannerMsg && (
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-emerald-100 text-xs px-6 py-2.5 flex items-center justify-between border-b border-emerald-800/50 animate-slide-up">
          <div className="flex items-center space-x-2">
            <Fingerprint className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">{authBannerMsg}</span>
          </div>
          <button
            onClick={() => setAuthBannerMsg(null)}
            className="text-emerald-300 hover:text-white p-1 hover:bg-emerald-800 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Layout Shell */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingReviewsCount={3}
          starredQueriesCount={2}
        />

        {/* Central Content Canvas */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
          <div key={activeTab} className="animate-fade-in">
            {activeTab === 'dashboard' && (
              <DashboardTab onNavigateTab={(tab) => setActiveTab(tab)} />
            )}

            {activeTab === 'documents' && (
              <DocumentsTab
                onSelectDocumentForExtraction={(docId) => {
                  setSelectedDocId(docId);
                  setActiveTab('extraction');
                }}
              />
            )}

            {activeTab === 'extraction' && (
              <ExtractionStudioTab
                selectedDocId={selectedDocId}
                onSelectDocId={setSelectedDocId}
              />
            )}

            {activeTab === 'ai_assistant' && <AIAssistantTab />}

            {activeTab === 'search' && (
              <SearchTab
                onSelectDocForReview={(docId) => {
                  setSelectedDocId(docId);
                  setActiveTab('extraction');
                }}
              />
            )}

            {activeTab === 'parliamentary' && <ParliamentaryTab />}

            {activeTab === 'reports' && <ReportsTab />}

            {activeTab === 'analytics' && (
              <AnalyticsTab onSearchTopic={(term) => setActiveTab('search')} />
            )}

            {activeTab === 'audit' && <AuditTab />}

            {activeTab === 'geomap' && <GeoMapTab />}
          </div>
        </main>
      </div>

      {/* Interactive Login & Sign Up Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
