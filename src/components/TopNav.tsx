import React from 'react';
import { Search, Globe, User, Radio, Activity, Bell } from 'lucide-react';

interface TopNavProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  onOpenSearch: () => void;
  onOpenGetStarted: () => void;
  watchlistCount: number;
  liveStreaming: boolean;
  setLiveStreaming: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeScreen,
  setActiveScreen,
  onOpenSearch,
  onOpenGetStarted,
  watchlistCount,
  liveStreaming,
  setLiveStreaming,
}) => {
  return (
    <header className="sticky top-0 z-40 h-[64px] w-full bg-[#FFFFFF] border-b border-[#E0E3EB] px-4 md:px-8 flex items-center justify-between">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-6 shrink-0">
        <button
          onClick={() => setActiveScreen('markets')}
          className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2962FF] rounded-lg"
          aria-label="Market Precision Home"
        >
          <div className="w-8 h-8 rounded-lg bg-[#131722] text-[#FFFFFF] flex items-center justify-center font-bold text-base tracking-tight shadow-xs group-hover:bg-[#2962FF] transition-colors">
            <Activity className="w-4 h-4 text-[#FFFFFF]" />
          </div>
          <div>
            <div className="text-[17px] font-extrabold tracking-tight text-[#131722] leading-none">
              Market<span className="text-[#2962FF]">Precision</span>
            </div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#737687] leading-none mt-0.5">
              Institutional Intelligence
            </div>
          </div>
        </button>

        {/* Global Search Field (Spec: 36px height, rounded full pill, bg #F0F3FA, placeholder Search (Ctrl+K) in #787B86) */}
        <div className="hidden lg:block w-72">
          <button
            onClick={onOpenSearch}
            className="w-full h-[36px] px-3.5 rounded-full bg-[#F0F3FA] hover:bg-[#E0E3EB] transition-colors flex items-center justify-between text-[#737687] text-[13px] group focus:outline-none focus:ring-2 focus:ring-[#2962FF]"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#737687] group-hover:text-[#131722] transition-colors" />
              <span className="truncate">Search (Ctrl+K)</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[11px] font-semibold bg-[#FFFFFF] text-[#434656] rounded-md border border-[#E0E3EB] shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* Zone 2: Navigation Links (Spec: label-md 13px Medium, color #131722, hover #2962FF) */}
      <nav className="hidden md:flex items-center gap-1 lg:gap-2">
        <button
          onClick={() => setActiveScreen('markets')}
          className={`h-9 px-3.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeScreen === 'markets'
              ? 'text-[#2962FF] bg-[#2962FF]/10 font-semibold'
              : 'text-[#131722] hover:text-[#2962FF] hover:bg-[#F0F3FA]'
          }`}
        >
          Markets
        </button>
        <button
          onClick={() => setActiveScreen('heatmap')}
          className={`h-9 px-3.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeScreen === 'heatmap'
              ? 'text-[#2962FF] bg-[#2962FF]/10 font-semibold'
              : 'text-[#131722] hover:text-[#2962FF] hover:bg-[#F0F3FA]'
          }`}
        >
          Heatmap
        </button>
        <button
          onClick={() => setActiveScreen('watchlist')}
          className={`h-9 px-3.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeScreen === 'watchlist'
              ? 'text-[#2962FF] bg-[#2962FF]/10 font-semibold'
              : 'text-[#131722] hover:text-[#2962FF] hover:bg-[#F0F3FA]'
          }`}
        >
          <span>Watchlist</span>
          {watchlistCount > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#131722] text-[#FFFFFF]">
              {watchlistCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveScreen('macro')}
          className={`h-9 px-3.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeScreen === 'macro'
              ? 'text-[#2962FF] bg-[#2962FF]/10 font-semibold'
              : 'text-[#131722] hover:text-[#2962FF] hover:bg-[#F0F3FA]'
          }`}
        >
          Macro & News
        </button>
      </nav>

      {/* Zone 3: Right Utility Actions + Primary Action Button */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Mobile Search button */}
        <button
          onClick={onOpenSearch}
          className="lg:hidden p-2 rounded-full hover:bg-[#F0F3FA] text-[#131722]"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Live Tick Stream Toggle */}
        <button
          onClick={() => setLiveStreaming(!liveStreaming)}
          title={liveStreaming ? 'Real-time tick streaming active' : 'Tick streaming paused'}
          className={`hidden sm:flex items-center gap-1.5 h-8 px-2.5 rounded-full text-[11px] font-semibold border transition-all ${
            liveStreaming
              ? 'border-[#089981]/30 bg-[#089981]/10 text-[#089981]'
              : 'border-[#E0E3EB] bg-[#F0F3FA] text-[#737687]'
          }`}
        >
          <Radio className={`w-3 h-3 ${liveStreaming ? 'animate-pulse text-[#089981]' : 'text-[#737687]'}`} />
          <span className="uppercase tracking-wide">{liveStreaming ? 'Live' : 'Paused'}</span>
        </button>

        {/* Market Status pill */}
        <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-semibold text-[#434656] bg-[#F0F3FA] px-2.5 h-8 rounded-full border border-[#E0E3EB]/80">
          <span className="w-1.5 h-1.5 rounded-full bg-[#089981]"></span>
          <span>NYSE: OPEN</span>
        </div>

        {/* Currency & Language selector */}
        <button
          onClick={() => {}}
          className="hidden sm:flex items-center gap-1.5 h-8 px-2.5 rounded-full hover:bg-[#F0F3FA] text-[#434656] text-[12px] font-medium border border-transparent hover:border-[#E0E3EB] transition-colors"
          title="Currency and Language"
        >
          <Globe className="w-3.5 h-3.5 text-[#737687]" />
          <span>USD · EN</span>
        </button>

        {/* User profile button */}
        <button
          onClick={onOpenGetStarted}
          className="w-8 h-8 rounded-full bg-[#F0F3FA] hover:bg-[#E0E3EB] flex items-center justify-center text-[#131722] transition-colors border border-[#E0E3EB]"
          aria-label="Account Profile"
        >
          <User className="w-4 h-4 text-[#434656]" />
        </button>

        {/* Action Button: "Get started" (Spec: #131722 fill, white text, pill radius, 36px height, px-4, hover #2A2E39) */}
        <button
          onClick={onOpenGetStarted}
          className="h-[36px] px-4 rounded-full bg-[#131722] hover:bg-[#2A2E39] active:scale-[0.98] text-[#FFFFFF] text-[13px] font-semibold shadow-xs transition-all flex items-center justify-center whitespace-nowrap cursor-pointer"
        >
          Get started
        </button>
      </div>
    </header>
  );
};
