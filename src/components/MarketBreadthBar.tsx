import React from 'react';
import { TrendingUp, BarChart2, ShieldAlert, Zap } from 'lucide-react';

export const MarketBreadthBar: React.FC = () => {
  const advancingPercent = 64.2;
  const decliningPercent = 35.8;

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E0E3EB] rounded-[12px] p-3.5 my-3 shadow-2xs">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Advance vs Decline Breadth Bar */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#737687] mb-1.5">
            <span className="flex items-center gap-1.5 text-[#089981]">
              <span className="w-2 h-2 rounded-full bg-[#089981]"></span>
              Advancing: 3,248 (64%)
            </span>
            <span className="flex items-center gap-1.5 text-[#F23645]">
              Declining: 1,812 (36%)
              <span className="w-2 h-2 rounded-full bg-[#F23645]"></span>
            </span>
          </div>
          {/* Breadth distribution bar */}
          <div className="h-2 w-full bg-[#F0F3FA] rounded-full overflow-hidden flex">
            <div
              className="h-full bg-[#089981] transition-all duration-500 rounded-l-full"
              style={{ width: `${advancingPercent}%` }}
              title="Advancing Issues"
            />
            <div
              className="h-full bg-[#F23645] transition-all duration-500 rounded-r-full"
              style={{ width: `${decliningPercent}%` }}
              title="Declining Issues"
            />
          </div>
        </div>

        {/* Market Momentum / Fear & Greed */}
        <div className="flex items-center gap-3 border-l-0 md:border-l border-[#E0E3EB] md:pl-4">
          <div className="w-8 h-8 rounded-full bg-[#089981]/10 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-[#089981]" />
          </div>
          <div>
            <div className="text-[11px] uppercase font-semibold text-[#737687] leading-tight">
              Market Sentiment
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[14px] font-bold text-[#131722] mono-num">68</span>
              <span className="text-[12px] font-semibold text-[#089981]">Greed</span>
            </div>
          </div>
        </div>

        {/* Intraday Liquidity / Volume */}
        <div className="flex items-center gap-3 border-l-0 md:border-l border-[#E0E3EB] md:pl-4">
          <div className="w-8 h-8 rounded-full bg-[#2962FF]/10 flex items-center justify-center shrink-0">
            <BarChart2 className="w-4 h-4 text-[#2962FF]" />
          </div>
          <div>
            <div className="text-[11px] uppercase font-semibold text-[#737687] leading-tight">
              Total Tape Volume
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[14px] font-bold text-[#131722] mono-num">$184.6B</span>
              <span className="text-[11px] font-medium text-[#737687]">+8.4% vs 30d</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
