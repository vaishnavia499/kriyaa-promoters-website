import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  BookmarkCheck,
  Phone,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';
import { KriyaaLogo } from '../KriyaaLogo';
import { PublicTab } from '../../types';

interface PublicHeaderProps {
  activeTab: PublicTab;
  onTabChange: (tab: PublicTab) => void;
  savedCount: number;
  onOpenConsultation?: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  activeTab,
  onTabChange,
  savedCount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks: { id: PublicTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projects & Master Plan' },
    { id: 'saved', label: 'My Plots' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleTabClick = (tab: PublicTab) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          STICKY HEADER: Stays fixed at the top on scroll
          Deep Forest Green (#113B24) with Gold accent border
          ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-[#113B24] border-b border-[#1E5D32] text-white shadow-lg select-none">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-3">
          {/* ─────────────────────────────────────────────────────────────
              LEFT BRAND IDENTITY:
              Circular Logo Frame + "KRIYAA PROMOTERS" + Gold Tagline
              ───────────────────────────────────────────────────────────── */}
          <div
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0"
          >
            {/* Circle Framed Logo: clean white background, gold border, sharp display */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-[#EAB308] p-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden shrink-0">
              <KriyaaLogo className="w-full h-full object-contain" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs sm:text-base font-black tracking-wider text-white uppercase truncate">
                  KRIYAA PROMOTERS
                </span>
                <span className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#15803D] text-emerald-100 border border-emerald-500/30">
                  DTCP
                </span>
              </div>
              <span className="text-[10px] sm:text-xs italic font-bold text-[#EAB308] tracking-wide truncate">
                Your dream, our priority
              </span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              DESKTOP RIGHT CLUSTER: NAVIGATION LINKS + CALL NOW
              ───────────────────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
            <nav className="flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleTabClick(link.id)}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs lg:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
                      isActive
                        ? 'bg-[#15803D] text-white shadow-sm'
                        : 'text-emerald-100/80 hover:text-white hover:bg-[#164329]'
                    }`}
                  >
                    {link.id === 'saved' && (
                      <div className="relative">
                        <BookmarkCheck
                          className={`w-4 h-4 ${
                            savedCount > 0 ? 'text-[#EAB308]' : 'text-emerald-200'
                          }`}
                        />
                        {savedCount > 0 && (
                          <span className="absolute -top-1.5 -right-2 bg-[#991B1B] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white/40 shadow-xs">
                            {savedCount}
                          </span>
                        )}
                      </div>
                    )}
                    <span>
                      {link.id === 'saved' && savedCount > 0 ? `My Plots (${savedCount})` : link.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="publicNavActive"
                        className="absolute bottom-1 left-3 right-3 h-0.5 bg-[#EAB308] rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Desktop Call Now Button on Right Corner Near Menu */}
            <a
              href="tel:+919443278899"
              className="min-h-[42px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#EAB308] to-[#CA8A04] hover:brightness-110 text-slate-950 text-xs sm:text-sm font-black flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer shrink-0"
              title="Call Rajesh RTR: +91 94432 78899"
            >
              <Phone className="w-4 h-4 fill-current text-slate-950" />
              <span>Call Now</span>
            </a>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              MOBILE RIGHT CLUSTER: CALL NOW BUTTON + HAMBURGER MENU (<768px)
              Properly visible, balanced, non-cramped spacing
              ───────────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 md:hidden">
            {/* Call Now button on right corner near menu */}
            <a
              href="tel:+919443278899"
              className="h-9 px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#EAB308] to-[#CA8A04] hover:brightness-110 active:scale-95 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
              title="Call Rajesh RTR: +91 94432 78899"
            >
              <Phone className="w-3.5 h-3.5 fill-current text-slate-950" />
              <span>Call Now</span>
            </a>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Toggle Navigation Drawer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE SLIDE-OVER DRAWER
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-xs"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              className="fixed top-0 right-0 bottom-0 w-[82vw] max-w-sm bg-[#113B24] border-l border-[#1E5D32] z-50 md:hidden flex flex-col justify-between p-6 text-white shadow-2xl"
            >
              <div className="space-y-6">
                {/* Drawer Header with Circle Framed Logo */}
                <div className="flex items-center justify-between pb-4 border-b border-[#1E5D32]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-[#EAB308] p-1 flex items-center justify-center overflow-hidden shrink-0">
                      <KriyaaLogo className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">KRIYAA PROMOTERS</h4>
                      <p className="text-[10px] text-[#EAB308] font-bold">Managed by Rajesh RTR</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-200/60 block px-1">
                    Navigation Menu
                  </span>
                  {navLinks.map((link) => {
                    const isActive = activeTab === link.id;
                    return (
                      <button
                        key={link.id}
                        type="button"
                        onClick={() => handleTabClick(link.id)}
                        className={`w-full min-h-[46px] px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#15803D] text-white shadow-md border-l-4 border-[#EAB308]'
                            : 'text-emerald-100/90 hover:bg-[#164329]'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          {link.id === 'saved' && (
                            <BookmarkCheck
                              className={`w-4 h-4 ${
                                savedCount > 0 ? 'text-[#EAB308]' : ''
                              }`}
                            />
                          )}
                          <span>{link.label}</span>
                        </span>

                        {link.id === 'saved' && savedCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-[#991B1B] text-white text-xs font-black">
                            {savedCount}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Bottom: Direct Contact & Call Desk */}
              <div className="pt-6 border-t border-[#1E5D32] space-y-3">
                <div className="space-y-1 text-xs text-emerald-200/80">
                  <p className="font-bold text-white">Promoter Desk · Rajesh RTR</p>
                  <p className="text-[11px]">No. 7, Kamaraj Salai, Cuddalore</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+919443278899"
                    className="min-h-[44px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#EAB308] to-[#CA8A04] text-slate-950 text-xs font-black shadow-md hover:brightness-110"
                  >
                    <Phone className="w-3.5 h-3.5 fill-current" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href="https://wa.me/919443278899?text=Hello%20Rajesh%20RTR,%20I%20am%20interested%20in%20Kriyaa%20Promoters%20plots."
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[44px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20bd5a]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
