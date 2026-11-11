import React from 'react';
import { motion } from 'motion/react';

interface PublicQuickActionsProps {
  onOpenConsultation?: () => void;
  onOpenCabBooking?: () => void;
  onNavigateToProjects?: () => void;
}

export const PublicQuickActions: React.FC<PublicQuickActionsProps> = () => {
  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(
      'Hello Rajesh RTR, I am interested in Kriyaa Promoters plots. Please share details and pricing.'
    );
    window.open(`https://wa.me/919443278899?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside
      aria-label="Quick WhatsApp Contact"
      className="fixed bottom-[110px] sm:bottom-12 right-4 sm:right-7 z-40 flex items-center justify-center pointer-events-auto"
    >
      <div className="relative group">
        {/* Floating WhatsApp Action Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            y: {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
          onClick={handleWhatsAppClick}
          className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-xl shadow-[#25D366]/40 border-2 border-white flex items-center justify-center cursor-pointer transition-transform"
          title="Chat with Rajesh RTR on WhatsApp (+91 94432 78899)"
          aria-label="Chat on WhatsApp"
        >
          {/* Authentic WhatsApp SVG Icon */}
          <svg
            className="w-8 h-8 fill-white"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12.031 2C6.495 2 2 6.494 2 12.029c0 1.767.46 3.491 1.332 5.006L2 22l5.127-1.344a10.01 10.01 0 0 0 4.904 1.282h.004c5.534 0 10.03-4.494 10.03-10.03 0-2.679-1.043-5.198-2.937-7.093A9.972 9.972 0 0 0 12.031 2zm0 18.358h-.003a8.318 8.318 0 0 1-4.238-1.163l-.304-.18-3.146.825.84-3.067-.198-.314a8.324 8.324 0 0 1-1.275-4.43c0-4.6 3.743-8.343 8.346-8.343 2.228 0 4.322.868 5.897 2.443a8.293 8.293 0 0 1 2.443 5.898c0 4.603-3.744 8.351-8.36 8.351zm4.573-6.246c-.25-.125-1.482-.731-1.712-.815-.23-.083-.397-.125-.564.125-.167.25-.646.815-.792.982-.146.167-.292.188-.542.063s-1.056-.39-2.012-1.242c-.744-.664-1.246-1.484-1.392-1.734-.146-.25-.016-.386.109-.51.112-.112.25-.292.375-.438.125-.146.167-.25.25-.417.083-.167.042-.313-.021-.438-.063-.125-.564-1.359-.772-1.862-.203-.49-.408-.423-.564-.431l-.48-.008c-.167 0-.438.063-.667.313-.23.25-.875.855-.875 2.085 0 1.23.896 2.418 1.021 2.585.125.167 1.762 2.69 4.269 3.773.596.258 1.062.412 1.425.527.6.19 1.145.163 1.576.099.48-.072 1.482-.605 1.69-1.189.209-.584.209-1.085.146-1.189-.062-.104-.229-.167-.479-.292z" />
          </svg>
        </motion.button>

        {/* Hover Tooltip on Desktop */}
        <span className="hidden md:group-hover:flex absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900/95 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-2xl border border-slate-700/80 items-center gap-2 pointer-events-none transition-all">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span>Chat on WhatsApp · Rajesh RTR</span>
        </span>
      </div>
    </aside>
  );
};
