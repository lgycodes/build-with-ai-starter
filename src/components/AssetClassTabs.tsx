import React, { useRef } from 'react';
import { AssetClassType } from '../types/market';
import { ASSET_CLASS_TABS } from '../data/mockMarketData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AssetClassTabsProps {
  selectedAsset: AssetClassType;
  onSelectAsset: (asset: AssetClassType) => void;
}

export const AssetClassTabs: React.FC<AssetClassTabsProps> = ({
  selectedAsset,
  onSelectAsset,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full py-2.5">
      <div className="flex items-center gap-1.5 w-full">
        {/* Scroll Left Button for small viewports */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex xl:hidden p-1 rounded-full text-[#737687] hover:text-[#131722] hover:bg-[#F0F3FA] transition-colors shrink-0"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Capsule Pill Housing (Spec: #F0F3FA background with 4px inner padding) */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1 p-1 bg-[#F0F3FA] rounded-full overflow-x-auto no-scrollbar scroll-smooth w-full xl:w-auto"
        >
          {ASSET_CLASS_TABS.map((tab) => {
            const isActive = selectedAsset === tab;
            return (
              <button
                key={tab}
                onClick={() => onSelectAsset(tab)}
                className={`h-[32px] px-[14px] rounded-full text-[13px] font-medium tracking-tight whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#131722] text-[#FFFFFF] shadow-xs font-semibold'
                    : 'bg-transparent text-[#737687] hover:text-[#131722] hover:bg-[#E0E3EB]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Scroll Right Button for small viewports */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex xl:hidden p-1 rounded-full text-[#737687] hover:text-[#131722] hover:bg-[#F0F3FA] transition-colors shrink-0"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
