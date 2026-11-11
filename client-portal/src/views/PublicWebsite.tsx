import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PublicTab, Property } from '../../types';
import { PublicHeader } from '../../components/public/PublicHeader';
import { PublicBottomNav } from '../../components/public/PublicBottomNav';
import { PublicQuickActions } from '../../components/public/PublicQuickActions';
import { PublicHome } from './PublicHome';
import { PublicProjects } from './PublicProjects';
import { PublicSaved } from './PublicSaved';
import { PublicContact } from './PublicContact';
import { FreeConsultationModal } from '../../components/public/FreeConsultationModal';
import { FreeCabModal } from '../../components/public/FreeCabModal';
import { DroneVideoModal } from '../../components/public/DroneVideoModal';

export const PublicWebsite: React.FC = () => {
  const {
    savedPlotIds,
    publicTab,
    setPublicTab,
  } = useApp();

  // Active Project being viewed in full screen inside the Projects tab (null = catalog list)
  const [activeViewingProjectId, setActiveViewingProjectId] = useState<string | null>(null);

  // Navigation History Stack: tracks visited states for [←] back button
  const [navHistory, setNavHistory] = useState<Array<{ tab: PublicTab; projectId?: string | null }>>([
    { tab: publicTab || 'home', projectId: null },
  ]);

  // Modals state
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isCabBookingOpen, setIsCabBookingOpen] = useState(false);
  const [isDroneVideoOpen, setIsDroneVideoOpen] = useState(false);
  const [prefillPlot, setPrefillPlot] = useState<Property | null>(null);
  const [prefillPlotNumbers, setPrefillPlotNumbers] = useState<string | undefined>(undefined);

  const navigateTo = (tab: PublicTab, projectId: string | null = null) => {
    setNavHistory((prev) => {
      const top = prev[prev.length - 1];
      if (top && top.tab === tab && top.projectId === projectId) {
        return prev;
      }
      return [...prev, { tab, projectId }];
    });
    setPublicTab(tab);
    setActiveViewingProjectId(projectId);

    // Push browser history state for hardware/browser back buttons
    try {
      window.history.pushState({ tab, projectId }, '');
    } catch {
      // Ignore in non-browser or sandbox environments
    }
  };

  const handleBackNavigation = () => {
    // 1. Close any open modal first
    if (isConsultationOpen) {
      setIsConsultationOpen(false);
      return;
    }
    if (isCabBookingOpen) {
      setIsCabBookingOpen(false);
      return;
    }
    if (isDroneVideoOpen) {
      setIsDroneVideoOpen(false);
      return;
    }

    // 2. If viewing a specific project detail, back takes them to the catalog or previous tab
    if (activeViewingProjectId) {
      if (navHistory.length > 1) {
        const next = [...navHistory];
        next.pop(); // remove current project view
        const target = next[next.length - 1];
        setNavHistory(next);
        setPublicTab(target.tab);
        setActiveViewingProjectId(target.projectId || null);
      } else {
        setActiveViewingProjectId(null);
      }
      return;
    }

    // 3. If in catalog, saved, or contact, pop to previous tab
    if (navHistory.length > 1) {
      const next = [...navHistory];
      next.pop(); // remove current tab
      const target = next[next.length - 1];
      setNavHistory(next);
      setPublicTab(target.tab);
      setActiveViewingProjectId(target.projectId || null);
    } else {
      if (publicTab !== 'home') {
        setPublicTab('home');
        setActiveViewingProjectId(null);
        setNavHistory([{ tab: 'home', projectId: null }]);
      }
    }
  };

  useEffect(() => {
    // Initialize initial browser history state once
    try {
      window.history.replaceState({ tab: 'home', projectId: null }, '');
    } catch {
      // ignore
    }

    const handlePopState = (e: PopStateEvent) => {
      if (isConsultationOpen || isCabBookingOpen || isDroneVideoOpen) {
        setIsConsultationOpen(false);
        setIsCabBookingOpen(false);
        setIsDroneVideoOpen(false);
        return;
      }

      if (e.state && e.state.tab) {
        setPublicTab(e.state.tab);
        setActiveViewingProjectId(e.state.projectId || null);
        setNavHistory((prev) => {
          if (prev.length > 1) {
            return prev.slice(0, prev.length - 1);
          }
          return [{ tab: e.state.tab, projectId: e.state.projectId || null }];
        });
      } else {
        setPublicTab('home');
        setActiveViewingProjectId(null);
        setNavHistory([{ tab: 'home', projectId: null }]);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isConsultationOpen, isCabBookingOpen, isDroneVideoOpen, setPublicTab]);

  const openConsultation = (plot?: Property) => {
    setPrefillPlot(plot || null);
    setIsConsultationOpen(true);
  };

  const openCabBooking = (plot?: Property, plotNumbersStr?: string) => {
    setPrefillPlot(plot || null);
    setPrefillPlotNumbers(plotNumbersStr);
    setIsCabBookingOpen(true);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white text-[#17251E] min-w-0 box-border">
      {/* ─────────────────────────────────────────────────────────────
          1. PUBLIC HEADER (Deep Forest Green #113B24)
          ───────────────────────────────────────────────────────────── */}
      <PublicHeader
        activeTab={publicTab}
        onTabChange={(tab) => navigateTo(tab, null)}
        savedCount={savedPlotIds.length}
        onOpenConsultation={() => openConsultation()}
      />

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN TAB CONTENT WITH SAFE BOTTOM CLEARANCE
          ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 w-full pb-20 md:pb-0">
        {publicTab === 'home' && (
          <PublicHome
            onTabChange={(tab) => navigateTo(tab, null)}
            onOpenConsultation={openConsultation}
            onOpenCabBooking={openCabBooking}
            onOpenDroneVideo={() => setIsDroneVideoOpen(true)}
          />
        )}

        {publicTab === 'projects' && (
          <PublicProjects
            activeProjectId={activeViewingProjectId}
            onActiveProjectChange={(id) => {
              if (id) {
                navigateTo('projects', id);
              } else {
                setActiveViewingProjectId(null);
              }
            }}
            onBack={handleBackNavigation}
            onTabChange={(tab) => navigateTo(tab, null)}
            onOpenConsultation={openConsultation}
            onOpenCabBooking={openCabBooking}
          />
        )}

        {publicTab === 'saved' && (
          <PublicSaved
            onTabChange={(tab) => navigateTo(tab, null)}
            onOpenConsultation={openConsultation}
            onOpenCabBooking={openCabBooking}
            onInspectPlotInProject={(plot) => navigateTo('projects', plot.projectId)}
            onBack={handleBackNavigation}
          />
        )}

        {publicTab === 'contact' && (
          <PublicContact
            onTabChange={(tab) => navigateTo(tab, null)}
            onOpenConsultation={openConsultation}
            onOpenCabBooking={openCabBooking}
            onBack={handleBackNavigation}
          />
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. PERSISTENT QUICK ACTIONS & BOT CLUSTER
          ───────────────────────────────────────────────────────────── */}
      <PublicQuickActions
        onOpenConsultation={() => openConsultation()}
        onOpenCabBooking={() => openCabBooking()}
        onNavigateToProjects={() => navigateTo('projects', null)}
      />

      {/* ─────────────────────────────────────────────────────────────
          4. STICKY BOTTOM NAV (<768px Mobile Devices)
          ───────────────────────────────────────────────────────────── */}
      <PublicBottomNav
        activeTab={publicTab}
        onTabChange={(tab) => navigateTo(tab, null)}
        savedCount={savedPlotIds.length}
      />

      {/* ─────────────────────────────────────────────────────────────
          5. GLOBAL PUBLIC MODALS
          ───────────────────────────────────────────────────────────── */}
      <FreeConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        prefillPlot={prefillPlot}
      />

      <FreeCabModal
        isOpen={isCabBookingOpen}
        onClose={() => setIsCabBookingOpen(false)}
        prefillPlot={prefillPlot}
        prefillPlotNumbers={prefillPlotNumbers}
      />

      <DroneVideoModal
        isOpen={isDroneVideoOpen}
        onClose={() => setIsDroneVideoOpen(false)}
      />
    </div>
  );
};
