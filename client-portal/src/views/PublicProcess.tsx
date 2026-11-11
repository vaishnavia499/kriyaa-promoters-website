import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import {
  FileText,
  Home,
  Car,
  ShieldCheck,
  CheckCircle2,
  FileEdit,
  Key,
  ArrowRight,
  CalendarCheck,
  Building2,
} from 'lucide-react';
import { PublicTab } from '../../types';
import { PublicFooter } from '../../components/public/PublicFooter';

interface PublicProcessProps {
  onTabChange: (tab: PublicTab) => void;
  onOpenConsultation: () => void;
  onOpenCabBooking: () => void;
}

const BUYING_PROCESS_STEPS = [
  {
    step: '01',
    title: 'Share Your Requirements',
    summary: 'Tell us what you are looking for. We will understand your needs, preferred location, and budget.',
    icon: FileText,
    details: [
      'Preferred layout locations: Cuddalore, Chidambaram, or Pondy ECR corridor.',
      'Flexible budget & EMI investment options with up to 80% spot bank loan sanction.',
      'Plot dimensions: 800 sq.ft, 1,200 sq.ft, 1,800 sq.ft, or custom villa extents.',
      'Vastu-compliant facing: East, North, or Corner plots with 30ft/40ft blacktop tar roads.',
    ],
  },
  {
    step: '02',
    title: 'Explore Available Plots',
    summary: 'Discover suitable plots and explore their location, layout, and available details.',
    icon: Home,
    details: [
      'Interactive 2D/3D master plan layout inspection with live availability status.',
      'Sanctioned boundary stone verification and road width checks.',
      'Immediate sub-divided patta transfer feasibility verification.',
      'Comparison matrix across high-growth corridors for maximum capital appreciation.',
    ],
  },
  {
    step: '03',
    title: 'Schedule a Site Visit',
    summary: 'Experience the location in person with our complimentary doorstep cab service and promoter accompaniment.',
    icon: Car,
    details: [
      '100% free doorstep pickup and drop cab service across Cuddalore and Pondicherry.',
      'Sweet potable drinking ground water testing and neighborhood infrastructure check.',
      'Physical demarcation stone confirmation matching the sanctioned blueprint.',
      'Direct on-site walkthrough with Managing Director Rajesh RTR.',
    ],
  },
  {
    step: '04',
    title: 'Verify Property Documents',
    summary: 'Complete peace of mind with 100% transparent legal scrutiny by senior high court advocates.',
    icon: ShieldCheck,
    details: [
      'Parent deed continuity verification dating back 30+ years without gaps.',
      'Nil-Encumbrance Certificate (EC) up to current date provided for inspection.',
      'DTCP Sanctioned Layout Order copy and government approval seals.',
      'Pre-vetted legal documentation folder ready for immediate bank loan submission.',
    ],
  },
  {
    step: '05',
    title: 'Choose & Book Your Plot',
    summary: 'Confirm your dream plot selection with transparent pricing, zero hidden charges, and instant receipt.',
    icon: CheckCircle2,
    details: [
      'Nominal token advance with immediate printed booking confirmation & plot reservation.',
      'Transparent square-foot pricing with zero broker commission or hidden charges.',
      'Spot loan sanction assistance with SBI, HDFC, Canara, and Indian Bank.',
      'Plot lock-in protection with immediate removal from public sale inventory.',
    ],
  },
  {
    step: '06',
    title: 'Complete Registration',
    summary: 'Hassle-free sub-registrar execution managed end-to-end by our dedicated legal documentation desk.',
    icon: FileEdit,
    details: [
      'Draft sale deed preparation and customer review prior to stamp duty purchase.',
      'Sub-registrar office appointment booking with dedicated promoter desk assistance.',
      'Guidance and presence of Rajesh RTR during biometric execution.',
      'All government registration formalities handled cleanly within 2 hours.',
    ],
  },
  {
    step: '07',
    title: 'Welcome to Ownership!',
    summary: 'Receive your registered sale deed, original individual Patta, and begin building your future.',
    icon: Key,
    details: [
      'Original registered sale deed delivered securely with laminated documents.',
      'Immediate individual sub-divided Patta transferred into your name.',
      'Architectural house-building guidance and borewell clearance assistance.',
      'Lifetime customer support and appreciation tracking from Kriyaa Promoters.',
    ],
  },
];

export const PublicProcess: React.FC<PublicProcessProps> = ({
  onTabChange,
  onOpenConsultation,
  onOpenCabBooking,
}) => {
  // State for which step is expanded in accordion
  const [openStepIndex, setOpenStepIndex] = useState<number | null>(0);

  const toggleStepDetails = (idx: number) => {
    setOpenStepIndex((prev) => (prev === idx ? null : idx));
  };

  // Scroll to top when navigating to Process page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // Scroll Progress Tracking for Timeline Central Trail using Framer Motion
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 80%', 'end 60%'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <div className="w-full min-h-screen bg-white text-[#17251E] flex flex-col justify-between select-none overflow-x-hidden">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-10 sm:space-y-12">
        {/* 1. HERO TITLE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto space-y-2.5"
        >
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#E5A91E] block">
            Your Property Buying Journey
          </span>

          <div className="flex items-center justify-center gap-2.5">
            <span className="w-8 sm:w-16 h-0.5 bg-[#E5A91E]" />
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0B3828] tracking-tight leading-tight">
              Process of Buying Plots
            </h1>
            <span className="w-8 sm:w-16 h-0.5 bg-[#E5A91E]" />
          </div>

          <p className="text-slate-600 text-xs sm:text-base leading-relaxed font-medium">
            From enquiry to ownership &mdash; we are with you at every step.
          </p>
        </motion.div>

        {/* 2. 7-STEP TIMELINE WITH SMOOTH SPRING ANIMATIONS */}
        <section ref={timelineRef} className="relative py-4">
          {/* Base Underlying Light Line (#E6EEE8) */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-[#E6EEE8] rounded-full
                       left-6 md:left-1/2 -translate-x-1/2 pointer-events-none"
          />

          {/* Overlaid Animated Scroll-Driven Progress Line (Gradient from #E5A91E to #14563D) */}
          <motion.div
            className="absolute top-0 w-1 h-full rounded-full origin-top
                       left-6 md:left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              scaleY: smoothProgress,
              background: 'linear-gradient(to bottom, #E5A91E 0%, #14563D 100%)',
              boxShadow: '0 0 12px rgba(229, 169, 30, 0.55)',
            }}
          />

          {/* 7 Timeline Milestones */}
          <div className="space-y-8 sm:space-y-12">
            {BUYING_PROCESS_STEPS.map((stepItem, idx) => {
              const isEven = idx % 2 === 1; // 0: left, 1: right, 2: left...
              const StepIcon = stepItem.icon;
              const isExpanded = openStepIndex === idx;

              return (
                <motion.article
                  key={stepItem.step}
                  initial={{ opacity: 0, x: isEven ? 36 : -36, y: 24 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content Card (Desktop: 45% width, Mobile: pl-14 full width) */}
                  <div
                    className={`w-full md:w-[45%] pl-14 md:pl-0 ${
                      isEven ? 'md:pl-8 text-left' : 'md:pr-8 md:text-left'
                    }`}
                  >
                    <motion.div
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6EEE8] hover:border-[#0B3828]/25 shadow-sm hover:shadow-lg transition-all relative"
                    >
                      {/* Step Icon in soft light green square */}
                      <div className="w-11 h-11 rounded-xl bg-[#EFF6F0] text-[#0B3828] border border-[#0B3828]/10 flex items-center justify-center mb-3">
                        <StepIcon className="w-5 h-5 stroke-[2.2]" />
                      </div>

                      {/* Step Badge */}
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#E5A91E] block mb-1">
                        STEP {stepItem.step}
                      </span>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-black text-[#0B3828] leading-tight mb-2">
                        {stepItem.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-3">
                        {stepItem.summary}
                      </p>

                      {/* Expandable Accordion "Know More +" Button */}
                      <button
                        type="button"
                        onClick={() => toggleStepDetails(idx)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B3828] hover:text-[#E5A91E] transition-colors cursor-pointer active:scale-95 group"
                      >
                        <span>{isExpanded ? 'Show Less -' : 'Know More +'}</span>
                        <ArrowRight
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isExpanded
                              ? 'rotate-90 text-[#0B3828]'
                              : 'text-[#E5A91E] group-hover:translate-x-0.5'
                          }`}
                        />
                      </button>

                      {/* Expandable Inner Details Drawer */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden border-t border-slate-100 mt-3 pt-3"
                          >
                            <ul className="space-y-1.5 text-xs text-slate-600">
                              {stepItem.details.map((bullet, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-2">
                                  <span className="text-[#E5A91E] font-bold text-sm leading-none mt-0.5">✓</span>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  {/* Central Indicator Circle with Number (01, 02.. in Gold) */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20 top-6 md:top-auto">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#E5A91E] text-[#0B3828]
                                 font-black text-xs sm:text-sm flex items-center justify-center
                                 border-2 border-white shadow-[0_0_16px_rgba(229,169,30,0.55)]"
                    >
                      <span>{stepItem.step}</span>
                    </motion.div>
                  </div>

                  {/* Desktop Opposite Space Balancer (45% width) */}
                  <div className="hidden md:block w-[45%]" />
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* 3. BOTTOM CTA CARD TO START BUYING JOURNEY */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#0B3B24] rounded-3xl p-6 sm:p-10 text-white text-center space-y-5 border border-emerald-700 shadow-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#EAB308] mx-auto">
            <CalendarCheck className="w-6 h-6" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="text-xl sm:text-3xl font-black tracking-tight text-white">
              Ready to Begin Step 01?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Book a complimentary doorstep cab visit or connect directly with Managing Director Rajesh RTR for personalized guidance.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenCabBooking}
              className="px-6 py-3 rounded-full bg-[#EAB308] hover:bg-[#CA8A04] text-[#0B2516] font-black text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg transition cursor-pointer active:scale-95"
            >
              <Car className="w-4 h-4" />
              <span>Book Free Doorstep Cab Visit</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('projects')}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 border border-white/20 transition cursor-pointer active:scale-95"
            >
              <Building2 className="w-4 h-4 text-[#EAB308]" />
              <span>Explore Sanctioned Plots</span>
            </button>
          </div>
        </motion.div>
      </main>

      {/* 4. FOOTER */}
      <PublicFooter onTabChange={onTabChange} />
    </div>
  );
};
