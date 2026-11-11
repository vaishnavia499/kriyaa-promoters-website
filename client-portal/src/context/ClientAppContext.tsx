import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Property, Lead, BusinessSettings, Project, PublicTab } from '../types';
import { INITIAL_PROPERTIES, INITIAL_SETTINGS, INITIAL_PROJECTS } from '../data/initialData';
import { supabase } from '../lib/supabase';
import {
  getSupabaseProjects,
  getSupabaseProperties,
  submitSupabaseLead,
  mapPropertyRow,
  mapProjectRow,
} from '../services/supabaseDataService';

export type { PublicTab };

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ClientAppContextType {
  publicTab: PublicTab;
  setPublicTab: (tab: PublicTab) => void;

  // Saved / Favourite Plots
  savedPlotIds: string[];
  toggleSavePlot: (plotId: string) => void;
  isPlotSaved: (plotId: string) => boolean;

  // Master Data
  projects: Project[];
  properties: Property[];
  settings: BusinessSettings;
  isLoading: boolean;
  refreshData: () => Promise<void>;

  // Customer Inquiries
  saveLead: (lead: Omit<Lead, 'id' | 'timestamp' | 'status'> & { id?: string }) => Promise<void>;

  // Toasts
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const STORAGE_KEYS = {
  SAVED_PLOTS: 'kriyaa_client_saved_plots_v1',
};

const ClientAppContext = createContext<ClientAppContextType | undefined>(undefined);

export const ClientAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publicTab, setPublicTab] = useState<PublicTab>('home');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Buyer Shortlisted Plots
  const [savedPlotIds, setSavedPlotIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_PLOTS);
      return saved ? JSON.parse(saved) : ['prop-1', 'prop-2'];
    } catch {
      return ['prop-1', 'prop-2'];
    }
  });

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (type === 'success') {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#10B981', '#EAB308', '#059669'],
        });
      } catch {
        // confetti fallback
      }
    }

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const toggleSavePlot = useCallback(
    (plotId: string) => {
      setSavedPlotIds((prev) => {
        const isAlreadySaved = prev.includes(plotId);
        const updated = isAlreadySaved ? prev.filter((id) => id !== plotId) : [...prev, plotId];

        try {
          localStorage.setItem(STORAGE_KEYS.SAVED_PLOTS, JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }

        showToast(
          isAlreadySaved ? 'Removed from My Plots' : 'Plot added to My Plots',
          isAlreadySaved ? 'info' : 'success'
        );
        return updated;
      });
    },
    [showToast]
  );

  const isPlotSaved = useCallback(
    (plotId: string) => savedPlotIds.includes(plotId),
    [savedPlotIds]
  );

  // Projects & Properties
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [settings] = useState<BusinessSettings>(INITIAL_SETTINGS);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedProjects, fetchedProperties] = await Promise.all([
        getSupabaseProjects(),
        getSupabaseProperties(),
      ]);

      if (fetchedProjects && fetchedProjects.length > 0) {
        setProjects(fetchedProjects);
      }
      if (fetchedProperties && fetchedProperties.length > 0) {
        setProperties(fetchedProperties);
      }
    } catch (err) {
      console.warn('[ClientAppContext] Supabase fetch fallback to defaults:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // ─────────────────────────────────────────────────────────────
  // SUPABASE REALTIME SUBSCRIPTION
  // Listens to properties table changes so any admin update reflects immediately
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const propertyChannel = supabase
      .channel('client-realtime-properties')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'properties' },
        (payload) => {
          console.log('[Supabase Realtime Sync] Property event:', payload.eventType, payload);

          if (payload.eventType === 'UPDATE' && payload.new) {
            const updated = mapPropertyRow(payload.new);
            setProperties((prev) =>
              prev.map((p) =>
                p.id === updated.id || (p.plotNumber === updated.plotNumber && p.projectId === updated.projectId)
                  ? { ...p, ...updated }
                  : p
              )
            );
          } else if (payload.eventType === 'INSERT' && payload.new) {
            const inserted = mapPropertyRow(payload.new);
            setProperties((prev) => [inserted, ...prev]);
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setProperties((prev) => prev.filter((p) => p.id !== String(payload.old.id)));
          }
        }
      )
      .subscribe();

    const projectChannel = supabase
      .channel('client-realtime-projects')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new) {
            const updated = mapProjectRow(payload.new);
            setProjects((prev) =>
              prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(propertyChannel);
      supabase.removeChannel(projectChannel);
    };
  }, []);

  // Customer Inquiries
  const saveLead = async (leadData: Omit<Lead, 'id' | 'timestamp' | 'status'> & { id?: string }) => {
    try {
      const result = await submitSupabaseLead(leadData);
      if (result.success) {
        showToast('Consultation request received! MD Rajesh RTR will call you.', 'success');
      } else {
        showToast('Request noted! Our team will contact you shortly.', 'success');
      }
    } catch {
      showToast('Request received! We will reach out to you shortly.', 'success');
    }
  };

  return (
    <ClientAppContext.Provider
      value={{
        publicTab,
        setPublicTab,
        savedPlotIds,
        toggleSavePlot,
        isPlotSaved,
        projects,
        properties,
        settings,
        isLoading,
        refreshData,
        saveLead,
        toasts,
        showToast,
      }}
    >
      {children}

      {/* Global Toast Overlay */}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-black flex items-center gap-2 pointer-events-auto transition-all ${
                toast.type === 'success'
                  ? 'bg-[#113B24] border-[#EAB308] text-white'
                  : toast.type === 'error'
                  ? 'bg-rose-950 border-rose-600 text-white'
                  : 'bg-slate-900 border-slate-700 text-white'
              }`}
            >
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      )}
    </ClientAppContext.Provider>
  );
};

export const useClientApp = () => {
  const context = useContext(ClientAppContext);
  if (!context) {
    throw new Error('useClientApp must be used within a ClientAppProvider');
  }
  return context;
};

// Aliased as useApp for drop-in component compatibility
export const useApp = useClientApp;
export const AppProvider = ClientAppProvider;

