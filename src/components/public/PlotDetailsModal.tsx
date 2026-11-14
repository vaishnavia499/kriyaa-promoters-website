import React, { useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Compass,
  Heart,
  ShieldCheck,
  Landmark,
  MessageCircle,
} from 'lucide-react';
import { Property, Project } from '../../types';

interface PlotDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  plot: Property | null;
  project: Project;
  isSaved: boolean;
  onToggleSave: (plotId: string) => void;
  onBookConsultation: (plot: Property) => void;
  onWhatsAppInquiry?: (plot: Property) => void;
}

export const PlotDetailsModal: React.FC<PlotDetailsModalProps> = ({
  isOpen,
  onClose,
  plot,
  project,
  isSaved,
  onToggleSave,
  onBookConsultation,
  onWhatsAppInquiry,
}) => {
  // ─────────────────────────────────────────────────────────────────
  // Accessibility: 'Esc' key to dismiss & Background scroll lock
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Prevent background scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // Parse dimensions for blueprint schematic (e.g. "35 x 43", "30x40 ft", "30 × 50")
  const { dimWidth, dimDepth, formattedDimensions } = useMemo(() => {
    const rawDim = (plot?.plotDimensions || '').replace(/ft/gi, '').trim();
    const parts = rawDim.split(/\s*(?:x|X|×|\*)\s*/);
    const w = parts[0] ? parts[0].trim() : '30';
    const d = parts[1] ? parts[1].trim() : (parts[0] ? parts[0].trim() : '40');
    return {
      dimWidth: w,
      dimDepth: d,
      formattedDimensions: `${w} × ${d}`,
    };
  }, [plot?.plotDimensions]);

  // Frontage road text for blueprint (e.g. "40' WIDE BLACKTOP MAIN RING ROAD FRONTAGE")
  const frontageText = useMemo(() => {
    const rw = (plot?.roadWidth || '40').replace(/ft|'/gi, '').trim();
    return `${rw || '40'}' WIDE BLACKTOP MAIN RING ROAD FRONTAGE`;
  }, [plot?.roadWidth]);

  // Status Badge Styling (Available: Emerald, Reserved: Amber, Sold: Red)
  let statusBadgeConfig = {
    label: 'Available',
    classes: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/40',
  };
  if (plot?.status === 'Reserved') {
    statusBadgeConfig = {
      label: 'On Hold / Reserved',
      classes: 'bg-amber-500/15 text-amber-700 border-amber-500/40',
    };
  } else if (plot?.status === 'Sold') {
    statusBadgeConfig = {
      label: 'Sold Out',
      classes: 'bg-red-500/15 text-red-700 border-red-500/40',
    };
  }

  // Estimated Monthly EMI (~8.5% p.a. for 20 years: ~₹790 per Lakh)
  const estimatedEmi = plot ? Math.round((plot.totalPrice / 100000) * 790) : 14200;

  // Road & Facing Tag
  const directionFacing = plot?.facing || 'East';
  const roadWidthStr = plot?.roadWidth || '40ft Main Road';

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && plot && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm select-none">
          {/* Backdrop tap to dismiss */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 cursor-pointer"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Dialog Card (Centered max-w-md on desktop, bottom-sheet on mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl p-5 sm:p-6 z-10 max-h-[92vh] overflow-y-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="plot-modal-heading"
          >
            {/* ─────────────────────────────────────────────────────────────
                1. TOP HEADER & ACCESSIBLE CLOSE (✕)
                ───────────────────────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                {/* Heading & Status Badge */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    id="plot-modal-heading"
                    className="text-xl sm:text-2xl font-black text-slate-900"
                  >
                    Plot #{plot.plotNumber}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${statusBadgeConfig.classes}`}
                  >
                    {statusBadgeConfig.label}
                  </span>
                </div>

                {/* Compass Direction Tag */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mt-1.5 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 w-fit">
                  <Compass className="w-3.5 h-3.5 text-[#CA8A04] shrink-0" />
                  <span>🧭 {directionFacing} Facing · {roadWidthStr}</span>
                </div>
              </div>

              {/* Top-Right Accessible Close Icon (44x44px Tap Target) */}
              <button
                type="button"
                onClick={onClose}
                className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-slate-200/80"
                title="Close (Esc)"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                2. CADASTRAL DIMENSION BLUEPRINT (Matches Reference Image 2)
                ───────────────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-3.5 sm:p-4 shadow-sm space-y-2.5">
              {/* Header: Title & Scale 1:200 Badge */}
              <div className="flex items-center justify-between gap-2 px-0.5">
                <span className="text-[11px] sm:text-xs font-black tracking-wider text-slate-800 uppercase font-serif">
                  Cadastral Dimension Blueprint
                </span>
                <span className="px-2.5 py-0.5 rounded-full border border-amber-300 text-amber-800 bg-amber-50/90 text-[10px] font-black tracking-wider uppercase shadow-2xs">
                  Scale 1:200
                </span>
              </div>

              {/* Visual Blueprint Schematic Box */}
              <div className="relative rounded-2xl border border-slate-200 bg-[#FAFCFA] p-3 sm:p-4 overflow-hidden flex flex-col items-center justify-center">
                {/* SVG Engineering Grid Background */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="cadastralGrid"
                      width="16"
                      height="16"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 16 0 L 0 0 0 16"
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth="0.8"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#cadastralGrid)" />
                </svg>

                {/* Compass North Arrow (Top Right) */}
                <div className="absolute top-2.5 right-3 flex flex-col items-center text-slate-700 pointer-events-none z-10 select-none">
                  <span className="text-xs leading-none">↑</span>
                  <span className="text-[10px] font-black leading-tight">N</span>
                </div>

                {/* Top Dimension Tag */}
                <div className="z-10 mb-2">
                  <span className="px-3 py-0.5 rounded-lg bg-white border border-slate-200 text-xs font-black text-slate-800 shadow-2xs inline-block">
                    {dimWidth} ft
                  </span>
                </div>

                {/* Center Plot Area flanked by Left & Right Dimension Tags */}
                <div className="w-full flex items-center justify-center gap-2 sm:gap-4 z-10 my-0.5">
                  {/* Left Dimension Tag */}
                  <span className="px-1.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-black text-slate-800 shadow-2xs [writing-mode:vertical-lr] rotate-180 inline-block shrink-0">
                    {dimDepth} ft
                  </span>

                  {/* Center Plot Box */}
                  <div className="flex-1 max-w-[260px] bg-white/95 rounded-2xl border-2 border-[#0B3B24] py-3.5 px-4 text-center shadow-xs">
                    <h4 className="text-base sm:text-lg font-black text-[#0B3B24] tracking-wider uppercase">
                      Plot #{plot.plotNumber}
                    </h4>
                    <p className="text-xs sm:text-sm font-black text-[#CA8A04] mt-0.5 tracking-wide uppercase">
                      {plot.areaSqFt?.toLocaleString('en-IN')} SQ.FT
                    </p>
                  </div>

                  {/* Right Dimension Tag */}
                  <span className="px-1.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-black text-slate-800 shadow-2xs [writing-mode:vertical-lr] rotate-180 inline-block shrink-0">
                    {dimDepth} ft
                  </span>
                </div>

                {/* Bottom Road Frontage Pill */}
                <div className="w-full max-w-sm py-1.5 px-3 rounded-xl bg-[#0B3B24] text-center shadow-xs z-10 mt-2.5">
                  <span className="text-[10px] sm:text-[11px] font-black tracking-wide text-[#EAB308] uppercase block truncate">
                    {frontageText}
                  </span>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                3. 4 PLOT SPECIFICATION METRIC CARDS (Matches Image 3)
                ───────────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* 1. Dimensions */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  DIMENSIONS
                </span>
                <span className="text-base sm:text-lg font-black text-slate-900 mt-1 block font-mono">
                  {formattedDimensions} ft
                </span>
                <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                  {plot.isCornerPlot ? 'Corner Parcel' : 'Standard Parcel'}
                </span>
              </div>

              {/* 2. Total Area */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  TOTAL AREA
                </span>
                <span className="text-base sm:text-lg font-black text-slate-900 mt-1 block">
                  {plot.areaSqFt?.toLocaleString('en-IN')} sq.ft
                </span>
                <span className="text-[11px] text-[#CA8A04] font-black block mt-0.5">
                  ({plot.areaCents} Cents)
                </span>
              </div>

              {/* 3. Price per Sq.Ft */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  PRICE PER SQ.FT
                </span>
                <span className="text-base sm:text-lg font-black text-slate-900 mt-1 block">
                  ₹{plot.pricePerSqFt?.toLocaleString('en-IN') || '1,000'} / sq.ft
                </span>
                <span className="text-[11px] text-[#15803D] font-bold block mt-0.5">
                  Govt Sanctioned
                </span>
              </div>

              {/* 4. Total Investment (Green highlight background & border - Image 3) */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-300/80 shadow-2xs flex flex-col justify-between">
                <span className="text-[10px] font-bold text-[#15803D] uppercase tracking-wider block">
                  TOTAL INVESTMENT
                </span>
                <span className="text-base sm:text-lg font-black text-[#0B3B24] mt-1 block">
                  ₹{plot.totalPrice?.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-700 font-bold block mt-0.5">
                  ₹{(plot.totalPrice / 100000).toFixed(2)} Lakhs
                </span>
              </div>
            </div>

            {/* 4. Estimated EMI Banner */}
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#113B24] border border-[#EAB308]/60 flex items-center justify-center text-[#EAB308] shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Estimated EMI
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    ₹{estimatedEmi.toLocaleString('en-IN')} / month
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-[#15803D] text-right">
                Pre-approved by SBI / HDFC
              </span>
            </div>

            {/* 5. Legal Approval Tag */}
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-bold text-[11px]">
                  {project.dtcpNumber || 'DTCP No. 182/2023'} · Clear Patta Ready
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#113B24] text-[#EAB308] text-[9px] font-black border border-[#EAB308]/30 shrink-0">
                RERA READY
              </span>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                6. ACTION BUTTONS (Footer of the Pop-up)
                ───────────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* Button 1: "♥ Add to Favourite" (or "Saved" toggle) */}
              <button
                type="button"
                onClick={() => onToggleSave(plot.id)}
                className={`min-h-[46px] px-3.5 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer active:scale-95 ${
                  isSaved
                    ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-sm'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Heart
                  className={`w-4 h-4 transition-transform ${
                    isSaved
                      ? 'fill-rose-500 text-rose-500 scale-110'
                      : 'text-slate-500'
                  }`}
                />
                <span>{isSaved ? '♥ Added to Favourites' : '♥ Add to Favourite'}</span>
              </button>

              {/* Button 2: "Book Consultation →" (Primary Metallic Gold CTA) */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookConsultation(plot);
                }}
                className="min-h-[46px] px-3.5 py-2.5 rounded-2xl bg-[#EAB308] hover:bg-[#CA8A04] text-[#0B2516] font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <span>Book Consultation →</span>
              </button>
            </div>

            {/* Secondary WhatsApp Direct Inquire */}
            {onWhatsAppInquiry && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onWhatsAppInquiry(plot);
                }}
                className="w-full py-1.5 text-center text-[11px] font-semibold text-slate-500 hover:text-emerald-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Or WhatsApp directly with MD Rajesh RTR</span>
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
