import React from 'react';
import { MapPin, Phone, Mail, Clock, ListOrdered, ArrowRight } from 'lucide-react';
import { KriyaaLogo } from '../KriyaaLogo';
import { PublicTab } from '../../types';

interface PublicFooterProps {
  onTabChange?: (tab: PublicTab) => void;
  onOpenConsultation?: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onTabChange }) => {
  return (
    <footer className="w-full bg-[#06180D] border-t border-emerald-950/80 text-slate-200 select-none pt-10 pb-16 px-4">
      <div className="max-w-md mx-auto flex flex-col items-center">
        {/* 1. Official Kriyaa Logo in Circle Frame */}
        <div className="w-16 h-16 rounded-full bg-white border-2 border-[#EAB308] p-2 flex items-center justify-center shadow-xl shadow-black/40 overflow-hidden shrink-0">
          <KriyaaLogo className="w-full h-full object-contain" />
        </div>

        {/* 2. Brand Name & Slogan */}
        <h3 className="text-xl font-black tracking-wide text-white uppercase mt-3.5">
          KRIYAA PROMOTERS
        </h3>
        <p className="italic text-xs font-semibold text-[#EAB308] mt-1">
          &ldquo;Your dream, our priority&rdquo;
        </p>

        {/* About Us Summary */}
        <div className="w-full text-center mt-4 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-[#EAB308] text-[11px] font-black uppercase tracking-wider">
            <span>About Us</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
            Kriyaa Promoters is Cuddalore &amp; Pondicherry&apos;s trusted real estate developer, providing 100% DTCP-approved gated community layouts with clear legal title, bank loan assistance, and direct guidance under Managing Director <strong className="text-white">Rajesh RTR</strong>.
          </p>
          {onTabChange && (
            <div className="flex items-center justify-center gap-3 pt-1 text-xs font-bold text-emerald-400">
              <button
                type="button"
                onClick={() => onTabChange('home')}
                className="hover:text-[#EAB308] transition-colors cursor-pointer"
              >
                Home
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => onTabChange('projects')}
                className="hover:text-[#EAB308] transition-colors cursor-pointer"
              >
                Projects
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => onTabChange('process')}
                className="hover:text-[#EAB308] transition-colors cursor-pointer"
              >
                Buying Process
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => onTabChange('contact')}
                className="hover:text-[#EAB308] transition-colors cursor-pointer"
              >
                About Us
              </button>
            </div>
          )}
        </div>

        {/* Dedicated "Process of Buying Plots" Section in Footer */}
        {onTabChange && (
          <button
            type="button"
            onClick={() => {
              onTabChange('process');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full mt-5 bg-gradient-to-r from-[#0B3B24] to-[#14563D] border border-emerald-600/60 hover:border-[#EAB308]/70 rounded-2xl p-4 flex items-center justify-between gap-3 text-left shadow-lg cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-[#EAB308] shrink-0 group-hover:scale-105 transition-transform">
                <ListOrdered className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#EAB308] tracking-wider uppercase block">
                  Step-by-Step Guide
                </span>
                <h4 className="text-sm font-black text-white leading-tight">
                  Process of Buying Plots
                </h4>
                <p className="text-[11px] text-emerald-100/80 mt-0.5">
                  View our animated 7-step buying &amp; registration journey
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#EAB308] shrink-0 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        )}

        {/* 3. Four Contact Info Cards */}
        <div className="w-full space-y-3 mt-6">
          {/* Card 1: Direct Mobile / WhatsApp */}
          <div className="w-full bg-[#04170D] border border-emerald-800/60 rounded-2xl p-3.5 flex items-center gap-3.5 text-left shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-[#061F12] border border-emerald-700/60 flex items-center justify-center text-[#EAB308] shrink-0">
              <Phone className="w-5 h-5 fill-current" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black text-[#34D399] tracking-wider uppercase block">
                DIRECT MOBILE / WHATSAPP
              </span>
              <a
                href="tel:+919443278899"
                className="text-base font-black text-white hover:text-[#EAB308] transition-colors block leading-tight mt-0.5"
              >
                +91 94432 78899
              </a>
              <a
                href="tel:+919443275727"
                className="text-xs font-bold text-white/90 hover:text-[#EAB308] transition-colors block leading-tight mt-0.5"
              >
                +91 94432 75727
              </a>
            </div>
          </div>

          {/* Card 2: Official Business Email */}
          <div className="w-full bg-[#04170D] border border-emerald-800/60 rounded-2xl p-3.5 flex items-center gap-3.5 text-left shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-[#061F12] border border-emerald-700/60 flex items-center justify-center text-[#EAB308] shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black text-[#34D399] tracking-wider uppercase block">
                OFFICIAL BUSINESS EMAIL
              </span>
              <a
                href="mailto:rajesh@kriyaapromoters.com"
                className="text-xs sm:text-sm font-black text-white hover:text-[#EAB308] transition-colors block truncate leading-tight mt-0.5"
              >
                rajesh@kriyaapromoters.com
              </a>
              <a
                href="mailto:kriyaapromoters@gmail.com"
                className="text-xs font-semibold text-white/80 hover:text-[#EAB308] transition-colors block truncate leading-tight mt-0.5"
              >
                kriyaapromoters@gmail.com
              </a>
            </div>
          </div>

          {/* Card 3: Registered Office */}
          <div className="w-full bg-[#04170D] border border-emerald-800/60 rounded-2xl p-3.5 flex items-center gap-3.5 text-left shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-[#061F12] border border-emerald-700/60 flex items-center justify-center text-[#EAB308] shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black text-[#34D399] tracking-wider uppercase block">
                REGISTERED OFFICE
              </span>
              <p className="text-xs font-bold text-white leading-snug mt-0.5">
                No. 7, Kamaraj Salai, Cuddalore, Tamil Nadu 607001 (Opposite Town Hall)
              </p>
            </div>
          </div>

          {/* Card 4: Consultation Support Hours */}
          <div className="w-full bg-[#04170D] border border-emerald-800/60 rounded-2xl p-3.5 flex items-center gap-3.5 text-left shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-[#061F12] border border-emerald-700/60 flex items-center justify-center text-[#EAB308] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black text-[#34D399] tracking-wider uppercase block">
                CONSULTATION SUPPORT HOURS
              </span>
              <p className="text-xs sm:text-sm font-black text-white leading-tight mt-0.5">
                Monday to Sunday · 8:00 AM – 8:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* 4. Subtle Divider Line */}
        <div className="w-full h-px bg-emerald-900/60 my-5" />

        {/* 5. Pill Badges (2 rows) */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-[#04170D] border border-[#EAB308]/60 text-[#EAB308] text-xs font-black shadow-xs">
              ✓ DTCP Approved
            </span>
            <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-[#04170D] border border-[#EAB308]/60 text-[#EAB308] text-xs font-black shadow-xs">
              ✓ Patta Ready
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-[#04170D] border border-[#EAB308]/60 text-[#EAB308] text-xs font-black shadow-xs">
            ✓ RERA Registered
          </span>
        </div>

        {/* 6. Footer Copyright */}
        <div className="mt-5 text-center text-xs text-slate-400 space-y-1">
          <p>© 2026 Kriyaa Promoters. All rights reserved.</p>
          <p className="text-slate-300">
            Managed by <span className="text-[#EAB308] font-bold">Rajesh RTR</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
