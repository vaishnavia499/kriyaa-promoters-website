import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookmarkCheck,
  MessageCircle,
  Car,
  Compass,
  ArrowRight,
  Building2,
  Trash2,
  Eye,
  Sparkles,
  FileText,
  MapPin,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Property, PublicTab } from '../../types';
import { PublicFooter } from '../../components/public/PublicFooter';
import { PlotDetailsModal } from '../../components/public/PlotDetailsModal';

interface PublicSavedProps {
  onTabChange: (tab: PublicTab) => void;
  onOpenConsultation: (prefillPlot?: Property) => void;
  onOpenCabBooking: (prefillPlot?: Property, plotNumbersStr?: string) => void;
  onInspectPlotInProject?: (plot: Property) => void;
  onBack?: () => void;
}

export const PublicSaved: React.FC<PublicSavedProps> = ({
  onTabChange,
  onOpenConsultation,
  onOpenCabBooking,
  onInspectPlotInProject,
  onBack,
}) => {
  const { properties, projects, savedPlotIds, toggleSavePlot, isPlotSaved, settings, showToast } = useApp();
  const [modalPlot, setModalPlot] = useState<Property | null>(null);

  // Selected properties
  const savedPlots = properties.filter((p) => savedPlotIds.includes(p.id));

  // Combined total calculations
  const totalSelectedPrice = savedPlots.reduce((sum, p) => sum + p.totalPrice, 0);
  const totalSelectedSqFt = savedPlots.reduce((sum, p) => sum + p.areaSqFt, 0);
  const plotNumbersSummary = savedPlots.map((p) => `#${p.plotNumber}`).join(', ');

  const handleDownloadBrochure = (plot: Property) => {
    const content = `
========================================================================
             KRIYAA PROMOTERS · GOLDEN CITY PROJECT
                 OFFICIAL PLOT SPECIFICATION SHEET
========================================================================

PLOT IDENTIFICATION:
• Plot Number: #${plot.plotNumber}
• Title: ${plot.title}
• Project Name: ${plot.projectName || 'Golden City'}
• Status: Available

PLOT DIMENSIONS & EXTENT:
• Dimensions: ${plot.plotDimensions}
• Extent: ${plot.areaSqFt} Sq.Ft (${plot.areaCents} Cents)
• Facing: ${plot.facing}
• Frontage Road Width: ${plot.roadWidth}

FINANCIAL OVERVIEW:
• Price per Sq.Ft: ₹${plot.pricePerSqFt}
• Total Plot Price: ₹${(plot.totalPrice / 100000).toFixed(2)} Lakhs (₹${plot.totalPrice.toLocaleString('en-IN')})
• Bank Loan Eligibility: Pre-approved up to 80% with Top Banks (SBI, HDFC, Indian Bank)

LEGAL & STATUTORY APPROVALS:
• DTCP Sanctioned Layout (Sanction No. 182/2023)
• Sub-divided Individual Patta Ready for immediate transfer
• 100% Clear 30-Year Parent Document Title Scrutiny
• RERA Registered

LAYOUT HIGHLIGHTS & INFRASTRUCTURE:
• 40ft & 60ft Heavy Tar Roads with Paver Walkways
• Sweet Potable Ground Water
• Individual Electricity (EB) Line Connection
• Gated Avenue with 24/7 Security & OSR Park Greenery

CONTACT & DIRECT GUIDANCE:
• Managing Director: Rajesh RTR
• Mobile / WhatsApp: +91 94432 78899 / +91 94432 75727
• Email: rajesh@kriyaapromoters.com
• Office Address: No. 7, Kamaraj Salai, Cuddalore, Tamil Nadu 607001
========================================================================
Generated on ${new Date().toLocaleDateString('en-IN')} via Kriyaa Promoters Portal
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Kriyaa_Promoters_Plot_${plot.plotNumber}_Brochure.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Brochure for Plot #${plot.plotNumber} downloaded!`, 'success');
  };

  const handleCombinedQuotation = () => {
    if (!savedPlots.length) return;

    const plotListText = savedPlots
      .map(
        (p, idx) =>
          `${idx + 1}. *Plot #${p.plotNumber} · ${p.title}*\n` +
          `   • Layout: ${p.projectName || 'Golden City'}\n` +
          `   • Dimensions: ${p.plotDimensions} | Extent: ${p.areaSqFt} sq.ft (${p.areaCents} Cts)\n` +
          `   • Facing: ${p.facing} | Road Width: ${p.roadWidth}\n` +
          `   • Pricing: ₹${(p.totalPrice / 100000).toFixed(2)} Lakhs (₹${p.pricePerSqFt}/sq.ft)\n` +
          `   • Approvals: ${p.approvals.join(', ')}`
      )
      .join('\n\n');

    const totalLakhs = (totalSelectedPrice / 100000).toFixed(2);

    const message =
      `📋 *${settings.companyName.toUpperCase()} · COMBINED PLOT QUOTATION REQUEST*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Customer Selected Plots (${savedPlots.length} Units)*:\n\n` +
      `${plotListText}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 *Total Estimated Investment: ₹${totalLakhs} Lakhs*\n` +
      `📜 *100% Clear Title · Sub-divided Individual Patta Ready*\n` +
      `🏛️ *DTCP Sanctioned & Pre-Approved by 5+ Top Banks (Up to 80% Loan)*\n` +
      `🚗 *Free Doorstep Cab Site Inspection Requested*\n` +
      `📞 Sent direct to MD Rajesh RTR (+91 94432 78899)`;

    window.open(`https://wa.me/919443278899?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleIndividualWhatsApp = (plot: Property) => {
    const text =
      `🏡 *${settings.companyName} · Selected Plot Inquiry*\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `📍 *Plot #${plot.plotNumber} · ${plot.title}*\n` +
      `📐 Dimensions: *${plot.plotDimensions}*\n` +
      `📏 Extent: *${plot.areaSqFt} sq.ft (${plot.areaCents} Cts)*\n` +
      `🧭 Facing: *${plot.facing}*\n` +
      `🛣️ Road Width: *${plot.roadWidth}*\n` +
      `💰 Total Price: *₹${(plot.totalPrice / 100000).toFixed(2)} Lakhs*\n` +
      `📞 Promoter Contact: Rajesh RTR (+91 94432 78899)\n` +
      `I would like to schedule a free site visit or check parent document clearance.`;

    window.open(`https://wa.me/919443278899?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 flex flex-col justify-between select-none">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full space-y-6 sm:space-y-8">
        {/* ─────────────────────────────────────────────────────────────
            1. TOP TITLE
            ───────────────────────────────────────────────────────────── */}
        <div className="text-center max-w-2xl mx-auto py-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            My Favourite plots
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Review your shortlisted DTCP plots, download official specification sheets, or contact Rajesh RTR directly.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2. SELECTED PLOTS GRID OR EMPTY STATE
            ───────────────────────────────────────────────────────────── */}
        {savedPlots.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 px-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-[#15803D] flex items-center justify-center border border-emerald-200">
              <BookmarkCheck className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                No plots selected yet
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Browse our DTCP-sanctioned layouts and bookmark plots to review measurements, road widths, and arrange a complimentary cab site visit.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onTabChange('projects')}
              className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#113B24] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 mx-auto shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Building2 className="w-4 h-4" />
              <span>Browse Master Plans &amp; Plots</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPlots.map((plot) => (
                <motion.div
                  key={plot.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Image & Plot Badge */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src={plot.images[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'}
                      alt={plot.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#113B24] text-[#EAB308] border border-[#EAB308]/40 text-xs font-black shadow-md flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#EAB308]" />
                        <span>Plot #{plot.plotNumber}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleSavePlot(plot.id)}
                        className="w-9 h-9 rounded-full bg-black/60 hover:bg-rose-950 text-slate-300 hover:text-rose-400 flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-white/20"
                        title="Remove Plot from Selected List"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-base font-black truncate">{plot.title}</h3>
                      <p className="text-[11px] text-[#EAB308] font-semibold">{plot.projectName || 'Golden City'}</p>
                    </div>
                  </div>

                  {/* Specs Body */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Dimensions</span>
                        <span className="font-black text-slate-900 mt-0.5 block font-mono">
                          {plot.plotDimensions}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Extent</span>
                        <span className="font-black text-slate-900 mt-0.5 block">
                          {plot.areaSqFt} Sq.Ft ({plot.areaCents} Cts)
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Facing</span>
                        <span className="font-black text-slate-900 mt-0.5 block flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5 text-[#CA8A04]" />
                          <span>{plot.facing}</span>
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Road Width</span>
                        <span className="font-black text-slate-900 mt-0.5 block">
                          {plot.roadWidth} Road
                        </span>
                      </div>
                    </div>

                    {/* Price Banner (Exact as Attachment 4) */}
                    <div className="p-3.5 rounded-2xl bg-[#EBF8F2] border border-[#A7E3C7] flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-[#0B3B24] uppercase block">Total Price</span>
                        <span className="text-lg font-black text-[#0B3B24]">
                          ₹{(plot.totalPrice / 100000).toFixed(2)} Lakhs
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#0B3B24] bg-white/90 border border-[#A7E3C7] rounded-full px-3 py-1 shadow-2xs">
                        ₹{plot.pricePerSqFt}/sq.ft
                      </span>
                    </div>

                    {/* Card Actions (Exact 3-Button Pill Stack from Attachment 4) */}
                    <div className="pt-2 flex flex-col gap-2.5">
                      {/* Button 1: Solid Dark Forest Green Pill */}
                      <button
                        type="button"
                        onClick={() => handleDownloadBrochure(plot)}
                        className="w-full min-h-[46px] rounded-full bg-gradient-to-r from-[#14563D] to-[#0B3B24] hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                      >
                        <Download className="w-4 h-4 text-white" />
                        <span>Download Brochure</span>
                      </button>

                      {/* Button 2: White Pill with Green Border & Authentic WhatsApp Icon */}
                      <button
                        type="button"
                        onClick={() => handleIndividualWhatsApp(plot)}
                        className="w-full min-h-[46px] rounded-full bg-white border-2 border-[#0B3B24] hover:bg-[#0B3B24]/5 text-[#0B3B24] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
                      >
                        <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12.031 2C6.495 2 2 6.494 2 12.029c0 1.767.46 3.491 1.332 5.006L2 22l5.127-1.344a10.01 10.01 0 0 0 4.904 1.282h.004c5.534 0 10.03-4.494 10.03-10.03 0-2.679-1.043-5.198-2.937-7.093A9.972 9.972 0 0 0 12.031 2zm0 18.358h-.003a8.318 8.318 0 0 1-4.238-1.163l-.304-.18-3.146.825.84-3.067-.198-.314a8.324 8.324 0 0 1-1.275-4.43c0-4.6 3.743-8.343 8.346-8.343 2.228 0 4.322.868 5.897 2.443a8.293 8.293 0 0 1 2.443 5.898c0 4.603-3.744 8.351-8.36 8.351zm4.573-6.246c-.25-.125-1.482-.731-1.712-.815-.23-.083-.397-.125-.564.125-.167.25-.646.815-.792.982-.146.167-.292.188-.542.063s-1.056-.39-2.012-1.242c-.744-.664-1.246-1.484-1.392-1.734-.146-.25-.016-.386.109-.51.112-.112.25-.292.375-.438.125-.146.167-.25.25-.417.083-.167.042-.313-.021-.438-.063-.125-.564-1.359-.772-1.862-.203-.49-.408-.423-.564-.431l-.48-.008c-.167 0-.438.063-.667.313-.23.25-.875.855-.875 2.085 0 1.23.896 2.418 1.021 2.585.125.167 1.762 2.69 4.269 3.773.596.258 1.062.412 1.425.527.6.19 1.145.163 1.576.099.48-.072 1.482-.605 1.69-1.189.209-.584.209-1.085.146-1.189-.062-.104-.229-.167-.479-.292z" />
                        </svg>
                        <span>Tap WhatsApp Consultant</span>
                      </button>

                      {/* Button 3: Styled Pill Button with Outline */}
                      <button
                        type="button"
                        onClick={() => setModalPlot(plot)}
                        className="w-full min-h-[44px] rounded-full bg-white border border-slate-300 hover:border-[#0B3B24] hover:bg-slate-50 text-[#0B3B24] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
                      >
                        <Eye className="w-4 h-4 text-[#0B3B24]" />
                        <span>View Plot Details &amp; Specs</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#0B3B24]" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Checkout CTA Reminder (If more than 1 plot) */}
            {savedPlots.length > 1 && (
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenCabBooking(savedPlots[0], plotNumbersSummary)}
                  className="w-full sm:w-auto min-h-[50px] px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#EAB308] via-[#FACC15] to-[#CA8A04] hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#EAB308]/25 transition-all cursor-pointer"
                >
                  <Car className="w-4 h-4 shrink-0" />
                  <span>Proceed to Free Site Visit ({savedPlots.length} Plots) →</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Interactive Plot Details Popup Modal */}
        {modalPlot && (
          <PlotDetailsModal
            isOpen={modalPlot !== null}
            onClose={() => setModalPlot(null)}
            plot={modalPlot}
            project={projects.find((p) => p.id === modalPlot.projectId) || projects[0]}
            isSaved={isPlotSaved(modalPlot.id)}
            onToggleSave={(id) => toggleSavePlot(id)}
            onBookConsultation={(plot) => {
              setModalPlot(null);
              onOpenConsultation(plot);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <PublicFooter
        onTabChange={onTabChange}
        onOpenConsultation={onOpenConsultation}
      />
    </div>
  );
};
