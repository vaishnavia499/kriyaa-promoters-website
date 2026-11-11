import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { PublicTab, Property } from '../../types';
import { PublicHeader } from '../../components/public/PublicHeader';
import { PublicBottomNav } from '../../components/public/PublicBottomNav';
import { PublicQuickActions } from '../../components/public/PublicQuickActions';
import { PublicHome } from './PublicHome';
import { PublicProjects } from './PublicProjects';
import { PublicProcess } from './PublicProcess';
import { PublicSaved } from './PublicSaved';
import { PublicContact } from './PublicContact';
import { FreeConsultationModal } from '../../components/public/FreeConsultationModal';
import { FreeCabModal } from '../../components/public/FreeCabModal';
import { DroneVideoModal } from '../../components/public/DroneVideoModal';

// Helper to map tab & project to a clean URL hash
const getHashForState = (tab: PublicTab, projectId: string | null): string => {
  if (tab === 'projects') {
    return projectId ? `#project-${projectId}` : '#projects';
  }
  if (tab === 'process') return '#process';
  if (tab === 'saved') return '#saved';
  if (tab === 'contact') return '#contact';
  return '#home';
};

// Helper to parse state from URL hash or popstate event
const parseHash = (hashStr?: string, state?: any): { tab: PublicTab; projectId: string | null } => {
  if (state && state.tab) {
    return { tab: state.tab, projectId: state.projectId || null };
  }
  const h = (hashStr !== undefined ? hashStr : (typeof window !== 'undefined' ? window.location.hash : '')).replace(/^#\/?/, '').trim();
  if (!h || h === 'home') {
    return { tab: 'home', projectId: null };
  }
  if (h === 'projects') {
    return { tab: 'projects', projectId: null };
  }
  if (h.startsWith('project-') || h.startsWith('projects/')) {
    const id = h.replace(/^(project-|projects\/)/, '').trim();
    return { tab: 'projects', projectId: id || null };
  }
  if (h === 'process' || h === 'buying-process') {
    return { tab: 'process', projectId: null };
  }
  if (h === 'saved' || h === 'my-plots') {
    return { tab: 'saved', projectId: null };
  }
  if (h === 'contact') {
    return { tab: 'contact', projectId: null };
  }
  return { tab: 'home', projectId: null };
};

export const PublicWebsite: React.FC = () => {
  const {
    savedPlotIds,
    publicTab,
    setPublicTab,
  } = useApp();

  // Active Project being viewed in full screen inside the Projects tab (null = catalog list)
  const [activeViewingProjectId, setActiveViewingProjectId] = useState<string | null>(null);

  // Modals state
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isCabBookingOpen, setIsCabBookingOpen] = useState(false);
  const [isDroneVideoOpen, setIsDroneVideoOpen] = useState(false);
  const [prefillPlot, setPrefillPlot] = useState<Property | null>(null);
  const [prefillPlotNumbers, setPrefillPlotNumbers] = useState<string | undefined>(undefined);

  // Unified navigation helper that updates React state and pushes a new browser history entry
  const navigateTo = useCallback((tab: PublicTab, projectId: string | null = null) => {
    setPublicTab(tab);
    setActiveViewingProjectId(projectId);

    if (typeof window !== 'undefined') {
      const newHash = getHashForState(tab, projectId);
      if (window.location.hash !== newHash) {
        try {
          window.history.pushState({ tab, projectId }, '', newHash);
        } catch {
          window.location.hash = newHash;
        }
      }
    }
  }, [setPublicTab]);

  // Initial mount: inspect initial URL hash and synchronize browser history
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const initial = parseHash();
    if (initial.tab !== publicTab || initial.projectId !== activeViewingProjectId) {
      setPublicTab(initial.tab);
      setActiveViewingProjectId(initial.projectId);
    }
    const initialHash = getHashForState(initial.tab, initial.projectId);
    try {
      window.history.replaceState({ tab: initial.tab, projectId: initial.projectId }, '', initialHash);
    } catch {
      // ignore
    }
  }, []);

  // Listen for native browser/hardware back button events (mobile gestures, Android back, laptop back)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = (e: PopStateEvent) => {
      // If a modal was open, close it first
      if (isConsultationOpen || isCabBookingOpen || isDroneVideoOpen) {
        setIsConsultationOpen(false);
        setIsCabBookingOpen(false);
        setIsDroneVideoOpen(false);
        return;
      }

      // Parse the new target tab & project from the popped history state or URL hash
      const parsed = parseHash(window.location.hash, e.state);
      setPublicTab(parsed.tab);
      setActiveViewingProjectId(parsed.projectId);
    };

    const handleHashChange = () => {
      if (isConsultationOpen || isCabBookingOpen || isDroneVideoOpen) {
        setIsConsultationOpen(false);
        setIsCabBookingOpen(false);
        setIsDroneVideoOpen(false);
        return;
      }
      const parsed = parseHash(window.location.hash);
      setPublicTab(parsed.tab);
      setActiveViewingProjectId(parsed.projectId);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
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
                navigateTo('projects', null);
              }
            }}
            onTabChange={(tab) => navigateTo(tab, null)}
            onOpenConsultation={openConsultation}
            onOpenCabBooking={openCabBooking}
          />
        )}

        {publicTab === 'process' && (
          <PublicProcess
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
          />
        )}

        {publicTab === 'contact' && (
          <PublicContact
            onTabChange={(tab) => navigateTo(tab, null)}
            onOpenConsultation={openConsultation}
            onOpenCabBooking={openCabBooking}
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
