import React from 'react';
import { motion } from 'motion/react';
import { Home, MapPin, ListOrdered, Info } from 'lucide-react';
import { PublicTab } from '../../types';

interface PublicBottomNavProps {
  activeTab: PublicTab;
  onTabChange: (tab: PublicTab) => void;
  savedCount?: number;
}

export const PublicBottomNav: React.FC<PublicBottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: {
    id: PublicTab;
    label: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'projects', label: 'Projects', icon: MapPin },
    { id: 'process', label: 'Buying Process', icon: ListOrdered },
    { id: 'contact', label: 'About Us', icon: Info },
  ];

  const handleTabClick = (tab: PublicTab) => {
    onTabChange(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#113B24] border-t border-[#1E5D32] shadow-2xl safe-area-bottom select-none"
    >
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className="min-h-[44px] flex flex-col items-center justify-center relative py-1 transition-colors cursor-pointer"
            >
              {/* Active Indicator Top Pill */}
              {isActive && (
                <motion.div
                  layoutId="mobileBottomNavActive"
                  className="absolute top-0 w-8 h-1 bg-[#EAB308] rounded-b-full shadow-sm"
                />
              )}

              {/* Icon Container */}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive
                      ? 'text-[#EAB308] scale-110'
                      : 'text-emerald-200/70 hover:text-white'
                  }`}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[9.5px] sm:text-[10px] mt-1 font-bold tracking-tight whitespace-nowrap ${
                  isActive ? 'text-[#EAB308]' : 'text-emerald-200/70'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
