import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ShieldCheck,
  Landmark,
  Handshake,
  Home,
  FileText,
  FileEdit,
  Key,
  ChevronLeft,
  ChevronRight,
  Star,
  Plus,
  Minus,
  Phone,
  MapPin,
  CheckCircle2,
  Car,
} from 'lucide-react';
import { PublicFooter } from '../../components/public/PublicFooter';
import { PublicTab } from '../../types';

interface PublicHomeProps {
  onTabChange: (tab: PublicTab) => void;
  onOpenConsultation: () => void;
  onOpenCabBooking: () => void;
  onOpenDroneVideo?: () => void;
}

/* ─────────────────────────────────────────────────────────── */
/* 3 PROMOTIONAL ADS (Exact Images from User) */
/* ─────────────────────────────────────────────────────────── */
const PROMOTIONAL_ADS = [
  {
    id: 'ad-1',
    src: '/ads/ad-1.png',
    alt: 'Find Your Perfect Place to Build Your Future - Premium Residential Plots in Cuddalore & Pondicherry',
  },
  {
    id: 'ad-2',
    src: '/ads/ad-2.png',
    alt: 'Invest in a Better Tomorrow with Kriyaa Promoters - DTCP Approved, Clear Documentation, Prime Locations',
  },
  {
    id: 'ad-3',
    src: '/ads/ad-3.png',
    alt: 'Build Your Dreams with Confidence - Spacious Plots, Peaceful Surroundings, Lasting Value',
  },
];

/* ─────────────────────────────────────────────────────────── */
/* FOUR PILLARS DATA */
/* ─────────────────────────────────────────────────────────── */
const PILLARS_DATA = [
  {
    id: 'pillar-1',
    title: 'Clear Documentation',
    subtitle: 'Transparent & hassle-free process.',
    icon: ShieldCheck,
  },
  {
    id: 'pillar-2',
    title: 'Loan Assistance',
    subtitle: 'Guidance for your dream home.',
    icon: Landmark,
  },
  {
    id: 'pillar-3',
    title: 'Prime Locations',
    subtitle: '100% DTCP Approved Layouts.',
    icon: MapPin,
  },
  {
    id: 'pillar-4',
    title: 'Dedicated Support',
    subtitle: 'Always with you, every step of the way.',
    icon: Handshake,
  },
];

/* ─────────────────────────────────────────────────────────── */
/* 7-STEP BUYING PROCESS DATA (Exact Match to Specification) */
/* ─────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────── */
/* REVIEWS DATA (Auto-advancing every 3 seconds) */
/* ─────────────────────────────────────────────────────────── */
const REVIEWS = [
  {
    quote:
      '“Kriyaa Promoters made our dream come true. Excellent service, transparent documentation, and smooth registration without any delays!”',
    author: '— Anitha Ramakrishnan',
    plot: 'Golden City Plot #18',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  },
  {
    quote:
      '“The spot loan support from SBI was completely arranged by the Kriyaa team within 3 days. Clean patta and broad tar road connectivity!”',
    author: '— S. Murugan',
    plot: 'Golden City Corner Plot #05',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    quote:
      '“Very high quality development. Clear demarcation stones and immediate individual patta handed over on registration day.”',
    author: '— Dr. R. Kanimozhi',
    plot: 'Golden City Plot #24',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  },
  {
    quote:
      '“Transparent parent deed verification and zero broker interference. Rajesh RTR personally walked us through the site and handled registration.”',
    author: '— S. Balasubramaniam',
    plot: 'Golden City Plot #07',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
];

/* ─────────────────────────────────────────────────────────── */
/* FAQS DATA */
/* ─────────────────────────────────────────────────────────── */
const FAQS = [
  {
    question: 'What is DTCP approval?',
    answer:
      'DTCP (Directorate of Town and Country Planning) approval certifies that the layout meets strict government benchmarks: minimum 30ft/40ft road widths, dedicated public park (OSR) reservations, potable water clearance, and clear zoning for residential construction.',
  },
  {
    question: 'Is bank loan available?',
    answer:
      'Yes! Up to 80% bank loan is pre-sanctioned on all Kriyaa Promoters layouts through leading nationalized and private banks including SBI, HDFC, Canara Bank, and Indian Bank with expedited approvals.',
  },
  {
    question: 'What documents are required?',
    answer:
      'To book and register, you only need basic KYC documents (Aadhaar & PAN card), passport-size photographs, and bank statements if availing loan financing. All parent documents, legal scrutinies, and patta transfers are handled directly by our promoter desk.',
  },
];

export const PublicHome: React.FC<PublicHomeProps> = ({
  onTabChange,
  onOpenConsultation,
  onOpenCabBooking,
}) => {
  // Review Carousel State (3-second auto-cycle)
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isReviewsPaused, setIsReviewsPaused] = useState(false);

  useEffect(() => {
    if (isReviewsPaused) return;
    const timer = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isReviewsPaused]);

  // 3-Second Promotional Ad Carousel State (3 Ads from User)
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isAdPaused, setIsAdPaused] = useState(false);

  useEffect(() => {
    if (isAdPaused) return;
    const timer = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % PROMOTIONAL_ADS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isAdPaused]);

  // Timeline Expandable Accordion State
  const [openStepIndex, setOpenStepIndex] = useState<number | null>(null);

  const toggleStepDetails = (idx: number) => {
    setOpenStepIndex((prev) => (prev === idx ? null : idx));
  };

  // Scroll Progress Tracking for Timeline Central Trail
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineProgress, setTimelineProgress] = useState(0.2);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalHeight = rect.height;
      const topOffset = rect.top;

      if (topOffset > windowHeight) {
        setTimelineProgress(0);
      } else if (topOffset + totalHeight < 0) {
        setTimelineProgress(1);
      } else {
        const scrolled = windowHeight - topOffset;
        const progress = Math.min(Math.max(scrolled / (totalHeight + windowHeight * 0.4), 0), 1);
        setTimelineProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Draggable Plot-to-Home Transformation Slider State (0 to 100)
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.min(Math.max((x / rect.width) * 100, 5), 95);
    setSliderPosition(percent);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDraggingSlider(true);
    handleSliderMove(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingSlider) return;
    handleSliderMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDraggingSlider(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  // FAQ Accordion State (default first open)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  const handleNextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % REVIEWS.length);
  };

  const handlePrevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  const currentReview = REVIEWS[currentReviewIndex];

  return (
    <div className="w-full min-h-screen bg-white text-[#17251E] select-none pb-12">

      {/* =========================================================================
          1. WELCOME SECTION & BUTTONS (EXACT AS ATTACHMENT 2)
          ========================================================================= */}
      <section className="relative pt-8 sm:pt-12 pb-10 sm:pb-14 px-4 sm:px-6 max-w-3xl mx-auto text-center">
        {/* House Outline Icon Apex with Symmetrical Gold Dividers */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2.5">
          <span className="h-[1.5px] w-14 sm:w-20 bg-[#E5A91E]" />
          <div className="p-1 text-[#0B3B24]">
            <Home className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="h-[1.5px] w-14 sm:w-20 bg-[#E5A91E]" />
        </div>

        {/* Small Caps Sub-header */}
        <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-[#0B3B24] font-black mb-2">
          W E L C O M E &nbsp; T O
        </p>

        {/* Monumental Centered Heading */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0B3B24] uppercase font-cinzel leading-none mb-2">
          KRIYAA<br />PROMOTERS
        </h1>

        {/* Symmetrical Golden Arch Curve Divider */}
        <div className="flex justify-center my-2.5">
          <svg className="w-48 sm:w-64 h-3.5 text-[#E5A91E]" viewBox="0 0 240 14" fill="none">
            <path
              d="M4 10 C 80 1, 160 1, 236 10"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Tagline in Italic Serif */}
        <p className="text-base sm:text-xl font-bold text-[#E5A91E] font-serif-heading italic mb-4 sm:mb-5">
          &ldquo;Your dream, our priority&rdquo;
        </p>

        {/* Value Headline */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B3B24] tracking-tight leading-tight mb-2.5">
          Find Your Perfect Place<br className="hidden sm:inline" /> to Build{' '}
          <span className="text-[#E5A91E]">Your Future.</span>
        </h2>

        {/* Subtitle Description */}
        <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto font-medium leading-relaxed mb-6 sm:mb-8">
          Explore DTCP-approved residential plots with clear documentation and trusted guidance.
        </p>

        {/* Two Centered Action Buttons (Exact as Attachment 2) */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => onTabChange('projects')}
            className="flex-1 sm:flex-initial px-6 sm:px-8 py-3 rounded-full bg-[#0B3B24] text-white font-bold text-xs sm:text-sm hover:bg-[#072416] transition flex items-center justify-center gap-2 shadow-md shadow-[#0B3B24]/15 cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <span>Explore More</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={() => onTabChange('contact')}
            className="flex-1 sm:flex-initial px-6 sm:px-8 py-3 rounded-full bg-white border-2 border-[#0B3B24] text-[#0B3B24] font-bold text-xs sm:text-sm hover:bg-[#0B3B24]/5 transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 fill-current text-[#0B3B24]" />
            <span>Contact Us</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          2. ABOUT SECTION
          ========================================================================= */}
      <section id="about" className="py-8 sm:py-12 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          {/* Gold Bar Label */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-10 h-0.5 bg-[#E5A91E]" />
            <span className="text-xs sm:text-sm font-extrabold text-[#0B3B24] uppercase tracking-wider">
              About Kriyaa Promoters
            </span>
            <span className="w-10 h-0.5 bg-[#E5A91E]" />
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold text-[#0B3B24] tracking-tight leading-tight mb-3">
            Building Trust, Creating Better Futures.
          </h3>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            We are a trusted real estate promoter committed to providing quality DTCP-approved residential plots with complete legal transparency, professional guidance, and guaranteed long-term value across Cuddalore and Pondicherry under the leadership of Managing Director <strong>Rajesh RTR</strong>.
          </p>

          <div className="pt-4">
            <button
              type="button"
              onClick={() => onTabChange('projects')}
              className="px-7 py-2.5 rounded-full bg-[#0B3B24] text-white font-bold text-xs sm:text-sm hover:bg-[#072416] transition inline-flex items-center gap-2 shadow-sm cursor-pointer active:scale-95"
            >
              <span>Know More</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. 3-SECOND ROTATING AD SHOWCASE (Exact 3 Ads from Reference)
          ========================================================================= */}
      <section
        id="ads"
        onMouseEnter={() => setIsAdPaused(true)}
        onMouseLeave={() => setIsAdPaused(false)}
        className="w-full px-1 sm:px-3 md:px-6 py-6 sm:py-10 max-w-[1560px] mx-auto"
      >
        <div
          onClick={() => onTabChange('projects')}
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-white cursor-pointer group"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={PROMOTIONAL_ADS[currentAdIndex].id}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-full flex items-center justify-center bg-white"
            >
              <img
                src={PROMOTIONAL_ADS[currentAdIndex].src}
                alt={PROMOTIONAL_ADS[currentAdIndex].alt}
                className="w-full h-auto min-h-[180px] sm:min-h-[280px] md:min-h-[380px] lg:min-h-[460px] object-cover rounded-2xl sm:rounded-3xl shadow-sm"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3 Interactive Dot Indicators */}
        <div className="flex items-center justify-center gap-2 pt-4">
          {PROMOTIONAL_ADS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentAdIndex(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentAdIndex ? 'w-8 bg-[#E5A91E]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Switch to Ad ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* =========================================================================
          4. FOUR PILLARS (Left & Right Entrance Animation, then Fixed)
          ========================================================================= */}
      <section
        id="pillars"
        className="py-10 sm:py-12 px-4 sm:px-8 max-w-5xl mx-auto"
      >
        {/* Diamond Star Header with Gold Lines */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-1.5">
            <span className="w-8 sm:w-16 h-0.5 bg-[#E5A91E]" />
            <span className="text-[#E5A91E] font-black text-sm">✦</span>
            <span className="w-8 sm:w-16 h-0.5 bg-[#E5A91E]" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B24] tracking-tight">
            Our Four Pillars
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm font-semibold mt-0.5">
            Building Trust. Delivering Value.
          </p>
        </div>

        {/* 4 White Rounded Cards: Animate Left & Right, then Fixed in Place */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {PILLARS_DATA.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            const slideX = idx % 2 === 0 ? -50 : 50;

            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, x: slideX }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="pillar-card bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-[#0B3B24]/40 hover:shadow-md transition-all flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EBF5EE] text-[#0B3B24] flex items-center justify-center mb-3 border border-[#0B3B24]/10 shadow-2xs">
                  <IconComponent className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-[#0B3B24] leading-tight mb-1">
                  {pillar.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {pillar.subtitle}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          5. 7-STEP PROPERTY BUYING JOURNEY PROCESS TIMELINE (Exact Specification)
          ========================================================================= */}
      <section
        id="process"
        ref={timelineRef}
        className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto relative"
      >
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <span className="w-8 sm:w-14 h-0.5 bg-[#E5A91E]" />
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#0B3828] tracking-tight">
              Your Property Buying Journey
            </h3>
            <span className="w-8 sm:w-14 h-0.5 bg-[#E5A91E]" />
          </div>
          <p className="text-slate-600 text-xs sm:text-sm font-medium">
            From enquiry to ownership &mdash; we are with you at every step.
          </p>
        </div>

        {/* Central Vertical Trail Container */}
        <div className="relative">
          {/* Base Underlying Light Line (#E6EEE8) */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-[#E6EEE8] rounded-full
                       left-6 md:left-1/2 -translate-x-1/2 pointer-events-none"
          />

          {/* Overlaid Animated Scroll-Driven Progress Line (Gradient from #E5A91E to #14563D) */}
          <div
            className="absolute top-0 w-1 rounded-full origin-top transition-all duration-300 ease-out
                       left-6 md:left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              height: '100%',
              transform: `scaleY(${timelineProgress})`,
              background: 'linear-gradient(to bottom, #E5A91E 0%, #14563D 100%)',
              boxShadow: '0 0 10px rgba(229, 169, 30, 0.6)',
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
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
                    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6EEE8] shadow-sm hover:shadow-md transition-shadow relative">
                      {/* Step Icon in soft light green square */}
                      <div className="w-11 h-11 rounded-xl bg-[#EFF6F0] text-[#0B3828] border border-[#0B3828]/10 flex items-center justify-center mb-3">
                        <StepIcon className="w-5 h-5 stroke-[2.2]" />
                      </div>

                      {/* Step Badge */}
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#E5A91E] block mb-1">
                        STEP {stepItem.step}
                      </span>

                      {/* Title */}
                      <h4 className="text-base sm:text-lg font-black text-[#0B3828] leading-tight mb-2">
                        {stepItem.title}
                      </h4>

                      {/* Summary */}
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-3">
                        {stepItem.summary}
                      </p>

                      {/* Expandable Accordion "Know More +" Button */}
                      <button
                        type="button"
                        onClick={() => toggleStepDetails(idx)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B3828] hover:text-[#E5A91E] transition-colors cursor-pointer group"
                      >
                        <span>{isExpanded ? 'Show Less -' : 'Know More +'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#E5A91E] group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      {/* Expandable Inner Details Drawer */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
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
                    </div>
                  </div>

                  {/* Central Indicator Circle with Number (01, 02.. Exact as Attachment 1) */}
                  <div
                    className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20 top-6 md:top-auto
                               w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#E5A91E] text-[#0B3828]
                               font-black text-xs sm:text-sm flex items-center justify-center
                               border-2 border-white shadow-[0_0_14px_rgba(229,169,30,0.5)] transition-all"
                  >
                    <span>{stepItem.step}</span>
                  </div>

                  {/* Desktop Opposite Space Balancer (45% width) */}
                  <div className="hidden md:block w-[45%]" />
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. REVIEWS ("What Our Customers Say" with 3-sec Auto Transition)
          ========================================================================= */}
      <section
        id="reviews"
        onMouseEnter={() => setIsReviewsPaused(true)}
        onMouseLeave={() => setIsReviewsPaused(false)}
        className="py-12 sm:py-16 px-4 sm:px-8 max-w-4xl mx-auto"
      >
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-1.5">
            <span className="w-8 sm:w-14 h-0.5 bg-[#E5A91E]" />
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B24] tracking-tight">
              What Our Customers Say
            </h3>
            <span className="w-8 sm:w-14 h-0.5 bg-[#E5A91E]" />
          </div>
          <p className="text-slate-600 text-xs sm:text-sm font-semibold">
            Real People. Real Experiences.
          </p>
        </div>

        {/* Review Card with Smooth Auto-Slide Animation */}
        <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex items-center gap-3 sm:gap-6 overflow-hidden">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handlePrevReview}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#0B3B24] hover:text-white transition shrink-0 cursor-pointer active:scale-95 shadow-xs"
            aria-label="Previous Review"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Active Review Content */}
          <div className="flex-1 overflow-hidden min-h-[110px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReviewIndex}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full flex flex-col md:flex-row items-center gap-4 sm:gap-6 text-center md:text-left"
              >
                {/* Customer Photo */}
                <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#E5A91E] shrink-0 shadow-md">
                  <img
                    src={currentReview.img}
                    alt={currentReview.author}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Rating & Quote */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-center md:justify-start gap-1 text-[#E5A91E]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    {currentReview.quote}
                  </p>
                  <div>
                    <span className="font-extrabold text-xs sm:text-sm text-[#0B3B24]">
                      {currentReview.author}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-2">
                      ({currentReview.plot})
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleNextReview}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#0B3B24] hover:text-white transition shrink-0 cursor-pointer active:scale-95 shadow-xs"
            aria-label="Next Review"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          7. FREQUENTLY ASKED QUESTIONS (With Draggable Plot-to-Home Transformation Slider)
          ========================================================================= */}
      <section id="faq" className="py-12 sm:py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Column 1: Interactive Draggable Plot-to-Home Comparison Slider (Attachments 4, 5, 6) */}
          <div className="lg:col-span-5">
            <div
              ref={sliderContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchMove={handleTouchMove}
              className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-slate-100 aspect-[4/3] sm:aspect-[16/11] bg-slate-100 select-none cursor-ew-resize group"
            >
              {/* Layer 1: Empty Residential Plot Background */}
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
                alt="Empty Demarcated Plot"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* Layer 2: Completed Dream Home Foreground (Clipped by slider position) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{
                  clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                  alt="Completed Built Home on Plot"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Central Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-xl pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              />

              {/* Central Circular Draggable Handle (Exact as Attachment 4/5/6 without Before/After badges) */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-11 h-11 rounded-full bg-[#112419] border-2 border-white shadow-2xl flex items-center justify-center text-[#E5A91E] pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="flex items-center gap-0.5 text-xs font-black">
                  <span>◀</span>
                  <span>▶</span>
                </div>
              </div>
            </div>

            {/* Instruction Caption (Exact as Attachment) */}
            <p className="text-center text-xs text-slate-500 font-medium mt-3 flex items-center justify-center gap-1.5">
              <span className="text-[#E5A91E]">✦</span>
              <span>Drag the handle left or right to reveal Plot to Completed Home transformation</span>
            </p>
          </div>

          {/* Column 2: Accordion FAQ Questions */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1 text-left mb-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-0.5 bg-[#E5A91E]" />
                <span className="text-xs sm:text-sm font-extrabold text-[#0B3B24] uppercase tracking-wider">
                  Frequently Asked Questions
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B24] tracking-tight">
                Get answers to common queries.
              </h3>
            </div>

            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-[#0B3B24] hover:bg-slate-50 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E5A91E]" />
                      <span>{faq.question}</span>
                    </span>
                    <span className="w-6 h-6 rounded-full bg-emerald-50 text-[#0B3B24] flex items-center justify-center shrink-0">
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. BOTTOM SITE VISIT CTA BANNER
          ========================================================================= */}
      <section className="px-4 sm:px-8 py-8 sm:py-10 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-[#0B3B24] p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[#1E5D32]">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#E5A91E]/20 text-[#E5A91E] flex items-center justify-center shrink-0 border border-[#E5A91E]/40">
              <Home className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl sm:text-2xl font-black">
                Let&rsquo;s Find the Right Plot for <span className="text-[#E5A91E]">Your Future.</span>
              </h4>
              <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                Schedule a site visit with Managing Director Rajesh RTR today.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenConsultation}
            className="px-7 py-3.5 rounded-full bg-[#E5A91E] hover:bg-[#d69814] text-[#0B3B24] font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <span>Schedule a Site Visit</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          9. PUBLIC FOOTER
          ========================================================================= */}
      <PublicFooter
        onTabChange={onTabChange}
        onOpenConsultation={onOpenConsultation}
        onOpenCabBooking={onOpenCabBooking}
      />
    </div>
  );
};
