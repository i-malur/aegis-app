import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { EmergencyModal } from './components/EmergencyModal';
import { DashboardView } from './components/DashboardView';
import { LiaAiChatView } from './components/LiaAiChatView';
import { ScannerCentralView } from './components/ScannerCentralView';
import { CallBlockerView } from './components/CallBlockerView';
import { ScamMapNewsView } from './components/ScamMapNewsView';
import { ScamAlertsAndArticlesView } from './components/ScamAlertsAndArticlesView';
import { LeakRadarView } from './components/LeakRadarView';
import { DigitalVaultView } from './components/DigitalVaultView';
import { CommunityReportsView } from './components/CommunityReportsView';
import { PostScamCareView } from './components/PostScamCareView';
import { GlossaryView } from './components/GlossaryView';
import { AnonymousFeedView } from './components/AnonymousFeedView';
import { UserProfileView } from './components/UserProfileView';
import { MySubmissionsView } from './components/MySubmissionsView';
import { AuthScreen } from './components/AuthScreen';
import { ActiveTab } from './types';
import { useAuth } from './context/AuthContext';
import { AEGIS_LOGO_IMG } from './assets/branding';
import { Shield } from 'lucide-react';

export default function App() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [initialScanText, setInitialScanText] = useState<string>('');
  const [initialLiaPrompt, setInitialLiaPrompt] = useState<string>('');
  const [reportPrefillData, setReportPrefillData] = useState<any>(null);

  const handleStartScan = (text: string) => {
    setInitialScanText(text);
    setActiveTab('scanner');
  };

  const handleConsultLia = (prompt?: string) => {
    if (prompt) {
      setInitialLiaPrompt(prompt);
    }
    setActiveTab('lia-ai');
  };

  const handleReportFraud = (reportData: any) => {
    setReportPrefillData(reportData);
    setActiveTab('community-reports');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0f1015] text-white">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#dfcf93]/40 p-1 shadow-2xl bg-[#14151a]">
            <img
              src={AEGIS_LOGO_IMG}
              alt="Aegis Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex items-center gap-2 text-[#70f3ff] text-sm font-heading font-bold">
            <Shield className="w-4 h-4 animate-spin" />
            <span>Iniciando ambiente seguro Aegis...</span>
          </div>
        </div>
      </div>
    );
  }

  // Authentication Gate: if user is not authenticated, show AuthScreen
  if (!isAuthenticated || !user) {
    return <AuthScreen />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#14151a] font-sans text-[#d2d2d2] selection:bg-[#3a6ea5] selection:text-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 h-full bg-[#1b1d23] shadow-2xl border-r border-[#323744]">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onCloseMobile={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main View Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSOS={() => setIsSOSOpen(true)}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Content Section (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#14151a]">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                setActiveTab={setActiveTab}
                onQuickScan={handleStartScan}
                onOpenSOS={() => setIsSOSOpen(true)}
              />
            )}

            {activeTab === 'lia-ai' && (
              <LiaAiChatView
                onOpenSOS={() => setIsSOSOpen(true)}
                initialQuery={initialLiaPrompt}
              />
            )}

            {activeTab === 'scanner' && (
              <ScannerCentralView
                initialScanText={initialScanText}
                onOpenSOS={() => setIsSOSOpen(true)}
                onReportFraud={handleReportFraud}
              />
            )}

            {activeTab === 'scam-alerts' && (
              <ScamAlertsAndArticlesView
                onOpenSOS={() => setIsSOSOpen(true)}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'call-blocker' && (
              <CallBlockerView onOpenSOS={() => setIsSOSOpen(true)} />
            )}

            {activeTab === 'scam-map' && <ScamMapNewsView />}

            {activeTab === 'leak-radar' && <LeakRadarView />}

            {activeTab === 'digital-vault' && <DigitalVaultView />}

            {activeTab === 'feed' && (
              <AnonymousFeedView
                onNavigateToProfile={() => setActiveTab('user-profile')}
              />
            )}

            {activeTab === 'user-profile' && (
              <UserProfileView
                onNavigateToSubmissions={() => setActiveTab('my-submissions')}
                onNavigateToFeed={() => setActiveTab('feed')}
              />
            )}

            {activeTab === 'my-submissions' && (
              <MySubmissionsView
                onBackToProfile={() => setActiveTab('user-profile')}
                onNavigateToNewReport={() => setActiveTab('community-reports')}
                onNavigateToNewAlert={() => setActiveTab('scam-alerts')}
              />
            )}

            {activeTab === 'community-reports' && (
              <CommunityReportsView initialReportData={reportPrefillData} />
            )}

            {activeTab === 'post-scam-care' && (
              <PostScamCareView
                onOpenLia={() => setActiveTab('lia-ai')}
                onOpenSOS={() => setIsSOSOpen(true)}
              />
            )}

            {activeTab === 'glossary' && (
              <GlossaryView
                setActiveTab={setActiveTab}
                onAskLia={handleConsultLia}
              />
            )}
          </div>
        </main>
      </div>

      {/* Emergency SOS Modal */}
      <EmergencyModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        onOpenCare={() => {
          setIsSOSOpen(false);
          setActiveTab('post-scam-care');
        }}
        onOpenChat={() => {
          setIsSOSOpen(false);
          setActiveTab('lia-ai');
        }}
      />
    </div>
  );
}

